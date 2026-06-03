import { connectDB } from '@/lib/db';
import Reservation from '@/lib/models/Reservation';
import { sendRestaurantReservationNotification } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { firstName, lastName, email, phone, date, time, guests, occasion, specialRequests } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const reservation = new Reservation({
      firstName,
      lastName,
      email,
      phone,
      date: new Date(date),
      time,
      guests: Number(guests),
      occasion: occasion || '',
      specialRequests: specialRequests || '',
      status: 'pending',
    });

    await reservation.save();

    // Keep reservation creation successful even if notification fails.
    const notificationResult = await Promise.allSettled([
      sendRestaurantReservationNotification({
        reservationId: reservation._id.toString(),
        firstName,
        lastName,
        email,
        phone,
        date: new Date(date).toLocaleDateString(),
        time,
        guests: Number(guests),
        occasion: occasion || '',
        specialRequests: specialRequests || '',
      }),
    ]);

    if (notificationResult[0].status === 'rejected') {
      console.error('Reservation notification failed after save:', notificationResult[0].reason);
    }

    return NextResponse.json(
      { message: 'Reservation created successfully', reservationId: reservation._id },
      { status: 201 }
    );
  } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Reservation API error:', errorMessage);
      return NextResponse.json(
        { error: `Failed to create reservation: ${errorMessage}` },
        { status: 500 }
      );
  }
}

export async function GET() {
  try {
    await connectDB();

    const reservations = await Reservation.find().sort({ date: -1 });
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Get reservations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, status } = body;

    const allowedStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!id || typeof id !== 'string' || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid id or status' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id format' }, { status: 400 });
    }

    const updated = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Reservation status updated', reservation: updated });
  } catch (error) {
    console.error('Update reservation status error:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation status' },
      { status: 500 }
    );
  }
}
