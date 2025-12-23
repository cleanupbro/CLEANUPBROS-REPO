# 🚀 Quick Start Guide - Clean Up Bros Portal

## ✅ What's Already Done

Your backend is **95% configured**! All API keys are set up and ready to use:

- ✅ **Supabase** - Database connected
- ✅ **Square** - Payment processing ready (Location ID: L6V6MMMWPJR88)
- ✅ **Stripe** - CleanUpCard ready
- ✅ **Google Gemini AI** - Price estimation ready
- ✅ **Dev Server** - Running at http://localhost:5173

## ⏰ 2-Minute Setup (Final Step)

You just need to create the database tables. Here's the fastest way:

### Option 1: Supabase Dashboard (RECOMMENDED - 2 minutes)

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/rtnamqbkowtrwogelgqv/sql/new
   - (You'll be logged in already)

2. **Run Gift Cards Migration:**
   - Open file: `supabase_migration_gift_cards.sql`
   - Copy ALL content (⌘+A, ⌘+C)
   - Paste into Supabase SQL Editor
   - Click **"Run"** button (green play icon)
   - Wait for "Success" message (~10 seconds)

3. **Run Contracts Migration:**
   - Click "New query" in Supabase
   - Open file: `supabase_migration_contracts.sql`
   - Copy ALL content (⌘+A, ⌘+C)
   - Paste into SQL Editor
   - Click **"Run"** button
   - Wait for "Success" message (~10 seconds)

4. **Verify Setup:**
   ```sql
   -- Run this query to check all tables exist:
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

   You should see these 8 tables:
   - ✅ contract_amendments
   - ✅ contract_payments
   - ✅ contract_templates
   - ✅ customer_credit
   - ✅ gift_card_transactions
   - ✅ gift_cards
   - ✅ service_contracts
   - ✅ square_invoices

**That's it!** Your backend is now 100% operational.

---

## 🎯 Test Your Features

Once tables are created, test everything:

### 1. Submit a Quote (Main Feature)
```
URL: http://localhost:5173/
```
- Fill in quote form
- Submit
- Check `/admin` for submission
- AI price estimation will appear

### 2. Create Gift Card
```
URL: http://localhost:5173/admin/gift-cards
```
- Click "Create New Gift Card"
- Enter amount: $500
- Bonus auto-calculates: +$75 (15%)
- Total value: $575
- Unique code generated: XXXX-XXXX-XXXX-XXXX

### 3. Generate Airbnb Contract
```
URL: http://localhost:5173/contract/airbnb
```
- Fill in property details
- Set cleaning frequency
- Review contract preview
- Download PDF
- Digital signature ready

### 4. Create Commercial Invoice
```
URL: http://localhost:5173/invoice/commercial
```
- Add service line items
- Square invoice generated
- Payment link sent to client
- Client signs terms online
- Payment processed via Square

---

## 📁 Project Files Created

### Configuration Files
- ✅ `.env` - All API keys configured
- ✅ `BACKEND_SETUP.md` - Complete backend documentation
- ✅ `QUICK-START.md` - This file

### Database Files
- ✅ `supabase_migration_gift_cards.sql` - Gift card tables
- ✅ `supabase_migration_contracts.sql` - Contract tables
- ✅ `migrate-database.js` - Automated migration script (optional)
- ✅ `setup-database.sh` - Shell script (requires psql)

### Email Templates
- ✅ `email_templates/square_invoice_sent.html`
- ✅ `email_templates/contract_sent.html`
- ✅ `email_templates/contract_signed.html`

---

## 🔧 Configuration Summary

### Supabase (Database)
```
URL: https://rtnamqbkowtrwogelgqv.supabase.co
Anon Key: sb_publishable_8_55hVJqyWOM-dfjpBZQkw_nscTf6ky
Status: ✅ Connected
Tables: ⏳ Run migrations (see above)
```

### Square (Payments)
```
Location: Clean Up Bros - Liverpool, NSW
Location ID: L6V6MMMWPJR88
Access Token: EAAAl3k... (configured)
Address: 10 Norfolk St, Liverpool, NSW 2170
Phone: +61 406 764 585
Status: ✅ Ready
```

### Stripe (CleanUpCard)
```
Publishable Key: pk_test_51Rnj... (test mode)
Status: ✅ Ready
Purpose: Prepaid cleaning cards
```

### Google Gemini AI
```
API Key: AIzaSyD2SC... (configured)
Status: ✅ Ready
Purpose: Price estimation, lead scoring
Model: gemini-pro
```

---

## 🎨 Features Available

| Feature | Route | Status | Purpose |
|---------|-------|--------|---------|
| **Quote Form** | `/` | ✅ Ready | Customer quote submissions |
| **Admin Dashboard** | `/admin` | ✅ Ready | View quotes, AI insights |
| **Gift Cards** | `/admin/gift-cards` | ⏳ Need tables | Sell & manage gift cards |
| **Airbnb Contract** | `/contract/airbnb` | ⏳ Need tables | Weekly/fortnightly contracts |
| **Commercial Invoice** | `/invoice/commercial` | ⏳ Need tables | Square invoices & payments |

---

## 🔒 Security Features

- ✅ Row Level Security (RLS) enabled
- ✅ Public access limited to viewing only
- ✅ Admin auth for all modifications
- ✅ Secure API key management
- ✅ SSL/TLS for all connections
- ✅ Input validation on all forms

---

## 📊 Database Features

### Gift Cards
- Auto-generate unique codes
- Automatic 15% bonus calculation
- Track purchases and redemptions
- Customer credit aggregation
- Transaction history

### Contracts
- Auto-number contracts (CONT-YYYYMMDD-XXX)
- Reusable templates
- Payment schedule tracking
- Digital signature capture
- PDF generation with jsPDF

### Square Invoices
- Auto-number invoices (INV-YYYYMMDD-XXX)
- Embedded service terms
- Online payment links
- Email delivery
- Payment tracking

---

## ⚡ Performance

- React 19 with TypeScript
- Lazy loading for code splitting
- Supabase real-time subscriptions
- Optimized bundle size
- Fast page loads

---

## 🐛 Troubleshooting

### If migrations fail:
1. Check you copied **entire** SQL file content
2. Make sure you're in the correct project (rtnamqbkowtrwogelgqv)
3. Look for error message in SQL Editor
4. Try running migrations one at a time

### If tables still missing:
```sql
-- Check what tables exist:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

### If features don't work:
1. Verify dev server is running: `npm run dev`
2. Check browser console for errors (F12)
3. Verify all tables exist in Supabase
4. Check `.env` file has all keys

---

## 📞 Next Steps

1. **Run the 2 migrations** (see Option 1 above)
2. **Test each feature** (see Test Your Features section)
3. **Submit a real quote** to see AI in action
4. **Create a gift card** to test Square integration
5. **Generate a contract** to test PDF export
6. **Review admin dashboard** for analytics

---

## 🎉 You're Almost There!

Just run those 2 SQL migrations and you're done!

**Estimated time:** 2 minutes
**Difficulty:** Copy & paste
**Result:** Fully operational backend 🚀

---

## 💡 Pro Tips

- Gift cards auto-calculate 15% bonus
- Contracts auto-number daily starting from 001
- Square handles all payment emails automatically
- AI analyzes quotes in real-time
- Admin dashboard updates live
- All forms have real-time validation

Ready to launch? Run those migrations! 🚀
