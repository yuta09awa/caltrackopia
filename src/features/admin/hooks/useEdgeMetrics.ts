import { useQuery } from "@tanstack/react-query";
import { EdgeAPIClient } from "@/lib/edge-api-client";

const edgeApiClient = new EdgeAPIClient();

export interface EdgeMetrics {
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

export function useEdgeMetrics() {
  return useQuery<EdgeMetrics>({
    queryKey: ["edge-metrics"],
    queryFn: async () => {
      const response = await edgeApiClient.get("/api/metrics");
      return response;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
