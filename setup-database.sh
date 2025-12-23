#!/bin/bash

# Clean Up Bros - Database Setup Script
# This script sets up all required database tables in Supabase

echo "🚀 Clean Up Bros - Database Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Database connection details
DB_HOST="db.rtnamqbkowtrwogelgqv.supabase.co"
DB_USER="postgres"
DB_PASSWORD="hafsah@1303"
DB_NAME="postgres"
DB_PORT="5432"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  psql is not installed${NC}"
    echo ""
    echo "To install PostgreSQL client on macOS:"
    echo -e "${BLUE}brew install postgresql@15${NC}"
    echo ""
    echo "Or run migrations manually:"
    echo -e "${BLUE}1. Go to: https://supabase.com/dashboard/project/rtnamqbkowtrwogelgqv/sql${NC}"
    echo -e "${BLUE}2. Copy contents of supabase_migration_gift_cards.sql${NC}"
    echo -e "${BLUE}3. Paste and click 'Run'${NC}"
    echo -e "${BLUE}4. Repeat with supabase_migration_contracts.sql${NC}"
    echo ""
    exit 1
fi

echo -e "${BLUE}📡 Connecting to Supabase...${NC}"
echo ""

# Test connection
if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -p "$DB_PORT" -c "SELECT version();" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connection successful${NC}"
    echo ""
else
    echo -e "${RED}❌ Connection failed${NC}"
    echo "Please check your database credentials"
    exit 1
fi

# Run gift cards migration
echo -e "${BLUE}📋 Running Gift Cards migration...${NC}"
if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -p "$DB_PORT" -f supabase_migration_gift_cards.sql; then
    echo -e "${GREEN}✅ Gift Cards migration complete${NC}"
    echo ""
else
    echo -e "${RED}❌ Gift Cards migration failed${NC}"
    exit 1
fi

# Run contracts migration
echo -e "${BLUE}📋 Running Contracts migration...${NC}"
if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -p "$DB_PORT" -f supabase_migration_contracts.sql; then
    echo -e "${GREEN}✅ Contracts migration complete${NC}"
    echo ""
else
    echo -e "${RED}❌ Contracts migration failed${NC}"
    exit 1
fi

# Verify tables
echo -e "${BLUE}🔍 Verifying database tables...${NC}"
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -p "$DB_PORT" -c "
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'gift_cards',
  'gift_card_transactions',
  'customer_credit',
  'contract_templates',
  'service_contracts',
  'contract_payments',
  'contract_amendments',
  'square_invoices'
)
ORDER BY table_name;
" || {
    echo -e "${RED}❌ Verification failed${NC}"
    exit 1
}

echo ""
echo -e "${GREEN}🎉 Database setup complete!${NC}"
echo ""
echo "Next steps:"
echo -e "  ${BLUE}1.${NC} Test gift card creation: ${BLUE}/admin/gift-cards${NC}"
echo -e "  ${BLUE}2.${NC} Test Airbnb contract: ${BLUE}/contract/airbnb${NC}"
echo -e "  ${BLUE}3.${NC} Test commercial invoice: ${BLUE}/invoice/commercial${NC}"
echo -e "  ${BLUE}4.${NC} Submit a test quote: ${BLUE}/${NC}"
echo ""
echo -e "🚀 Your backend is now fully operational!"
