import { Env } from '../index';

interface MetricsResponse {
  health: {
    status: string;
    uptime_ms: number;
  };
  cache: {
    hit_rate: number;
    total_queries: number;
    cached_restaurants: number;
  };
  sync: {
    last_sync_at: string | null;
    pending_count: number;
    failed_count: number;
  };
  performance: {
    avg_response_ms: number;
    p95_response_ms: number;
    requests_per_minute: number;
  };
  regions: Array<{
    region: string;
    requests: number;
    avg_latency_ms: number;
  }>;
}

export async function handleMetrics(env: Env): Promise<Response> {
  try {
    const db = env.DB;
    
    // Get cache statistics
    const cacheStats = await db
      .prepare('SELECT COUNT(*) as total FROM restaurants')
      .first();
    
    // Mock metrics data (in production, this would come from actual tracking)
    const metrics: MetricsResponse = {
      health: {
        status: 'healthy',
        uptime_ms: Date.now() - (Date.now() - 3600000), // Mock 1 hour uptime
      },
      cache: {
        hit_rate: 85.5,
        total_queries: 15234,
        cached_restaurants: cacheStats?.total || 0,
      },
      sync: {
        last_sync_at: new Date().toISOString(),
        pending_count: 0,
        failed_count: 0,
      },
      performance: {
        avg_response_ms: 45,
        p95_response_ms: 120,
        requests_per_minute: 250,
      },
      regions: [
        { region: 'IAD', requests: 5234, avg_latency_ms: 42 },
        { region: 'SFO', requests: 4123, avg_latency_ms: 38 },
        { region: 'LHR', requests: 3456, avg_latency_ms: 55 },
        { region: 'SYD', requests: 2421, avg_latency_ms: 68 },
      ],
    };

    return new Response(JSON.stringify(metrics), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Metrics error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch metrics' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
