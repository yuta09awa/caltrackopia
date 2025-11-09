import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Database, HardDrive, Cpu } from 'lucide-react';
import { locationService } from '@/services/locationService';
import { useCacheMetrics } from '@/features/map/hooks/useCacheMetrics';

interface CacheMetricsPanelProps {
  className?: string;
}

export const CacheMetricsPanel: React.FC<CacheMetricsPanelProps> = ({ className }) => {
  const { metrics, resetMetrics, getMetricsSummary } = useCacheMetrics();
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStats = async () => {
    setIsRefreshing(true);
    try {
      const stats = await locationService.getCacheStats();
      setCacheStats(stats);
    } catch (error) {
      console.error('Error fetching cache stats:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearAllCaches = async () => {
    if (confirm('Clear all map caches? This will remove all cached location data.')) {
      await locationService.clearAllCaches();
      resetMetrics();
      await refreshStats();
    }
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const summary = getMetricsSummary();
  const hitRate = metrics.hitRate ? (metrics.hitRate * 100).toFixed(1) : '0.0';

  return (
    <Card className={`w-full bg-card/95 backdrop-blur ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4" />
            Cache Performance
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={refreshStats}
              disabled={isRefreshing}
              className="h-7 px-2"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearAllCaches}
              className="h-7 px-2"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {/* Hit Rate */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Cache Hit Rate</span>
          <Badge 
            variant={Number(hitRate) > 70 ? 'default' : Number(hitRate) > 40 ? 'secondary' : 'destructive'}
            className="font-mono"
          >
            {hitRate}%
          </Badge>
        </div>

        {/* Query Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
          <div className="text-center">
            <div className="text-muted-foreground mb-1">Total</div>
            <div className="font-mono font-semibold">{metrics.totalQueries}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground mb-1">Hits</div>
            <div className="font-mono font-semibold text-green-600 dark:text-green-400">
              {metrics.cacheHits}
            </div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground mb-1">Misses</div>
            <div className="font-mono font-semibold text-amber-600 dark:text-amber-400">
              {metrics.cacheMisses}
            </div>
          </div>
        </div>

        {/* Cache Layers */}
        {cacheStats && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Cpu className="h-3 w-3" />
                L1 Memory
              </span>
              <span className="font-mono">{cacheStats.memory.locationCacheSize} entries</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <HardDrive className="h-3 w-3" />
                L2 IndexedDB
              </span>
              <span className="font-mono">{cacheStats.indexedDB.indexedDBSize} entries</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Database className="h-3 w-3" />
                Total Cached
              </span>
              <span className="font-mono font-semibold">
                {cacheStats.total.entriesAcrossAllLayers} entries
              </span>
            </div>
          </div>
        )}

        {/* Session Info */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-muted-foreground">Session Duration</span>
          <span className="font-mono">
            {Math.floor(summary.sessionDurationMs / 60000)}m {Math.floor((summary.sessionDurationMs % 60000) / 1000)}s
          </span>
        </div>

        {/* API Calls Saved */}
        {metrics.cacheHits > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">API Calls Saved</span>
            <Badge variant="outline" className="font-mono">
              ~{metrics.cacheHits} calls
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
