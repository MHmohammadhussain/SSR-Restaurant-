import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const resendEnabled = resendApiKey.startsWith('re_') && !resendApiKey.includes('placeholder');
const resend = resendEnabled ? new Resend(resendApiKey) : null;

export async function sendReservationConfirmation(
  email: string,
  name: string,
  date: string,
  time: string,
  guests: number
) {
  if (!resend) {
    console.warn('Resend is not configured. Skipping reservation email.');
    return;
  }

  try {
    await resend.emails.send({
      from: resendFromEmail,
      to: email,
      subject: 'Reservation Confirmed - SSR Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b5451b;">Reservation Confirmed! 🎉</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for booking with SSR Restaurant. Your reservation has been confirmed with the following details:</p>
          <div style="background: #f4a229; padding: 20px; border-radius: 8px; margin: 20px 0; color: #fff;">
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Guests:</strong> ${guests} people</p>
          </div>
          <p>We look forward to serving you authentic South Indian Andhra cuisine!</p>
          <p>For any changes or cancellations, please call us at <strong>+91 9491437799</strong></p>
          <p>Best regards,<br><strong>SSR Restaurant Team</strong></p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send reservation email:', error);
  }
}

export async function sendOrderConfirmation(
  email: string,
  name: string,
  orderId: string,
  amount: number
) {
  if (!resend) {
    console.warn('Resend is not configured. Skipping order email.');
    return;
  }

  try {
    await resend.emails.send({
      from: resendFromEmail,
      to: email,
      subject: 'Order Confirmed - SSR Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b5451b;">Order Confirmed! 🍛</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for ordering from SSR Restaurant!</p>
          <div style="background: #f4a229; padding: 20px; border-radius: 8px; margin: 20px 0; color: #fff;">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Amount:</strong> ₹${amount}</p>
            <p><strong>Status:</strong> Preparing your delicious meal...</p>
          </div>
          <p>Your order will be delivered soon. You can track your delivery status or call us at <strong>+91 9491437799</strong></p>
          <p>Best regards,<br><strong>SSR Restaurant Team</strong></p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send order email:', error);
  }
}

export async function sendContactReply(
  email: string,
  name: string,
  message: string
) {
  if (!resend) {
    console.warn('Resend is not configured. Skipping contact email.');
    return;
  }

  try {
    await resend.emails.send({
      from: resendFromEmail,
      to: email,
      subject: 'We Received Your Message - SSR Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b5451b;">Thank You For Contacting Us!</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <div style="background: #f4a229; padding: 20px; border-radius: 8px; margin: 20px 0; color: #1a1a1a;">
            <p><strong>Your Message:</strong></p>
            <p>${message}</p>
          </div>
          <p>If you need immediate assistance, please call us at <strong>+91 9491437799</strong></p>
          <p>Best regards,<br><strong>SSR Restaurant Team</strong></p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send contact email:', error);
  }
}
