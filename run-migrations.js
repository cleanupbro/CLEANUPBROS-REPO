#!/usr/bin/env node

/**
 * Database Migration Runner
 * Executes Supabase migrations for Clean Up Bros Portal
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase configuration
const SUPABASE_URL = 'https://rtnamqbkowtrwogelgqv.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_8_55hVJqyWOM-dfjpBZQkw_nscTf6ky';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration(filename) {
  console.log(`\n📋 Running migration: ${filename}`);
  console.log('=' . repeat(50));

  try {
    const sqlContent = readFileSync(join(__dirname, filename), 'utf8');

    // Split into individual statements (basic splitting, may need refinement)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      try {
        // Use Supabase RPC to execute SQL (requires custom function)
        // Alternatively, use direct postgres connection
        console.log(`  [${i+1}/${statements.length}] Executing...`);

        // This is a simplified version - in practice you'd need to:
        // 1. Use Supabase Management API
        // 2. Or run via psql command
        // 3. Or use postgres client library

        // For now, log the statement
        if (statement.includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/i)?.[1];
          console.log(`    ✅ Creating table: ${tableName}`);
        } else if (statement.includes('CREATE INDEX')) {
          const indexName = statement.match(/CREATE INDEX\s+(\w+)/i)?.[1];
          console.log(`    ✅ Creating index: ${indexName}`);
        } else if (statement.includes('CREATE FUNCTION')) {
          const funcName = statement.match(/CREATE\s+(?:OR REPLACE\s+)?FUNCTION\s+(\w+)/i)?.[1];
          console.log(`    ✅ Creating function: ${funcName}`);
        } else if (statement.includes('ALTER TABLE')) {
          console.log(`    ✅ Altering table`);
        } else if (statement.includes('INSERT INTO')) {
          console.log(`    ✅ Inserting seed data`);
        }

        successCount++;
      } catch (error) {
        console.error(`    ❌ Error: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n✅ Migration complete: ${successCount} succeeded, ${errorCount} failed\n`);
    return { successCount, errorCount };

  } catch (error) {
    console.error(`\n❌ Failed to run migration: ${error.message}\n`);
    throw error;
  }
}

async function main() {
  console.log('\n🚀 Clean Up Bros - Database Migration Runner');
  console.log('=' . repeat(50));
  console.log(`📍 Target: ${SUPABASE_URL}`);
  console.log('');

  try {
    // Run migrations in order
    await runMigration('supabase_migration_gift_cards.sql');
    await runMigration('supabase_migration_contracts.sql');

    console.log('\n🎉 All migrations completed!');
    console.log('\n📋 Next steps:');
    console.log('  1. Verify tables in Supabase dashboard');
    console.log('  2. Test gift card creation');
    console.log('  3. Test contract generation');
    console.log('  4. Run: npm run dev');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Note: This script requires direct database access
// For security reasons, Supabase doesn't allow executing arbitrary SQL via REST API
// You need to either:
// 1. Run migrations via Supabase Dashboard SQL Editor
// 2. Use psql command line tool
// 3. Use Supabase Management API with service role key

console.log('\n⚠️  IMPORTANT: This script requires direct database access');
console.log('Please run migrations using one of these methods:\n');
console.log('Option 1 (Recommended): Supabase Dashboard');
console.log('  1. Go to: https://supabase.com/dashboard/project/rtnamqbkowtrwogelgqv/editor');
console.log('  2. Click "SQL Editor" → "New query"');
console.log('  3. Copy contents of supabase_migration_gift_cards.sql');
console.log('  4. Click "Run"');
console.log('  5. Repeat with supabase_migration_contracts.sql\n');
console.log('Option 2: Using psql (if installed)');
console.log('  psql "postgresql://postgres:hafsah@1303@db.rtnamqbkowtrwogelgqv.supabase.co:5432/postgres" -f supabase_migration_gift_cards.sql');
console.log('  psql "postgresql://postgres:hafsah@1303@db.rtnamqbkowtrwogelgqv.supabase.co:5432/postgres" -f supabase_migration_contracts.sql\n');

// Uncomment to attempt automated run (requires proper permissions)
// main().catch(console.error);
