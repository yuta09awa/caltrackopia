
import { toast } from "sonner";

export interface DataSource {
  id: string;
  name: string;
  priority: number;
  isAvailable: boolean;
  lastHealthCheck: Date;
  responseTime: number;
  errorCount: number;
  maxErrors: number;
}

export interface RoutingConfig {
  maxRetries: number;
  healthCheckInterval: number;
  circuitBreakerThreshold: number;
  loadBalancingStrategy: 'round-robin' | 'priority' | 'least-response-time';
}

export class ApiRoutingService {
  private dataSources: Map<string, DataSource> = new Map();
  private currentIndex = 0;
  private config: RoutingConfig = {
    maxRetries: 3,
    healthCheckInterval: 60000, // 1 minute
    circuitBreakerThreshold: 5,
    loadBalancingStrategy: 'priority'
  };

  constructor() {
    this.initializeDataSources();
    this.startHealthChecks();
  }

  private initializeDataSources() {
    const sources: DataSource[] = [
      {
        id: 'supabase-cache',
        name: 'Supabase Cache',
        priority: 1,
        isAvailable: true,
        lastHealthCheck: new Date(),
        responseTime: 100,
        errorCount: 0,
        maxErrors: 3
      },
      {
        id: 'google-places',
        name: 'Google Places API',
        priority: 2,
        isAvailable: true,
        lastHealthCheck: new Date(),
        responseTime: 500,
        errorCount: 0,
        maxErrors: 5
      },
      {
        id: 'usda-api',
        name: 'USDA Food Data Central',
        priority: 3,
        isAvailable: true,
        lastHealthCheck: new Date(),
        responseTime: 800,
        errorCount: 0,
        maxErrors: 3
      },
      {
        id: 'fatsecret-api',
        name: 'FatSecret API',
        priority: 4,
        isAvailable: true,
        lastHealthCheck: new Date(),
        responseTime: 600,
        errorCount: 0,
        maxErrors: 3
      }
    ];

    sources.forEach(source => this.dataSources.set(source.id, source));
  }

  async routeRequest<T>(
    serviceType: 'places' | 'nutrition' | 'cache',
    requestFn: (sourceId: string) => Promise<T>,
    fallbackFn?: () => Promise<T>
  ): Promise<T> {
    const availableSources = this.getAvailableSourcesForService(serviceType);
    
    if (availableSources.length === 0) {
      if (fallbackFn) {
        console.log('No available sources, using fallback');
        return await fallbackFn();
      }
      throw new Error(`No available data sources for ${serviceType}`);
    }

    let lastError: Error | null = null;

    for (const source of availableSources) {
      try {
        const startTime = performance.now();
        const result = await requestFn(source.id);
        const responseTime = performance.now() - startTime;
        
        // Update source metrics on success
        this.updateSourceMetrics(source.id, responseTime, false);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Request failed for source ${source.id}:`, error);
        
        // Update source metrics on error
        this.updateSourceMetrics(source.id, 0, true);
        
        // Check if we should circuit break this source
        if (source.errorCount >= source.maxErrors) {
          this.circuitBreakSource(source.id);
        }
      }
    }

    // All sources failed, try fallback
    if (fallbackFn) {
      try {
        return await fallbackFn();
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }

    throw lastError || new Error(`All data sources failed for ${serviceType}`);
  }

  private getAvailableSourcesForService(serviceType: string): DataSource[] {
    const serviceSourceMap = {
      'places': ['supabase-cache', 'google-places'],
      'nutrition': ['supabase-cache', 'usda-api', 'fatsecret-api'],
      'cache': ['supabase-cache']
    };

    const sourceIds = serviceSourceMap[serviceType] || [];
    const sources = sourceIds
      .map(id => this.dataSources.get(id))
      .filter(source => source && source.isAvailable) as DataSource[];

    return this.sortSourcesByStrategy(sources);
  }

  private sortSourcesByStrategy(sources: DataSource[]): DataSource[] {
    switch (this.config.loadBalancingStrategy) {
      case 'priority':
        return sources.sort((a, b) => a.priority - b.priority);
      case 'least-response-time':
        return sources.sort((a, b) => a.responseTime - b.responseTime);
      case 'round-robin':
        this.currentIndex = (this.currentIndex + 1) % sources.length;
        return [sources[this.currentIndex], ...sources.slice(0, this.currentIndex), ...sources.slice(this.currentIndex + 1)];
      default:
        return sources;
    }
  }

  private updateSourceMetrics(sourceId: string, responseTime: number, isError: boolean) {
    const source = this.dataSources.get(sourceId);
    if (!source) return;

    if (isError) {
      source.errorCount++;
    } else {
      source.errorCount = Math.max(0, source.errorCount - 1); // Recover gradually
      source.responseTime = (source.responseTime + responseTime) / 2; // Moving average
    }

    source.lastHealthCheck = new Date();
  }

  private circuitBreakSource(sourceId: string) {
    const source = this.dataSources.get(sourceId);
    if (!source) return;

    source.isAvailable = false;
    console.warn(`Circuit breaker activated for ${source.name}`);
    toast.error(`${source.name} temporarily unavailable`);

    // Auto-recover after 5 minutes
    setTimeout(() => {
      source.isAvailable = true;
      source.errorCount = 0;
      console.log(`Auto-recovering ${source.name}`);
    }, 5 * 60 * 1000);
  }

  private startHealthChecks() {
    setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheckInterval);
  }

  private async performHealthChecks() {
    for (const [sourceId, source] of this.dataSources) {
      try {
        const startTime = performance.now();
        await this.healthCheckSource(sourceId);
        const responseTime = performance.now() - startTime;
        
        source.isAvailable = true;
        source.responseTime = responseTime;
        source.lastHealthCheck = new Date();
      } catch (error) {
        console.warn(`Health check failed for ${source.name}:`, error);
        // Don't immediately mark as unavailable on health check failure
      }
    }
  }

  private async healthCheckSource(sourceId: string): Promise<void> {
    // Simple ping-like health checks for each source
    switch (sourceId) {
      case 'supabase-cache':
        // Check Supabase connectivity
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.from('cached_places').select('id').limit(1);
        break;
      case 'google-places':
        // Check if Google Maps is loaded
        if (!window.google?.maps?.places) {
          throw new Error('Google Places API not available');
        }
        break;
      default:
        // For external APIs, we'll just assume they're available
        // In a real implementation, you'd make a lightweight test request
        break;
    }
  }

  getSourceStatus(): Record<string, DataSource> {
    const status: Record<string, DataSource> = {};
    this.dataSources.forEach((source, id) => {
      status[id] = { ...source };
    });
    return status;
  }
}

export const apiRoutingService = new ApiRoutingService();
