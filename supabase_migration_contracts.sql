-- Clean Up Bros - Service Contracts & Agreements System
-- Migration for contract templates, signed contracts, and Square invoices integration

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CONTRACT TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contract_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Template Info
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('airbnb_long_term', 'commercial_recurring', 'commercial_one_time', 'residential_recurring')),
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,

  -- Contract Terms
  template_content JSONB NOT NULL, -- Structured contract data

  -- Default Terms
  default_duration_months INTEGER,
  default_frequency VARCHAR(50), -- 'daily', 'weekly', 'bi-weekly', 'monthly'
  payment_terms TEXT,
  cancellation_policy TEXT,

  -- Legal
  terms_and_conditions TEXT NOT NULL,
  liability_clause TEXT,
  insurance_details TEXT,

  CONSTRAINT unique_active_template UNIQUE (type, is_active) WHERE is_active = true
);

-- =====================================================
-- SERVICE CONTRACTS TABLE (Signed Agreements)
-- =====================================================
CREATE TABLE IF NOT EXISTS service_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contract Basics
  contract_number VARCHAR(50) UNIQUE NOT NULL,
  template_id UUID REFERENCES contract_templates(id),
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'active', 'completed', 'cancelled', 'expired')),

  -- Client Information
  client_name VARCHAR(200) NOT NULL,
  client_email VARCHAR(200) NOT NULL,
  client_phone VARCHAR(50),
  client_company VARCHAR(200),

  -- Property/Service Details
  property_address TEXT NOT NULL,
  property_type VARCHAR(100),
  service_description TEXT NOT NULL,

  -- Financial Terms
  total_contract_value DECIMAL(10,2) NOT NULL,
  payment_frequency VARCHAR(50) NOT NULL, -- 'weekly', 'bi-weekly', 'monthly', 'one-time'
  payment_amount_per_period DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'AUD',

  -- Duration
  start_date DATE NOT NULL,
  end_date DATE,
  duration_months INTEGER,
  auto_renew BOOLEAN DEFAULT false,

  -- Service Specifics
  service_frequency VARCHAR(50), -- How often cleaning happens
  service_scope JSONB, -- Detailed scope of work
  special_requirements TEXT,

  -- Signatures
  client_signature_data TEXT, -- Base64 signature image
  client_signed_at TIMESTAMPTZ,
  client_ip_address VARCHAR(50),

  business_signature_data TEXT,
  business_signed_at TIMESTAMPTZ,
  business_signed_by VARCHAR(200),

  -- Documents
  pdf_url TEXT, -- URL to generated PDF in storage
  pdf_generated_at TIMESTAMPTZ,

  -- Square Integration
  square_invoice_id VARCHAR(200),
  square_payment_status VARCHAR(50),

  -- Tracking
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  last_reminded_at TIMESTAMPTZ,

  -- Notes
  internal_notes TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- CONTRACT PAYMENTS TABLE (Payment Schedule)
-- =====================================================
CREATE TABLE IF NOT EXISTS contract_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  contract_id UUID REFERENCES service_contracts(id) ON DELETE CASCADE,

  -- Payment Details
  payment_number INTEGER NOT NULL, -- 1st payment, 2nd payment, etc.
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'paid', 'overdue', 'cancelled', 'refunded')),

  -- Square Integration
  square_invoice_id VARCHAR(200),
  square_payment_id VARCHAR(200),

  -- Payment Info
  paid_at TIMESTAMPTZ,
  paid_amount DECIMAL(10,2),
  payment_method VARCHAR(50),

  -- Tracking
  invoice_sent_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,

  notes TEXT,

  CONSTRAINT unique_contract_payment UNIQUE (contract_id, payment_number)
);

-- =====================================================
-- CONTRACT AMENDMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contract_amendments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  contract_id UUID REFERENCES service_contracts(id) ON DELETE CASCADE,

  amendment_number INTEGER NOT NULL,
  amendment_type VARCHAR(50) NOT NULL, -- 'price_change', 'scope_change', 'duration_extension', 'frequency_change'

  description TEXT NOT NULL,
  previous_value JSONB,
  new_value JSONB,

  effective_date DATE NOT NULL,

  -- Signatures
  client_signed_at TIMESTAMPTZ,
  business_signed_at TIMESTAMPTZ,

  pdf_url TEXT,

  CONSTRAINT unique_contract_amendment UNIQUE (contract_id, amendment_number)
);

-- =====================================================
-- SQUARE INVOICES TABLE (For tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS square_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  square_invoice_id VARCHAR(200) UNIQUE NOT NULL,
  square_order_id VARCHAR(200),

  contract_id UUID REFERENCES service_contracts(id),
  submission_id VARCHAR(200), -- Link to quote submission

  -- Invoice Details
  invoice_number VARCHAR(100),
  customer_name VARCHAR(200) NOT NULL,
  customer_email VARCHAR(200) NOT NULL,

  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50), -- 'draft', 'unpaid', 'paid', 'cancelled'

  service_description TEXT,
  due_date DATE,

  -- Links
  invoice_url TEXT,
  payment_url TEXT,

  -- Payment
  paid_at TIMESTAMPTZ,
  payment_method VARCHAR(50),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_contracts_client_email ON service_contracts(client_email);
CREATE INDEX idx_contracts_status ON service_contracts(status);
CREATE INDEX idx_contracts_start_date ON service_contracts(start_date);
CREATE INDEX idx_contracts_end_date ON service_contracts(end_date);
CREATE INDEX idx_contracts_type ON service_contracts(type);
CREATE INDEX idx_contracts_contract_number ON service_contracts(contract_number);

CREATE INDEX idx_contract_payments_contract_id ON contract_payments(contract_id);
CREATE INDEX idx_contract_payments_due_date ON contract_payments(due_date);
CREATE INDEX idx_contract_payments_status ON contract_payments(status);

CREATE INDEX idx_square_invoices_square_id ON square_invoices(square_invoice_id);
CREATE INDEX idx_square_invoices_contract_id ON square_invoices(contract_id);
CREATE INDEX idx_square_invoices_status ON square_invoices(status);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Generate contract number
CREATE OR REPLACE FUNCTION generate_contract_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_code TEXT;
  sequence_num INTEGER;
BEGIN
  year_code := TO_CHAR(NOW(), 'YY');

  -- Get next sequence number for this year
  SELECT COUNT(*) + 1 INTO sequence_num
  FROM service_contracts
  WHERE contract_number LIKE 'CUB-' || year_code || '-%';

  new_number := 'CUB-' || year_code || '-' || LPAD(sequence_num::TEXT, 4, '0');

  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE TRIGGER update_contract_templates_updated_at
  BEFORE UPDATE ON contract_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_contracts_updated_at
  BEFORE UPDATE ON service_contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_square_invoices_updated_at
  BEFORE UPDATE ON square_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_amendments ENABLE ROW LEVEL SECURITY;
ALTER TABLE square_invoices ENABLE ROW LEVEL SECURITY;

-- Policies (Allow all for now, tighten in production)
CREATE POLICY "Allow all operations on contract_templates" ON contract_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on service_contracts" ON service_contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on contract_payments" ON contract_payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on contract_amendments" ON contract_amendments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on square_invoices" ON square_invoices FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- SEED DATA - Default Contract Templates
-- =====================================================

-- Airbnb Long-Term Contract Template
INSERT INTO contract_templates (
  name,
  type,
  version,
  is_active,
  template_content,
  default_duration_months,
  default_frequency,
  payment_terms,
  cancellation_policy,
  terms_and_conditions,
  liability_clause,
  insurance_details
) VALUES (
  'Airbnb Property Management - Long Term Agreement',
  'airbnb_long_term',
  1,
  true,
  '{
    "sections": [
      {"title": "Service Description", "content": "Clean Up Bros agrees to provide professional cleaning and turnover services for the Airbnb property located at [PROPERTY_ADDRESS]."},
      {"title": "Scope of Work", "content": "Full property cleaning including bedrooms, bathrooms, kitchen, living areas, laundry, and outdoor spaces as required between guest stays."},
      {"title": "Service Standards", "content": "All services will meet Clean Up Bros professional standards and Airbnb hosting guidelines."}
    ]
  }'::jsonb,
  6,
  'per_turnover',
  'Payment due within 7 days of invoice. Monthly invoicing for all turnovers completed in the previous month.',
  'Either party may terminate this agreement with 30 days written notice. Early termination may result in fees.',
  'This agreement constitutes the entire agreement between Clean Up Bros (ABN: [ABN]) and the Client. Services are provided in accordance with Australian Consumer Law. Client agrees to provide reasonable access to the property for scheduled services.',
  'Clean Up Bros maintains public liability insurance. Client is responsible for property insurance. Clean Up Bros is not liable for pre-existing damage or items left by guests.',
  'Clean Up Bros carries $20M public liability insurance. Policy number available upon request.'
) ON CONFLICT DO NOTHING;

-- Commercial Recurring Contract Template
INSERT INTO contract_templates (
  name,
  type,
  version,
  is_active,
  template_content,
  default_duration_months,
  default_frequency,
  payment_terms,
  cancellation_policy,
  terms_and_conditions,
  liability_clause,
  insurance_details
) VALUES (
  'Commercial Cleaning - Recurring Service Agreement',
  'commercial_recurring',
  1,
  true,
  '{
    "sections": [
      {"title": "Service Description", "content": "Clean Up Bros agrees to provide professional commercial cleaning services for [COMPANY_NAME] at [PROPERTY_ADDRESS]."},
      {"title": "Service Schedule", "content": "Cleaning services to be performed [FREQUENCY] as per agreed schedule."},
      {"title": "Scope of Work", "content": "General office cleaning including floors, surfaces, bathrooms, kitchen areas, and waste removal."}
    ]
  }'::jsonb,
  12,
  'weekly',
  'Monthly invoicing in advance. Payment due within 14 days of invoice date.',
  '90 days notice required for termination. Services must be paid for the current billing period.',
  'This agreement is between Clean Up Bros and the Client for commercial cleaning services. Client must provide access to premises during agreed service hours. Clean Up Bros reserves the right to adjust pricing with 60 days notice.',
  'Clean Up Bros maintains comprehensive insurance. Client responsible for securing valuable items. Clean Up Bros not liable for items left unsecured.',
  'Full public liability and workers compensation insurance maintained.'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Active Contracts Overview
CREATE OR REPLACE VIEW active_contracts_summary AS
SELECT
  sc.id,
  sc.contract_number,
  sc.type,
  sc.client_name,
  sc.client_email,
  sc.property_address,
  sc.start_date,
  sc.end_date,
  sc.total_contract_value,
  sc.payment_amount_per_period,
  sc.payment_frequency,
  sc.status,
  COUNT(DISTINCT cp.id) as total_payments,
  COUNT(DISTINCT cp.id) FILTER (WHERE cp.status = 'paid') as paid_payments,
  SUM(cp.amount) FILTER (WHERE cp.status = 'paid') as total_paid,
  SUM(cp.amount) FILTER (WHERE cp.status IN ('pending', 'overdue')) as total_outstanding
FROM service_contracts sc
LEFT JOIN contract_payments cp ON sc.id = cp.contract_id
WHERE sc.status IN ('active', 'signed')
GROUP BY sc.id, sc.contract_number, sc.type, sc.client_name, sc.client_email,
         sc.property_address, sc.start_date, sc.end_date, sc.total_contract_value,
         sc.payment_amount_per_period, sc.payment_frequency, sc.status;

-- Payment Schedule View
CREATE OR REPLACE VIEW contract_payment_schedule AS
SELECT
  cp.id,
  cp.contract_id,
  sc.contract_number,
  sc.client_name,
  sc.client_email,
  cp.payment_number,
  cp.due_date,
  cp.amount,
  cp.status,
  cp.paid_at,
  cp.square_invoice_id,
  CASE
    WHEN cp.status = 'pending' AND cp.due_date < CURRENT_DATE THEN 'overdue'
    ELSE cp.status
  END as computed_status
FROM contract_payments cp
JOIN service_contracts sc ON cp.contract_id = sc.id
ORDER BY cp.due_date ASC;
