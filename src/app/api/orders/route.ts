import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { sendRestaurantOrderNotification } from '@/lib/email';
import { sendRestaurantOrderWhatsappNotification } from '@/lib/whatsapp';
import { createPaymentIntent } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const onlineCardPaymentsEnabled = (process.env.ENABLE_ONLINE_CARD_PAYMENTS || 'false').toLowerCase() === 'true';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      fullName,
      phone,
      email,
      deliveryAddress,
      pinCode,
      orderDescription,
      selectedItems,
      amount,
      paymentMethod,
      preferredTime,
      specialInstructions,
    } = body;

    const missingFields: string[] = [];
    if (!fullName) missingFields.push('fullName');
    if (!phone) missingFields.push('phone');
    if (!deliveryAddress) missingFields.push('deliveryAddress');
    if (!pinCode) missingFields.push('pinCode');
    if (!orderDescription && (!Array.isArray(selectedItems) || selectedItems.length === 0)) {
      missingFields.push('selectedItems');
    }

    // Validation
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    const estimatedAmount = Number.isFinite(parsedAmount) && parsedAmount > 0
      ? parsedAmount
      : Math.floor(Math.random() * 500) + 300;

    let stripePaymentId = null;

    // "credit_card" is used as Card on Delivery in the current UI.
    // Only create an online payment intent when explicitly enabled.
    if (paymentMethod === 'credit_card' && onlineCardPaymentsEnabled) {
      try {
        const paymentIntent = await createPaymentIntent(estimatedAmount, fullName);
        stripePaymentId = paymentIntent.id;
      } catch (error) {
        console.error('Order API payment intent error:', error);
        return NextResponse.json(
          { error: 'Online card payment is unavailable right now. Please choose Cash on Delivery or UPI.' },
          { status: 400 }
        );
      }
    }

    const order = new Order({
      fullName,
      phone,
      email: typeof email === 'string' ? email : '',
      deliveryAddress,
      pinCode,
      orderDescription,
      selectedItems: Array.isArray(selectedItems) ? selectedItems : [],
      paymentMethod,
      preferredTime,
      specialInstructions: specialInstructions || '',
      amount: estimatedAmount,
      stripePaymentId,
      status: 'pending',
    });

    await order.save();

    // Keep order placement successful even if email delivery fails, but wait for the
    // async send attempt so serverless runtimes do not drop the task.
    const notificationResult = await Promise.allSettled([
      sendRestaurantOrderNotification({
        orderId: order._id.toString(),
        customerName: fullName,
        customerPhone: phone,
        customerEmail: typeof email === 'string' ? email : '',
        deliveryAddress,
        pinCode,
        amount: estimatedAmount,
        paymentMethod,
        preferredTime,
        specialInstructions,
        orderDescription,
        selectedItems: Array.isArray(selectedItems) ? selectedItems : [],
      }),
      sendRestaurantOrderWhatsappNotification({
        orderId: order._id.toString(),
        customerName: fullName,
        customerPhone: phone,
        customerEmail: typeof email === 'string' ? email : '',
        deliveryAddress,
        pinCode,
        amount: estimatedAmount,
        paymentMethod,
        preferredTime,
        specialInstructions,
        orderDescription,
        selectedItems: Array.isArray(selectedItems) ? selectedItems : [],
      }),
    ]);

    if (notificationResult[0].status === 'rejected') {
      console.error('Order notification failed after order save:', notificationResult[0].reason);
    }

    if (notificationResult[1].status === 'rejected') {
      console.error('Order WhatsApp notification failed after order save:', notificationResult[1].reason);
    }

    return NextResponse.json(
      {
        message: 'Order created successfully',
        orderId: order._id,
        amount: estimatedAmount,
        clientSecret: stripePaymentId ? 'payment_intent_secret' : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, status } = body;

    const allowedStatuses = ['pending', 'confirmed', 'preparing', 'on_way', 'delivered', 'cancelled'];
    if (!id || typeof id !== 'string' || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid id or status' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id format' }, { status: 400 });
    }

    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order status updated', order: updated });
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
