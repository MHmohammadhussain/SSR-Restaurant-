import { NextRequest, NextResponse } from 'next/server';
import { createPasswordResetToken } from '@/lib/adminAuth';
import { sendAdminPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    // Generic response avoids leaking whether an account exists.
    const genericResponse = NextResponse.json({ message: 'If the account exists, a reset link has been sent.' });

    if (!email) {
      return genericResponse;
    }

    const reset = await createPasswordResetToken(email);
    if (!reset) {
      return genericResponse;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const resetUrl = `${siteUrl}/admin/reset-password?token=${encodeURIComponent(reset.token)}&email=${encodeURIComponent(reset.email)}`;

    await sendAdminPasswordResetEmail(reset.email, resetUrl);

    return genericResponse;
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'If the account exists, a reset link has been sent.' });
  }
}
