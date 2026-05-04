import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { sendOrderConfirmation } from '@/lib/email';
import { createPaymentIntent } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { fullName, phone, email, deliveryAddress, pinCode, orderDescription, paymentMethod, preferredTime, specialInstructions } = body;

    // Validation
    if (!fullName || !phone || !deliveryAddress || !pinCode || !orderDescription || !preferredTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Estimate order amount (can be calculated from items)
    const estimatedAmount = Math.floor(Math.random() * 500) + 300; // Random between 300-800

    let stripePaymentId = null;

    // If paying by card, create payment intent
    if (paymentMethod === 'credit_card') {
      const paymentIntent = await createPaymentIntent(estimatedAmount, fullName);
      stripePaymentId = paymentIntent.id;
    }

    const order = new Order({
      fullName,
      phone,
      deliveryAddress,
      pinCode,
      orderDescription,
      paymentMethod,
      preferredTime,
      specialInstructions: specialInstructions || '',
      amount: estimatedAmount,
      stripePaymentId,
      status: 'confirmed',
    });

    await order.save();

    // Send confirmation email only when a valid email is provided
    if (typeof email === 'string' && email.includes('@')) {
      await sendOrderConfirmation(email, fullName, order._id.toString(), estimatedAmount);
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

export async function GET(request: NextRequest) {
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
