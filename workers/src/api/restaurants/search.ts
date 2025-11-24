/**
 * Restaurant Search Endpoint
 * Global edge search with FTS5, geolocation, and allergen filtering
 */

import { createClient } from '@libsql/client/web';
import type { Env } from '../../index';

export async function searchRestaurants(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  const lat = parseFloat(url.searchParams.get('lat') || '0');
  const lng = parseFloat(url.searchParams.get('lng') || '0');
  const radius = parseInt(url.searchParams.get('radius') || '5000');
  const cuisine = url.searchParams.get('cuisine');
  const priceLevel = url.searchParams.get('priceLevel');
  const allergens = url.searchParams.getAll('allergen');

  try {
    const db = createClient({
      url: env.TURSO_DB_URL,
      authToken: env.TURSO_AUTH_TOKEN
    });

    // Build SQL query
    let sql = `
      SELECT 
        r.*,
        (
          (r.latitude - ?) * (r.latitude - ?) * 12321 +
          (r.longitude - ?) * (r.longitude - ?) * 12321 * 
          (0.5 + 0.5 * cos(r.latitude * 0.0174533))
        ) AS distance_meters
      FROM restaurants r
    `;

    const conditions: string[] = [];
    const args: any[] = [lat, lat, lng, lng];

    // Full-text search
    if (q) {
      conditions.push(`r.rowid IN (SELECT rowid FROM restaurants_fts WHERE restaurants_fts MATCH ?)`);
      args.push(q);
    }

    // Distance filter
    if (lat !== 0 && lng !== 0) {
      conditions.push(`distance_meters <= ?`);
      args.push(radius);
    }

    // Cuisine filter
    if (cuisine) {
      conditions.push(`r.place_types LIKE ?`);
      args.push(`%${cuisine}%`);
    }

    // Price level filter
    if (priceLevel) {
      conditions.push(`r.price_level = ?`);
      args.push(parseInt(priceLevel));
    }

    // Allergen filtering - restaurants must have safe protocols
    if (allergens.length > 0) {
      const allergenPlaceholders = allergens.map(() => '?').join(',');
      conditions.push(`
        EXISTS (
          SELECT 1 FROM allergen_protocols ap
          WHERE ap.restaurant_id = r.id
          AND ap.allergen IN (${allergenPlaceholders})
          AND ap.cross_contamination_risk = 'low'
        )
      `);
      args.push(...allergens);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` ORDER BY distance_meters ASC LIMIT 50`;

    const result = await db.execute({ sql, args });

    // Parse JSON fields
    const restaurants = result.rows.map((row: any) => ({
      ...row,
      place_types: row.place_types ? JSON.parse(row.place_types) : [],
      photo_references: row.photo_references ? JSON.parse(row.photo_references) : [],
      is_open_now: row.is_open_now === 1,
      has_supply_chain_data: row.has_supply_chain_data === 1,
      distance_meters: Math.round(row.distance_meters)
    }));

    return new Response(JSON.stringify({
      restaurants,
      count: restaurants.length,
      query: { q, lat, lng, radius, cuisine, priceLevel, allergens }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300' // Cache at edge for 5 min
      }
    });

  } catch (error) {
    console.error('[Restaurant Search] Error:', error);
    return new Response(JSON.stringify({
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
