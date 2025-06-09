
import { apiRoutingService } from '../routing/apiRoutingService';
import { multiLevelCacheService } from '../caching/multiLevelCacheService';
import { enhancedPlacesService } from '../enhanced/enhancedPlacesService';
import { serviceMonitor, monitoredCall } from '../monitoring/serviceMonitor';
import { toast } from "sonner";

export interface ServiceOrchestratorConfig {
  enableAutoRecovery: boolean;
  enablePerformanceOptimization: boolean;
  enableProactiveHealthChecks: boolean;
  healthCheckInterval: number;
}

export class ServiceOrchestrator {
  private config: ServiceOrchestratorConfig = {
    enableAutoRecovery: true,
    enablePerformanceOptimization: true,
    enableProactiveHealthChecks: true,
    healthCheckInterval: 30000 // 30 seconds
  };

  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('Initializing Three-Tier Architecture Services...');

    try {
      // Initialize services in order
      await this.initializeMonitoring();
      await this.initializeRouting();
      await this.initializeCaching();
      await this.initializeEnhancedServices();

      if (this.config.enableProactiveHealthChecks) {
        this.startProactiveHealthChecks();
      }

      if (this.config.enableAutoRecovery) {
        this.startAutoRecoverySystem();
      }

      this.isInitialized = true;
      console.log('Three-Tier Architecture Services initialized successfully');
      toast.success('Enhanced services initialized');

    } catch (error) {
      console.error('Failed to initialize services:', error);
      toast.error('Failed to initialize enhanced services');
      throw error;
    }
  }

  private async initializeMonitoring(): Promise<void> {
    return monitoredCall('service-orchestrator', 'initialize-monitoring', async () => {
      // Service monitor is already initialized
      console.log('✓ Monitoring service initialized');
    });
  }

  private async initializeRouting(): Promise<void> {
    return monitoredCall('service-orchestrator', 'initialize-routing', async () => {
      // API routing service is already initialized
      console.log('✓ API routing service initialized');
    });
  }

  private async initializeCaching(): Promise<void> {
    return monitoredCall('service-orchestrator', 'initialize-caching', async () => {
      // Multi-level cache service is already initialized
      console.log('✓ Multi-level cache service initialized');
    });
  }

  private async initializeEnhancedServices(): Promise<void> {
    return monitoredCall('service-orchestrator', 'initialize-enhanced-services', async () => {
      // Enhanced places service is already initialized
      console.log('✓ Enhanced places service initialized');
    });
  }

  private startProactiveHealthChecks(): void {
    setInterval(() => {
      this.performProactiveHealthCheck();
    }, this.config.healthCheckInterval);
  }

  private async performProactiveHealthCheck(): Promise<void> {
    try {
      const healthStatuses = serviceMonitor.getServiceHealth() as Map<string, any>;
      
      for (const [serviceName, health] of healthStatuses) {
        if (health.status !== 'healthy') {
          console.warn(`Service ${serviceName} is ${health.status}`);
          
          if (this.config.enableAutoRecovery) {
            await this.attemptServiceRecovery(serviceName, health);
          }
        }
      }
    } catch (error) {
      console.error('Proactive health check failed:', error);
    }
  }

  private async attemptServiceRecovery(serviceName: string, health: any): Promise<void> {
    console.log(`Attempting recovery for service: ${serviceName}`);

    try {
      switch (serviceName) {
        case 'multi-level-cache':
          // Clear corrupted cache entries
          await multiLevelCacheService.invalidatePattern('.*');
          toast.info('Cache cleared for recovery');
          break;

        case 'enhanced-places':
          // Reset places service cache
          await enhancedPlacesService.invalidateCache();
          toast.info('Places service cache cleared for recovery');
          break;

        case 'supabase-database':
          // Test database connection
          const { supabase } = await import('@/integrations/supabase/client');
          await supabase.from('cached_places').select('id').limit(1);
          toast.success('Database connection restored');
          break;

        default:
          console.log(`No recovery strategy defined for service: ${serviceName}`);
      }
    } catch (error) {
      console.error(`Recovery failed for service ${serviceName}:`, error);
      toast.error(`Failed to recover service: ${serviceName}`);
    }
  }

  private startAutoRecoverySystem(): void {
    // Listen for critical errors and attempt automatic recovery
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      console.error('Unhandled promise rejection:', error);
      
      // Record the error
      serviceMonitor.recordMetric({
        service: 'global',
        operation: 'unhandled-error',
        duration: 0,
        success: false,
        timestamp: Date.now(),
        errorMessage: error instanceof Error ? error.message : String(error)
      });
    });
  }

  async getSystemStatus(): Promise<{
    overall: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, any>;
    performance: any;
    cache: any;
    routing: any;
  }> {
    const healthStatuses = serviceMonitor.getServiceHealth() as Map<string, any>;
    const performanceReport = serviceMonitor.getPerformanceReport();
    const cacheStats = multiLevelCacheService.getCacheStats();
    const routingStats = apiRoutingService.getSourceStatus();

    // Determine overall system health
    let unhealthyCount = 0;
    let degradedCount = 0;
    
    for (const [, health] of healthStatuses) {
      if (health.status === 'unhealthy') unhealthyCount++;
      else if (health.status === 'degraded') degradedCount++;
    }

    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (unhealthyCount > 0) {
      overall = 'unhealthy';
    } else if (degradedCount > 0) {
      overall = 'degraded';
    }

    return {
      overall,
      services: Object.fromEntries(healthStatuses),
      performance: performanceReport,
      cache: cacheStats,
      routing: routingStats
    };
  }

  async optimizePerformance(): Promise<void> {
    if (!this.config.enablePerformanceOptimization) return;

    console.log('Running performance optimization...');

    try {
      // Clear old cache entries
      await multiLevelCacheService.invalidatePattern('.*_old');
      
      // Warm up frequently accessed data
      await this.warmUpCache();
      
      console.log('Performance optimization completed');
      toast.success('System performance optimized');
    } catch (error) {
      console.error('Performance optimization failed:', error);
      toast.error('Performance optimization failed');
    }
  }

  private async warmUpCache(): Promise<void> {
    // Pre-load frequently accessed places data
    const commonQueries = ['restaurant', 'grocery', 'cafe'];
    const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // NYC

    for (const query of commonQueries) {
      try {
        await enhancedPlacesService.searchPlaces({
          query,
          center: defaultCenter,
          radius: 5000,
          limit: 10
        });
      } catch (error) {
        console.warn(`Failed to warm up cache for query: ${query}`, error);
      }
    }
  }

  getConfig(): ServiceOrchestratorConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<ServiceOrchestratorConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Service orchestrator config updated:', this.config);
  }
}

export const serviceOrchestrator = new ServiceOrchestrator();

// Auto-initialize on import
serviceOrchestrator.initialize().catch(console.error);
