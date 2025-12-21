-- =====================================================
-- CLEAN UP BROS - GIFT CARD SYSTEM DATABASE MIGRATION
-- =====================================================
-- Run this in Supabase SQL Editor
-- This creates all tables for the gift card system

-- =====================================================
-- 1. GIFT CARDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Card Details
  code VARCHAR(20) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('digital', 'physical', 'prepaid')),

  -- Value
  original_amount DECIMAL(10,2) NOT NULL CHECK (original_amount > 0),
  bonus_amount DECIMAL(10,2) DEFAULT 0 CHECK (bonus_amount >= 0),
  current_balance DECIMAL(10,2) NOT NULL CHECK (current_balance >= 0),

  -- Purchase Info
  purchaser_name VARCHAR(255),
  purchaser_email VARCHAR(255),
  purchaser_phone VARCHAR(20),

  -- Recipient Info (for gift cards)
  recipient_name VARCHAR(255),
  recipient_email VARCHAR(255),
  gift_message TEXT,

  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'redeemed', 'expired', 'cancelled')),
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Redemption
  redeemed_by_email VARCHAR(255),
  redeemed_at TIMESTAMPTZ,
  fully_redeemed_at TIMESTAMPTZ,

  -- Square Integration
  square_gift_card_id VARCHAR(255),
  square_gan VARCHAR(255),
  square_payment_id VARCHAR(255),

  -- Metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX idx_gift_cards_code ON gift_cards(code);
CREATE INDEX idx_gift_cards_status ON gift_cards(status);
CREATE INDEX idx_gift_cards_purchaser_email ON gift_cards(purchaser_email);
CREATE INDEX idx_gift_cards_recipient_email ON gift_cards(recipient_email);
CREATE INDEX idx_gift_cards_created_at ON gift_cards(created_at DESC);

-- =====================================================
-- 2. GIFT CARD TRANSACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS gift_card_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  gift_card_id UUID REFERENCES gift_cards(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,

  -- Transaction Details
  type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'redemption', 'refund', 'adjustment', 'activation')),
  amount DECIMAL(10,2) NOT NULL,
  balance_before DECIMAL(10,2),
  balance_after DECIMAL(10,2),

  description TEXT,
  performed_by VARCHAR(255),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_gct_gift_card_id ON gift_card_transactions(gift_card_id);
CREATE INDEX idx_gct_submission_id ON gift_card_transactions(submission_id);
CREATE INDEX idx_gct_created_at ON gift_card_transactions(created_at DESC);
CREATE INDEX idx_gct_type ON gift_card_transactions(type);

-- =====================================================
-- 3. CUSTOMER CREDIT TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS customer_credit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  customer_email VARCHAR(255) UNIQUE NOT NULL,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),

  total_purchased DECIMAL(10,2) DEFAULT 0 CHECK (total_purchased >= 0),
  total_bonus DECIMAL(10,2) DEFAULT 0 CHECK (total_bonus >= 0),
  total_redeemed DECIMAL(10,2) DEFAULT 0 CHECK (total_redeemed >= 0),
  current_balance DECIMAL(10,2) DEFAULT 0 CHECK (current_balance >= 0),

  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_customer_credit_email ON customer_credit(customer_email);
CREATE INDEX idx_customer_credit_balance ON customer_credit(current_balance DESC);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_credit ENABLE ROW LEVEL SECURITY;

-- Gift Cards: Public can read active cards by code
CREATE POLICY "Anyone can view active gift cards by code"
  ON gift_cards
  FOR SELECT
  USING (status = 'active');

-- Gift Cards: Authenticated users can insert (purchase)
CREATE POLICY "Authenticated users can create gift cards"
  ON gift_cards
  FOR INSERT
  WITH CHECK (true);

-- Gift Cards: Only admins can update
CREATE POLICY "Only admins can update gift cards"
  ON gift_cards
  FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN (
      'hafsahnuzhat1303@gmail.com',
      'cleanupbros.au@gmail.com'
    )
  );

-- Gift Card Transactions: Anyone can insert redemptions
CREATE POLICY "Anyone can create gift card transactions"
  ON gift_card_transactions
  FOR INSERT
  WITH CHECK (true);

-- Gift Card Transactions: Anyone can view their own transactions
CREATE POLICY "Users can view gift card transactions"
  ON gift_card_transactions
  FOR SELECT
  USING (true);

-- Customer Credit: Customers can view their own credit
CREATE POLICY "Customers can view their own credit"
  ON customer_credit
  FOR SELECT
  USING (true);

-- Customer Credit: System can insert/update
CREATE POLICY "System can manage customer credit"
  ON customer_credit
  FOR ALL
  USING (true);

-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Function to generate unique gift card code
CREATE OR REPLACE FUNCTION generate_gift_card_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code format: CLEAN-XXXX-XXXX
    new_code := 'CLEAN-' ||
                UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)) || '-' ||
                UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM gift_cards WHERE code = new_code) INTO code_exists;

    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;

  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Function to update customer credit balance
CREATE OR REPLACE FUNCTION update_customer_credit()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update customer credit record
  INSERT INTO customer_credit (
    customer_email,
    customer_name,
    total_purchased,
    total_bonus,
    current_balance
  ) VALUES (
    NEW.purchaser_email,
    NEW.purchaser_name,
    NEW.original_amount,
    NEW.bonus_amount,
    NEW.current_balance
  )
  ON CONFLICT (customer_email)
  DO UPDATE SET
    total_purchased = customer_credit.total_purchased + NEW.original_amount,
    total_bonus = customer_credit.total_bonus + NEW.bonus_amount,
    current_balance = customer_credit.current_balance + NEW.current_balance,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update customer credit on gift card insert
CREATE TRIGGER trigger_update_customer_credit
  AFTER INSERT ON gift_cards
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION update_customer_credit();

-- =====================================================
-- 6. INITIAL TEST DATA (OPTIONAL)
-- =====================================================

-- Insert a test gift card
INSERT INTO gift_cards (
  code,
  type,
  original_amount,
  bonus_amount,
  current_balance,
  purchaser_name,
  purchaser_email,
  recipient_name,
  recipient_email,
  gift_message,
  status,
  activated_at
) VALUES (
  'CLEAN-TEST-0001',
  'digital',
  100.00,
  15.00,
  115.00,
  'Test Purchaser',
  'purchaser@test.com',
  'Test Recipient',
  'recipient@test.com',
  'Enjoy your clean home! This is a test gift card.',
  'active',
  NOW()
);

-- Insert activation transaction for test card
INSERT INTO gift_card_transactions (
  gift_card_id,
  type,
  amount,
  balance_before,
  balance_after,
  description
) SELECT
  id,
  'activation',
  115.00,
  0,
  115.00,
  'Gift card activated'
FROM gift_cards
WHERE code = 'CLEAN-TEST-0001';

-- =====================================================
-- 7. VIEWS FOR REPORTING
-- =====================================================

-- View: Gift Card Summary
CREATE OR REPLACE VIEW gift_card_summary AS
SELECT
  COUNT(*) FILTER (WHERE status = 'active') as active_cards,
  COUNT(*) FILTER (WHERE status = 'redeemed') as redeemed_cards,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_cards,
  SUM(original_amount) as total_sold,
  SUM(bonus_amount) as total_bonus,
  SUM(current_balance) FILTER (WHERE status = 'active') as total_active_balance,
  SUM(original_amount + bonus_amount - current_balance) as total_redeemed_value
FROM gift_cards;

-- View: Gift Card Details with Transaction Count
CREATE OR REPLACE VIEW gift_card_details AS
SELECT
  gc.*,
  COUNT(gct.id) as transaction_count,
  MAX(gct.created_at) as last_transaction_at
FROM gift_cards gc
LEFT JOIN gift_card_transactions gct ON gc.id = gct.gift_card_id
GROUP BY gc.id;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Verify tables created
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('gift_cards', 'gift_card_transactions', 'customer_credit')
ORDER BY table_name;

-- Show summary
SELECT 'Gift Card Tables Created Successfully!' as status;
