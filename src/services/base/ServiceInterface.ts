// Common service interface for dependency injection
export interface IService {
  getName(): string;
  getVersion?(): string;
}

// Enhanced service interface with common operations
export interface IEnhancedService extends IService {
  readonly loading: boolean;
  readonly error: Error | null;
  readonly lastUpdated: Date | null;
}

// Service with caching capabilities
export interface ICachingService extends IEnhancedService {
  clearCache(): Promise<void>;
  getCacheSize(): number;
  getCacheStats(): object;
}

// Service with API quota tracking
export interface IQuotaAwareService extends IEnhancedService {
  getQuotaInfo(): {
    used: number;
    limit: number;
    resetAt: Date;
    service: string;
  } | null;
  checkQuotaAvailable(): boolean;
}