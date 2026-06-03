import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const ADMIN_AUTH_COOKIE = 'ssr_admin_auth';

function getGoogleClientId() {
  return process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
}

function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
}

function normalizeEmail(input: string) {
  const value = (input || '').toLowerCase().trim();
  const [localPart, domain] = value.split('@');
  if (!localPart || !domain) {
    return value;
  }

  const normalizedDomain = domain === 'googlemail.com' ? 'gmail.com' : domain;
  if (normalizedDomain !== 'gmail.com') {
    return `${localPart}@${normalizedDomain}`;
  }

  const localWithoutPlus = localPart.split('+')[0];
  const localWithoutDots = localWithoutPlus.replace(/\./g, '');
  return `${localWithoutDots}@gmail.com`;
}

function getAllowedGoogleEmails() {
  const fromList = (process.env.ADMIN_GOOGLE_EMAILS || '')
    .split(',')
    .map((item) => normalizeEmail(item))
    .filter(Boolean);

  const primary = normalizeEmail(getAdminEmail());
  if (primary && !fromList.includes(primary)) {
    fromList.push(primary);
  }

  return fromList;
}

function buildAdminRedirect(request: NextRequest, googleError?: string) {
  const url = new URL('/admin', request.url);
  if (googleError) {
    url.searchParams.set('googleError', googleError);
  }
  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  try {
    const contentType = (request.headers.get('content-type') || '').toLowerCase();
    const isJsonRequest = contentType.includes('application/json');

    let credential = '';
    if (isJsonRequest) {
      const body = await request.json().catch(() => ({}));
      credential = typeof body?.credential === 'string' ? body.credential : '';
    } else {
      const form = await request.formData().catch(() => null);
      const formCredential = form?.get('credential');
      credential = typeof formCredential === 'string' ? formCredential : '';
    }

    if (!credential) {
      if (!isJsonRequest) {
        return buildAdminRedirect(request, 'Missing Google credential. Please try again.');
      }
      return NextResponse.json({ error: 'Missing Google credential' }, { status: 400 });
    }

    const clientId = getGoogleClientId();
    if (!clientId) {
      if (!isJsonRequest) {
        return buildAdminRedirect(request, 'Google sign-in is not configured.');
      }
      return NextResponse.json({ error: 'Google sign-in is not configured' }, { status: 500 });
    }

    const allowedEmails = getAllowedGoogleEmails();
    if (allowedEmails.length === 0) {
      if (!isJsonRequest) {
        return buildAdminRedirect(request, 'Admin email is not configured.');
      }
      return NextResponse.json({ error: 'Admin email is not configured' }, { status: 500 });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    const email = normalizeEmail(payload?.email || '');

    if (!payload?.email_verified) {
      if (!isJsonRequest) {
        return buildAdminRedirect(request, 'Google email is not verified.');
      }
      return NextResponse.json({ error: 'Google email is not verified' }, { status: 401 });
    }

    if (!allowedEmails.includes(email)) {
      if (!isJsonRequest) {
        return buildAdminRedirect(request, 'This Google account is not authorized for admin login.');
      }
      return NextResponse.json(
        {
          error: 'This Google account is not authorized for admin login.',
          details: 'Sign in with the same Google account configured as ADMIN_EMAIL.',
        },
        { status: 401 }
      );
    }

    const response = isJsonRequest
      ? NextResponse.json({ authenticated: true })
      : buildAdminRedirect(request);
    response.cookies.set(ADMIN_AUTH_COOKIE, '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error('Google admin auth error:', error);
    const contentType = (request.headers.get('content-type') || '').toLowerCase();
    if (!contentType.includes('application/json')) {
      return buildAdminRedirect(request, 'Failed to authenticate with Google.');
    }
    return NextResponse.json({ error: 'Failed to authenticate with Google' }, { status: 500 });
  }
}
