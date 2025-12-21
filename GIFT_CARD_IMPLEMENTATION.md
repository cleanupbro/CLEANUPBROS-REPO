# 🎁 GIFT CARD SYSTEM - COMPLETE IMPLEMENTATION GUIDE
## Clean Up Bros - Gift Cards & Prepaid Credit

**Created:** December 21, 2025
**Status:** Design Complete - Ready to Build
**Integration:** Square Gift Cards API + Supabase

---

## 🎯 **WHAT ARE GIFT CARDS FOR CLEAN UP BROS?**

Gift cards allow customers to:
- **Buy cleaning credit** as a gift for friends/family
- **Prepay** for future cleaning services
- **Save 15%** when buying gift cards (incentive)
- **Redeem** during checkout for any cleaning service

**Example Use Cases:**
- "Gift your mom a sparkling clean home for Mother's Day"
- "Housewarming gift - give them a fresh start"
- "Corporate gifts for employees"
- "Wedding gift for busy newlyweds"
- "Prepay $1000, get $1150 worth of cleaning" (15% bonus)

---

## 💡 **GIFT CARD OPTIONS**

### **Option 1: Digital Gift Cards (Recommended)**

**What it is:**
- Customer buys online
- Receives email with code
- Can forward to gift recipient
- Recipient enters code at checkout
- Credit applied to booking

**Benefits:**
- ✅ Instant delivery
- ✅ No physical cards needed
- ✅ Easy to track
- ✅ Low overhead
- ✅ Can be emailed to recipient

**How it works:**
1. Customer visits: cleanupbros.com.au/gift-cards
2. Selects amount: $100, $200, $500, Custom
3. Enters recipient details (name, email, message)
4. Pays via Square
5. System generates unique code: `CLEAN-XXXX-XXXX`
6. Email sent to recipient with code
7. Recipient books cleaning, enters code at checkout
8. Credit applied, remaining balance tracked

---

### **Option 2: Physical Gift Cards**

**What it is:**
- Customer buys in-person or online
- Square provides physical plastic cards
- Square manages balance
- Customer swipes at checkout (in-person)
- Or enters card number online

**Benefits:**
- ✅ Professional physical card
- ✅ Square handles everything
- ✅ Works in-person and online
- ✅ Balance tracked by Square
- ✅ Can be reloaded

**How it works:**
1. Order Square plastic gift cards
2. Customer buys gift card (in-person or online)
3. Square activates card
4. Recipient receives physical card
5. Recipient books cleaning
6. Enters card number at checkout
7. Square processes payment using gift card balance

---

### **Option 3: Clean Up Card (Custom Prepaid Credit)**

**What it is:**
- Customer buys "Clean Up Card" (digital credit)
- Gets 15% bonus credit
- Examples:
  - Pay $100 → Get $115 credit
  - Pay $500 → Get $575 credit
  - Pay $1000 → Get $1150 credit
- Credit stored in Supabase
- Can be used for any service
- Never expires

**Benefits:**
- ✅ Encourages prepayment
- ✅ Guaranteed revenue
- ✅ Customer saves money
- ✅ Builds loyalty
- ✅ Flexible usage

**How it works:**
1. Customer buys Clean Up Card
2. Pays via Square
3. Credit added to account (Supabase)
4. Customer books service
5. Credit auto-applied at checkout
6. Balance tracked in dashboard
7. Customer sees remaining balance

---

## 📊 **RECOMMENDED APPROACH: HYBRID MODEL**

**Combine all three options:**

| Type | Use Case | Implementation |
|------|----------|----------------|
| **Digital Gift Card** | Gifts for others | Custom code system + Email |
| **Physical Gift Card** | Corporate/Premium | Square Gift Cards API |
| **Clean Up Card** | Customer prepayment | Supabase credit system |

---

## 🏗️ **ARCHITECTURE DESIGN**

### **Database Schema (Supabase)**

**Table: `gift_cards`**
```sql
CREATE TABLE gift_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Card Details
  code VARCHAR(20) UNIQUE NOT NULL, -- CLEAN-XXXX-XXXX
  type VARCHAR(20) NOT NULL, -- 'digital' | 'physical' | 'prepaid'

  -- Value
  original_amount DECIMAL(10,2) NOT NULL, -- Amount paid
  bonus_amount DECIMAL(10,2) DEFAULT 0, -- 15% bonus
  current_balance DECIMAL(10,2) NOT NULL, -- Remaining balance

  -- Purchase Info
  purchaser_name VARCHAR(255),
  purchaser_email VARCHAR(255),
  purchaser_phone VARCHAR(20),

  -- Recipient Info (for gift cards)
  recipient_name VARCHAR(255),
  recipient_email VARCHAR(255),
  gift_message TEXT,

  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'active' | 'redeemed' | 'expired'
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Redemption
  redeemed_by_user_id UUID REFERENCES auth.users(id),
  redeemed_at TIMESTAMPTZ,

  -- Square Integration
  square_gift_card_id VARCHAR(255), -- For physical cards
  square_gan VARCHAR(255), -- Gift Account Number

  -- Metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_gift_cards_code ON gift_cards(code);
CREATE INDEX idx_gift_cards_status ON gift_cards(status);
CREATE INDEX idx_gift_cards_purchaser_email ON gift_cards(purchaser_email);
CREATE INDEX idx_gift_cards_recipient_email ON gift_cards(recipient_email);
```

**Table: `gift_card_transactions`**
```sql
CREATE TABLE gift_card_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  gift_card_id UUID REFERENCES gift_cards(id),
  submission_id UUID REFERENCES submissions(id),

  -- Transaction Details
  type VARCHAR(20) NOT NULL, -- 'purchase' | 'redemption' | 'refund' | 'adjustment'
  amount DECIMAL(10,2) NOT NULL,
  balance_before DECIMAL(10,2),
  balance_after DECIMAL(10,2),

  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index
CREATE INDEX idx_gct_gift_card_id ON gift_card_transactions(gift_card_id);
```

**Table: `customer_credit`**
```sql
CREATE TABLE customer_credit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  customer_email VARCHAR(255) UNIQUE NOT NULL,
  customer_name VARCHAR(255),

  total_credit DECIMAL(10,2) DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,

  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index
CREATE INDEX idx_customer_credit_email ON customer_credit(customer_email);
```

---

## 🎨 **FRONTEND COMPONENTS**

### **1. Gift Card Purchase Page**

**File:** `views/GiftCardPurchaseView.tsx`

```typescript
import React, { useState } from 'react';

const GIFT_CARD_AMOUNTS = [
  { value: 100, label: '$100', bonus: 15 },
  { value: 200, label: '$200', bonus: 30 },
  { value: 500, label: '$500', bonus: 75 },
  { value: 1000, label: '$1000', bonus: 150 },
];

export const GiftCardPurchaseView = () => {
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [isGift, setIsGift] = useState(false);

  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');

  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  const bonusAmount = amount * 0.15;
  const totalValue = amount + bonusAmount;

  const handlePurchase = async () => {
    // Create gift card in Supabase
    const { data: giftCard } = await supabase
      .from('gift_cards')
      .insert({
        code: generateGiftCardCode(),
        type: isGift ? 'digital' : 'prepaid',
        original_amount: amount,
        bonus_amount: bonusAmount,
        current_balance: totalValue,
        purchaser_name: purchaserName,
        purchaser_email: purchaserEmail,
        recipient_name: isGift ? recipientName : purchaserName,
        recipient_email: isGift ? recipientEmail : purchaserEmail,
        gift_message: isGift ? giftMessage : '',
        status: 'pending',
      })
      .select()
      .single();

    // Create Square payment link for gift card purchase
    const paymentData = {
      customerName: purchaserName,
      customerEmail: purchaserEmail,
      serviceType: 'Gift Card',
      amount: amount,
      referenceId: giftCard.id,
      description: `Clean Up Bros Gift Card - $${totalValue} value`,
    };

    const result = await createPaymentLink(paymentData);

    if (result.success) {
      // Redirect to Square payment page
      window.location.href = result.paymentLink;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Buy a Clean Up Bros Gift Card</h1>
      <p className="text-gray-600 mb-8">
        Give the gift of a spotless home! Get 15% bonus credit on all gift cards.
      </p>

      {/* Amount Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {GIFT_CARD_AMOUNTS.map(option => (
          <button
            key={option.value}
            onClick={() => setAmount(option.value)}
            className={`p-6 rounded-2xl border-2 transition-all ${
              amount === option.value
                ? 'border-brand-gold bg-brand-gold/10'
                : 'border-gray-200 hover:border-brand-gold/50'
            }`}
          >
            <div className="text-2xl font-bold">{option.label}</div>
            <div className="text-sm text-gray-600 mt-1">
              +${option.bonus} bonus
            </div>
            <div className="text-lg font-semibold text-brand-navy mt-2">
              = ${option.value + option.bonus}
            </div>
          </button>
        ))}
      </div>

      {/* Is this a gift? */}
      <div className="mb-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isGift}
            onChange={(e) => setIsGift(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="text-lg font-medium">
            This is a gift for someone else
          </span>
        </label>
      </div>

      {/* Purchaser Details */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold">Your Details</h3>
        <input
          type="text"
          placeholder="Your Name"
          value={purchaserName}
          onChange={(e) => setPurchaserName(e.target.value)}
          className="input"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={purchaserEmail}
          onChange={(e) => setPurchaserEmail(e.target.value)}
          className="input"
        />
      </div>

      {/* Recipient Details (if gift) */}
      {isGift && (
        <div className="space-y-4 mb-8 p-6 bg-blue-50 rounded-2xl">
          <h3 className="text-xl font-semibold">Recipient Details</h3>
          <input
            type="text"
            placeholder="Recipient Name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="input"
          />
          <input
            type="email"
            placeholder="Recipient Email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="input"
          />
          <textarea
            placeholder="Gift Message (optional)"
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
            className="input"
            rows={4}
          />
        </div>
      )}

      {/* Purchase Summary */}
      <div className="bg-gradient-to-br from-brand-navy to-blue-900 text-white rounded-3xl p-8 mb-8">
        <h3 className="text-2xl font-bold mb-6">Purchase Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-lg">
            <span>Amount Paid:</span>
            <span className="font-semibold">${amount}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Bonus Credit (15%):</span>
            <span className="font-semibold text-brand-gold">+${bonusAmount}</span>
          </div>
          <div className="border-t border-white/20 pt-3 mt-3"></div>
          <div className="flex justify-between text-2xl font-bold">
            <span>Total Value:</span>
            <span className="text-brand-gold">${totalValue}</span>
          </div>
        </div>
      </div>

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        className="btn-primary w-full py-4 text-xl"
      >
        🎁 Purchase Gift Card - ${amount}
      </button>

      {/* Terms */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        Gift cards never expire. Non-refundable. Can be used for any Clean Up Bros service.
      </p>
    </div>
  );
};
```

### **2. Gift Card Redemption Component**

**File:** `components/GiftCardRedemption.tsx`

```typescript
import React, { useState } from 'react';

interface GiftCardRedemptionProps {
  totalAmount: number;
  onApply: (giftCardId: string, amountToApply: number) => void;
}

export const GiftCardRedemption: React.FC<GiftCardRedemptionProps> = ({
  totalAmount,
  onApply,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [giftCard, setGiftCard] = useState(null);

  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');

    try {
      // Check gift card in Supabase
      const { data, error: dbError } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('status', 'active')
        .single();

      if (dbError || !data) {
        setError('Invalid or inactive gift card code');
        return;
      }

      if (data.current_balance <= 0) {
        setError('This gift card has zero balance');
        return;
      }

      setGiftCard(data);
    } catch (err) {
      setError('Error verifying gift card');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    const amountToApply = Math.min(giftCard.current_balance, totalAmount);
    onApply(giftCard.id, amountToApply);
  };

  return (
    <div className="bg-blue-50 rounded-2xl p-6 mb-6">
      <h3 className="font-semibold mb-4">Have a Gift Card or Clean Up Card?</h3>

      {!giftCard ? (
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter code (e.g., CLEAN-XXXX-XXXX)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="input flex-1"
            maxLength={20}
          />
          <button
            onClick={handleVerifyCode}
            disabled={!code || loading}
            className="btn-primary"
          >
            {loading ? 'Verifying...' : 'Apply'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Gift Card Balance:</span>
              <span className="text-2xl font-bold text-brand-navy">
                ${giftCard.current_balance}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Code: {giftCard.code}
            </div>
          </div>

          <div className="bg-green-100 border border-green-300 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-green-800">
                Amount to Apply:
              </span>
              <span className="text-2xl font-bold text-green-600">
                -${Math.min(giftCard.current_balance, totalAmount)}
              </span>
            </div>
          </div>

          <button
            onClick={handleApply}
            className="btn-primary w-full"
          >
            ✅ Apply Gift Card
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg p-3">
          {error}
        </div>
      )}
    </div>
  );
};
```

### **3. Admin Gift Card Management**

**File:** `views/AdminGiftCardsView.tsx`

```typescript
export const AdminGiftCardsView = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [filter, setFilter] = useState('all'); // all | active | redeemed

  useEffect(() => {
    loadGiftCards();
  }, [filter]);

  const loadGiftCards = async () => {
    let query = supabase
      .from('gift_cards')
      .select('*, gift_card_transactions(*)')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data } = await query;
    setGiftCards(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gift Card Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Sold"
          value={`$${giftCards.reduce((sum, gc) => sum + gc.original_amount, 0)}`}
          icon="💰"
        />
        <StatCard
          title="Active Balance"
          value={`$${giftCards.filter(gc => gc.status === 'active').reduce((sum, gc) => sum + gc.current_balance, 0)}`}
          icon="💳"
        />
        <StatCard
          title="Redeemed"
          value={giftCards.filter(gc => gc.status === 'redeemed').length}
          icon="✅"
        />
        <StatCard
          title="Pending Activation"
          value={giftCards.filter(gc => gc.status === 'pending').length}
          icon="⏳"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'btn-primary' : 'btn-secondary'}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('redeemed')}
          className={filter === 'redeemed' ? 'btn-primary' : 'btn-secondary'}
        >
          Fully Redeemed
        </button>
      </div>

      {/* Gift Cards Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">Code</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Purchaser</th>
              <th className="px-6 py-4 text-left">Recipient</th>
              <th className="px-6 py-4 text-right">Original</th>
              <th className="px-6 py-4 text-right">Balance</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {giftCards.map(gc => (
              <tr key={gc.id} className="border-t">
                <td className="px-6 py-4 font-mono font-semibold">
                  {gc.code}
                </td>
                <td className="px-6 py-4 capitalize">{gc.type}</td>
                <td className="px-6 py-4">
                  {gc.purchaser_name}
                  <br />
                  <span className="text-xs text-gray-500">{gc.purchaser_email}</span>
                </td>
                <td className="px-6 py-4">
                  {gc.recipient_name}
                  <br />
                  <span className="text-xs text-gray-500">{gc.recipient_email}</span>
                </td>
                <td className="px-6 py-4 text-right font-semibold">
                  ${gc.original_amount + gc.bonus_amount}
                </td>
                <td className="px-6 py-4 text-right font-bold text-brand-navy">
                  ${gc.current_balance}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={gc.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-blue-600 hover:underline">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

## 🔄 **BACKEND WORKFLOW (n8n)**

### **Workflow 1: Gift Card Purchase**

**Node 1: Webhook - Gift Card Purchase**
- Receives: Payment completion from Square
- Payment reference matches gift card ID

**Node 2: Update Supabase - Activate Gift Card**
```sql
UPDATE gift_cards
SET
  status = 'active',
  activated_at = NOW()
WHERE id = $1;
```

**Node 3: Send Gift Card Email (Resend)**

**If it's a gift:**
- To: Recipient email
- Subject: "You've received a Clean Up Bros Gift Card!"
- Template: `gift_card_received.html`
- Variables: {recipientName, giftMessage, code, value}

**If it's prepaid credit:**
- To: Purchaser email
- Subject: "Your Clean Up Card is ready!"
- Template: `prepaid_card_activated.html`
- Variables: {customerName, code, value, balance}

**Node 4: Notify Admin (Telegram)**
```
🎁 GIFT CARD PURCHASED!

Type: Digital Gift Card
Amount Paid: $200
Total Value: $230 (with bonus)
Code: CLEAN-ABCD-1234

Purchaser: John Smith
Recipient: Jane Doe

✅ Email sent
```

### **Workflow 2: Gift Card Redemption**

**Node 1: Webhook - Gift Card Redemption**
- Receives: {giftCardId, submissionId, amountApplied}

**Node 2: Create Transaction Record**
```sql
INSERT INTO gift_card_transactions (
  gift_card_id,
  submission_id,
  type,
  amount,
  balance_before,
  balance_after
) VALUES ($1, $2, 'redemption', $3, $4, $5);
```

**Node 3: Update Gift Card Balance**
```sql
UPDATE gift_cards
SET
  current_balance = current_balance - $1,
  status = CASE
    WHEN current_balance - $1 <= 0 THEN 'redeemed'
    ELSE 'active'
  END,
  redeemed_at = CASE
    WHEN current_balance - $1 <= 0 THEN NOW()
    ELSE redeemed_at
  END
WHERE id = $2;
```

**Node 4: Update Submission with Applied Credit**
```sql
UPDATE submissions
SET data = jsonb_set(
  data,
  '{payment}',
  jsonb_build_object(
    'gift_card_applied', $1,
    'gift_card_code', $2
  )
)
WHERE id = $3;
```

**Node 5: Send Confirmation Email**
- To: Customer
- Subject: "Gift Card Applied to Your Booking"
- Template: Shows credit applied, remaining balance

**Node 6: Notify Admin**
```
💳 GIFT CARD REDEEMED

Code: CLEAN-ABCD-1234
Amount Applied: $180
Remaining Balance: $50

Customer: Jane Doe
Booking: Residential Clean - Liverpool
```

---

## 🎨 **EMAIL TEMPLATES**

### **1. Gift Card Received Email**

**File:** `email_templates/gift_card_received.html`

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Glassmorphism styles */
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎁 You've Received a Gift!</h1>
    </div>

    <div class="content">
      <p>Hi {{recipientName}},</p>

      <p>Great news! Someone special has gifted you a Clean Up Bros Gift Card!</p>

      {{#if giftMessage}}
      <div class="gift-message">
        <p class="label">Personal Message:</p>
        <p class="message">"{{giftMessage}}"</p>
      </div>
      {{/if}}

      <div class="gift-card">
        <div class="value">${{totalValue}}</div>
        <div class="code">{{code}}</div>
        <p class="instructions">Use this code at checkout</p>
      </div>

      <p><strong>How to use your gift card:</strong></p>
      <ol>
        <li>Visit <a href="https://cleanupbros.com.au">cleanupbros.com.au</a></li>
        <li>Select your cleaning service</li>
        <li>Enter code <strong>{{code}}</strong> at checkout</li>
        <li>Enjoy your spotless home!</li>
      </ol>

      <a href="https://cleanupbros.com.au" class="cta-button">
        Book Your Cleaning Now
      </a>

      <p class="fine-print">
        Gift card never expires. Can be used for any Clean Up Bros service.
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 💰 **PRICING & PROMOTIONS**

### **Gift Card Amounts:**

| Amount Paid | Bonus Credit (15%) | Total Value | Savings |
|------------|-------------------|-------------|---------|
| $100 | $15 | $115 | 15% |
| $200 | $30 | $230 | 15% |
| $500 | $75 | $575 | 15% |
| $1000 | $150 | $1150 | 15% |
| Custom | 15% | Custom + 15% | 15% |

### **Why 15% Bonus?**

**Customer Benefits:**
- Save money on future cleanings ✅
- Guaranteed pricing ✅
- Never expires ✅

**Business Benefits:**
- Upfront cash flow ✅
- Customer lock-in ✅
- Increased lifetime value ✅
- Marketing (gifting spreads awareness) ✅

### **Marketing Angles:**

**1. Holiday Promotions:**
- "Perfect Mother's Day Gift"
- "Housewarming Gift Idea"
- "Wedding Gift They'll Actually Use"

**2. Corporate:**
- "Employee Appreciation Gifts"
- "Client Thank You Gifts"
- "Bulk Discounts for Businesses"

**3. Prepaid Savings:**
- "Save 15% by Prepaying"
- "Lock In Today's Rates"
- "Budget Your Cleaning Costs"

---

## ✅ **IMPLEMENTATION CHECKLIST**

### **Phase 1: Database Setup (1 hour)**
- [ ] Create `gift_cards` table
- [ ] Create `gift_card_transactions` table
- [ ] Create `customer_credit` table
- [ ] Add RLS policies
- [ ] Add indexes

### **Phase 2: Frontend (4 hours)**
- [ ] Create GiftCardPurchaseView component
- [ ] Create GiftCardRedemption component
- [ ] Create AdminGiftCardsView component
- [ ] Add gift card route to App.tsx
- [ ] Add redemption to checkout flow

### **Phase 3: Backend Workflows (2 hours)**
- [ ] Create gift card purchase webhook
- [ ] Create gift card activation workflow
- [ ] Create redemption webhook
- [ ] Create balance update workflow

### **Phase 4: Email Templates (1 hour)**
- [ ] Create gift_card_received.html
- [ ] Create prepaid_card_activated.html
- [ ] Create gift_card_redeemed.html

### **Phase 5: Square Integration (2 hours)**
- [ ] Test Square payment link for gift cards
- [ ] Test webhook handling
- [ ] Configure Square webhooks

### **Phase 6: Testing (2 hours)**
- [ ] Test purchase flow end-to-end
- [ ] Test redemption with valid code
- [ ] Test redemption with invalid code
- [ ] Test partial redemption
- [ ] Test full redemption
- [ ] Test email deliveries
- [ ] Test admin dashboard

### **Phase 7: Launch (1 hour)**
- [ ] Add gift card link to homepage
- [ ] Update navigation
- [ ] Create marketing page
- [ ] Social media announcement
- [ ] Email existing customers

**TOTAL ESTIMATED TIME: 13 hours**

---

## 🚀 **LAUNCH STRATEGY**

### **Week 1: Soft Launch**
1. Add gift card page to website
2. Test with 5 internal purchases
3. Send to friends/family for feedback
4. Fix any bugs

### **Week 2: Marketing Push**
1. Social media posts
2. Email to customer database
3. Add gift card promo to homepage
4. Instagram Stories showing how to use

### **Week 3: Promotions**
1. Limited-time 20% bonus (instead of 15%)
2. Referral bonus: "Gift a card, get $20 credit"
3. Corporate packages

---

## 📊 **SUCCESS METRICS**

**Track these KPIs:**
- Gift cards sold per month
- Average gift card value
- Redemption rate (target: 80%+ within 6 months)
- Time to redemption (average days)
- Repeat purchase rate
- Gift card revenue as % of total revenue

**Goals (Year 1):**
- 100 gift cards sold
- $20,000 total gift card revenue
- 75%+ redemption rate
- 10% of new customers from gift cards

---

## 💡 **ADVANCED FEATURES (Future)**

1. **Bulk Purchase Portal**
   - Corporate customers buy 50+ cards
   - Tiered pricing (20% bonus for 50+)

2. **Customizable Gift Cards**
   - Upload custom design/logo
   - Personalized video message
   - Premium tier

3. **Auto-Reload**
   - Low balance alert
   - Auto-reload when < $50
   - Subscription model

4. **Loyalty Integration**
   - Earn points on gift card purchases
   - Redeem points for gift cards

5. **Physical Cards**
   - Order Square plastic gift cards
   - Mail to recipients
   - Premium packaging

---

**Created:** December 21, 2025
**Status:** Complete Design - Ready to Build
**Estimated Build Time:** 13 hours
**Expected ROI:** 300%+ (15% bonus cost vs. customer lock-in value)

**LET'S IMPLEMENT GIFT CARDS! 🎁✨**
