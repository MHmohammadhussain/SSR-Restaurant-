import { connectDB } from '@/lib/db';
import Reservation from '@/lib/models/Reservation';
import { sendReservationConfirmation } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

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
      status: 'confirmed',
    });

    await reservation.save();

    // Send confirmation email
    await sendReservationConfirmation(
      email,
      `${firstName} ${lastName}`,
      new Date(date).toLocaleDateString(),
      time,
      Number(guests)
    );

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

export async function GET(request: NextRequest) {
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
