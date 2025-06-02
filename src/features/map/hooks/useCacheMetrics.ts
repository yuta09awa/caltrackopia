
import { useState, useCallback, useRef } from 'react';

export interface CacheMetrics {
  hitRate: number | null;
  totalQueries: number;
  cacheHits: number;
  cacheMisses: number;
  sessionStartTime: number;
}

export const useCacheMetrics = () => {
  const [metrics, setMetrics] = useState<CacheMetrics>({
    hitRate: null,
    totalQueries: 0,
    cacheHits: 0,
    cacheMisses: 0,
    sessionStartTime: Date.now()
  });

  const recordCacheHit = useCallback(() => {
    setMetrics(prev => {
      const newCacheHits = prev.cacheHits + 1;
      const newTotal = prev.totalQueries + 1;
      
      return {
        ...prev,
        cacheHits: newCacheHits,
        totalQueries: newTotal,
        hitRate: newCacheHits / newTotal
      };
    });
  }, []);

  const recordCacheMiss = useCallback(() => {
    setMetrics(prev => {
      const newCacheMisses = prev.cacheMisses + 1;
      const newTotal = prev.totalQueries + 1;
      
      return {
        ...prev,
        cacheMisses: newCacheMisses,
        totalQueries: newTotal,
        hitRate: prev.cacheHits / newTotal
      };
    });
  }, []);

  const recordCacheResult = useCallback((wasHit: boolean) => {
    if (wasHit) {
      recordCacheHit();
    } else {
      recordCacheMiss();
    }
  }, [recordCacheHit, recordCacheMiss]);

  const resetMetrics = useCallback(() => {
    setMetrics({
      hitRate: null,
      totalQueries: 0,
      cacheHits: 0,
      cacheMisses: 0,
      sessionStartTime: Date.now()
    });
  }, []);

  const getSessionDuration = useCallback(() => {
    return Date.now() - metrics.sessionStartTime;
  }, [metrics.sessionStartTime]);

  const getMetricsSummary = useCallback(() => {
    const sessionDuration = getSessionDuration();
    const queriesPerMinute = metrics.totalQueries / (sessionDuration / 60000);
    
    return {
      ...metrics,
      sessionDurationMs: sessionDuration,
      queriesPerMinute: queriesPerMinute,
      efficiency: metrics.hitRate ? `${(metrics.hitRate * 100).toFixed(1)}%` : 'N/A'
    };
  }, [metrics, getSessionDuration]);

  return {
    metrics,
    recordCacheHit,
    recordCacheMiss,
    recordCacheResult,
    resetMetrics,
    getSessionDuration,
    getMetricsSummary
  };
};
