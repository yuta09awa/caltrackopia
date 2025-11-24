/**
 * Disclaimer Acceptance Endpoint
 * Records legal disclaimer acceptances with geo-location for GDPR compliance
 */

import { createClient } from '@libsql/client/web';
import type { Env } from '../index';

interface DisclaimerRequest {
  user_id: string;
  disclaimer_type: string;
  disclaimer_version: string;
  page_url?: string;
}

export async function handleDisclaimerAcceptance(request: Request, env: Env): Promise<Response> {
  try {
    const body: DisclaimerRequest = await request.json();
    const { user_id, disclaimer_type, disclaimer_version, page_url } = body;

    // Validate required fields
    if (!user_id || !disclaimer_type || !disclaimer_version) {
      return new Response(JSON.stringify({
        error: 'Missing required fields',
        required: ['user_id', 'disclaimer_type', 'disclaimer_version']
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract Cloudflare geo data (GDPR compliance)
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const country = request.headers.get('CF-IPCountry') || 'unknown';
    const region = request.headers.get('CF-Region') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || 'unknown';

    const db = createClient({
      url: env.TURSO_DB_URL,
      authToken: env.TURSO_AUTH_TOKEN
    });

    // Generate ID (SQLite equivalent of gen_random_uuid)
    const id = crypto.randomUUID();

    await db.execute({
      sql: `
        INSERT INTO user_disclaimer_acceptances (
          id, user_id, disclaimer_type, disclaimer_version,
          ip_address, user_agent, country, region, page_url,
          accepted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `,
      args: [
        id,
        user_id,
        disclaimer_type,
        disclaimer_version,
        ip,
        userAgent,
        country,
        region,
        page_url || ''
      ]
    });

    console.log(`[Disclaimer] Recorded: ${disclaimer_type} v${disclaimer_version} for user ${user_id} (${country})`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Disclaimer acceptance recorded',
      id,
      edge_location: request.headers.get('cf-ray') || 'unknown',
      country
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Disclaimer] Error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to record disclaimer acceptance',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
