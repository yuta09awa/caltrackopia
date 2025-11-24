/**
 * One-Time Data Migration Script
 * Copies restaurants from Supabase to Turso
 * 
 * Usage: 
 *   npm install @supabase/supabase-js
 *   npx tsx workers/scripts/migrate-restaurants.ts
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createTursoClient } from '@libsql/client';

// Configuration - Set these via environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://aulfiflberencgsdvyay.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';
const TURSO_URL = process.env.TURSO_DB_URL || '';
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || '';

const BATCH_SIZE = 100; // Process 100 restaurants at a time

async function migrateRestaurants() {
  console.log('🚀 Starting migration from Supabase to Turso...\n');

  const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_KEY);
  const turso = createTursoClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

  let offset = 0;
  let totalMigrated = 0;

  while (true) {
    console.log(`📦 Fetching batch at offset ${offset}...`);

    const { data: restaurants, error } = await supabase
      .from('cached_places')
      .select('*')
      .range(offset, offset + BATCH_SIZE - 1);

    if (error) {
      console.error('❌ Supabase fetch error:', error);
      break;
    }

    if (!restaurants || restaurants.length === 0) {
      console.log('✅ No more restaurants to migrate');
      break;
    }

    console.log(`   Found ${restaurants.length} restaurants`);

    for (const restaurant of restaurants) {
      try {
        await turso.execute({
          sql: `
            INSERT INTO restaurants (
              id, place_id, name, formatted_address, latitude, longitude, 
              primary_type, place_types, rating, price_level, 
              phone_number, website, photo_references, 
              is_open_now, has_supply_chain_data, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET 
              name = excluded.name,
              formatted_address = excluded.formatted_address,
              rating = excluded.rating,
              updated_at = datetime('now')
          `,
          args: [
            restaurant.id,
            restaurant.place_id,
            restaurant.name,
            restaurant.formatted_address,
            restaurant.latitude,
            restaurant.longitude,
            restaurant.primary_type,
            JSON.stringify(restaurant.place_types || []),
            restaurant.rating,
            restaurant.price_level,
            restaurant.phone_number,
            restaurant.website,
            JSON.stringify(restaurant.photo_references || []),
            restaurant.is_open_now ? 1 : 0,
            0, // has_supply_chain_data - default false
            restaurant.first_cached_at || new Date().toISOString(),
            restaurant.last_updated_at || new Date().toISOString()
          ]
        });

        totalMigrated++;
      } catch (err) {
        console.error(`   ⚠️  Failed to migrate ${restaurant.id}:`, err);
      }
    }

    console.log(`   ✓ Migrated ${restaurants.length} restaurants\n`);

    offset += BATCH_SIZE;

    // Safety check - don't run forever
    if (offset > 10000) {
      console.warn('⚠️  Reached 10,000 restaurants limit. Stopping migration.');
      break;
    }
  }

  console.log(`\n🎉 Migration complete! Total migrated: ${totalMigrated} restaurants`);
  console.log('\n📊 Next steps:');
  console.log('   1. Configure Supabase webhooks to keep data in sync');
  console.log('   2. Test restaurant search: curl "https://your-worker.workers.dev/api/restaurants/search?q=pizza"');
  console.log('   3. Update frontend to use EdgeAPIClient');
}

// Run migration
migrateRestaurants().catch(console.error);
