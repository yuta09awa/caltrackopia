import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@libsql/client/web';

type Bindings = {
  TURSO_DB_URL: string;
  TURSO_AUTH_TOKEN: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check endpoint
app.get('/health', (c) => {
  const cfRay = c.req.header('cf-ray') || 'local';
  const colo = c.req.header('cf-ray')?.split('-')[1] || 'unknown';
  
  return c.json({
    status: 'ok',
    service: 'nutrimap-api',
    environment: c.env.ENVIRONMENT,
    edge_location: colo,
    cf_ray: cfRay,
    timestamp: new Date().toISOString(),
  });
});

// Turso database connection test
app.get('/db-test', async (c) => {
  try {
    const db = createClient({
      url: c.env.TURSO_DB_URL,
      authToken: c.env.TURSO_AUTH_TOKEN,
    });

    // Simple query to test connection
    const result = await db.execute('SELECT 1 as test, datetime("now") as timestamp');
    
    return c.json({
      success: true,
      message: 'Turso connection successful',
      edge_location: c.req.header('cf-ray')?.split('-')[1] || 'unknown',
      test_query_result: result.rows[0],
      database_url: c.env.TURSO_DB_URL.split('@')[0] + '@***', // Hide sensitive parts
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Turso connection failed',
    }, 500);
  }
});

// Root endpoint
app.get('/', (c) => {
  return c.json({
    service: 'NutriMap Edge API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      database_test: '/db-test',
    },
    docs: 'See README.md for setup instructions',
  });
});

export default app;
