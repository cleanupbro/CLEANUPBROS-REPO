/**
 * Square Payment Integration
 * Creates payment links for confirmed bookings
 */

const SQUARE_API_BASE = 'https://connect.squareup.com/v2';
const SQUARE_ACCESS_TOKEN = import.meta.env.VITE_SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID;

export interface PaymentLinkData {
  customerName: string;
  customerEmail: string;
  serviceType: string;
  amount: number; // in AUD
  referenceId: string;
  description?: string;
}

export interface SquarePaymentLinkResponse {
  success: boolean;
  paymentLink?: string;
  orderId?: string;
  error?: string;
}

/**
 * Create a Square payment link for a booking
 * Note: This requires a backend API endpoint to keep Square credentials secure
 */
export const createPaymentLink = async (
  data: PaymentLinkData
): Promise<SquarePaymentLinkResponse> => {
  try {
    // Call your n8n webhook which handles Square API integration
    const n8nWebhookUrl = 'https://nioctibinu.online/webhook/create-payment-link';

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        serviceType: data.serviceType,
        amount: data.amount,
        referenceId: data.referenceId,
        description: data.description || `${data.serviceType} - Clean Up Bros`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Square API error: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      paymentLink: result.payment_link?.url,
      orderId: result.order?.id,
    };
  } catch (error) {
    console.error('Square payment link creation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Backend implementation example (for n8n or Supabase Edge Function)
 * This code should run on your backend, not in the browser!
 */
export const createSquarePaymentLinkBackend = async (data: PaymentLinkData) => {
  const response = await fetch(`${SQUARE_API_BASE}/online-checkout/payment-links`, {
    method: 'POST',
    headers: {
      'Square-Version': '2024-12-18',
      'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idempotency_key: data.referenceId,
      order: {
        location_id: SQUARE_LOCATION_ID,
        line_items: [
          {
            name: data.serviceType,
            quantity: '1',
            base_price_money: {
              amount: Math.round(data.amount * 100), // Convert to cents
              currency: 'AUD',
            },
            note: data.description,
          },
        ],
        customer_id: undefined, // Optional: create customer in Square first
      },
      checkout_options: {
        redirect_url: 'https://cleanupbros.com.au/payment-success',
        merchant_support_email: 'cleanupbros.au@gmail.com',
        ask_for_shipping_address: false,
        enable_loyalty: false,
      },
      pre_populated_data: {
        buyer_email: data.customerEmail,
        buyer_phone_number: undefined, // Optional
      },
    }),
  });

  return await response.json();
};

/**
 * Verify Square webhook signature
 * Use this to validate webhooks from Square
 */
export const verifySquareWebhook = (
  webhookUrl: string,
  requestBody: string,
  signatureHeader: string
): boolean => {
  // Square webhook verification logic
  // See: https://developer.squareup.com/docs/webhooks/step3validate

  const crypto = require('crypto');
  const SQUARE_WEBHOOK_SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

  const hmac = crypto.createHmac('sha256', SQUARE_WEBHOOK_SIGNATURE_KEY);
  hmac.update(webhookUrl + requestBody);
  const expectedSignature = hmac.digest('base64');

  return expectedSignature === signatureHeader;
};

/**
 * Handle Square webhook events
 */
export const handleSquareWebhook = async (event: any) => {
  switch (event.type) {
    case 'payment.created':
      console.log('Payment created:', event.data.object.payment);
      // Update Supabase submission status to "Paid"
      break;

    case 'payment.updated':
      console.log('Payment updated:', event.data.object.payment);
      if (event.data.object.payment.status === 'COMPLETED') {
        // Send confirmation email
        // Update booking status
        // Notify admin via Telegram
      }
      break;

    case 'order.created':
      console.log('Order created:', event.data.object.order);
      break;

    default:
      console.log('Unhandled Square event type:', event.type);
  }
};
