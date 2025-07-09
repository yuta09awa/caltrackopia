// ============= PERFORMANCE UTILITIES =============

import React from 'react';
import { PerformanceMetrics } from '@/types';

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = [];
  private static maxMetrics = 1000;

  static recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only the latest metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  static getMetrics(componentName?: string): PerformanceMetrics[] {
    if (componentName) {
      return this.metrics.filter(m => m.componentName === componentName);
    }
    return [...this.metrics];
  }

  static getAverageRenderTime(componentName: string): number {
    const componentMetrics = this.getMetrics(componentName);
    if (componentMetrics.length === 0) return 0;
    
    const total = componentMetrics.reduce((sum, m) => sum + m.renderTime, 0);
    return total / componentMetrics.length;
  }

  static getSlowRenders(threshold: number = 16): PerformanceMetrics[] {
    return this.metrics.filter(m => m.renderTime > threshold);
  }

  static clearMetrics() {
    this.metrics = [];
  }

  static generateReport(): {
    totalComponents: number;
    averageRenderTime: number;
    slowRenders: number;
    topSlowComponents: Array<{ name: string; avgTime: number; count: number }>;
  } {
    const componentStats = new Map<string, { times: number[]; count: number }>();
    
    this.metrics.forEach(metric => {
      const stats = componentStats.get(metric.componentName) || { times: [], count: 0 };
      stats.times.push(metric.renderTime);
      stats.count++;
      componentStats.set(metric.componentName, stats);
    });

    const totalRenderTime = this.metrics.reduce((sum, m) => sum + m.renderTime, 0);
    const averageRenderTime = this.metrics.length > 0 ? totalRenderTime / this.metrics.length : 0;
    const slowRenders = this.getSlowRenders().length;

    const topSlowComponents = Array.from(componentStats.entries())
      .map(([name, stats]) => ({
        name,
        avgTime: stats.times.reduce((a, b) => a + b, 0) / stats.times.length,
        count: stats.count,
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 10);

    return {
      totalComponents: componentStats.size,
      averageRenderTime,
      slowRenders,
      topSlowComponents,
    };
  }
}

/**
 * Component render timer decorator
 */
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const ComponentWithPerformanceMonitoring = React.forwardRef<any, P>((props, ref) => {
    const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
    const startTimeRef = React.useRef<number>();

    React.useLayoutEffect(() => {
      startTimeRef.current = performance.now();
    });

    React.useLayoutEffect(() => {
      if (startTimeRef.current) {
        const renderTime = performance.now() - startTimeRef.current;
        PerformanceMonitor.recordMetric({
          componentName: name,
          renderTime,
          props: props as any,
          timestamp: new Date(),
        });
      }
    });

    return <WrappedComponent ref={ref} {...props} />;
  });

  ComponentWithPerformanceMonitoring.displayName = `withPerformanceMonitoring(${name})`;
  
  return ComponentWithPerformanceMonitoring;
}

/**
 * Bundle size analysis utilities
 */
export class BundleAnalyzer {
  private static imports = new Map<string, number>();

  static recordImport(moduleName: string, size?: number) {
    const currentCount = this.imports.get(moduleName) || 0;
    this.imports.set(moduleName, currentCount + 1);
  }

  static getImportStats(): Array<{ module: string; count: number }> {
    return Array.from(this.imports.entries())
      .map(([module, count]) => ({ module, count }))
      .sort((a, b) => b.count - a.count);
  }

  static getMostImported(limit: number = 10): Array<{ module: string; count: number }> {
    return this.getImportStats().slice(0, limit);
  }

  static clearStats() {
    this.imports.clear();
  }
}

/**
 * Memory usage monitoring
 */
export class MemoryMonitor {
  static getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
        percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100),
      };
    }
    return null;
  }

  static startMonitoring(interval: number = 5000): () => void {
    const intervalId = setInterval(() => {
      const usage = this.getMemoryUsage();
      if (usage && usage.percentage > 80) {
        console.warn(`High memory usage detected: ${usage.percentage}% (${usage.used}MB/${usage.total}MB)`);
      }
    }, interval);

    return () => clearInterval(intervalId);
  }
}

/**
 * Network performance monitoring
 */
export class NetworkMonitor {
  private static requests = new Map<string, { count: number; totalTime: number; errors: number }>();

  static recordRequest(url: string, duration: number, success: boolean = true) {
    const stats = this.requests.get(url) || { count: 0, totalTime: 0, errors: 0 };
    stats.count++;
    stats.totalTime += duration;
    if (!success) stats.errors++;
    this.requests.set(url, stats);
  }

  static getRequestStats(): Array<{\
    url: string;
    count: number;
    averageTime: number;
    errorRate: number;
  }> {
    return Array.from(this.requests.entries()).map(([url, stats]) => ({
      url,
      count: stats.count,
      averageTime: stats.count > 0 ? stats.totalTime / stats.count : 0,
      errorRate: stats.count > 0 ? (stats.errors / stats.count) * 100 : 0,
    }));
  }

  static getSlowestRequests(limit: number = 10): Array<{\
    url: string;
    averageTime: number;
  }> {
    return this.getRequestStats()
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, limit);
  }

  static clearStats() {
    this.requests.clear();
  }
}

/**
 * React DevTools performance utilities
 */
export const DevTools = {
  /**
   * Highlight component renders
   */
  enableRenderHighlighting: () => {
    if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (hook.renderers && hook.renderers.size > 0) {
        hook.renderers.forEach((renderer: any) => {
          if (renderer.setTraceUpdatesEnabled) {
            renderer.setTraceUpdatesEnabled(true);
          }
        });
      }
    }
  },

  /**
   * Get React performance data
   */
  getReactPerformanceData: () => {
    if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      return hook.reactCurrentDispatcher?.current;
    }
    return null;
  },
};

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
  }
}
