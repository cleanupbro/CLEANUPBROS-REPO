# 🧪 COMPREHENSIVE FORM TESTING GUIDE
## Clean Up Bros - All Forms Testing & Verification

**Created:** December 21, 2025
**Environment:** Production (cleanupbros.com.au)
**Backend:** n8n (nioctibinu.online)

---

## 📊 **FORM TESTING OVERVIEW**

Your application has **5 main forms** that need testing:

| # | Form Type | Webhook ID | Reference Prefix | Status |
|---|-----------|-----------|-----------------|--------|
| 1 | Residential Cleaning | 98d35453... | CUB-RES-XXXXXX | ⏳ Pending |
| 2 | Commercial Cleaning | bb12f45e... | CUB-COM-XXXXXX | ⏳ Pending |
| 3 | Airbnb Turnover | a12b53e8... | CUB-AIR-XXXXXX | ⏳ Pending |
| 4 | Job Application | 8da4395f... | CUB-JOB-XXXXXX | ⏳ Pending |
| 5 | Client Feedback | 22624a36... | CUB-FB-XXXXXX | ⏳ Pending |

---

## 🎯 **WHAT EACH FORM DOES**

### **1. RESIDENTIAL CLEANING QUOTE FORM**

**Purpose:** Homeowners request house cleaning quotes
**Location:** https://cleanupbros.com.au → "Residential Cleaning"
**Multi-Step:** Yes (4 steps)

**Collects:**
- Property details (suburb, type, bedrooms, bathrooms)
- Service type (Deep Clean, Regular Clean, End of Lease, etc.)
- Property condition (Standard, Heavy, Extreme)
- Frequency (One-time, Weekly, Bi-weekly, Monthly)
- Add-ons (Oven, Fridge, Windows, Balcony, etc.)
- Preferred date & time
- Customer contact info (name, email, phone)
- Terms agreement

**AI Features:**
- ✅ **Instant Price Estimation** - Gemini AI calculates price based on inputs
- ✅ **Lead Scoring** - AI scores lead quality (0-100)
- ✅ **Smart Reasoning** - AI explains why lead is HOT/WARM/COLD

**Backend Workflow:**
1. Customer submits form
2. Frontend validates with Zod
3. AI calculates price & scores lead
4. Saves to Supabase `submissions` table
5. Fires webhook to n8n (ID: 98d35453...)
6. n8n sends:
   - **Telegram alert** to admin (instant)
   - **Email to admin** (detailed)
   - **Welcome email to customer** (confirmation)
7. Customer sees success message

**Testing Checklist:**
- [ ] Form loads correctly
- [ ] All 4 steps navigate properly
- [ ] AI price estimation appears
- [ ] Price updates as user changes inputs
- [ ] Extreme condition shows "Custom Quote Required"
- [ ] Phone number formats correctly (0000-000-000)
- [ ] Form validates required fields
- [ ] "Agree to Terms" enforced
- [ ] Submission saves to Supabase
- [ ] Webhook fires successfully
- [ ] Telegram notification received
- [ ] Admin email received
- [ ] Customer welcome email received
- [ ] Success page displays with reference ID
- [ ] Data appears in admin dashboard

---

### **2. COMMERCIAL CLEANING QUOTE FORM**

**Purpose:** Businesses request commercial cleaning quotes
**Location:** https://cleanupbros.com.au → "Commercial Cleaning"
**Multi-Step:** Yes (3 steps)

**Collects:**
- Company details (name, contact person, email, phone)
- Facility type (Office, Medical Centre, Gym, Warehouse, etc.)
- Square meters (size)
- Cleaning frequency (Daily, 3x/week, Weekly, etc.)
- Contract term (1 month, 3 months, 6 months, 12 months)
- Compliance needs (WHS, Police Checks, Insurance, WWC, NDIS)
- Pain points (current cleaning issues)
- Preferred start date

**AI Features:**
- ✅ **Commercial Price Estimation** - Based on sq meters, frequency, contract
- ✅ **Shows price per week/month**
- ✅ **Lead scoring for B2B clients**

**Backend Workflow:**
1. Business submits form
2. AI calculates commercial pricing
3. Saves to Supabase
4. Fires webhook to n8n (ID: bb12f45e...)
5. n8n sends notifications (Telegram, Email)
6. Success confirmation

**Testing Checklist:**
- [ ] Form loads correctly
- [ ] All 3 steps work
- [ ] AI price shows per week/month
- [ ] Compliance checkboxes work
- [ ] Square meters validation
- [ ] Contract term affects pricing
- [ ] Submission saves to Supabase
- [ ] Webhook fires
- [ ] Notifications received
- [ ] Success page shows
- [ ] Appears in admin dashboard

---

### **3. AIRBNB TURNOVER QUOTE FORM**

**Purpose:** Airbnb hosts request turnover cleaning
**Location:** https://cleanupbros.com.au → "Airbnb Cleaning"
**Multi-Step:** Yes (3 steps)

**Collects:**
- Listing URL (Airbnb property link)
- Property type (Studio, Apartment, House, etc.)
- Bedrooms & Bathrooms
- Turnover requirements (Full clean, Linen change, Restock, etc.)
- Access method (Lockbox, Key collection, Meet on-site)
- Preferred turnover time (2-hour window, 3-hour, 4-hour)
- Cleaning frequency (Per booking, Weekly, etc.)
- Contact details (name, email, phone)
- Preferred start date

**AI Features:**
- ✅ **Per-turnover pricing** - AI calculates per clean
- ✅ **Considers property size and requirements**
- ✅ **Lead scoring for Airbnb hosts**

**Backend Workflow:**
1. Host submits form
2. AI calculates per-turnover price
3. Saves to Supabase
4. Fires webhook to n8n (ID: a12b53e8...)
5. n8n sends notifications
6. Success confirmation

**Testing Checklist:**
- [ ] Form loads
- [ ] Listing URL field works
- [ ] Property type dropdown works
- [ ] Turnover requirements checkboxes work
- [ ] AI shows price "per turnover"
- [ ] Access method options work
- [ ] Turnover time affects pricing
- [ ] Submission saves
- [ ] Webhook fires
- [ ] Notifications received
- [ ] Success page displays
- [ ] Dashboard entry created

---

### **4. JOB APPLICATION FORM**

**Purpose:** Job seekers apply for cleaner positions
**Location:** https://cleanupbros.com.au → "We're Hiring"
**Multi-Step:** Yes (3 steps)

**Collects:**
- Personal details (name, email, phone)
- Work rights in Australia (Yes/No)
- Cleaning experience (None, 1-2 years, 3-5 years, 5+ years)
- Own equipment (Yes/No)
- Availability (Monday-Sunday checkboxes)
- Service suburbs (which areas can you work)
- Preferred start date
- References (name, contact)
- File uploads (Resume, Police Check, etc.)
- Photo uploads (ID, Work samples)
- Agreement to background checks

**AI Features:**
- ✅ **Candidate scoring** - AI evaluates application quality
- ✅ **Experience assessment**

**Backend Workflow:**
1. Applicant submits form
2. Files uploaded (base64 encoded)
3. Saves to Supabase
4. Fires webhook to n8n (ID: 8da4395f...)
5. n8n sends:
   - Admin notification
   - Applicant confirmation
6. Success message

**Testing Checklist:**
- [ ] Form loads
- [ ] File upload works
- [ ] Photo upload works
- [ ] Work rights checkbox
- [ ] Availability checkboxes (multiple select)
- [ ] Reference fields validate
- [ ] "Agree to checks" enforced
- [ ] Files encode correctly
- [ ] Submission saves
- [ ] Webhook fires
- [ ] Notifications sent
- [ ] Success page
- [ ] Dashboard entry

---

### **5. CLIENT FEEDBACK FORM**

**Purpose:** Existing customers leave reviews
**Location:** https://cleanupbros.com.au → "Share Feedback"
**Multi-Step:** No (Single page)

**Collects:**
- Star rating (1-5 stars)
- NPS score (0-10 scale: "How likely to recommend?")
- Comments (text feedback)
- Full name
- Email

**AI Features:**
- ✅ **Sentiment analysis** - AI analyzes feedback sentiment
- ✅ **NPS categorization** - Detractors (0-6), Passives (7-8), Promoters (9-10)

**Backend Workflow:**
1. Customer submits feedback
2. Saves to Supabase
3. Fires webhook to n8n (ID: 22624a36...)
4. n8n sends admin notification
5. Success confirmation

**Testing Checklist:**
- [ ] Form loads
- [ ] Star rating clickable (1-5)
- [ ] NPS buttons work (0-10)
- [ ] NPS colors: Red (0-6), Yellow (7-8), Green (9-10)
- [ ] Comments textarea works
- [ ] Validates star rating selected
- [ ] Submission saves
- [ ] Webhook fires
- [ ] Notification sent
- [ ] Success page
- [ ] Dashboard entry

---

## 🔧 **BACKEND ARCHITECTURE - HOW IT ALL WORKS**

### **Complete Data Flow:**

```
┌─────────────────────────────────────────────────────────┐
│ 1. CUSTOMER FILLS FORM (cleanupbros.com.au)            │
│    → React 19 frontend with Glassmorphism UI            │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. FRONTEND VALIDATION                                  │
│    → Zod schema validates all fields                    │
│    → Phone formatting (0000-000-000)                    │
│    → Email validation                                   │
│    → Required fields check                              │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. AI PROCESSING (Google Gemini)                        │
│    → Price estimation (ResidentialQuoteData)            │
│    → Lead scoring (0-100)                               │
│    → AI reasoning (HOT/WARM/COLD)                       │
│    → Smart insights                                     │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. SAVE TO SUPABASE                                     │
│    → Table: submissions                                 │
│    → Columns: id, created_at, type, status,             │
│                data, summary, lead_score, lead_reasoning│
│    → Row Level Security (RLS) policies                  │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. FIRE n8n WEBHOOK                                     │
│    → POST to: nioctibinu.online/webhook/[UUID]          │
│    → Payload: Full form data + AI results               │
│    → Timeout: 30 seconds                                │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 6. n8n WORKFLOW EXECUTES (11 nodes)                     │
│                                                          │
│    Node 1: Webhook receives data                        │
│    Node 2: Telegram Bot → Admin (instant)               │
│    Node 3: Resend Email → Admin (detailed)              │
│    Node 4: Resend Email → Customer (welcome)            │
│    Node 5: Format data                                  │
│    Node 6: Respond with success                         │
│                                                          │
│    Admin receives:                                      │
│    • Telegram: "New quote! Sarah - Liverpool - $180"    │
│    • Email: Full details with AI score                  │
│                                                          │
│    Customer receives:                                   │
│    • Email: "Thanks! We'll call you soon"               │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 7. ADMIN CALLS CUSTOMER (Human verification)            │
│    → Admin sees lead in dashboard                       │
│    → Calls customer to confirm details                  │
│    → Discusses exact requirements                       │
│    → Agrees on final price                              │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 8. ADMIN CONFIRMS BOOKING                               │
│    → Clicks "Confirm Booking & Send Payment Link"       │
│    → BookingConfirmationModal opens                     │
│    → Enters: Customer name, email, final price, notes   │
│    → Clicks "Generate Payment Link"                     │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 9. SQUARE PAYMENT LINK GENERATION                       │
│    → n8n webhook: /webhook/create-payment-link          │
│    → n8n calls Square API                               │
│    → Square creates payment link                        │
│    → Returns: https://square.link/u/XXXXXX              │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 10. CUSTOMER RECEIVES PAYMENT EMAIL                     │
│    → Resend sends payment_request_email.html            │
│    → Contains: Service details, price, Square link      │
│    → Customer clicks link                               │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 11. CUSTOMER PAYS 25% DEPOSIT                           │
│    → Square checkout page                               │
│    → Pays via card (1.6% + 30¢ fee)                     │
│    → Payment confirmation                               │
│    → Square webhook → n8n (optional)                    │
│    → Admin receives payment notification                │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 **TESTING METHODS**

### **Method 1: Manual Form Testing (Recommended)**

**Pros:** Most realistic, tests entire user experience
**Cons:** Slower, requires manual data entry

**Steps:**
1. Open https://cleanupbros.com.au in browser
2. Click service type (e.g., "Residential Cleaning")
3. Fill form with realistic test data
4. Verify AI price estimation appears
5. Click through all steps
6. Submit form
7. Verify success message
8. Check Supabase for new entry
9. Check Telegram for notification
10. Check email for notifications

---

### **Method 2: Automated API Testing**

**Pros:** Fast, repeatable, can test error cases
**Cons:** Doesn't test UI/UX

**Steps:**
1. Use curl or Postman
2. POST to webhook URLs directly
3. Send test JSON payloads
4. Verify responses

**Example curl command:**
```bash
curl -X POST https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Customer",
    "email": "test@example.com",
    "phone": "0412345678",
    "suburb": "Liverpool",
    "bedrooms": 3,
    "bathrooms": 2,
    "serviceType": "Deep Clean",
    "estimatedPrice": 180,
    "referenceId": "TEST-001"
  }'
```

---

### **Method 3: Supabase Direct Verification**

**Pros:** Confirms database integration
**Cons:** Doesn't test webhooks

**Steps:**
1. Log in to Supabase Dashboard
2. Go to Table Editor → `submissions`
3. Check for new entries after form submission
4. Verify all fields saved correctly
5. Check `lead_score` and `lead_reasoning` populated

---

## ✅ **VERIFICATION CHECKLIST**

After testing each form, verify:

### **Frontend Verification:**
- [ ] Form loads without errors
- [ ] All fields render correctly
- [ ] Validation works (shows errors)
- [ ] AI price estimation appears
- [ ] Price updates in real-time
- [ ] Submit button enables/disables correctly
- [ ] Loading spinner shows during submission
- [ ] Success page displays
- [ ] Reference ID generated

### **Backend Verification:**
- [ ] Data saved to Supabase `submissions` table
- [ ] All fields correctly stored in `data` column (JSONB)
- [ ] `type` column matches service type
- [ ] `status` set to "Pending"
- [ ] `lead_score` populated (0-100)
- [ ] `lead_reasoning` contains AI explanation
- [ ] `created_at` timestamp correct

### **Webhook Verification:**
- [ ] n8n webhook received POST request
- [ ] n8n execution succeeded (check Executions tab)
- [ ] No errors in n8n logs
- [ ] All nodes executed successfully

### **Notification Verification:**
- [ ] Telegram notification received on admin phone
- [ ] Admin email received in inbox
- [ ] Customer welcome email received
- [ ] All emails formatted correctly (no broken HTML)
- [ ] All data populated in email templates

### **Admin Dashboard Verification:**
- [ ] New submission appears in dashboard
- [ ] Submission card displays correctly
- [ ] All data fields visible
- [ ] Lead score badge shows correct color
- [ ] Status shows "Pending"
- [ ] "Confirm Booking" button works

---

## 🚨 **COMMON ISSUES & FIXES**

### **Issue 1: Form Submits but No Webhook Received**
**Symptoms:** Success message shows, Supabase has data, but no Telegram/email
**Cause:** n8n webhook URL incorrect or n8n down
**Fix:**
1. Check constants.ts has correct webhook URLs
2. Test webhook URL in browser: `https://nioctibinu.online/webhook/[UUID]`
3. Should return: "Workflow is listening for events..."
4. Check n8n dashboard is accessible
5. Verify webhook nodes are active

### **Issue 2: AI Price Not Showing**
**Symptoms:** Form loads but "Instant Estimate" stays "Calculating..." forever
**Cause:** Gemini API not configured or rate limited
**Fix:**
1. Check VITE_GEMINI_API_KEY in .env.local
2. Verify Gemini API quota not exceeded
3. Check browser console for errors
4. Test with simple calculation first

### **Issue 3: Supabase Save Fails**
**Symptoms:** Error: "Failed to save submission"
**Cause:** Supabase credentials wrong or RLS blocking
**Fix:**
1. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
2. Verify Supabase project is active
3. Check RLS policies allow inserts
4. Test Supabase connection in browser console

### **Issue 4: No Telegram Notification**
**Symptoms:** Everything works except Telegram
**Cause:** Telegram bot token wrong or chat ID incorrect
**Fix:**
1. Verify TELEGRAM_BOT_TOKEN in n8n credentials
2. Verify TELEGRAM_ADMIN_CHAT_ID correct
3. Test bot manually: Send `/start` to bot
4. Check n8n Telegram node configuration

### **Issue 5: Email Not Received**
**Symptoms:** Webhook fires but no email
**Cause:** Resend API issue or email in spam
**Fix:**
1. Check spam/junk folder
2. Verify RESEND_API_KEY in n8n
3. Check Resend dashboard for delivery status
4. Verify sender email (hello@cleanupbros.com.au)
5. Test with different email address

---

## 📈 **SUCCESS METRICS**

After testing all forms, you should have:

- ✅ **5/5 forms working** (100% success rate)
- ✅ **All submissions in Supabase** (Database persistence)
- ✅ **All webhooks firing** (n8n integration)
- ✅ **All notifications received** (Telegram + Email)
- ✅ **All emails delivered** (Resend working)
- ✅ **Dashboard showing submissions** (Admin access)
- ✅ **Zero console errors** (Clean frontend)
- ✅ **Mobile responsive** (Works on phone)

---

## 🎯 **NEXT STEPS AFTER TESTING**

Once all forms are verified working:

1. **Load Test Data** - Import test_data.sql to Supabase
2. **Set Up Square** - Complete Square payment integration
3. **Test Payment Links** - Generate and test payment flow
4. **Configure Gift Cards** - Implement gift card system
5. **Monitor Analytics** - Set up conversion tracking
6. **Optimize Performance** - Check page load speeds
7. **SEO Audit** - Verify Google indexing

---

## 📞 **SUPPORT RESOURCES**

### **Debugging Tools:**
- **Browser Console:** F12 → Console (frontend errors)
- **Network Tab:** F12 → Network (API calls)
- **Supabase Logs:** Dashboard → Logs → API
- **n8n Executions:** Dashboard → Executions
- **Resend Logs:** Dashboard → Emails
- **Telegram Bot:** @BotFather

### **Documentation:**
- **Forms Documentation:** YOUR_APP_FEATURES.md
- **Backend Setup:** N8N_BACKEND_SETUP.md
- **API Credentials:** API.md
- **Deployment Guide:** DEPLOY_TO_GODADDY_DOMAIN.md

---

**Created:** December 21, 2025
**Status:** Ready for Testing
**Forms:** 5 (Residential, Commercial, Airbnb, Jobs, Feedback)
**Backend:** n8n + Supabase + Square + Resend + Telegram

**LET'S TEST ALL FORMS! 🚀**
