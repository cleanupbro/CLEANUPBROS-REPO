# N8N BACKEND AUTOMATION - CLEAN UP BROS
## Complete Production-Ready Workflow

**Created:** December 21, 2025
**Backend:** n8n + Square + Resend + Telegram

---

## 🎯 WORKFLOW OVERVIEW

### **Customer Journey:**

```
1. Client submits quote
   ↓
2. Supabase saves submission
   ↓
3. n8n webhook receives data
   ↓
4. Client gets welcome email (personalized)
   ↓
5. Admin gets Telegram + Email alert
   ↓
6. Admin calls client (human in loop)
   ↓
7. Admin confirms booking + enters price
   ↓
8. n8n creates Square payment link
   ↓
9. Client receives payment email with link
   ↓
10. Client pays
   ↓
11. Admin gets payment confirmation
   ↓
12. Job scheduled!
```

---

## 📋 PREREQUISITES

### 1. **n8n Setup** ✅
- n8n instance: `https://nioctibinu.online`
- Existing webhooks configured:
  - Residential: `/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c`
  - Commercial: `/webhook/bb12f45e-21f4-4e43-af36-5dbed46fe072`
  - Airbnb: `/webhook/a12b53e8-2391-4c82-b611-47fa4032c235`
  - Jobs: `/webhook/8da4395f-48f7-4d56-b500-3c43e2077ac6`
  - Client Feedback: `/webhook/22624a36-cd07-4b6b-9334-3909dd3cff9f`
  - Landing Lead: `/webhook/c5dc6960-15ee-4ccb-9cac-3bf8ffcb7bda`

**NEW Webhooks to Create:**
  - Booking Confirmation: `/webhook/booking-confirmation`
  - Square Payment Link: `/webhook/create-payment-link`

### 2. **Square Account**
- Square Business account
- API credentials (Access Token, Location ID)
- Get from: https://developer.squareup.com

### 3. **Twilio (SMS Notifications)** ✅
- Account SID: `[YOUR_TWILIO_ACCOUNT_SID]` (stored securely in .env)
- Auth Token: `[YOUR_TWILIO_AUTH_TOKEN]` (stored securely in .env)
- Phone Number: `+61 2 5655 3786`
- Dashboard: https://console.twilio.com

### 4. **Telegram Bot**
- Bot Token: (create via @BotFather)
- Admin Chat ID: (get from @userinfobot)
- See: `TELEGRAM_BOT_SETUP.md` for complete guide

### 3. **Resend Email**
- Resend account: https://resend.com
- API key
- Verified domain (or use resend.dev)

### 4. **Telegram Bot**
- Create bot via @BotFather
- Get bot token
- Get your chat ID

---

## 🔧 STEP 1: CONFIGURE SERVICES

### **A. Square API Setup**

1. **Go to:** https://developer.squareup.com/apps
2. **Create Application:** "Clean Up Bros Payments"
3. **Get Credentials:**
   - **Access Token** (Production): `EAAAl...` (long string)
   - **Location ID**: `L12345...` (your business location)
4. **Enable:** Payment Links API

**Save these:**
```env
SQUARE_ACCESS_TOKEN=EAAA...
SQUARE_LOCATION_ID=L12345...
SQUARE_ENVIRONMENT=production  # or 'sandbox' for testing
```

---

### **B. Resend Email Setup**

1. **Go to:** https://resend.com
2. **Get API Key:** Settings → API Keys
3. **Verify Domain** (optional): Use your domain or `resend.dev`

**Save this:**
```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@cleanupbros.com.au
```

---

### **C. Telegram Bot Setup**

1. **Open Telegram** → Search for `@BotFather`
2. **Send:** `/newbot`
3. **Name it:** "Clean Up Bros Alerts"
4. **Username:** `cleanupbros_bot`
5. **Get Token:** `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

6. **Get Your Chat ID:**
   - Send a message to your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your `chat_id` in the response

**Save these:**
```env
TELEGRAM_BOT_TOKEN=123456789:ABC...
TELEGRAM_ADMIN_CHAT_ID=987654321
```

---

## 🎨 STEP 2: CREATE EMAIL TEMPLATES

### **Template 1: Welcome Email (To Client)**

**File:** `email_templates/welcome.html`

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { background: linear-gradient(135deg, #F2B705 0%, #FFD700 100%);
              padding: 40px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #fff; padding: 40px; border: 1px solid #e0e0e0;
               border-radius: 0 0 12px 12px; }
    .button { background: #0071e3; color: white; padding: 16px 32px;
              text-decoration: none; border-radius: 8px; display: inline-block;
              margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #0B2545; margin: 0; font-size: 32px;">✨ Clean Up Bros</h1>
      <p style="color: #0B2545; margin-top: 10px; font-size: 18px;">
        Sydney's Premier Cleaning Service
      </p>
    </div>

    <div class="content">
      <h2 style="color: #1D1D1F;">Hi {{customerName}},</h2>

      <p style="font-size: 16px; line-height: 1.6; color: #333;">
        Thank you for choosing Clean Up Bros! We've received your quote request
        for <strong>{{serviceType}}</strong>.
      </p>

      <div style="background: #F5F5F7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1D1D1F;">Your Quote Details</h3>
        <p style="margin: 5px 0;"><strong>Reference ID:</strong> {{referenceId}}</p>
        <p style="margin: 5px 0;"><strong>Service:</strong> {{serviceType}}</p>
        <p style="margin: 5px 0;"><strong>Estimated Price:</strong> ${{estimatedPrice}}</p>
        <p style="margin: 5px 0;"><strong>Property:</strong> {{propertyDetails}}</p>
      </div>

      <p style="font-size: 16px; line-height: 1.6; color: #333;">
        <strong>What happens next?</strong>
      </p>

      <ol style="font-size: 16px; line-height: 1.8; color: #333;">
        <li>Our team will call you within the next 2 hours to confirm details</li>
        <li>We'll finalize the price and schedule</li>
        <li>You'll receive a secure payment link</li>
        <li>Once paid, your booking is confirmed!</li>
      </ol>

      <p style="font-size: 16px; line-height: 1.6; color: #333;">
        Have questions? Call us anytime at
        <a href="tel:+61406764585" style="color: #0071e3;">+61 406 764 585</a>
      </p>

      <a href="https://cleanupbros.com.au" class="button">
        Visit Our Website
      </a>

      <p style="font-size: 14px; color: #666; margin-top: 30px;">
        Looking forward to serving you!<br>
        <strong style="color: #F2B705;">The Clean Up Bros Team</strong>
      </p>
    </div>

    <div class="footer">
      <p>Clean Up Bros | Sydney, NSW | +61 406 764 585</p>
      <p>cleanupbros.au@gmail.com | cleanupbros.com.au</p>
      <p style="font-size: 12px; color: #999;">
        You're receiving this because you requested a quote from Clean Up Bros.
      </p>
    </div>
  </div>
</body>
</html>
```

---

### **Template 2: Payment Request Email**

**File:** `email_templates/payment.html`

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { background: linear-gradient(135deg, #0071e3 0%, #00a6ff 100%);
              padding: 40px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #fff; padding: 40px; border: 1px solid #e0e0e0;
               border-radius: 0 0 12px 12px; }
    .price-box { background: #F2B705; color: #0B2545; padding: 30px;
                 text-align: center; border-radius: 12px; margin: 30px 0; }
    .button { background: #0B2545; color: white; padding: 18px 40px;
              text-decoration: none; border-radius: 8px; display: inline-block;
              margin: 20px 0; font-size: 18px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: white; margin: 0; font-size: 32px;">💳 Payment Ready!</h1>
      <p style="color: white; margin-top: 10px; font-size: 18px; opacity: 0.9;">
        Your booking is confirmed. Pay securely to complete.
      </p>
    </div>

    <div class="content">
      <h2 style="color: #1D1D1F;">Hi {{customerName}},</h2>

      <p style="font-size: 16px; line-height: 1.6; color: #333;">
        Great news! We've confirmed your booking for <strong>{{serviceType}}</strong>.
        Complete your payment to lock in your appointment.
      </p>

      <div class="price-box">
        <p style="margin: 0; font-size: 18px; opacity: 0.8;">Total Amount</p>
        <h1 style="margin: 10px 0; font-size: 48px;">${{finalPrice}}</h1>
        <p style="margin: 0; font-size: 16px; opacity: 0.8;">{{serviceType}}</p>
      </div>

      <div style="background: #F5F5F7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1D1D1F;">Booking Details</h3>
        <p style="margin: 5px 0;"><strong>Service Date:</strong> {{serviceDate}}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> {{serviceTime}}</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> {{propertyAddress}}</p>
        <p style="margin: 5px 0;"><strong>Reference:</strong> {{referenceId}}</p>
      </div>

      <div style="text-align: center;">
        <a href="{{paymentLink}}" class="button">
          🔒 Pay Securely with Square
        </a>
      </div>

      <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
        🔐 Secure payment powered by Square<br>
        💳 All major credit cards accepted<br>
        ✅ Instant booking confirmation
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 30px;">
        <strong>After payment:</strong><br>
        • You'll receive instant confirmation<br>
        • We'll send a reminder 24 hours before<br>
        • Our team will arrive on time!
      </p>

      <p style="font-size: 14px; color: #666; margin-top: 30px;">
        Questions? Call us at
        <a href="tel:+61406764585" style="color: #0071e3;">+61 406 764 585</a>
      </p>
    </div>

    <div class="footer">
      <p>Clean Up Bros | Sydney, NSW | +61 406 764 585</p>
      <p style="font-size: 12px; color: #999;">
        Payment link expires in 48 hours
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 🤖 STEP 3: N8N WORKFLOW JSON

### **Complete Automation Workflow**

**Save as:** `n8n_workflow_cleanupbros.json`

```json
{
  "name": "Clean Up Bros - Quote to Payment",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "cleanupbros-quote",
        "responseMode": "lastNode",
        "options": {}
      },
      "name": "Webhook - Quote Received",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "cleanupbros-main"
    },
    {
      "parameters": {
        "operation": "sendMessage",
        "chatId": "={{$env.TELEGRAM_ADMIN_CHAT_ID}}",
        "text": "🆕 NEW QUOTE REQUEST!\n\n👤 Name: {{$json.customerName}}\n📧 Email: {{$json.email}}\n📞 Phone: {{$json.phone}}\n\n🏠 Service: {{$json.serviceType}}\n💰 Est. Price: ${{$json.estimatedPrice}}\n📍 Suburb: {{$json.suburb}}\n\n🔗 Ref: {{$json.referenceId}}\n\n⏰ Submitted: {{$now.format('DD/MM/YYYY HH:mm')}}\n\n📞 CALL CLIENT TO CONFIRM!",
        "additionalFields": {
          "parse_mode": "Markdown"
        }
      },
      "name": "Telegram - Alert Admin",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1,
      "position": [450, 200],
      "credentials": {
        "telegramApi": {
          "id": "1",
          "name": "Telegram Bot"
        }
      }
    },
    {
      "parameters": {
        "fromEmail": "={{$env.RESEND_FROM_EMAIL}}",
        "toEmail": "={{$json.email}}",
        "subject": "✨ Quote Received - Clean Up Bros",
        "html": "=<html><!-- Use welcome.html template here --></html>",
        "options": {
          "replyTo": "cleanupbros.au@gmail.com"
        }
      },
      "name": "Email - Welcome Client",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [450, 400],
      "credentials": {
        "resend": {
          "id": "2",
          "name": "Resend API"
        }
      }
    },
    {
      "parameters": {
        "fromEmail": "noreply@cleanupbros.com.au",
        "toEmail": "cleanupbros.au@gmail.com",
        "subject": "🔔 New Quote: {{$json.customerName}} - {{$json.serviceType}}",
        "text": "New quote received!\n\nCustomer: {{$json.customerName}}\nEmail: {{$json.email}}\nPhone: {{$json.phone}}\nService: {{$json.serviceType}}\nEst. Price: ${{$json.estimatedPrice}}\n\nRef: {{$json.referenceId}}\n\nCall client to confirm booking!",
        "options": {}
      },
      "name": "Email - Alert Admin",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [450, 600],
      "credentials": {
        "resend": {
          "id": "2",
          "name": "Resend API"
        }
      }
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "cleanupbros-confirm-booking",
        "responseMode": "lastNode",
        "options": {}
      },
      "name": "Webhook - Booking Confirmed by Admin",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [750, 300],
      "webhookId": "cleanupbros-confirm"
    },
    {
      "parameters": {
        "url": "https://connect.squareup.com/v2/online-checkout/payment-links",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Square-Version",
              "value": "2024-12-18"
            },
            {
              "name": "Authorization",
              "value": "=Bearer {{$env.SQUARE_ACCESS_TOKEN}}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "idempotency_key",
              "value": "={{$json.referenceId}}"
            },
            {
              "name": "order",
              "value": {
                "location_id": "={{$env.SQUARE_LOCATION_ID}}",
                "line_items": [
                  {
                    "name": "={{$json.serviceType}} - Clean Up Bros",
                    "quantity": "1",
                    "base_price_money": {
                      "amount": "={{Math.round($json.finalPrice * 100)}}",
                      "currency": "AUD"
                    }
                  }
                ]
              }
            },
            {
              "name": "checkout_options",
              "value": {
                "redirect_url": "https://cleanupbros.com.au/payment-success",
                "ask_for_shipping_address": false
              }
            }
          ]
        },
        "options": {}
      },
      "name": "Square - Create Payment Link",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [950, 300]
    },
    {
      "parameters": {
        "fromEmail": "noreply@cleanupbros.com.au",
        "toEmail": "={{$json.customerEmail}}",
        "subject": "💳 Payment Link Ready - Clean Up Bros Booking",
        "html": "=<html><!-- Use payment.html template here --></html>",
        "options": {
          "replyTo": "cleanupbros.au@gmail.com"
        }
      },
      "name": "Email - Send Payment Link",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [1150, 300],
      "credentials": {
        "resend": {
          "id": "2",
          "name": "Resend API"
        }
      }
    },
    {
      "parameters": {
        "operation": "sendMessage",
        "chatId": "={{$env.TELEGRAM_ADMIN_CHAT_ID}}",
        "text": "✅ PAYMENT LINK SENT!\n\n👤 Customer: {{$json.customerName}}\n💰 Amount: ${{$json.finalPrice}}\n🔗 Payment Link Created\n\n📧 Email sent to: {{$json.customerEmail}}\n\n⏰ {{$now.format('DD/MM/YYYY HH:mm')}}",
        "additionalFields": {}
      },
      "name": "Telegram - Confirm Link Sent",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1,
      "position": [1150, 500],
      "credentials": {
        "telegramApi": {
          "id": "1",
          "name": "Telegram Bot"
        }
      }
    }
  ],
  "connections": {
    "Webhook - Quote Received": {
      "main": [
        [
          {
            "node": "Telegram - Alert Admin",
            "type": "main",
            "index": 0
          },
          {
            "node": "Email - Welcome Client",
            "type": "main",
            "index": 0
          },
          {
            "node": "Email - Alert Admin",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Webhook - Booking Confirmed by Admin": {
      "main": [
        [
          {
            "node": "Square - Create Payment Link",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Square - Create Payment Link": {
      "main": [
        [
          {
            "node": "Email - Send Payment Link",
            "type": "main",
            "index": 0
          },
          {
            "node": "Telegram - Confirm Link Sent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {},
  "staticData": null,
  "tags": [],
  "triggerCount": 0,
  "updatedAt": "2025-12-21T00:00:00.000Z",
  "versionId": "1"
}
```

---

## 🔗 STEP 4: UPDATE FRONTEND WEBHOOKS

Now update your app to use n8n webhooks:

**File:** `constants.ts`

```typescript
export const WEBHOOK_URLS = {
  // n8n Webhook for quote submissions
  QUOTE_SUBMISSION: 'https://your-n8n-instance.com/webhook/cleanupbros-quote',

  // n8n Webhook for booking confirmation (admin triggered)
  BOOKING_CONFIRMATION: 'https://your-n8n-instance.com/webhook/cleanupbros-confirm-booking',

  // Square Webhooks (for payment events)
  SQUARE_WEBHOOK: 'https://your-n8n-instance.com/webhook/square-payment',
};
```

---

## 📱 STEP 5: ADMIN CONFIRMATION INTERFACE

Create a simple admin interface to confirm bookings:

**File:** `views/AdminConfirmBookingView.tsx`

```typescript
import React, { useState } from 'react';

export const AdminConfirmBooking = ({ submission }) => {
  const [finalPrice, setFinalPrice] = useState(submission.data.priceEstimate || '');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('Morning');
  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = async () => {
    setLoading(true);

    const payload = {
      referenceId: submission.id,
      customerName: submission.data.fullName,
      customerEmail: submission.data.email,
      customerPhone: submission.data.phone,
      serviceType: submission.type,
      finalPrice: parseFloat(finalPrice),
      serviceDate,
      serviceTime,
      propertyAddress: `${submission.data.suburb}, Sydney NSW`,
      propertyDetails: `${submission.data.bedrooms}BR, ${submission.data.bathrooms}BA`
    };

    try {
      // Send to n8n webhook
      const response = await fetch('https://your-n8n-instance.com/webhook/cleanupbros-confirm-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('✅ Payment link sent to customer!');
        // Update submission status to Confirmed
      } else {
        alert('❌ Failed to send payment link');
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gradient-gold">
        Confirm Booking & Send Payment Link
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Final Price (AUD)</label>
          <input
            type="number"
            value={finalPrice}
            onChange={(e) => setFinalPrice(e.target.value)}
            className="glass-input w-full"
            placeholder="350.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Service Date</label>
          <input
            type="date"
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
            className="glass-input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Service Time</label>
          <select
            value={serviceTime}
            onChange={(e) => setServiceTime(e.target.value)}
            className="glass-input w-full"
          >
            <option>Morning (8am-12pm)</option>
            <option>Afternoon (12pm-5pm)</option>
            <option>Flexible</option>
          </select>
        </div>

        <button
          onClick={handleConfirmBooking}
          disabled={loading || !finalPrice || !serviceDate}
          className="glass-button glow-gold w-full py-4 text-lg font-bold"
        >
          {loading ? 'Sending...' : '💳 Confirm & Send Payment Link'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>What happens next:</strong><br/>
          1. Square payment link will be created<br/>
          2. Customer receives email with payment link<br/>
          3. You get Telegram confirmation<br/>
          4. Customer pays and booking is locked in!
        </p>
      </div>
    </div>
  );
};
```

---

## 🎯 STEP 6: DEPLOYMENT CHECKLIST

### **Before Going Live:**

- [ ] Set up n8n instance (cloud.n8n.io or self-hosted)
- [ ] Import `n8n_workflow_cleanupbros.json`
- [ ] Configure Square credentials in n8n
- [ ] Configure Resend credentials in n8n
- [ ] Configure Telegram credentials in n8n
- [ ] Test workflow with test data
- [ ] Update `constants.ts` with real webhook URLs
- [ ] Add email templates to n8n workflow
- [ ] Test end-to-end flow
- [ ] Go live! 🚀

---

## 📊 WORKFLOW TESTING

### **Test Quote Submission:**

```bash
curl -X POST https://your-n8n-instance.com/webhook/cleanupbros-quote \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Smith",
    "email": "john@example.com",
    "phone": "+61400123456",
    "serviceType": "Residential Cleaning",
    "estimatedPrice": 250,
    "suburb": "Liverpool",
    "bedrooms": 3,
    "bathrooms": 2,
    "referenceId": "REF123456"
  }'
```

**Expected Results:**
1. ✅ Telegram message to admin
2. ✅ Welcome email to customer
3. ✅ Email alert to admin

---

### **Test Booking Confirmation:**

```bash
curl -X POST https://your-n8n-instance.com/webhook/cleanupbros-confirm-booking \
  -H "Content-Type: application/json" \
  -d '{
    "referenceId": "REF123456",
    "customerName": "John Smith",
    "customerEmail": "john@example.com",
    "customerPhone": "+61400123456",
    "serviceType": "Residential Cleaning",
    "finalPrice": 275,
    "serviceDate": "2025-12-25",
    "serviceTime": "Morning (8am-12pm)",
    "propertyAddress": "Liverpool, Sydney NSW",
    "propertyDetails": "3BR, 2BA"
  }'
```

**Expected Results:**
1. ✅ Square payment link created
2. ✅ Payment email sent to customer
3. ✅ Telegram confirmation to admin

---

## 🎁 BONUS FEATURES

### **Add to Your Workflow:**

1. **SMS Notifications** (Twilio)
   - Send SMS to customer after quote
   - SMS reminder 24h before service

2. **Calendar Integration** (Google Calendar)
   - Auto-add bookings to calendar
   - Share with cleaning team

3. **Payment Confirmation Webhook**
   - Square → n8n webhook when paid
   - Auto-update Supabase status
   - Send confirmation SMS

4. **CRM Integration** (Notion/Airtable)
   - Auto-create customer record
   - Track booking history
   - Analytics dashboard

---

## 📞 SUPPORT

**Need help?**
- n8n Docs: https://docs.n8n.io
- Square API: https://developer.squareup.com
- Resend Docs: https://resend.com/docs
- Telegram Bot API: https://core.telegram.org/bots/api

---

**Your automated backend is ready to roll! 🚀**
