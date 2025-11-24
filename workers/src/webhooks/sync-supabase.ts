/**
 * Supabase CDC Sync Handler
 * Handles INSERT, UPDATE, DELETE events from Supabase webhooks
 * Translates JSON → SQL → Turso for read-heavy workloads
 */

import { createClient } from '@libsql/client/web';
import type { Env } from '../index';
import { sendAlert } from '../utils/alerts';

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record?: Record<string, any>;
  old_record?: Record<string, any>;
}

export async function handleSupabaseSync(request: Request, env: Env): Promise<Response> {
  // Verify secret key
  const providedKey = request.headers.get('x-service-key');
  if (providedKey !== env.SYNC_SECRET_KEY) {
    console.warn('Unauthorized sync attempt');
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const payload: WebhookPayload = await request.json();
    const { type, table, record, old_record } = payload;

    console.log(`[CDC Sync] ${type} on ${table}`, { id: record?.id || old_record?.id });

    const db = createClient({
      url: env.TURSO_DB_URL,
      authToken: env.TURSO_AUTH_TOKEN
    });

    // Route to table-specific handler
    switch (table) {
      case 'cached_places':
      case 'restaurants':
        await syncRestaurant(db, type, record, old_record);
        break;
      
      case 'suppliers':
        await syncSupplier(db, type, record, old_record);
        break;
      
      case 'supplier_relationships':
        await syncSupplierRelationship(db, type, record, old_record);
        break;
      
      case 'allergen_protocols':
        await syncAllergenProtocol(db, type, record, old_record);
        break;
      
      default:
        console.warn(`[CDC Sync] Unhandled table: ${table}`);
        return new Response('Table not configured for sync', { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, table, type }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[CRITICAL SYNC FAILURE]', error);
    
    // Send alert to Slack/Discord
    await sendAlert(
      env,
      `Sync Failed\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'error'
    );

    // Return 500 to trigger Supabase retry
    return new Response('Sync Failed', { status: 500 });
  }
}

async function syncRestaurant(
  db: ReturnType<typeof createClient>,
  type: string,
  record?: Record<string, any>,
  old_record?: Record<string, any>
) {
  if (type === 'DELETE') {
    await db.execute({
      sql: 'DELETE FROM restaurants WHERE id = ?',
      args: [old_record!.id]
    });
    return;
  }

  const r = record!;
  await db.execute({
    sql: `
      INSERT INTO restaurants (
        id, name, formatted_address, latitude, longitude, 
        primary_type, place_types, rating, price_level, 
        phone_number, website, photo_references, 
        is_open_now, has_supply_chain_data, place_id,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        formatted_address = excluded.formatted_address,
        latitude = excluded.latitude,
        longitude = excluded.longitude,
        primary_type = excluded.primary_type,
        place_types = excluded.place_types,
        rating = excluded.rating,
        price_level = excluded.price_level,
        phone_number = excluded.phone_number,
        website = excluded.website,
        photo_references = excluded.photo_references,
        is_open_now = excluded.is_open_now,
        has_supply_chain_data = excluded.has_supply_chain_data,
        updated_at = datetime('now')
    `,
    args: [
      r.id || r.place_id,
      r.name,
      r.formatted_address,
      r.latitude,
      r.longitude,
      r.primary_type,
      JSON.stringify(r.place_types || []),
      r.rating,
      r.price_level,
      r.phone_number,
      r.website,
      JSON.stringify(r.photo_references || []),
      r.is_open_now ? 1 : 0,
      r.has_supply_chain_data ? 1 : 0,
      r.place_id || r.id,
      r.created_at || r.first_cached_at || new Date().toISOString(),
      r.updated_at || r.last_updated_at || new Date().toISOString()
    ]
  });

  console.log(`[CDC] Synced restaurant: ${r.id || r.place_id}`);
}

async function syncSupplier(
  db: ReturnType<typeof createClient>,
  type: string,
  record?: Record<string, any>,
  old_record?: Record<string, any>
) {
  if (type === 'DELETE') {
    await db.execute({
      sql: 'DELETE FROM suppliers WHERE id = ?',
      args: [old_record!.id]
    });
    return;
  }

  const s = record!;
  await db.execute({
    sql: `
      INSERT INTO suppliers (
        id, name, supplier_type, contact_email, contact_phone,
        address, city, state, zip_code, certifications,
        specialty_items, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        supplier_type = excluded.supplier_type,
        contact_email = excluded.contact_email,
        contact_phone = excluded.contact_phone,
        address = excluded.address,
        city = excluded.city,
        state = excluded.state,
        zip_code = excluded.zip_code,
        certifications = excluded.certifications,
        specialty_items = excluded.specialty_items,
        updated_at = datetime('now')
    `,
    args: [
      s.id,
      s.name,
      s.supplier_type,
      s.contact_email,
      s.contact_phone,
      s.address,
      s.city,
      s.state,
      s.zip_code,
      JSON.stringify(s.certifications || []),
      JSON.stringify(s.specialty_items || []),
      s.created_at || new Date().toISOString(),
      s.updated_at || new Date().toISOString()
    ]
  });

  console.log(`[CDC] Synced supplier: ${s.id}`);
}

async function syncSupplierRelationship(
  db: ReturnType<typeof createClient>,
  type: string,
  record?: Record<string, any>,
  old_record?: Record<string, any>
) {
  if (type === 'DELETE') {
    await db.execute({
      sql: 'DELETE FROM supplier_relationships WHERE id = ?',
      args: [old_record!.id]
    });
    return;
  }

  const sr = record!;
  await db.execute({
    sql: `
      INSERT INTO supplier_relationships (
        id, restaurant_id, supplier_id, relationship_type,
        start_date, is_active, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        relationship_type = excluded.relationship_type,
        is_active = excluded.is_active
    `,
    args: [
      sr.id,
      sr.restaurant_id,
      sr.supplier_id,
      sr.relationship_type,
      sr.start_date,
      sr.is_active ? 1 : 0,
      sr.created_at || new Date().toISOString()
    ]
  });

  console.log(`[CDC] Synced supplier relationship: ${sr.id}`);
}

async function syncAllergenProtocol(
  db: ReturnType<typeof createClient>,
  type: string,
  record?: Record<string, any>,
  old_record?: Record<string, any>
) {
  if (type === 'DELETE') {
    await db.execute({
      sql: 'DELETE FROM allergen_protocols WHERE id = ?',
      args: [old_record!.id]
    });
    return;
  }

  const ap = record!;
  await db.execute({
    sql: `
      INSERT INTO allergen_protocols (
        id, restaurant_id, allergen, cross_contamination_risk,
        protocol_description, last_updated, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        cross_contamination_risk = excluded.cross_contamination_risk,
        protocol_description = excluded.protocol_description,
        last_updated = excluded.last_updated
    `,
    args: [
      ap.id,
      ap.restaurant_id,
      ap.allergen,
      ap.cross_contamination_risk,
      ap.protocol_description,
      ap.last_updated || new Date().toISOString(),
      ap.created_at || new Date().toISOString()
    ]
  });

  console.log(`[CDC] Synced allergen protocol: ${ap.id}`);
}
