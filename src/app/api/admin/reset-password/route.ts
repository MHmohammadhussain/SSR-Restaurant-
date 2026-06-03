import { NextRequest, NextResponse } from 'next/server';
import { resetAdminPassword } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body?.token === 'string' ? body.token.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : '';

    if (!token || !email || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const ok = await resetAdminPassword(token, newPassword, email);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
