import { toast } from 'sonner';

// Common service state interface
export interface ServiceState {
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

// API quota tracking interface
export interface ApiQuotaInfo {
  used: number;
  limit: number;
  resetAt: Date;
  service: string;
}

/**
 * Base service class providing common patterns for all services
 */
export abstract class ServiceBase {
  protected state: ServiceState = {
    loading: false,
    error: null,
    lastUpdated: null
  };

  protected quotaInfo: ApiQuotaInfo | null = null;

  // State getters
  get loading(): boolean {
    return this.state.loading;
  }

  get error(): Error | null {
    return this.state.error;
  }

  get lastUpdated(): Date | null {
    return this.state.lastUpdated;
  }

  get quota(): ApiQuotaInfo | null {
    return this.quotaInfo;
  }

  // Protected state management methods
  protected setLoading(loading: boolean): void {
    this.state.loading = loading;
  }

  protected setError(error: Error | null): void {
    this.state.error = error;
    if (error) {
      console.error(`${this.constructor.name} error:`, error);
    }
  }

  protected setLastUpdated(date: Date = new Date()): void {
    this.state.lastUpdated = date;
  }

  protected resetState(): void {
    this.state = {
      loading: false,
      error: null,
      lastUpdated: null
    };
  }

  // API quota management
  protected updateQuota(quotaInfo: Partial<ApiQuotaInfo>): void {
    this.quotaInfo = {
      ...this.quotaInfo,
      ...quotaInfo,
      service: quotaInfo.service || this.constructor.name
    } as ApiQuotaInfo;
  }

  protected checkQuotaLimit(): boolean {
    if (!this.quotaInfo) return true;
    
    const now = new Date();
    if (now > this.quotaInfo.resetAt) {
      // Reset quota if expired
      this.quotaInfo.used = 0;
      return true;
    }
    
    return this.quotaInfo.used < this.quotaInfo.limit;
  }

  protected incrementQuotaUsage(amount: number = 1): void {
    if (this.quotaInfo) {
      this.quotaInfo.used += amount;
    }
  }

  // Common error handling
  protected handleError(error: unknown, context?: string): Error {
    const errorInstance = error instanceof Error ? error : new Error('Unknown error');
    const contextMessage = context ? `${context}: ${errorInstance.message}` : errorInstance.message;
    const finalError = new Error(contextMessage);
    
    this.setError(finalError);
    return finalError;
  }

  // Common async operation wrapper
  protected async executeWithStateManagement<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T> {
    this.setLoading(true);
    this.setError(null);

    try {
      const result = await operation();
      this.setLastUpdated();
      return result;
    } catch (error) {
      throw this.handleError(error, context);
    } finally {
      this.setLoading(false);
    }
  }

  // Utility methods
  protected showSuccessToast(message: string): void {
    toast.success(message);
  }

  protected showErrorToast(message: string): void {
    toast.error(message);
  }

  protected showInfoToast(message: string): void {
    toast.info(message);
  }

  // Cache management helpers
  protected isDataStale(lastUpdate: Date | null, maxAge: number = 5 * 60 * 1000): boolean {
    if (!lastUpdate) return true;
    return Date.now() - lastUpdate.getTime() > maxAge;
  }

  // Abstract methods that services should implement
  abstract getName(): string;
  abstract getVersion?(): string;
}