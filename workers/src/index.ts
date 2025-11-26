import { handleSupabaseSync } from './webhooks/sync-supabase';
import { searchRestaurants } from './api/restaurants/search';
import { handleDisclaimerAcceptance } from './api/disclaimer';
import { handleMetrics } from './api/metrics';

export interface Env {
  TURSO_DB_URL: string;
  TURSO_AUTH_TOKEN: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SYNC_SECRET_KEY: string;
  SLACK_WEBHOOK_URL?: string;
  ENVIRONMENT: string;
}

// CORS Headers - Allow frontend to communicate with API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-service-key, Authorization',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route: Webhook Sync (Protected by Secret Key)
      if (url.pathname === '/webhooks/sync' && request.method === 'POST') {
        return handleSupabaseSync(request, env);
      }

      // Route: Restaurant Search (Public Read-Only)
      if (url.pathname === '/api/restaurants/search' && request.method === 'GET') {
        const response = await searchRestaurants(request, env);
        return addCors(response);
      }

      // Route: Disclaimer Acceptance (Edge Write)
      if (url.pathname === '/api/disclaimer' && request.method === 'POST') {
        const response = await handleDisclaimerAcceptance(request, env);
        return addCors(response);
      }

      // Route: Metrics (Admin endpoint)
      if (url.pathname === '/api/metrics' && request.method === 'GET') {
        const response = await handleMetrics(env);
        return addCors(response);
      }

      // Route: Health Check
      if (url.pathname === '/health') {
        return addCors(new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          environment: env.ENVIRONMENT || 'production',
          edge_location: request.headers.get('cf-ray') || 'unknown'
        }), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      // Route: Root
      if (url.pathname === '/') {
        return addCors(new Response(JSON.stringify({
          message: 'NutriMap Edge API',
          version: '1.0.0',
          endpoints: {
            health: '/health',
            search: '/api/restaurants/search',
            disclaimer: '/api/disclaimer',
            sync: '/webhooks/sync (protected)'
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });

    } catch (err) {
      console.error('Global error handler:', err);
      return new Response(JSON.stringify({ 
        error: err instanceof Error ? err.message : 'Internal server error'
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
  }
};

// Helper to attach CORS headers to any response
function addCors(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => newHeaders.set(key, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
