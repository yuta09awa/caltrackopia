
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useCachedPlacesApi } from '../hooks/useCachedPlacesApi';

const CacheStatusIndicator: React.FC = () => {
  const { getCacheStats, cacheHitRate } = useCachedPlacesApi();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getCacheStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load cache stats:', error);
      }
    };

    loadStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [getCacheStats]);

  if (!stats) return null;

  const todayStats = stats.stats?.[0];
  const totalHits = todayStats?.cache_hits || 0;
  const totalMisses = todayStats?.cache_misses || 0;
  const hitRate = totalHits + totalMisses > 0 ? (totalHits / (totalHits + totalMisses)) * 100 : 0;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Badge variant={hitRate > 80 ? "default" : hitRate > 60 ? "secondary" : "destructive"}>
        Cache: {hitRate.toFixed(0)}%
      </Badge>
      {cacheHitRate !== null && (
        <Badge variant="outline">
          Session: {(cacheHitRate * 100).toFixed(0)}%
        </Badge>
      )}
    </div>
  );
};

export default CacheStatusIndicator;
