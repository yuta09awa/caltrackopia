
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

  return (
    <div className="flex items-center gap-2 text-sm">
      {cacheHitRate !== null && (
        <Badge variant="outline">
          Session: {(cacheHitRate * 100).toFixed(0)}%
        </Badge>
      )}
    </div>
  );
};

export default CacheStatusIndicator;
