/**
 * Unified Cache Service
 * Implements a 3-tier caching strategy: Memory → IndexedDB → Supabase
 * 
 * L1 (Memory): 60s TTL, fastest access, volatile
 * L2 (IndexedDB): 24h TTL, persistent, browser storage
 * L3 (Supabase): Database-level caching with freshness tracking
 * 
 * @example
 * ```typescript
 * const data = await cacheService.get('places', 'search:pizza', async () => {
 *   return await supabase.from('cached_places').select('*');
 * });
 * ```
 */

import { indexedDBService, type StoreName } from '../storage/IndexedDBService';
import { mapCacheService } from '../storage/MapCacheService';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number;
  skipMemory?: boolean;
  skipIndexedDB?: boolean;
  skipSupabase?: boolean;
}

interface CacheMetrics {
  l1Hits: number;
  l1Misses: number;
  l2Hits: number;
  l2Misses: number;
  l3Hits: number;
  l3Misses: number;
  totalRequests: number;
  avgResponseTime: number;
}

export class UnifiedCacheService {
  // L1: Memory cache
  private memoryCache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_MEMORY_TTL = 60 * 1000; // 60 seconds
  private readonly DEFAULT_INDEXEDDB_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_MEMORY_SIZE = 100;

  // Metrics
  private metrics: CacheMetrics = {
    l1Hits: 0,
    l1Misses: 0,
    l2Hits: 0,
    l2Misses: 0,
    l3Hits: 0,
    l3Misses: 0,
    totalRequests: 0,
    avgResponseTime: 0
  };

  /**
   * Get data from cache or fetch from source
   * Automatically promotes data through cache layers
   */
  async get<T>(
    storeName: StoreName | 'places' | 'searches' | 'ingredients',
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const startTime = performance.now();
    this.metrics.totalRequests++;

    const {
      ttl = this.DEFAULT_MEMORY_TTL,
      skipMemory = false,
      skipIndexedDB = false,
      skipSupabase = false
    } = options;

    const cacheKey = `${storeName}:${key}`;

    // L1: Check memory cache
    if (!skipMemory) {
      const memoryData = this.getFromMemory<T>(cacheKey);
      if (memoryData !== null) {
        this.metrics.l1Hits++;
        this.updateMetrics(startTime);
        console.log(`[Cache] L1 HIT: ${cacheKey}`);
        return memoryData;
      }
      this.metrics.l1Misses++;
    }

    // L2: Check IndexedDB
    if (!skipIndexedDB) {
      try {
        const indexedDBData = await this.getFromIndexedDB<T>(storeName as StoreName, key);
        if (indexedDBData !== null) {
          this.metrics.l2Hits++;
          // Promote to L1
          this.setInMemory(cacheKey, indexedDBData, ttl);
          this.updateMetrics(startTime);
          console.log(`[Cache] L2 HIT: ${cacheKey} (promoted to L1)`);
          return indexedDBData;
        }
        this.metrics.l2Misses++;
      } catch (error) {
        console.warn('[Cache] L2 error:', error);
      }
    }

    // L3: Fetch from source (Supabase or API)
    console.log(`[Cache] L3 FETCH: ${cacheKey}`);
    const data = await fetchFn();

    if (data !== null && data !== undefined) {
      // Store in all cache layers
      if (!skipMemory) {
        this.setInMemory(cacheKey, data, ttl);
      }
      if (!skipIndexedDB) {
        await this.setInIndexedDB(storeName as StoreName, key, data, this.DEFAULT_INDEXEDDB_TTL);
      }
      this.metrics.l3Hits++;
    } else {
      this.metrics.l3Misses++;
    }

    this.updateMetrics(startTime);
    return data;
  }

  /**
   * Set data in all cache layers
   */
  async set<T>(
    storeName: StoreName | 'places' | 'searches' | 'ingredients',
    key: string,
    data: T,
    options: CacheOptions = {}
  ): Promise<void> {
    const {
      ttl = this.DEFAULT_MEMORY_TTL,
      skipMemory = false,
      skipIndexedDB = false
    } = options;

    const cacheKey = `${storeName}:${key}`;

    if (!skipMemory) {
      this.setInMemory(cacheKey, data, ttl);
    }

    if (!skipIndexedDB) {
      await this.setInIndexedDB(storeName as StoreName, key, data, this.DEFAULT_INDEXEDDB_TTL);
    }

    console.log(`[Cache] SET: ${cacheKey}`);
  }

  /**
   * Invalidate cache for a specific key
   */
  async invalidate(
    storeName: StoreName | 'places' | 'searches' | 'ingredients',
    key: string
  ): Promise<void> {
    const cacheKey = `${storeName}:${key}`;
    
    // Remove from memory
    this.memoryCache.delete(cacheKey);
    
    // Remove from IndexedDB
    try {
      await indexedDBService.delete(storeName as StoreName, key);
    } catch (error) {
      console.warn('[Cache] Error invalidating IndexedDB:', error);
    }

    console.log(`[Cache] INVALIDATED: ${cacheKey}`);
  }

  /**
   * Clear all caches for a store
   */
  async clearStore(storeName: StoreName | 'places' | 'searches' | 'ingredients'): Promise<void> {
    // Clear memory cache for this store
    const prefix = `${storeName}:`;
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear IndexedDB
    try {
      await indexedDBService.clear(storeName as StoreName);
    } catch (error) {
      console.warn('[Cache] Error clearing IndexedDB:', error);
    }

    console.log(`[Cache] CLEARED STORE: ${storeName}`);
  }

  /**
   * Clear all caches
   */
  async clearAll(): Promise<void> {
    this.memoryCache.clear();
    await mapCacheService.clearAll();
    console.log('[Cache] CLEARED ALL');
  }

  /**
   * Get cache metrics
   */
  getMetrics(): CacheMetrics {
    const totalHits = this.metrics.l1Hits + this.metrics.l2Hits + this.metrics.l3Hits;
    const hitRate = this.metrics.totalRequests > 0 
      ? (totalHits / this.metrics.totalRequests) * 100 
      : 0;

    return {
      ...this.metrics,
      hitRate: parseFloat(hitRate.toFixed(2)),
      l1HitRate: parseFloat(((this.metrics.l1Hits / this.metrics.totalRequests) * 100 || 0).toFixed(2)),
      l2HitRate: parseFloat(((this.metrics.l2Hits / this.metrics.totalRequests) * 100 || 0).toFixed(2)),
      l3HitRate: parseFloat(((this.metrics.l3Hits / this.metrics.totalRequests) * 100 || 0).toFixed(2)),
      memoryCacheSize: this.memoryCache.size
    } as any;
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      l1Hits: 0,
      l1Misses: 0,
      l2Hits: 0,
      l2Misses: 0,
      l3Hits: 0,
      l3Misses: 0,
      totalRequests: 0,
      avgResponseTime: 0
    };
  }

  // ============= PRIVATE METHODS =============

  private getFromMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setInMemory<T>(key: string, data: T, ttl: number): void {
    // Evict oldest entries if cache is full
    if (this.memoryCache.size >= this.MAX_MEMORY_SIZE) {
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) {
        this.memoryCache.delete(firstKey);
      }
    }

    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private async getFromIndexedDB<T>(storeName: StoreName, key: string): Promise<T | null> {
    try {
      return await indexedDBService.get<T>(storeName, key);
    } catch (error) {
      console.warn('[Cache] IndexedDB get error:', error);
      return null;
    }
  }

  private async setInIndexedDB<T>(
    storeName: StoreName,
    key: string,
    data: T,
    expiresInMs: number
  ): Promise<void> {
    try {
      await indexedDBService.set(storeName, key, data, expiresInMs);
    } catch (error) {
      console.warn('[Cache] IndexedDB set error:', error);
    }
  }

  private updateMetrics(startTime: number): void {
    const responseTime = performance.now() - startTime;
    const totalTime = this.metrics.avgResponseTime * (this.metrics.totalRequests - 1);
    this.metrics.avgResponseTime = (totalTime + responseTime) / this.metrics.totalRequests;
  }
}

export const unifiedCacheService = new UnifiedCacheService();
