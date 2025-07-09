// ============= STANDARD SERVICE BASE =============

import { ServiceBase, ApiQuotaInfo } from '../base/ServiceBase';
import { IEnhancedService, ICachingService, IQuotaAwareService } from '../base/ServiceInterface';
import { ApiResponse, ApiError, ServiceConfig } from '@/types';

/**
 * Enhanced service base class with standard patterns
 */
export abstract class StandardServiceBase extends ServiceBase implements IEnhancedService, ICachingService, IQuotaAwareService {
  protected config: ServiceConfig;
  protected cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  protected requestQueue: Map<string, Promise<any>> = new Map();

  constructor(config: ServiceConfig = {}) {
    super();
    this.config = {
      timeout: 10000,
      retries: 3,
      cache: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      ...config,
    };
  }

  abstract getName(): string;
  abstract getVersion(): string;

  /**
   * Execute API request with standard patterns
   */
  protected async executeRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    options: {
      cache?: boolean;
      ttl?: number;
      retries?: number;
      timeout?: number;
    } = {}
  ): Promise<T> {
    const {
      cache = this.config.cache,
      ttl = this.config.cacheTTL,
      retries = this.config.retries,
      timeout = this.config.timeout,
    } = options;

    // Check cache first
    if (cache && this.hasValidCache(key)) {
      return this.getFromCache(key);
    }

    // Check if request is already in progress
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key)!;
    }

    // Execute request with error handling and retries
    const requestPromise = this.executeWithRetries(requestFn, retries, timeout);
    this.requestQueue.set(key, requestPromise);

    try {
      const result = await requestPromise;
      
      // Cache successful result
      if (cache) {
        this.setCache(key, result, ttl!);
      }

      return result;
    } finally {
      this.requestQueue.delete(key);
    }
  }

  /**
   * Execute with retry logic
   */
  private async executeWithRetries<T>(
    requestFn: () => Promise<T>,
    retries: number,
    timeout: number
  ): Promise<T> {
    return this.executeWithStateManagement(async () => {
      let lastError: Error;

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          // Add timeout wrapper
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          );

          const result = await Promise.race([requestFn(), timeoutPromise]);
          
          // Increment quota on successful request
          this.incrementQuotaUsage();
          
          return result;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          
          if (attempt < retries) {
            // Exponential backoff
            await this.delay(Math.pow(2, attempt) * 1000);
          }
        }
      }

      throw lastError!;
    }, `${this.getName()} request`);
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Cache management
  private hasValidCache(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private getFromCache<T>(key: string): T {
    const entry = this.cache.get(key);
    return entry!.data;
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Cleanup old entries (keep last 1000)
    if (this.cache.size > 1000) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => b[1].timestamp - a[1].timestamp)
        .slice(0, 1000);
      
      this.cache.clear();
      entries.forEach(([key, value]) => this.cache.set(key, value));
    }
  }

  // ICachingService implementation
  async clearCache(): Promise<void> {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheStats(): object {
    const entries = Array.from(this.cache.values());
    const now = Date.now();
    
    return {
      total: entries.length,
      valid: entries.filter(e => now - e.timestamp < e.ttl).length,
      expired: entries.filter(e => now - e.timestamp >= e.ttl).length,
      totalSize: JSON.stringify(entries).length,
    };
  }

  // IQuotaAwareService implementation
  getQuotaInfo(): ApiQuotaInfo | null {
    return this.quota;
  }

  checkQuotaAvailable(): boolean {
    return this.checkQuotaLimit();
  }

  /**
   * Standardize API response format
   */
  protected formatResponse<T>(data: T, success: boolean = true, message?: string): ApiResponse<T> {
    return {
      data,
      success,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        service: this.getName(),
        version: this.getVersion(),
      },
    };
  }

  /**
   * Standardize API error format
   */
  protected formatError(error: Error, code: string = 'UNKNOWN_ERROR'): ApiError {
    return {
      code,
      message: error.message,
      details: {
        service: this.getName(),
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date(),
    };
  }

  /**
   * Generic CRUD operations
   */
  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const key = `GET:${endpoint}:${JSON.stringify(params || {})}`;
    return this.executeRequest(key, () => this.performGet<T>(endpoint, params));
  }

  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.executeWithStateManagement(
      () => this.performPost<T>(endpoint, data),
      `POST ${endpoint}`
    );
  }

  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.executeWithStateManagement(
      () => this.performPut<T>(endpoint, data),
      `PUT ${endpoint}`
    );
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    return this.executeWithStateManagement(
      () => this.performDelete<T>(endpoint),
      `DELETE ${endpoint}`
    );
  }

  // Abstract methods for HTTP operations (to be implemented by concrete services)
  protected abstract performGet<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
  protected abstract performPost<T>(endpoint: string, data?: any): Promise<T>;
  protected abstract performPut<T>(endpoint: string, data?: any): Promise<T>;
  protected abstract performDelete<T>(endpoint: string): Promise<T>;

  /**
   * Batch operations support
   */
  protected async batch<T>(operations: (() => Promise<T>)[]): Promise<T[]> {
    return this.executeWithStateManagement(async () => {
      const results = await Promise.allSettled(operations.map(op => op()));
      
      const successes: T[] = [];
      const errors: Error[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successes.push(result.value);
        } else {
          errors.push(new Error(`Batch operation ${index} failed: ${result.reason}`));
        }
      });

      if (errors.length > 0 && successes.length === 0) {
        throw new Error(`All batch operations failed: ${errors.map(e => e.message).join(', ')}`);
      }

      return successes;
    }, 'Batch operations');
  }
}

/**
 * HTTP Service implementation
 */
export class StandardHttpService extends StandardServiceBase {
  constructor(config: ServiceConfig & { baseUrl: string }) {
    super(config);
  }

  getName(): string {
    return 'StandardHttpService';
  }

  getVersion(): string {
    return '1.0.0';
  }

  protected async performGet<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.config.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  protected async performPost<T>(endpoint: string, data?: any): Promise<T> {
    const url = new URL(endpoint, this.config.baseUrl);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  protected async performPut<T>(endpoint: string, data?: any): Promise<T> {
    const url = new URL(endpoint, this.config.baseUrl);
    
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  protected async performDelete<T>(endpoint: string): Promise<T> {
    const url = new URL(endpoint, this.config.baseUrl);
    
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
