import { useEffect, useRef, useCallback } from 'react';
import { logger } from '@/services/logging/LoggingService';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
  props?: any;
  rerenderCount: number;
}

interface UsePerformanceMonitorOptions {
  enabled?: boolean;
  threshold?: number; // ms - log slow renders above this threshold
  trackRerenders?: boolean;
  trackProps?: boolean;
}

export const usePerformanceMonitor = (
  componentName: string,
  options: UsePerformanceMonitorOptions = {}
) => {
  const {
    enabled = process.env.NODE_ENV === 'development',
    threshold = 16, // 60fps threshold
    trackRerenders = true,
    trackProps = false
  } = options;

  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const lastProps = useRef<any>(null);
  const mountTime = useRef<number>(Date.now());

  // Start timing before render
  if (enabled) {
    renderStartTime.current = performance.now();
  }

  useEffect(() => {
    if (!enabled) return;

    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    renderCount.current += 1;

    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now(),
      rerenderCount: renderCount.current
    };

    // Log slow renders
    if (renderTime > threshold) {
      logger.warn(`Slow render detected in ${componentName}`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        threshold: `${threshold}ms`,
        rerenderCount: renderCount.current,
        rendersSinceMount: renderCount.current,
        timeSinceMount: `${Date.now() - mountTime.current}ms`
      });
    }

    // Log rerender information
    if (trackRerenders && renderCount.current > 1) {
      logger.debug(`Component rerender: ${componentName}`, {
        rerenderCount: renderCount.current,
        renderTime: `${renderTime.toFixed(2)}ms`
      });
    }

    // Performance mark for devtools
    if (window.performance && 'mark' in window.performance) {
      const markName = `${componentName}-render-${renderCount.current}`;
      window.performance.mark(markName);
      
      // Measure from mount
      if (renderCount.current === 1) {
        window.performance.mark(`${componentName}-mount`);
      } else {
        try {
          window.performance.measure(
            `${componentName}-total-time`,
            `${componentName}-mount`,
            markName
          );
        } catch (error) {
          // Ignore measurement errors
        }
      }
    }
  });

  const markInteraction = useCallback((interactionName: string, duration?: number) => {
    if (!enabled) return;

    const interactionTime = duration || (performance.now() - renderStartTime.current);
    
    logger.performance(`${componentName}: ${interactionName}`, interactionTime, {
      componentName,
      interactionName,
      renderCount: renderCount.current
    });

    if (window.performance && 'mark' in window.performance) {
      window.performance.mark(`${componentName}-${interactionName}`);
    }
  }, [componentName, enabled]);

  const measureAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    if (!enabled) return operation();

    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      logger.performance(`${componentName}: ${operationName}`, duration, {
        componentName,
        operationName,
        success: true
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      logger.error(`${componentName}: ${operationName} failed`, error as Error, {
        componentName,
        operationName,
        duration,
        success: false
      });

      throw error;
    }
  }, [componentName, enabled]);

  return {
    renderCount: renderCount.current,
    markInteraction,
    measureAsync,
    componentName
  };
};

// Memory usage monitoring hook
export const useMemoryMonitor = (
  componentName: string,
  options: { enabled?: boolean; interval?: number } = {}
) => {
  const { enabled = process.env.NODE_ENV === 'development', interval = 5000 } = options;

  useEffect(() => {
    if (!enabled || !('memory' in performance)) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      const memoryInfo = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
      };

      // Log if memory usage is high
      const usagePercent = (memoryInfo.used / memoryInfo.limit) * 100;
      
      if (usagePercent > 80) {
        logger.warn(`High memory usage in ${componentName}`, {
          ...memoryInfo,
          usagePercent: `${usagePercent.toFixed(1)}%`,
          component: componentName
        });
      }

      // Log if there's a significant increase
      const lastUsage = sessionStorage.getItem(`memory-${componentName}`);
      if (lastUsage) {
        const lastUsed = parseInt(lastUsage);
        const increase = memoryInfo.used - lastUsed;
        
        if (increase > 10) { // >10MB increase
          logger.info(`Memory increase detected in ${componentName}`, {
            increase: `${increase}MB`,
            current: `${memoryInfo.used}MB`,
            component: componentName
          });
        }
      }

      sessionStorage.setItem(`memory-${componentName}`, memoryInfo.used.toString());
    };

    checkMemory();
    const intervalId = setInterval(checkMemory, interval);

    return () => clearInterval(intervalId);
  }, [componentName, enabled, interval]);
};

// Bundle size and loading performance
export const useBundleAnalyzer = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Analyze resource loading
    const analyzeResources = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const analysis = {
        totalResources: resources.length,
        scripts: resources.filter(r => r.name.includes('.js')).length,
        stylesheets: resources.filter(r => r.name.includes('.css')).length,
        images: resources.filter(r => r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)).length,
        totalTransferSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        largestResources: resources
          .filter(r => r.transferSize > 0)
          .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
          .slice(0, 5)
          .map(r => ({
            name: r.name.split('/').pop(),
            size: `${Math.round((r.transferSize || 0) / 1024)}KB`,
            duration: `${Math.round(r.duration)}ms`
          }))
      };

      logger.info('Bundle analysis', analysis);
    };

    // Run analysis after page load
    if (document.readyState === 'complete') {
      setTimeout(analyzeResources, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(analyzeResources, 1000);
      });
    }
  }, []);
};