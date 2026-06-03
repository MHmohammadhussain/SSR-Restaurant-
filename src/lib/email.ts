import { Resend } from 'resend';
import { connectDB } from '@/lib/db';
import NotificationQueue from '@/lib/models/NotificationQueue';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const restaurantOrderEmail = process.env.ORDER_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'ssrrestaurant007@gmail.com';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const retryEnabled = (process.env.NOTIFICATION_RETRY_ENABLED || 'true').toLowerCase() !== 'false';
const resendEnabled = resendApiKey.startsWith('re_') && !resendApiKey.includes('placeholder');
const resendSandboxMode = resendFromEmail.toLowerCase().endsWith('@resend.dev');
const resend = resendEnabled ? new Resend(resendApiKey) : null;

const globalNotificationState = globalThis as typeof globalThis & {
  __ssrNotificationRetryTimer?: ReturnType<typeof setInterval> | null;
  __ssrNotificationRetryLoopStarted?: boolean;
};

function ensureRetryLoop() {
  if (!retryEnabled || globalNotificationState.__ssrNotificationRetryTimer || typeof window !== 'undefined') {
    return;
  }

  globalNotificationState.__ssrNotificationRetryTimer = setInterval(() => {
    void flushNotificationQueue();
  }, 60_000);
}

function logNotificationFailure(context: string, error: unknown, details?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[notification:${context}] ${message}`, details || {});
}

function isTransientSendError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes('unable to fetch data') ||
    lower.includes('request could not be resolved') ||
    lower.includes('timed out') ||
    lower.includes('econn')
  );
}

function isSandboxRecipientRestriction(message: string) {
  return message.toLowerCase().includes('you can only send testing emails to your own email address');
}

function isAllowedSandboxRecipient(to: string) {
  const normalized = to.trim().toLowerCase();
  return normalized === restaurantOrderEmail.trim().toLowerCase();
}

async function enqueueNotification(job: { notificationType: string; to: string; subject: string; html: string; lastError?: string }) {
  if (!retryEnabled) {
    return;
  }

  await connectDB();
  const created = await NotificationQueue.create({
    ...job,
    attempts: 0,
    maxAttempts: 3,
    nextAttemptAt: new Date(),
    status: 'queued',
  });

  console.warn(`[notification:queue] queued ${job.notificationType}`, {
    queueId: created._id.toString(),
    to: job.to,
    subject: job.subject,
  });

  ensureRetryLoop();
}

async function flushNotificationQueue() {
  if (!resend || !retryEnabled) return;

  await connectDB();
  const now = new Date();
  const dueJobs = await NotificationQueue.find({
    status: { $in: ['queued', 'failed'] },
    nextAttemptAt: { $lte: now },
    attempts: { $lt: 3 },
  }).sort({ createdAt: 1 }).limit(10);

  for (const job of dueJobs) {
    const queueId = job._id.toString();

    try {
      await NotificationQueue.updateOne({ _id: job._id }, { $set: { status: 'processing' } });
      const result = await resend.emails.send({
        from: resendFromEmail,
        to: job.to,
        subject: job.subject,
        html: job.html,
      });

      if (result?.error) {
        throw new Error(result.error.message || 'Resend queue send failed');
      }

      await NotificationQueue.updateOne(
        { _id: job._id },
        {
          $set: {
            status: 'sent',
            sentAt: new Date(),
            lastError: undefined,
          },
        }
      );
      console.info(`[notification:queue] sent ${job.notificationType} on retry`, { id: queueId, attempts: job.attempts + 1 });
    } catch (error) {
      const nextAttempts = (job.attempts || 0) + 1;
      const exhausted = nextAttempts >= 3;
      await NotificationQueue.updateOne(
        { _id: job._id },
        {
          $set: {
            status: exhausted ? 'failed' : 'failed',
            attempts: nextAttempts,
            lastError: error instanceof Error ? error.message : String(error),
            nextAttemptAt: exhausted ? new Date(Date.now() + 24 * 60 * 60 * 1000) : new Date(Date.now() + 60_000 * Math.min(nextAttempts, 3)),
          },
        }
      );
      logNotificationFailure('retry', error, { id: queueId, type: job.notificationType, to: job.to, attempts: nextAttempts });
    }
  }
}

async function recordFailedNotification(job: { notificationType: string; to: string; subject: string; html: string }, error: unknown) {
  logNotificationFailure(job.notificationType, error, { to: job.to, subject: job.subject });
  await enqueueNotification({ ...job, lastError: error instanceof Error ? error.message : String(error) });
}

function sanitize(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function brandedEmailTemplate(params: {
  title: string;
  subtitle?: string;
  greeting?: string;
  intro?: string;
  details?: Array<{ label: string; value: string }>;
  body?: string;
  ctaText?: string;
  ctaUrl?: string;
  footerNote?: string;
  highlight?: string;
}) {
  const rows = params.details || [];
  const detailsHtml = rows.length
    ? rows
        .map(
          (row) => `
            <tr>
              <td style="padding: 10px 0; color: #6b7280; width: 34%; vertical-align: top; font-size: 14px;">${sanitize(row.label)}</td>
              <td style="padding: 10px 0; color: #111827; font-weight: 700; vertical-align: top; font-size: 14px;">${sanitize(row.value)}</td>
            </tr>
          `
        )
        .join('')
    : '';

  const ctaHtml = params.ctaText && params.ctaUrl
    ? `<div style="margin: 28px 0 10px;"><a href="${sanitize(params.ctaUrl)}" style="background: linear-gradient(135deg, #b5451b, #f4a229); color: #fff; text-decoration: none; font-weight: 700; padding: 12px 20px; border-radius: 999px; display: inline-block;">${sanitize(params.ctaText)}</a></div>`
    : '';

  return `
    <div style="margin: 0; padding: 0; background: #f6f1ea;">
      <div style="max-width: 680px; margin: 0 auto; padding: 24px 16px; font-family: Arial, sans-serif; color: #1f2937;">
        <div style="background: #1a1a1a; border-radius: 22px; padding: 30px 28px; color: #fff; box-shadow: 0 20px 45px rgba(0,0,0,0.18);">
          <div style="display: inline-block; padding: 6px 12px; border-radius: 999px; background: rgba(244,162,41,0.18); color: #ffd08a; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">SSR Restaurant</div>
          <h1 style="margin: 18px 0 10px; font-family: Georgia, serif; font-size: 32px; line-height: 1.15; color: #fff;">${sanitize(params.title)}</h1>
          ${params.subtitle ? `<p style="margin: 0 0 18px; color: #f3e8da; font-size: 15px; line-height: 1.7;">${sanitize(params.subtitle)}</p>` : ''}
          ${params.highlight ? `<div style="margin: 18px 0 0; padding: 14px 16px; border-left: 4px solid #f4a229; background: rgba(244,162,41,0.12); color: #fff; border-radius: 12px; font-size: 14px; line-height: 1.65;">${sanitize(params.highlight)}</div>` : ''}
        </div>

        <div style="background: #fff; border-radius: 20px; margin-top: 18px; padding: 26px 24px; box-shadow: 0 12px 28px rgba(0,0,0,0.08);">
          ${params.greeting ? `<p style="margin: 0 0 12px; font-size: 16px; color: #111827;">${sanitize(params.greeting)}</p>` : ''}
          ${params.intro ? `<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.75; color: #374151;">${sanitize(params.intro)}</p>` : ''}
          ${params.body ? `<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.75; color: #374151; white-space: pre-line;">${sanitize(params.body)}</p>` : ''}

          ${rows.length ? `<table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 10px;">${detailsHtml}</table>` : ''}

          ${ctaHtml}
        </div>

        <div style="text-align: center; color: #6b7280; font-size: 12px; line-height: 1.7; padding: 18px 8px 4px;">
          <div style="font-weight: 700; color: #111827; margin-bottom: 4px;">SSR Restaurant</div>
          <div>Opposite MRO Office, Beside Venkataramana Theatre, Main Road, Kaikalur, Andhra Pradesh, 521333</div>
          <div>Phone: +91 9491437799 · Email: ssrrestaurant007@gmail.com</div>
          <div style="margin-top: 6px;">${sanitize(siteUrl)}</div>
          ${params.footerNote ? `<div style="margin-top: 8px; color: #9ca3af;">${sanitize(params.footerNote)}</div>` : ''}
        </div>
      </div>
    </div>
  `;
}

async function sendViaResend(job: { to: string; subject: string; html: string }, context: string) {
  if (!resend) {
    throw new Error('Resend is not configured');
  }

  if (resendSandboxMode && !isAllowedSandboxRecipient(job.to)) {
    console.warn(`[notification:${context}] skipped in sandbox mode for external recipient`, {
      to: job.to,
      subject: job.subject,
      from: resendFromEmail,
    });
    return false;
  }

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const result = await resend.emails.send({
        from: resendFromEmail,
        to: job.to,
        subject: job.subject,
        html: job.html,
      });

      if (result?.error) {
        throw new Error(result.error.message || 'Resend send failed');
      }

      console.info(`[notification:${context}] sent`, { to: job.to, subject: job.subject, id: result?.data?.id, attempt });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (attempt < 2 && isTransientSendError(message)) {
        console.warn(`[notification:${context}] transient send error, retrying once`, {
          to: job.to,
          subject: job.subject,
          attempt,
          message,
        });
        continue;
      }

      if (isSandboxRecipientRestriction(message)) {
        console.warn(`[notification:${context}] blocked by Resend sandbox recipient rule`, {
          to: job.to,
          subject: job.subject,
          from: resendFromEmail,
        });
        return false;
      }

      logNotificationFailure(context, error, { to: job.to, subject: job.subject, attempt });
      await recordFailedNotification({ notificationType: context, to: job.to, subject: job.subject, html: job.html }, error);
      return false;
    }
  }

  return false;
}

type OrderLineItem = {
  name: string;
  price: number;
  quantity: number;
  lineTotal?: number;
};

export async function sendReservationConfirmation(
  email: string,
  name: string,
  date: string,
  time: string,
  guests: number
) {
  const html = brandedEmailTemplate({
    title: 'Reservation Confirmed',
    subtitle: 'Your table is reserved and our team is ready to welcome you.',
    greeting: `Dear ${name},`,
    intro: 'Thank you for booking with SSR Restaurant. Your reservation has been confirmed with the details below.',
    details: [
      { label: 'Date', value: date },
      { label: 'Time', value: time },
      { label: 'Guests', value: `${guests} people` },
    ],
    highlight: 'Please arrive on time. If you need to change your plan, call us or reply to this message.',
    footerNote: 'Authentic South Indian Andhra cuisine served with warmth and tradition.',
  });

  await sendViaResend({ to: email, subject: 'Reservation Confirmed - SSR Restaurant', html }, 'reservation-confirmation');
}

export async function sendOrderConfirmation(
  email: string,
  name: string,
  orderId: string,
  amount: number
) {
  const html = brandedEmailTemplate({
    title: 'Order Confirmed',
    subtitle: 'We have received your approval and the kitchen is preparing your food.',
    greeting: `Dear ${name},`,
    intro: 'Thank you for ordering from SSR Restaurant. Your order has been confirmed with the summary below.',
    details: [
      { label: 'Order ID', value: orderId },
      { label: 'Amount', value: `₹${amount}` },
      { label: 'Status', value: 'Preparing your delicious meal' },
    ],
    highlight: 'If you need support, please reply to this email or call +91 9491437799.',
    footerNote: 'We appreciate your order and look forward to serving you again.',
  });

  await sendViaResend({ to: email, subject: 'Order Confirmed - SSR Restaurant', html }, 'order-confirmation');
}

export async function sendReservationStatusEmail(params: {
  email: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'cancelled';
}) {
  const isConfirmed = params.status === 'confirmed';

  const html = brandedEmailTemplate({
    title: isConfirmed ? 'Reservation Confirmed' : 'Reservation Cancelled',
    subtitle: isConfirmed
      ? 'Your table is reserved and our team is ready to welcome you.'
      : 'We are sorry. Your reservation request could not be accommodated for the selected slot.',
    greeting: `Dear ${params.name},`,
    intro: isConfirmed
      ? 'Thank you for booking with SSR Restaurant. Your reservation has been confirmed with the details below.'
      : 'We regret to inform you that your reservation request has been cancelled. Please review the details below.',
    details: [
      { label: 'Date', value: params.date },
      { label: 'Time', value: params.time },
      { label: 'Guests', value: `${params.guests} people` },
      { label: 'Status', value: isConfirmed ? 'Confirmed' : 'Cancelled' },
    ],
    highlight: isConfirmed
      ? 'Please arrive on time. If you need any changes, reply to this email or call +91 9491437799.'
      : 'For alternate slot assistance, please call +91 9491437799 and our team will help you.',
    footerNote: 'This update was shared by the SSR Restaurant admin team.',
  });

  await sendViaResend(
    {
      to: params.email,
      subject: isConfirmed ? 'SSR Reservation Confirmed' : 'SSR Reservation Cancelled',
      html,
    },
    `reservation-${params.status}`
  );
}

export async function sendOrderStatusEmail(params: {
  email: string;
  name: string;
  orderId: string;
  amount: number;
  status: 'confirmed' | 'cancelled';
}) {
  const isConfirmed = params.status === 'confirmed';

  const html = brandedEmailTemplate({
    title: isConfirmed ? 'Order Confirmed' : 'Order Cancelled',
    subtitle: isConfirmed
      ? 'Your order has been accepted and our kitchen will begin preparation shortly.'
      : 'We are sorry. Your order request could not be processed at this time.',
    greeting: `Dear ${params.name},`,
    intro: isConfirmed
      ? 'Thank you for ordering from SSR Restaurant. Your order has been confirmed with the summary below.'
      : 'We regret to inform you that your order request has been cancelled. Please review the details below.',
    details: [
      { label: 'Order ID', value: params.orderId },
      { label: 'Amount', value: `₹${params.amount}` },
      { label: 'Status', value: isConfirmed ? 'Confirmed' : 'Cancelled' },
    ],
    highlight: isConfirmed
      ? 'Need support? Reply to this email or call +91 9491437799.'
      : 'For assistance or a fresh order, please call +91 9491437799 and our team will help.',
    footerNote: 'This update was shared by the SSR Restaurant admin team.',
  });

  await sendViaResend(
    {
      to: params.email,
      subject: isConfirmed ? 'SSR Order Confirmed' : 'SSR Order Cancelled',
      html,
    },
    `order-${params.status}`
  );
}

export async function sendContactReply(
  email: string,
  name: string,
  message: string
) {
  const html = brandedEmailTemplate({
    title: 'We Received Your Message',
    subtitle: 'Thanks for reaching out to SSR Restaurant.',
    greeting: `Dear ${name},`,
    intro: 'We have received your message and will get back to you as soon as possible.',
    body: message,
    highlight: 'For urgent help, please call +91 9491437799.',
    footerNote: 'Your enquiry has been logged with our team.',
  });

  await sendViaResend({ to: email, subject: 'We Received Your Message - SSR Restaurant', html }, 'contact-reply');
}

export async function sendRestaurantContactNotification(params: {
  contactId: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const html = brandedEmailTemplate({
    title: 'New Contact Form Message',
    subtitle: params.subject || 'general',
    greeting: `Contact ID: ${params.contactId}`,
    intro: `From: ${params.name} (${params.email})`,
    body: params.message,
    details: [
      { label: 'Phone', value: params.phone || 'N/A' },
      { label: 'Subject', value: params.subject || 'general' },
    ],
    highlight: 'Please review this message and respond from the admin inbox if needed.',
    footerNote: 'Internal contact notification for the restaurant team.',
  });

  await sendViaResend({ to: restaurantOrderEmail, subject: `New Contact Message - ${params.subject || 'general'}`, html }, 'restaurant-contact-notification');
}

export async function sendRestaurantOrderNotification(params: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  pinCode: string;
  amount: number;
  paymentMethod?: string;
  preferredTime?: string;
  specialInstructions?: string;
  orderDescription?: string;
  selectedItems?: OrderLineItem[];
}) {
  const items = Array.isArray(params.selectedItems) ? params.selectedItems : [];
  const html = brandedEmailTemplate({
    title: 'New Order Alert',
    subtitle: 'A new order has been placed on the SSR Restaurant website.',
    greeting: `Order ID: ${params.orderId}`,
    intro: `Customer: ${params.customerName} · Phone: ${params.customerPhone} · Email: ${params.customerEmail || 'N/A'}`,
    details: [
      { label: 'Amount', value: `₹${params.amount}` },
      { label: 'Payment', value: params.paymentMethod || 'N/A' },
      { label: 'Preferred Time', value: params.preferredTime || 'ASAP' },
      { label: 'Address', value: `${params.deliveryAddress}, ${params.pinCode}` },
      { label: 'Special Instructions', value: params.specialInstructions || 'None' },
    ],
    body: items.length > 0
      ? items.map((item) => `${item.name} x ${item.quantity} - ₹${item.lineTotal ?? item.price * item.quantity}`).join('\n')
      : `Order Notes: ${params.orderDescription || 'N/A'}`,
    highlight: 'Please review and process this order from the admin panel.',
    footerNote: 'Restaurant internal order notification.',
  });

  await sendViaResend({ to: restaurantOrderEmail, subject: `New Order Received - ${params.orderId}`, html }, 'restaurant-order-notification');
}

export async function sendRestaurantReservationNotification(params: {
  reservationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  specialRequests?: string;
}) {
  const html = brandedEmailTemplate({
    title: 'New Reservation Alert',
    subtitle: 'A new table reservation has been received.',
    greeting: `Reservation ID: ${params.reservationId}`,
    intro: `${params.firstName} ${params.lastName} · ${params.email} · ${params.phone}`,
    details: [
      { label: 'Date', value: params.date },
      { label: 'Time', value: params.time },
      { label: 'Guests', value: `${params.guests}` },
      { label: 'Occasion', value: params.occasion || 'N/A' },
      { label: 'Special Requests', value: params.specialRequests || 'None' },
    ],
    highlight: 'Please review and confirm or cancel this reservation from the admin panel.',
    footerNote: 'Restaurant internal reservation notification.',
  });

  await sendViaResend({ to: restaurantOrderEmail, subject: `New Reservation - ${params.firstName} ${params.lastName}`, html }, 'restaurant-reservation-notification');
}

ensureRetryLoop();

export async function sendAdminPasswordResetEmail(email: string, resetUrl: string) {
  if (!resend) {
    console.warn('Resend is not configured. Skipping admin password reset email.');
    return;
  }

  try {
    const result = await resend.emails.send({
      from: resendFromEmail,
      to: email,
      subject: 'SSR Admin Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b5451b;">Reset Admin Password</h2>
          <p>We received a request to reset your SSR admin password.</p>
          <p>This link expires in 15 minutes.</p>
          <p style="margin: 24px 0;">
            <a href="${resetUrl}" style="background:#b5451b;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block;">Reset Password</a>
          </p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (result?.error) {
      throw new Error(result.error.message || 'Resend password reset send failed');
    }
  } catch (error) {
    console.error('Failed to send admin password reset email:', error);
  }
}
