import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import AdminCredential from '@/lib/models/AdminCredential';

type AdminCredentialDoc = {
  email: string;
  passwordHash: string;
  resetTokenHash?: string;
  resetTokenExpiresAt?: Date;
  save: () => Promise<unknown>;
};

function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
}

function getAdminPasswordFromEnv() {
  return process.env.ADMIN_PASSWORD || '';
}

export async function getOrCreateAdminCredential() {
  await connectDB();

  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPasswordFromEnv();

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured');
  }

  let doc = (await AdminCredential.findOne({ email: adminEmail })) as AdminCredentialDoc | null;
  if (!doc) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    doc = (await AdminCredential.create({
      email: adminEmail,
      passwordHash,
    })) as AdminCredentialDoc;
  }

  return doc;
}

export async function verifyAdminLogin(username?: string, password?: string) {
  const adminEmail = getAdminEmail();
  if (!username || !password || username.toLowerCase().trim() !== adminEmail) {
    return false;
  }

  const doc = await getOrCreateAdminCredential();
  return bcrypt.compare(password, doc.passwordHash);
}

export async function createPasswordResetToken(email: string) {
  const adminEmail = getAdminEmail();
  if (!email || email.toLowerCase().trim() !== adminEmail) {
    return null;
  }

  const doc = await getOrCreateAdminCredential();
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  doc.resetTokenHash = tokenHash;
  doc.resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 15);
  await doc.save();

  return { token, email: adminEmail };
}

export async function resetAdminPassword(token: string, newPassword: string, email: string) {
  const adminEmail = getAdminEmail();
  if (!token || !newPassword || !email || email.toLowerCase().trim() !== adminEmail) {
    return false;
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const doc = (await AdminCredential.findOne({
    email: adminEmail,
    resetTokenHash: tokenHash,
    resetTokenExpiresAt: { $gt: new Date() },
  })) as AdminCredentialDoc | null;

  if (!doc) {
    return false;
  }

  doc.passwordHash = await bcrypt.hash(newPassword, 10);
  doc.resetTokenHash = undefined;
  doc.resetTokenExpiresAt = undefined;
  await doc.save();

  return true;
}
