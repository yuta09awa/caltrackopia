import { useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '@/store/appStore';

interface CartEvent {
  type: 'item_added' | 'item_removed' | 'quantity_changed' | 'cart_cleared' | 'checkout_started' | 'cart_state_changed';
  data: any;
  timestamp: number;
  sessionId: string;
}

interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: number;
}

export const useCartAnalytics = () => {
  const { items, total, itemCount } = useAppStore();
  const sessionId = useRef(crypto.randomUUID());
  const performanceMetrics = useRef<PerformanceMetric[]>([]);

  const trackEvent = useCallback((type: CartEvent['type'], data: any) => {
    const event: CartEvent = {
      type,
      data,
      timestamp: Date.now(),
      sessionId: sessionId.current
    };

    // Store locally for development/debugging
    const events = JSON.parse(localStorage.getItem('cart-analytics') || '[]');
    events.push(event);
    localStorage.setItem('cart-analytics', JSON.stringify(events.slice(-100))); // Keep last 100 events

    console.log('Cart Analytics Event:', event);

    // In production, send to analytics service
    // analytics.track(event);
  }, []);

  const trackPerformance = useCallback((operation: string, startTime: number) => {
    const duration = performance.now() - startTime;
    const metric: PerformanceMetric = {
      operation,
      duration,
      timestamp: Date.now()
    };

    performanceMetrics.current.push(metric);
    
    // Log slow operations
    if (duration > 100) {
      console.warn(`Slow cart operation: ${operation} took ${duration.toFixed(2)}ms`);
    }

    // Keep only recent metrics
    if (performanceMetrics.current.length > 50) {
      performanceMetrics.current = performanceMetrics.current.slice(-50);
    }
  }, []);

  const getPerformanceReport = useCallback(() => {
    const metrics = performanceMetrics.current;
    const report = {
      averageOperationTime: metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length || 0,
      slowestOperation: metrics.reduce((prev, curr) => prev.duration > curr.duration ? prev : curr, metrics[0]),
      totalOperations: metrics.length,
      operationBreakdown: metrics.reduce((acc, metric) => {
        acc[metric.operation] = (acc[metric.operation] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return report;
  }, []);

  // Track cart state changes
  useEffect(() => {
    const cartData = {
      itemCount,
      total,
      locations: new Set(items.map(item => item.locationId)).size
    };

    trackEvent('cart_state_changed', cartData);
  }, [items, total, itemCount, trackEvent]);

  const measureOperation = useCallback(<T extends any[], R>(
    operation: string,
    fn: (...args: T) => R
  ) => {
    return (...args: T): R => {
      const startTime = performance.now();
      const result = fn(...args);
      trackPerformance(operation, startTime);
      return result;
    };
  }, [trackPerformance]);

  return {
    trackEvent,
    trackPerformance,
    measureOperation,
    getPerformanceReport,
    sessionId: sessionId.current
  };
};
