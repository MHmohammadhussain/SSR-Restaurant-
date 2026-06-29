import { NextRequest, NextResponse } from 'next/server';
import { sendRestaurantWhatsappTestNotification } from '@/lib/whatsapp';

const ADMIN_AUTH_COOKIE = 'ssr_admin_auth';

type TestPayload = {
  note?: string;
};

function isAuthorized(request: NextRequest) {
  const cookieAuth = request.cookies.get(ADMIN_AUTH_COOKIE)?.value === '1';
  if (cookieAuth) {
    return true;
  }

  const headerToken = request.headers.get('x-whatsapp-test-token')?.trim();
  const configuredToken = process.env.WHATSAPP_TEST_TOKEN?.trim();

  if (!configuredToken) {
    return false;
  }

  return Boolean(headerToken && headerToken === configuredToken);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let note: string | undefined;
    try {
      const body = (await request.json()) as TestPayload;
      if (typeof body.note === 'string' && body.note.trim()) {
        note = body.note.trim();
      }
    } catch {
      note = undefined;
    }

    const sent = await sendRestaurantWhatsappTestNotification(note);
    if (!sent) {
      return NextResponse.json(
        { error: 'WhatsApp test send failed. Check server logs for Twilio details.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: 'WhatsApp test notification sent' }, { status: 200 });
  } catch (error) {
    console.error('WhatsApp test API error:', error);
    return NextResponse.json({ error: 'Failed to send WhatsApp test notification' }, { status: 500 });
  }
}
