import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import Reservation from '@/lib/models/Reservation';
import { sendOrderStatusEmail, sendReservationStatusEmail } from '@/lib/email';

const ADMIN_AUTH_COOKIE = 'ssr_admin_auth';

type StatusPayload = {
  type?: 'reservation' | 'order';
  id?: string;
  status?: 'confirmed' | 'cancelled';
};

export async function POST(request: NextRequest) {
  const authToken = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  if (authToken !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as StatusPayload;
    const { type, id, status } = body;

    if (!type || !id || !status || !['confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    await connectDB();

    if (type === 'reservation') {
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
      }

      if (!reservation.email || !reservation.email.includes('@')) {
        return NextResponse.json({ error: 'Customer email is missing for this reservation' }, { status: 400 });
      }

      await sendReservationStatusEmail({
        email: reservation.email,
        name: `${reservation.firstName} ${reservation.lastName}`,
        date: new Date(reservation.date).toLocaleDateString(),
        time: reservation.time,
        guests: Number(reservation.guests),
        status,
      });

      return NextResponse.json({ message: 'Reservation status email sent' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.email || !order.email.includes('@')) {
      return NextResponse.json({ error: 'Customer email is missing for this order' }, { status: 400 });
    }

    await sendOrderStatusEmail({
      email: order.email,
      name: order.fullName,
      orderId: order._id.toString(),
      amount: Number(order.amount || 0),
      status,
    });

    return NextResponse.json({ message: 'Order status email sent' });
  } catch (error) {
    console.error('Status email API error:', error);
    return NextResponse.json({ error: 'Failed to send status email' }, { status: 500 });
  }
}
