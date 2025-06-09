
import { toast } from "sonner";

export interface PerformanceMetric {
  service: string;
  operation: string;
  duration: number;
  success: boolean;
  timestamp: number;
  errorMessage?: string;
}

export interface HealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  responseTime: number;
  errorRate: number;
  uptime: number;
}

export class ServiceMonitor {
  private metrics: PerformanceMetric[] = [];
  private healthStatuses: Map<string, HealthStatus> = new Map();
  private maxMetrics = 1000; // Keep last 1000 metrics
  
  constructor() {
    this.initializeServices();
    this.startMonitoring();
  }

  private initializeServices() {
    const services = [
      'api-routing',
      'multi-level-cache',
      'enhanced-places',
      'google-maps',
      'supabase-database',
      'nutrition-apis'
    ];

    services.forEach(service => {
      this.healthStatuses.set(service, {
        service,
        status: 'healthy',
        lastCheck: Date.now(),
        responseTime: 0,
        errorRate: 0,
        uptime: 100
      });
    });
  }

  recordMetric(metric: PerformanceMetric) {
    // Add timestamp if not provided
    if (!metric.timestamp) {
      metric.timestamp = Date.now();
    }

    this.metrics.push(metric);

    // Trim metrics if we exceed max
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Update health status
    this.updateHealthStatus(metric);

    // Log performance issues
    if (metric.duration > 5000) { // 5 seconds
      console.warn(`Slow operation detected: ${metric.service}.${metric.operation} took ${metric.duration}ms`);
    }

    if (!metric.success) {
      console.error(`Operation failed: ${metric.service}.${metric.operation} - ${metric.errorMessage}`);
    }
  }

  private updateHealthStatus(metric: PerformanceMetric) {
    const health = this.healthStatuses.get(metric.service);
    if (!health) return;

    health.lastCheck = metric.timestamp;
    health.responseTime = (health.responseTime + metric.duration) / 2; // Moving average

    // Calculate error rate from last 100 operations
    const recentMetrics = this.metrics
      .filter(m => m.service === metric.service)
      .slice(-100);
    
    const errorCount = recentMetrics.filter(m => !m.success).length;
    health.errorRate = recentMetrics.length > 0 ? (errorCount / recentMetrics.length) * 100 : 0;

    // Determine status
    if (health.errorRate > 50 || health.responseTime > 10000) {
      health.status = 'unhealthy';
    } else if (health.errorRate > 20 || health.responseTime > 5000) {
      health.status = 'degraded';
    } else {
      health.status = 'healthy';
    }

    // Alert on status changes
    if (health.status !== 'healthy') {
      this.alertOnDegradation(metric.service, health);
    }
  }

  private alertOnDegradation(service: string, health: HealthStatus) {
    const message = `Service ${service} is ${health.status} (Error rate: ${health.errorRate.toFixed(1)}%, Response time: ${health.responseTime.toFixed(0)}ms)`;
    
    if (health.status === 'unhealthy') {
      toast.error(message);
    } else if (health.status === 'degraded') {
      toast.warning(message);
    }
  }

  getServiceHealth(service?: string): HealthStatus | Map<string, HealthStatus> {
    if (service) {
      return this.healthStatuses.get(service) || {
        service,
        status: 'unhealthy',
        lastCheck: 0,
        responseTime: 0,
        errorRate: 100,
        uptime: 0
      };
    }
    return this.healthStatuses;
  }

  getPerformanceReport(service?: string, timeWindow?: number): {
    totalOperations: number;
    successRate: number;
    averageResponseTime: number;
    p95ResponseTime: number;
    errorRate: number;
    recentErrors: string[];
  } {
    const now = Date.now();
    const windowStart = timeWindow ? now - timeWindow : 0;
    
    let filteredMetrics = this.metrics.filter(m => m.timestamp >= windowStart);
    
    if (service) {
      filteredMetrics = filteredMetrics.filter(m => m.service === service);
    }

    const totalOperations = filteredMetrics.length;
    const successfulOperations = filteredMetrics.filter(m => m.success).length;
    const successRate = totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 0;

    const responseTimes = filteredMetrics.map(m => m.duration).sort((a, b) => a - b);
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;
    
    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p95ResponseTime = responseTimes.length > 0 ? responseTimes[p95Index] || 0 : 0;

    const errorRate = 100 - successRate;
    const recentErrors = filteredMetrics
      .filter(m => !m.success && m.errorMessage)
      .slice(-10)
      .map(m => m.errorMessage || 'Unknown error');

    return {
      totalOperations,
      successRate,
      averageResponseTime,
      p95ResponseTime,
      errorRate,
      recentErrors
    };
  }

  private startMonitoring() {
    // Check service health every minute
    setInterval(() => {
      this.performHealthChecks();
    }, 60000);

    // Clean old metrics every hour
    setInterval(() => {
      this.cleanOldMetrics();
    }, 3600000);
  }

  private async performHealthChecks() {
    for (const [serviceName, health] of this.healthStatuses) {
      try {
        const startTime = performance.now();
        await this.healthCheckService(serviceName);
        const duration = performance.now() - startTime;

        this.recordMetric({
          service: serviceName,
          operation: 'health-check',
          duration,
          success: true,
          timestamp: Date.now()
        });
      } catch (error) {
        this.recordMetric({
          service: serviceName,
          operation: 'health-check',
          duration: 0,
          success: false,
          timestamp: Date.now(),
          errorMessage: error instanceof Error ? error.message : 'Health check failed'
        });
      }
    }
  }

  private async healthCheckService(serviceName: string): Promise<void> {
    switch (serviceName) {
      case 'supabase-database':
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.from('cached_places').select('id').limit(1);
        break;
      case 'google-maps':
        if (!window.google?.maps) {
          throw new Error('Google Maps not loaded');
        }
        break;
      default:
        // For other services, assume they're healthy if no recent errors
        break;
    }
  }

  private cleanOldMetrics() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
  }

  exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      healthStatuses: Array.from(this.healthStatuses.entries()),
      exportedAt: Date.now()
    }, null, 2);
  }
}

export const serviceMonitor = new ServiceMonitor();

// Helper function to wrap service calls with monitoring
export function monitoredCall<T>(
  service: string,
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  return fn()
    .then(result => {
      serviceMonitor.recordMetric({
        service,
        operation,
        duration: performance.now() - startTime,
        success: true,
        timestamp: Date.now()
      });
      return result;
    })
    .catch(error => {
      serviceMonitor.recordMetric({
        service,
        operation,
        duration: performance.now() - startTime,
        success: false,
        timestamp: Date.now(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    });
}
