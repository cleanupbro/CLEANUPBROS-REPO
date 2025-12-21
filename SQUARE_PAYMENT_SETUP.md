# 💳 SQUARE PAYMENT INTEGRATION - COMPLETE SETUP GUIDE
## Clean Up Bros - Payment Link Generation & Processing

**Created:** December 21, 2025
**Platform:** Square (https://squareup.com/au)
**Integration:** n8n + Square API
**Status:** Ready for Setup

---

## 🎯 **HOW YOUR SQUARE PAYMENT SYSTEM WORKS**

### **Complete Payment Flow:**

```
1. CUSTOMER SUBMITS QUOTE
   → Form submission → Supabase → n8n
   → Admin receives Telegram + Email notification

2. ADMIN CALLS CUSTOMER (Human Verification)
   → Discusses requirements
   → Confirms details
   → Agrees on final price

3. ADMIN CONFIRMS BOOKING (Admin Dashboard)
   → Opens submission in dashboard
   → Clicks "Confirm Booking & Send Payment Link"
   → BookingConfirmationModal opens

4. ADMIN ENTERS PAYMENT DETAILS
   → Customer name
   → Customer email
   → Final price (AUD)
   → Scheduled date
   → Additional notes
   → Clicks "Confirm & Send Payment Link"

5. FRONTEND CALLS n8n WEBHOOK
   → POST to: /webhook/create-payment-link
   → Payload: {customerName, customerEmail, amount, referenceId}

6. n8n CALLS SQUARE API
   → Endpoint: POST /v2/online-checkout/payment-links
   → Creates Square payment link
   → Returns: {payment_link: {url: "https://square.link/u/XXXXX"}}

7. CUSTOMER RECEIVES EMAIL
   → n8n sends payment_request_email.html
   → Contains: Service details, price, Square payment link
   → Call-to-action: "Pay 25% Deposit Now"

8. CUSTOMER PAYS VIA SQUARE
   → Clicks payment link
   → Square checkout page opens
   → Enters card details (Visa, Mastercard, Amex)
   → Pays 25% deposit
   → Square processes payment (1.6% + 30¢ fee)

9. PAYMENT CONFIRMATION
   → Square webhook → n8n (optional)
   → n8n updates Supabase status to "Paid"
   → Admin receives payment notification (Telegram + Email)
   → Customer receives payment confirmation email

10. BOOKING CONFIRMED
    → Service scheduled
    → Admin has deposit secured
    → Customer receives booking details
```

---

## 📋 **WHAT YOU NEED FROM SQUARE**

### **Step 1: Create Square Account (10 minutes)**

**Go to:** https://squareup.com/au/sign-up

1. Click "Get Started"
2. Enter:
   - Business name: **Clean Up Bros**
   - Your email: cleanupbros.au@gmail.com
   - Create password
3. Verify email address
4. Business details:
   - Industry: **Cleaning Services**
   - Business structure: **Sole Trader** (or your structure)
   - ABN: Your ABN number
5. Bank account for payouts:
   - Account name
   - BSB
   - Account number
   - Square will deposit earnings here

### **Step 2: Get Square API Credentials (5 minutes)**

**In Square Dashboard:**

1. Go to: **Apps** → **Developer** → **Open Developer Portal**
2. Or visit: https://developer.squareup.com/apps
3. Click "+" → "Create New Application"
4. Application name: **Clean Up Bros Online Payments**
5. Click "Create"

**You'll get:**

```
APPLICATION ID: sq0idp-XXXXXXXXXXXXXXXXX
ACCESS TOKEN (Sandbox): sq0atp-sandbox-XXXXXXXXXX
ACCESS TOKEN (Production): sq0atp-XXXXXXXXXXXXXXXXX
LOCATION ID: LXXXXXXXXXXXXXXXXX
```

### **Step 3: Configure Square Settings**

**Required Settings:**

1. **Payment Methods:**
   - Enable: Visa, Mastercard, Amex, Apple Pay, Google Pay
   - Disable: Cash, Check (not needed for online)

2. **Checkout Options:**
   - Enable: Email receipts
   - Enable: Send invoice reminders
   - Disable: Require shipping address

3. **Webhooks (Optional but Recommended):**
   - Go to: Developer → Webhooks
   - Create webhook URL: `https://nioctibinu.online/webhook/square-payment-webhook`
   - Subscribe to events:
     - `payment.created`
     - `payment.updated`
     - `order.created`
     - `order.updated`
   - Get webhook signature key

---

## 🔧 **n8n WORKFLOW CONFIGURATION**

### **Node 1: Webhook - Create Payment Link**

**Setup:**
1. Add Webhook node
2. Path: `create-payment-link`
3. Method: POST
4. Response Mode: "Respond When Last Node Finishes"

**Receives:**
```json
{
  "customerName": "John Smith",
  "customerEmail": "john@example.com",
  "serviceType": "Residential Cleaning",
  "amount": 180,
  "referenceId": "CUB-RES-ABC123",
  "description": "3BR house deep clean - Liverpool"
}
```

### **Node 2: Square - Create Payment Link**

**Setup:**
1. Add "HTTP Request" node (Square doesn't have native n8n node)
2. Method: POST
3. URL: `https://connect.squareup.com/v2/online-checkout/payment-links`
4. Headers:
   ```
   Square-Version: 2024-12-18
   Authorization: Bearer {{YOUR_SQUARE_ACCESS_TOKEN}}
   Content-Type: application/json
   ```
5. Body (JSON):
   ```json
   {
     "idempotency_key": "{{$json.referenceId}}",
     "order": {
       "location_id": "{{YOUR_SQUARE_LOCATION_ID}}",
       "line_items": [{
         "name": "{{$json.serviceType}}",
         "quantity": "1",
         "base_price_money": {
           "amount": "{{$json.amount * 100}}",
           "currency": "AUD"
         },
         "note": "{{$json.description}}"
       }]
     },
     "checkout_options": {
       "redirect_url": "https://cleanupbros.com.au/payment-success",
       "merchant_support_email": "cleanupbros.au@gmail.com",
       "ask_for_shipping_address": false,
       "enable_loyalty": false
     },
     "pre_populated_data": {
       "buyer_email": "{{$json.customerEmail}}"
     }
   }
   ```

### **Node 3: Set Response**

**Extract payment link from Square response:**
```json
{
  "success": true,
  "payment_link": {
    "url": "{{$json.payment_link.url}}",
    "id": "{{$json.payment_link.id}}"
  },
  "order": {
    "id": "{{$json.order.id}}"
  }
}
```

### **Node 4: Resend - Send Payment Email**

**Setup:**
1. Add Resend node
2. From: hello@cleanupbros.com.au
3. To: `{{$node["Webhook"].json["body"]["customerEmail"]}}`
4. Subject: `Payment Required - Clean Up Bros Booking`
5. HTML: Use `email_templates/payment_request_email.html`
6. Variables:
   ```json
   {
     "customerName": "{{$node["Webhook"].json["body"]["customerName"]}}",
     "serviceType": "{{$node["Webhook"].json["body"]["serviceType"]}}",
     "totalPrice": "{{$node["Webhook"].json["body"]["amount"]}}",
     "depositAmount": "{{$node["Webhook"].json["body"]["amount"] * 0.25}}",
     "paymentLink": "{{$node["Square API"].json["payment_link"]["url"]}}",
     "referenceId": "{{$node["Webhook"].json["body"]["referenceId"]}}"
   }
   ```

### **Node 5: Telegram - Notify Admin**

**Send admin notification:**
```
💳 PAYMENT LINK SENT

Customer: {{$node["Webhook"].json["body"]["customerName"]}}
Email: {{$node["Webhook"].json["body"]["customerEmail"]}}
Service: {{$node["Webhook"].json["body"]["serviceType"]}}
Amount: ${{$node["Webhook"].json["body"]["amount"]}}
Deposit (25%): ${{$node["Webhook"].json["body"]["amount"] * 0.25}}

Payment Link: {{$node["Square API"].json["payment_link"]["url"]}}

Ref: {{$node["Webhook"].json["body"]["referenceId"]}}
```

---

## 🎨 **PAYMENT EMAIL TEMPLATE**

**File:** `email_templates/payment_request_email.html` (Already created!)

**Variables to replace:**
- `{{customerName}}` - Customer's name
- `{{serviceType}}` - Type of service booked
- `{{totalPrice}}` - Total booking price
- `{{depositAmount}}` - 25% deposit amount
- `{{paymentLink}}` - Square payment link URL
- `{{referenceId}}` - Booking reference number

**Email includes:**
- Clean Up Bros branding
- Service details summary
- Total price and deposit breakdown
- Prominent payment button (links to Square)
- Payment instructions
- Contact information
- Professional glassmorphism design

---

## 💰 **SQUARE PRICING & FEES**

### **Transaction Fees:**

| Payment Method | Online Fee | In-Person Fee |
|---------------|-----------|---------------|
| Visa/Mastercard | **1.6% + 30¢** | 1.4% + 0¢ |
| American Express | 1.6% + 30¢ | 1.4% + 0¢ |
| Apple Pay | 1.6% + 30¢ | 1.4% + 0¢ |
| Google Pay | 1.6% + 30¢ | 1.4% + 0¢ |

**Example Calculation:**
```
Booking Total: $180
Deposit (25%): $45
Square Fee: $45 × 1.6% + $0.30 = $1.02
You Receive: $43.98
Customer Pays: $45.00
```

### **Monthly Costs:**

```
Square Account: $0/month (Free)
Payment Links: $0 per link (Unlimited)
Webhooks: $0/month (Free)
Card Reader: Not needed (online only)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: $0/month + transaction fees
```

**You only pay when you get paid!** ✅

---

## ✅ **TESTING YOUR SQUARE INTEGRATION**

### **Test Mode (Sandbox):**

**Square provides test credentials:**

1. Go to: https://developer.squareup.com/apps
2. Click your application
3. Switch to "Sandbox" tab
4. Use Sandbox Access Token for testing

**Test Card Numbers:**
```
Successful Payment:
Card: 4111 1111 1111 1111
Expiry: Any future date
CVV: 111
ZIP: 12345

Declined Payment:
Card: 4000 0000 0000 0002
```

### **Testing Workflow:**

```bash
# Test n8n webhook with curl
curl -X POST https://nioctibinu.online/webhook/create-payment-link \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerEmail": "test@example.com",
    "serviceType": "Residential Cleaning",
    "amount": 50,
    "referenceId": "TEST-001",
    "description": "Test booking"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "payment_link": {
    "url": "https://squareupsandbox.com/checkout/XXXXX",
    "id": "XXXXX"
  },
  "order": {
    "id": "XXXXX"
  }
}
```

### **Manual Testing in Dashboard:**

1. Log in to Admin Dashboard
2. Open any submission
3. Click "Confirm Booking & Send Payment Link"
4. Fill in test details:
   - Name: Test Customer
   - Email: your-test-email@gmail.com
   - Price: $50
5. Click "Confirm & Send Payment Link"
6. Check:
   - ✅ Success message appears
   - ✅ Payment link displayed
   - ✅ Email received
   - ✅ Link clickable
7. Click payment link
8. Enter test card details
9. Complete payment
10. Verify:
    - ✅ Payment confirmation from Square
    - ✅ Admin notification received
    - ✅ Supabase status updated

---

## 🔒 **SECURITY BEST PRACTICES**

### **1. Environment Variables**

**NEVER commit Square credentials to Git!**

**In .env.local:**
```env
VITE_SQUARE_ACCESS_TOKEN=sq0atp-PRODUCTION_TOKEN_HERE
VITE_SQUARE_LOCATION_ID=LXXXXXXXXX
VITE_SQUARE_APPLICATION_ID=sq0idp-XXXXXXXXX
```

**In n8n credentials:**
- Store Square Access Token in n8n credentials manager
- Reference as `{{$credentials.square.accessToken}}`

### **2. Webhook Signature Verification**

**Square signs all webhooks - verify them!**

```javascript
const crypto = require('crypto');

function verifySquareWebhook(url, body, signatureHeader) {
  const SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

  const hmac = crypto.createHmac('sha256', SIGNATURE_KEY);
  hmac.update(url + body);
  const expectedSignature = hmac.digest('base64');

  return expectedSignature === signatureHeader;
}
```

### **3. Idempotency**

**Always use unique idempotency keys to prevent duplicate charges:**
- Use submission ID as idempotency key
- Square will reject duplicate requests with same key
- Prevents accidental double-charging

---

## 📊 **SQUARE DASHBOARD - WHAT YOU GET**

### **Real-Time Analytics:**

- **Payments:** See all transactions
- **Revenue:** Daily/weekly/monthly totals
- **Deposits:** Track money being sent to your bank
- **Customers:** Build customer database automatically
- **Disputes:** Handle chargebacks (rare for service businesses)

### **Reports Available:**

- Sales summary
- Itemized sales
- Payment method breakdown
- Customer directory
- Tax summaries
- Settlement reports (for accounting)

### **Mobile App:**

- Download "Square Dashboard" app
- Get instant payment notifications
- View sales anywhere
- Issue refunds on-the-go

---

## 🔔 **SQUARE WEBHOOKS (Optional but Recommended)**

### **Why Use Webhooks?**

Automatically update your system when:
- Customer completes payment ✅
- Payment fails ❌
- Customer refunded 💵
- Order updated 📝

### **Setup in n8n:**

**Node: Webhook - Square Payment Events**

1. Add Webhook node
2. Path: `square-payment-webhook`
3. Method: POST
4. Add verification code (above)

**Node: Switch on Event Type**

```javascript
if ($json.type === 'payment.created') {
  // New payment initiated
  return [{json: {action: 'payment_created'}}];
}

if ($json.type === 'payment.updated' && $json.data.object.payment.status === 'COMPLETED') {
  // Payment successful!
  return [{json: {action: 'payment_completed'}}];
}

if ($json.type === 'payment.updated' && $json.data.object.payment.status === 'FAILED') {
  // Payment failed
  return [{json: {action: 'payment_failed'}}];
}
```

**Node: Update Supabase**

When payment completed:
```sql
UPDATE submissions
SET status = 'Paid',
    data = jsonb_set(data, '{payment}', $1::jsonb)
WHERE id = $2;
```

**Node: Notify Admin (Telegram)**

```
💰 PAYMENT RECEIVED!

Customer: {{$json.payment.buyer_email}}
Amount: ${{$json.payment.total_money.amount / 100}}
Reference: {{$json.payment.reference_id}}

✅ Booking confirmed
```

---

## 🚨 **TROUBLESHOOTING**

### **Issue 1: Payment Link Not Generating**

**Error:** "Failed to create payment link"

**Possible Causes:**
1. Wrong Square Access Token
2. Wrong Square Location ID
3. Invalid amount (must be positive)
4. n8n webhook not responding

**Fix:**
```bash
# Test Square API directly
curl -X POST https://connect.squareup.com/v2/online-checkout/payment-links \
  -H "Square-Version: 2024-12-18" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "idempotency_key": "test-123",
    "order": {
      "location_id": "YOUR_LOCATION_ID",
      "line_items": [{
        "name": "Test",
        "quantity": "1",
        "base_price_money": {
          "amount": 5000,
          "currency": "AUD"
        }
      }]
    }
  }'
```

### **Issue 2: Customer Not Receiving Email**

**Check:**
1. Resend dashboard → Emails → Check delivery status
2. Check spam/junk folder
3. Verify email address correct
4. Check Resend API key valid

### **Issue 3: Payment Successful but No Notification**

**Check:**
1. Square webhooks configured correctly
2. Webhook signature valid
3. n8n webhook receiving events
4. Telegram bot working

### **Issue 4: Wrong Currency**

**Error:** Payment link shows USD instead of AUD

**Fix:**
- Verify Square account set to Australia
- Check currency in API request: `"currency": "AUD"`
- Square Location must be Australia-based

---

## 📈 **PAYMENT CONVERSION OPTIMIZATION**

### **Increase Payment Completion Rate:**

**1. Fast Payment Link Delivery (< 5 minutes)**
   - Automate completely ✅
   - No manual work required ✅

**2. Clear Email Communication**
   - Professional HTML template ✅
   - Prominent payment button ✅
   - Shows deposit amount (25%) ✅
   - Includes service details ✅

**3. Easy Checkout Process**
   - Square checkout is mobile-optimized ✅
   - Saves card details for returning customers ✅
   - Apple Pay / Google Pay support ✅
   - No account creation required ✅

**4. Payment Reminders (Optional)**
   - n8n can send reminder after 24 hours
   - Telegram notification to follow up
   - Email reminder to customer

---

## ✅ **SETUP CHECKLIST**

Before going live with Square payments:

### **Square Account:**
- [ ] Square account created
- [ ] Business verified
- [ ] Bank account connected
- [ ] Payment methods enabled (Visa, MC, Amex)
- [ ] API credentials obtained
- [ ] Webhooks configured (optional)

### **n8n Workflow:**
- [ ] Webhook node added (/webhook/create-payment-link)
- [ ] HTTP Request node configured (Square API)
- [ ] Square credentials stored securely in n8n
- [ ] Response formatted correctly
- [ ] Resend email node configured
- [ ] Telegram notification node added
- [ ] Workflow tested with sandbox

### **Frontend:**
- [ ] BookingConfirmationModal working
- [ ] squareService.ts configured
- [ ] Webhook URL points to production n8n
- [ ] Error handling implemented
- [ ] Success state displays payment link
- [ ] Payment link copyable

### **Email Template:**
- [ ] payment_request_email.html created
- [ ] All variables replaced correctly
- [ ] Payment button links to Square
- [ ] Mobile responsive
- [ ] Tested in multiple email clients

### **Testing:**
- [ ] Tested with Square Sandbox
- [ ] Test payment link generated
- [ ] Test email received
- [ ] Test payment completed
- [ ] Webhooks firing correctly
- [ ] Supabase status updating
- [ ] Admin notifications working

---

## 🎯 **EXPECTED RESULTS**

After setup, your payment workflow:

```
⏱️ Quote Submitted → Instant notification
📞 You Call Customer → 10 minutes (average)
✅ Confirm Booking → 2 minutes (dashboard)
💳 Payment Link Generated → < 10 seconds (automatic)
📧 Customer Receives Email → < 1 minute
💰 Customer Pays → 2-3 minutes (average)
🎉 Booking Confirmed → Instant

TOTAL TIME: 15-20 minutes from quote to payment! 🚀
```

### **Success Metrics to Track:**

- **Payment Link Generation Time:** < 10 seconds
- **Email Delivery Rate:** > 95%
- **Payment Completion Rate:** 60-70% (industry average)
- **Average Payment Time:** 2-24 hours after link sent
- **Failed Payments:** < 5%

---

## 💡 **ADVANCED FEATURES (Optional)**

### **1. Partial Payments**

Allow customers to pay in installments:
```javascript
// Create payment link for 25% deposit
amount: bookingTotal * 0.25

// After service, create link for remaining 75%
amount: bookingTotal * 0.75
```

### **2. Subscription Billing**

For recurring cleaning customers:
- Use Square Subscriptions API
- Auto-charge weekly/monthly
- Stored card on file

### **3. Gift Cards**

Sell gift cards via Square:
- Square Gift Cards API
- Customers buy credit
- Redeem at checkout
- (See GIFT_CARD_IMPLEMENTATION.md)

### **4. Customer Saved Cards**

Square stores cards for returning customers:
- Enable "Save card for future use"
- Faster checkout next time
- PCI-compliant storage by Square

---

**Created:** December 21, 2025
**Status:** Ready for Setup
**Platform:** Square Australia
**Integration:** n8n Webhook → Square API
**Cost:** $0/month + 1.6% + 30¢ per transaction

**GO LIVE WITH SQUARE PAYMENTS! 💳✨**
