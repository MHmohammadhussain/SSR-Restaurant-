import { connectDB } from '@/lib/db';
import Contact from '@/lib/models/Contact';
import { sendContactReply, sendRestaurantContactNotification } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { name, phone, email, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const contact = new Contact({
      name,
      phone: phone || '',
      email,
      subject: subject || 'general',
      message,
      status: 'new',
    });

    await contact.save();

    // Keep submission successful even if email delivery fails, but wait for async work
    // so serverless runtimes do not terminate before sends are attempted.
    const notificationResults = await Promise.allSettled([
      sendRestaurantContactNotification({
        contactId: contact._id.toString(),
        name,
        email,
        phone: phone || '',
        subject: subject || 'general',
        message,
      }),
      sendContactReply(email, name, message),
    ]);

    if (notificationResults[0].status === 'rejected') {
      console.error('Contact notification failed after save:', notificationResults[0].reason);
    }

    if (notificationResults[1].status === 'rejected') {
      console.error('Contact auto-reply failed after save:', notificationResults[1].reason);
    }

    return NextResponse.json(
      { message: 'Message received successfully', contactId: contact._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, status } = body;

    const allowedStatuses = ['new', 'read', 'replied'];
    if (!id || typeof id !== 'string' || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid id or status' }, { status: 400 });
    }

    const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact status updated', contact: updated });
  } catch (error) {
    console.error('Update contact status error:', error);
    return NextResponse.json(
      { error: 'Failed to update contact status' },
      { status: 500 }
    );
  }
}
