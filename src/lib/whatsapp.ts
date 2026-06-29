type OrderLineItem = {
  name: string;
  price: number;
  quantity: number;
  lineTotal?: number;
};

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID?.trim() || '';
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN?.trim() || '';
const twilioWhatsappFrom = process.env.TWILIO_WHATSAPP_FROM?.trim() || '';
const orderNotificationWhatsappTo = process.env.ORDER_NOTIFICATION_WHATSAPP_TO?.trim() || '+919515416903';
const twilioOrderContentSid = process.env.TWILIO_ORDER_CONTENT_SID?.trim() || '';
const twilioReservationContentSid = process.env.TWILIO_RESERVATION_CONTENT_SID?.trim() || '';
const twilioContactContentSid = process.env.TWILIO_CONTACT_CONTENT_SID?.trim() || '';
const twilioTestContentSid = process.env.TWILIO_TEST_CONTENT_SID?.trim() || '';

function normalizeIndianPhone(raw: string) {
  const cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  const digitsOnly = cleaned.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }

  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return `+${digitsOnly}`;
  }

  return cleaned;
}

function toWhatsappAddress(value: string) {
  if (value.toLowerCase().startsWith('whatsapp:')) {
    return value;
  }
  return `whatsapp:${normalizeIndianPhone(value)}`;
}

function formatOrderItems(items: OrderLineItem[]) {
  if (items.length === 0) {
    return null;
  }

  return items
    .slice(0, 8)
    .map((item) => `${item.name} x ${item.quantity} - Rs ${item.lineTotal ?? item.price * item.quantity}`)
    .join('\n');
}

function buildOrderWhatsappMessage(params: {
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
  const formattedItems = formatOrderItems(items);

  const messageLines = [
    'New Order Alert - SSR Restaurant',
    `Order ID: ${params.orderId}`,
    `Customer: ${params.customerName}`,
    `Phone: ${params.customerPhone}`,
    `Email: ${params.customerEmail || 'N/A'}`,
    `Amount: Rs ${params.amount}`,
    `Payment: ${params.paymentMethod || 'N/A'}`,
    `Preferred Time: ${params.preferredTime || 'ASAP'}`,
    `Address: ${params.deliveryAddress}, ${params.pinCode}`,
    `Special Instructions: ${params.specialInstructions || 'None'}`,
    formattedItems ? `Items:\n${formattedItems}` : `Order Notes: ${params.orderDescription || 'N/A'}`,
  ];

  return messageLines.join('\n');
}

function isWhatsAppConfigured() {
  return Boolean(twilioAccountSid && twilioAuthToken && twilioWhatsappFrom);
}

function stringifyContentVariables(variables: Record<string, string>) {
  const cleaned: Record<string, string> = {};
  Object.entries(variables).forEach(([key, value]) => {
    cleaned[key] = value;
  });
  return JSON.stringify(cleaned);
}

async function sendWhatsappMessage(params: {
  to: string;
  context: string;
  body?: string;
  contentSid?: string;
  contentVariables?: Record<string, string>;
}) {
  const authHeader = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');

  const sendRequest = async (payload: URLSearchParams) => {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        body: await response.text(),
      };
    }

    return {
      ok: true,
      status: response.status,
      body: await response.text(),
    };
  };

  if (!params.contentSid && !params.body) {
    throw new Error('Either body or contentSid must be provided for WhatsApp send');
  }

  if (params.contentSid) {
    const templatePayload = new URLSearchParams({
      From: toWhatsappAddress(twilioWhatsappFrom),
      To: toWhatsappAddress(params.to),
      ContentSid: params.contentSid,
    });

    if (params.contentVariables && Object.keys(params.contentVariables).length > 0) {
      templatePayload.append('ContentVariables', stringifyContentVariables(params.contentVariables));
    }

    const templateResult = await sendRequest(templatePayload);
    if (templateResult.ok) {
      console.info(`[notification:${params.context}] sent`, {
        to: toWhatsappAddress(params.to),
        mode: 'content-template',
      });
      return true;
    }

    console.warn(`[notification:${params.context}] template send failed, trying plain text fallback`, {
      status: templateResult.status,
      body: templateResult.body,
    });
  }

  if (params.body) {
    const plainPayload = new URLSearchParams({
      From: toWhatsappAddress(twilioWhatsappFrom),
      To: toWhatsappAddress(params.to),
      Body: params.body,
    });

    const plainResult = await sendRequest(plainPayload);
    if (plainResult.ok) {
      console.info(`[notification:${params.context}] sent`, {
        to: toWhatsappAddress(params.to),
        mode: 'plain-text-fallback',
      });
      return true;
    }

    console.error(`[notification:${params.context}] failed`, {
      status: plainResult.status,
      body: plainResult.body,
    });
    return false;
  }

  return false;
}

export async function sendRestaurantOrderWhatsappNotification(params: {
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
  if (!isWhatsAppConfigured()) {
    console.warn('[notification:restaurant-order-whatsapp] skipped because Twilio WhatsApp env vars are missing.');
    return false;
  }

  try {
    const sent = await sendWhatsappMessage({
      to: orderNotificationWhatsappTo,
      context: 'restaurant-order-whatsapp',
      body: buildOrderWhatsappMessage(params),
      contentSid: twilioOrderContentSid || undefined,
      contentVariables: twilioOrderContentSid
        ? {
            '1': params.orderId,
            '2': params.customerName,
            '3': params.customerPhone,
            '4': `${params.amount}`,
            '5': params.paymentMethod || 'N/A',
            '6': params.preferredTime || 'ASAP',
            '7': `${params.deliveryAddress}, ${params.pinCode}`,
            '8': params.specialInstructions || 'None',
          }
        : undefined,
    });

    if (sent) {
      console.info('[notification:restaurant-order-whatsapp] details', {
        orderId: params.orderId,
      });
    }

    return sent;
  } catch (error) {
    console.error('[notification:restaurant-order-whatsapp] failed', error);
    return false;
  }
}

export async function sendRestaurantReservationWhatsappNotification(params: {
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
  if (!isWhatsAppConfigured()) {
    console.warn('[notification:restaurant-reservation-whatsapp] skipped because Twilio WhatsApp env vars are missing.');
    return false;
  }

  const message = [
    'New Reservation Alert - SSR Restaurant',
    `Reservation ID: ${params.reservationId}`,
    `Guest: ${params.firstName} ${params.lastName}`,
    `Phone: ${params.phone}`,
    `Email: ${params.email}`,
    `Date: ${params.date}`,
    `Time: ${params.time}`,
    `Guests: ${params.guests}`,
    `Occasion: ${params.occasion || 'N/A'}`,
    `Special Requests: ${params.specialRequests || 'None'}`,
  ].join('\n');

  try {
    const sent = await sendWhatsappMessage({
      to: orderNotificationWhatsappTo,
      context: 'restaurant-reservation-whatsapp',
      body: message,
      contentSid: twilioReservationContentSid || undefined,
      contentVariables: twilioReservationContentSid
        ? {
            '1': params.reservationId,
            '2': `${params.firstName} ${params.lastName}`,
            '3': params.phone,
            '4': params.date,
            '5': params.time,
            '6': `${params.guests}`,
            '7': params.occasion || 'N/A',
            '8': params.specialRequests || 'None',
          }
        : undefined,
    });

    if (sent) {
      console.info('[notification:restaurant-reservation-whatsapp] details', {
        reservationId: params.reservationId,
      });
    }

    return sent;
  } catch (error) {
    console.error('[notification:restaurant-reservation-whatsapp] failed', error);
    return false;
  }
}

export async function sendRestaurantContactWhatsappNotification(params: {
  contactId: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  if (!isWhatsAppConfigured()) {
    console.warn('[notification:restaurant-contact-whatsapp] skipped because Twilio WhatsApp env vars are missing.');
    return false;
  }

  const message = [
    'New Contact Message - SSR Restaurant',
    `Contact ID: ${params.contactId}`,
    `Name: ${params.name}`,
    `Email: ${params.email}`,
    `Phone: ${params.phone || 'N/A'}`,
    `Subject: ${params.subject || 'general'}`,
    `Message: ${params.message}`,
  ].join('\n');

  try {
    const sent = await sendWhatsappMessage({
      to: orderNotificationWhatsappTo,
      context: 'restaurant-contact-whatsapp',
      body: message,
      contentSid: twilioContactContentSid || undefined,
      contentVariables: twilioContactContentSid
        ? {
            '1': params.contactId,
            '2': params.name,
            '3': params.email,
            '4': params.phone || 'N/A',
            '5': params.subject || 'general',
            '6': params.message,
          }
        : undefined,
    });

    if (sent) {
      console.info('[notification:restaurant-contact-whatsapp] details', {
        contactId: params.contactId,
      });
    }

    return sent;
  } catch (error) {
    console.error('[notification:restaurant-contact-whatsapp] failed', error);
    return false;
  }
}

export async function sendRestaurantWhatsappTestNotification(note?: string) {
  if (!isWhatsAppConfigured()) {
    console.warn('[notification:restaurant-whatsapp-test] skipped because Twilio WhatsApp env vars are missing.');
    return false;
  }

  const now = new Date().toLocaleString('en-IN', { hour12: true });
  const message = [
    'SSR Restaurant WhatsApp test message',
    `Time: ${now}`,
    `To: ${orderNotificationWhatsappTo}`,
    note ? `Note: ${note}` : 'Note: API smoke test',
  ].join('\n');

  try {
    return await sendWhatsappMessage({
      to: orderNotificationWhatsappTo,
      context: 'restaurant-whatsapp-test',
      body: message,
      contentSid: twilioTestContentSid || undefined,
      contentVariables: twilioTestContentSid
        ? {
            '1': now,
            '2': note || 'API smoke test',
            '3': orderNotificationWhatsappTo,
          }
        : undefined,
    });
  } catch (error) {
    console.error('[notification:restaurant-whatsapp-test] failed', error);
    return false;
  }
}
