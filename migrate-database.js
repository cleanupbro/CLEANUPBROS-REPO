import { Client } from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database configuration
const client = new Client({
  host: 'db.rtnamqbkowtrwogelgqv.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'hafsah@1303',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration(filename) {
  console.log(`\n📋 Running migration: ${filename}`);
  console.log('='.repeat(60));

  try {
    const sqlContent = readFileSync(join(__dirname, filename), 'utf8');

    console.log(`Executing SQL from ${filename}...`);
    await client.query(sqlContent);

    console.log(`✅ Migration ${filename} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Migration ${filename} failed:`, error.message);
    throw error;
  }
}

async function verifyTables() {
  console.log('\n🔍 Verifying database tables...');
  console.log('='.repeat(60));

  const result = await client.query(`
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
  `);

  console.log(`\nFound ${result.rows.length} tables:`);
  result.rows.forEach(row => {
    console.log(`  ✅ ${row.table_name}`);
  });

  return result.rows.length;
}

async function main() {
  console.log('\n🚀 Clean Up Bros - Database Migration');
  console.log('='.repeat(60));
  console.log(`📍 Target: db.rtnamqbkowtrwogelgqv.supabase.co`);

  try {
    // Connect to database
    console.log('\n📡 Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    // Run migrations
    await runMigration('supabase_migration_gift_cards.sql');
    await runMigration('supabase_migration_contracts.sql');

    // Verify tables
    const tableCount = await verifyTables();

    if (tableCount === 8) {
      console.log('\n🎉 All migrations completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('  1. Test gift card creation: /admin/gift-cards');
      console.log('  2. Test Airbnb contract: /contract/airbnb');
      console.log('  3. Test commercial invoice: /invoice/commercial');
      console.log('  4. Submit a test quote: /');
      console.log('\n🚀 Your backend is now fully operational!\n');
    } else {
      console.log(`\n⚠️  Warning: Expected 8 tables but found ${tableCount}`);
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
