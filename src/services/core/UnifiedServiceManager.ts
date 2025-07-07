import { ServiceBase, ApiQuotaInfo } from '../base/ServiceBase';
import { IEnhancedService } from '../base/ServiceInterface';

/**
 * Unified service manager that coordinates all services
 * Provides centralized quota management, error handling, and service coordination
 */
export class UnifiedServiceManager extends ServiceBase implements IEnhancedService {
  private services: Map<string, ServiceBase> = new Map();
  private serviceInstances: Map<string, any> = new Map();

  constructor() {
    super();
  }

  getName(): string {
    return 'UnifiedServiceManager';
  }

  getVersion(): string {
    return '1.0.0';
  }

  /**
   * Register a service with the manager
   */
  registerService<T extends ServiceBase>(name: string, service: T): T {
    this.services.set(name, service);
    this.serviceInstances.set(name, service);
    return service;
  }

  /**
   * Get a registered service
   */
  getService<T = any>(name: string): T | null {
    return this.serviceInstances.get(name) || null;
  }

  /**
   * Get all registered services
   */
  getAllServices(): Array<{ name: string; service: ServiceBase }> {
    return Array.from(this.services.entries()).map(([name, service]) => ({
      name,
      service
    }));
  }

  /**
   * Get aggregated quota information from all services
   */
  getAggregatedQuota(): Record<string, ApiQuotaInfo | null> {
    const quotas: Record<string, ApiQuotaInfo | null> = {};
    
    for (const [name, service] of this.services.entries()) {
      quotas[name] = service.quota;
    }
    
    return quotas;
  }

  /**
   * Check if any service is over quota
   */
  checkQuotaStatus(): {
    hasQuotaIssues: boolean;
    servicesOverQuota: string[];
    totalQuotaUsage: number;
  } {
    const servicesOverQuota: string[] = [];
    let totalUsage = 0;

    for (const [name, service] of this.services.entries()) {
      const quota = service.quota;
      if (quota) {
        totalUsage += quota.used;
        
        const now = new Date();
        if (now <= quota.resetAt && quota.used >= quota.limit) {
          servicesOverQuota.push(name);
        }
      }
    }

    return {
      hasQuotaIssues: servicesOverQuota.length > 0,
      servicesOverQuota,
      totalQuotaUsage: totalUsage
    };
  }

  /**
   * Get service health status
   */
  getServiceHealth(): Record<string, {
    status: 'healthy' | 'error' | 'loading';
    lastUpdated: Date | null;
    error: Error | null;
  }> {
    const health: Record<string, any> = {};

    for (const [name, service] of this.services.entries()) {
      health[name] = {
        status: service.error ? 'error' : service.loading ? 'loading' : 'healthy',
        lastUpdated: service.lastUpdated,
        error: service.error
      };
    }

    return health;
  }

  /**
   * Reset all service states
   */
  resetAllServices(): void {
    for (const service of this.services.values()) {
      // Check if service has resetState method and call it safely
      if (service instanceof ServiceBase && typeof (service as any).resetState === 'function') {
        try {
          (service as any).resetState();
        } catch (error) {
          console.warn(`Failed to reset service state: ${error}`);
        }
      }
    }
    this.resetState();
  }

  /**
   * Execute operation across multiple services with coordination
   */
  async executeCoordinated<T>(
    operations: Array<{
      serviceName: string;
      operation: () => Promise<T>;
      fallback?: () => Promise<T>;
      required?: boolean;
    }>
  ): Promise<Array<T | null>> {
    return this.executeWithStateManagement(async () => {
      const results: Array<T | null> = [];
      
      for (const { serviceName, operation, fallback, required = false } of operations) {
        try {
          const result = await operation();
          results.push(result);
        } catch (error) {
          if (fallback) {
            try {
              const fallbackResult = await fallback();
              results.push(fallbackResult);
            } catch (fallbackError) {
              if (required) {
                throw fallbackError;
              }
              results.push(null);
            }
          } else if (required) {
            throw error;
          } else {
            results.push(null);
          }
        }
      }
      
      return results;
    }, 'Coordinated service execution');
  }
}

// Export singleton instance
export const serviceManager = new UnifiedServiceManager();