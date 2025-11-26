import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/ui/Container";
import { Activity, Database, Gauge, Globe } from "lucide-react";
import {
  MetricsCard,
  ResponseTimeChart,
  CacheHitRateGauge,
  SyncStatusTable,
  QuotaProgressCard,
  RegionPerformanceTable,
  useEdgeMetrics,
  useSyncStatus,
  useQuotaUsage,
} from "@/features/admin";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: edgeMetrics, isLoading: metricsLoading } = useEdgeMetrics();
  const { data: syncEvents, isLoading: syncLoading } = useSyncStatus();
  const { data: quotaData, isLoading: quotaLoading } = useQuotaUsage();

  const isLoading = metricsLoading || syncLoading || quotaLoading;

  // Mock response time data for chart
  const mockResponseTimeData = [
    { timestamp: "00:00", p50: 45, p95: 120, p99: 180 },
    { timestamp: "04:00", p50: 38, p95: 110, p99: 165 },
    { timestamp: "08:00", p50: 52, p95: 145, p99: 210 },
    { timestamp: "12:00", p50: 68, p95: 180, p99: 250 },
    { timestamp: "16:00", p50: 55, p95: 150, p99: 195 },
    { timestamp: "20:00", p50: 42, p95: 125, p99: 175 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor edge API performance, cache metrics, and system health
          </p>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Sync Status
            </TabsTrigger>
            <TabsTrigger value="quotas" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              API Quotas
            </TabsTrigger>
            <TabsTrigger value="regions" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Regions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricsCard
                title="Avg Response Time"
                value={`${edgeMetrics?.performance.avg_response_ms.toFixed(0) || 0}ms`}
                subtitle="Last 24 hours"
                trend="down"
                trendValue="12% faster"
                icon={<Activity className="h-4 w-4" />}
              />
              <MetricsCard
                title="Requests/Min"
                value={edgeMetrics?.performance.requests_per_minute.toFixed(0) || 0}
                subtitle="Current rate"
                trend="up"
                trendValue="+8%"
              />
              <MetricsCard
                title="Cache Hit Rate"
                value={`${edgeMetrics?.cache.hit_rate.toFixed(1) || 0}%`}
                subtitle="Total efficiency"
                trend="up"
                trendValue="+2.3%"
              />
              <MetricsCard
                title="Uptime"
                value={edgeMetrics?.health.status || "healthy"}
                subtitle={`${((edgeMetrics?.health.uptime_ms || 0) / 3600000).toFixed(1)}h`}
                trend="neutral"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <ResponseTimeChart data={mockResponseTimeData} />
              <CacheHitRateGauge hitRate={edgeMetrics?.cache.hit_rate || 0} />
            </div>
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <MetricsCard
                title="Last Sync"
                value={
                  edgeMetrics?.sync.last_sync_at
                    ? new Date(edgeMetrics.sync.last_sync_at).toLocaleTimeString()
                    : "Never"
                }
                subtitle="Latest synchronization"
              />
              <MetricsCard
                title="Pending"
                value={edgeMetrics?.sync.pending_count || 0}
                subtitle="Awaiting sync"
              />
              <MetricsCard
                title="Failed"
                value={edgeMetrics?.sync.failed_count || 0}
                subtitle="Requires attention"
                trend={edgeMetrics?.sync.failed_count ? "down" : "neutral"}
              />
            </div>

            <SyncStatusTable events={syncEvents || []} />
          </TabsContent>

          <TabsContent value="quotas" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quotaData?.map((quota) => (
                <QuotaProgressCard
                  key={quota.service_name}
                  service={quota.service_name}
                  used={quota.quota_used}
                  limit={quota.quota_limit}
                  resetAt={quota.quota_reset_at}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="regions" className="space-y-6">
            <RegionPerformanceTable
              data={
                edgeMetrics?.regions.map((r) => ({
                  region: r.region,
                  requests: r.requests,
                  avgLatency: r.avg_latency_ms,
                  p95Latency: r.avg_latency_ms * 1.5, // Mock P95
                })) || []
              }
            />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
