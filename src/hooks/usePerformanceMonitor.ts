
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

export const usePerformanceMonitor = (componentName: string, enabled: boolean = false) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;

    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;

    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;

    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now()
    };

    // Log performance metrics in development
    if (renderTime > 16) { // Flag renders taking longer than 16ms (60fps threshold)
      console.warn(`Slow render detected in ${componentName}:`, {
        ...metrics,
        renderCount: renderCount.current,
        threshold: '16ms (60fps)'
      });
    }

    // Store metrics for analysis (could be sent to analytics service)
    if (window.performance && 'mark' in window.performance) {
      window.performance.mark(`${componentName}-render-${renderCount.current}`);
    }
  });

  return {
    renderCount: renderCount.current,
    componentName
  };
};

// Memory usage monitoring
export const useMemoryMonitor = (componentName: string, enabled: boolean = false) => {
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;
    if (!('memory' in window.performance)) return;

    const memory = (window.performance as any).memory;
    const memoryInfo = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      component: componentName,
      timestamp: Date.now()
    };

    // Log memory usage periodically
    const intervalId = setInterval(() => {
      const currentMemory = (window.performance as any).memory;
      const memoryGrowth = currentMemory.usedJSHeapSize - memory.usedJSHeapSize;
      
      if (memoryGrowth > 10 * 1024 * 1024) { // Flag >10MB growth
        console.warn(`Memory growth detected in ${componentName}:`, {
          growth: `${(memoryGrowth / 1024 / 1024).toFixed(2)}MB`,
          current: `${(currentMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          limit: `${(currentMemory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
        });
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [componentName, enabled]);
};
