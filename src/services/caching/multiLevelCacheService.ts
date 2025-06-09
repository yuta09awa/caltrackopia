
import { databaseService } from '../databaseService';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  source: 'level1' | 'level2' | 'level3';
  accessCount: number;
  lastAccessed: number;
}

export interface CacheConfig {
  level1MaxSize: number; // Browser localStorage
  level2MaxAge: number; // Supabase database (in ms)
  level3MaxAge: number; // In-memory cache (in ms)
  compressionEnabled: boolean;
}

export class MultiLevelCacheService {
  private level3Cache: Map<string, CacheItem<any>> = new Map(); // In-memory
  private config: CacheConfig = {
    level1MaxSize: 50, // Number of items
    level2MaxAge: 24 * 60 * 60 * 1000, // 24 hours
    level3MaxAge: 30 * 60 * 1000, // 30 minutes
    compressionEnabled: true
  };

  constructor() {
    this.startCacheCleanup();
  }

  async get<T>(key: string): Promise<T | null> {
    console.log(`Cache lookup for key: ${key}`);

    // Level 3: In-memory cache (fastest)
    const level3Item = this.level3Cache.get(key);
    if (level3Item && this.isValid(level3Item)) {
      level3Item.accessCount++;
      level3Item.lastAccessed = Date.now();
      console.log(`Cache HIT (Level 3): ${key}`);
      return level3Item.data;
    }

    // Level 1: Browser localStorage
    const level1Data = this.getFromLocalStorage<T>(key);
    if (level1Data) {
      console.log(`Cache HIT (Level 1): ${key}`);
      // Promote to Level 3 for faster future access
      this.setLevel3(key, level1Data, this.config.level3MaxAge);
      return level1Data;
    }

    // Level 2: Supabase database
    const level2Data = await this.getFromDatabase<T>(key);
    if (level2Data) {
      console.log(`Cache HIT (Level 2): ${key}`);
      // Promote to Level 1 and Level 3
      this.setLevel1(key, level2Data);
      this.setLevel3(key, level2Data, this.config.level3MaxAge);
      return level2Data;
    }

    console.log(`Cache MISS: ${key}`);
    return null;
  }

  async set<T>(key: string, data: T, options?: {
    level1?: boolean;
    level2?: boolean;
    level3?: boolean;
    ttl?: number;
  }): Promise<void> {
    const opts = {
      level1: true,
      level2: true,
      level3: true,
      ttl: this.config.level2MaxAge,
      ...options
    };

    console.log(`Cache SET: ${key} (L1:${opts.level1}, L2:${opts.level2}, L3:${opts.level3})`);

    if (opts.level3) {
      this.setLevel3(key, data, opts.ttl);
    }

    if (opts.level1) {
      this.setLevel1(key, data);
    }

    if (opts.level2) {
      await this.setLevel2(key, data, opts.ttl);
    }
  }

  async invalidate(key: string): Promise<void> {
    console.log(`Cache INVALIDATE: ${key}`);
    
    // Remove from all levels
    this.level3Cache.delete(key);
    this.removeFromLocalStorage(key);
    await this.removeFromDatabase(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    console.log(`Cache INVALIDATE PATTERN: ${pattern}`);
    
    const regex = new RegExp(pattern);
    
    // Level 3
    for (const key of this.level3Cache.keys()) {
      if (regex.test(key)) {
        this.level3Cache.delete(key);
      }
    }

    // Level 1
    const localStorageKeys = Object.keys(localStorage);
    for (const key of localStorageKeys) {
      if (key.startsWith('cache_') && regex.test(key.substring(6))) {
        localStorage.removeItem(key);
      }
    }

    // Level 2 - would need database query to find matching keys
    // For now, we'll skip this as it's expensive
  }

  private setLevel3<T>(key: string, data: T, ttl: number): void {
    // Implement LRU eviction if cache is full
    if (this.level3Cache.size >= 100) { // Max 100 items in memory
      const oldestKey = this.findOldestKey();
      if (oldestKey) {
        this.level3Cache.delete(oldestKey);
      }
    }

    this.level3Cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      source: 'level3',
      accessCount: 1,
      lastAccessed: Date.now()
    });
  }

  private setLevel1<T>(key: string, data: T): void {
    try {
      // Implement size-based eviction
      const currentSize = Object.keys(localStorage).filter(k => k.startsWith('cache_')).length;
      if (currentSize >= this.config.level1MaxSize) {
        this.evictOldestFromLocalStorage();
      }

      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: this.config.level2MaxAge,
        source: 'level1',
        accessCount: 1,
        lastAccessed: Date.now()
      };

      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Failed to set Level 1 cache:', error);
      // LocalStorage might be full, try to clear some space
      this.evictOldestFromLocalStorage();
    }
  }

  private async setLevel2<T>(key: string, data: T, ttl: number): Promise<void> {
    try {
      // In a real implementation, you'd store this in a dedicated cache table
      // For now, we'll skip Level 2 database caching as it requires schema changes
      console.log(`Level 2 cache SET skipped for: ${key}`);
    } catch (error) {
      console.warn('Failed to set Level 2 cache:', error);
    }
  }

  private getFromLocalStorage<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const cacheItem: CacheItem<T> = JSON.parse(item);
      if (this.isValid(cacheItem)) {
        cacheItem.accessCount++;
        cacheItem.lastAccessed = Date.now();
        localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
        return cacheItem.data;
      } else {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
    } catch (error) {
      console.warn('Failed to get from Level 1 cache:', error);
      return null;
    }
  }

  private async getFromDatabase<T>(key: string): Promise<T | null> {
    try {
      // In a real implementation, you'd query a dedicated cache table
      // For now, we'll skip Level 2 database caching
      return null;
    } catch (error) {
      console.warn('Failed to get from Level 2 cache:', error);
      return null;
    }
  }

  private removeFromLocalStorage(key: string): void {
    localStorage.removeItem(`cache_${key}`);
  }

  private async removeFromDatabase(key: string): Promise<void> {
    try {
      // In a real implementation, you'd delete from a dedicated cache table
      console.log(`Level 2 cache DELETE skipped for: ${key}`);
    } catch (error) {
      console.warn('Failed to remove from Level 2 cache:', error);
    }
  }

  private isValid(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp < item.ttl;
  }

  private findOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.level3Cache) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  private evictOldestFromLocalStorage(): void {
    const cacheKeys = Object.keys(localStorage).filter(k => k.startsWith('cache_'));
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const key of cacheKeys) {
      try {
        const item = JSON.parse(localStorage.getItem(key) || '{}');
        if (item.lastAccessed && item.lastAccessed < oldestTime) {
          oldestTime = item.lastAccessed;
          oldestKey = key;
        }
      } catch (error) {
        // Invalid item, remove it
        localStorage.removeItem(key);
      }
    }

    if (oldestKey) {
      localStorage.removeItem(oldestKey);
    }
  }

  private startCacheCleanup(): void {
    // Clean up expired items every 5 minutes
    setInterval(() => {
      this.cleanupExpiredItems();
    }, 5 * 60 * 1000);
  }

  private cleanupExpiredItems(): void {
    // Level 3 cleanup
    for (const [key, item] of this.level3Cache) {
      if (!this.isValid(item)) {
        this.level3Cache.delete(key);
      }
    }

    // Level 1 cleanup
    const cacheKeys = Object.keys(localStorage).filter(k => k.startsWith('cache_'));
    for (const key of cacheKeys) {
      try {
        const item = JSON.parse(localStorage.getItem(key) || '{}');
        if (!this.isValid(item)) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        localStorage.removeItem(key);
      }
    }
  }

  getCacheStats() {
    const level1Size = Object.keys(localStorage).filter(k => k.startsWith('cache_')).length;
    const level3Size = this.level3Cache.size;

    return {
      level1: { size: level1Size, maxSize: this.config.level1MaxSize },
      level2: { size: 0, maxAge: this.config.level2MaxAge }, // Would be populated with real DB implementation
      level3: { size: level3Size, maxSize: 100, maxAge: this.config.level3MaxAge }
    };
  }
}

export const multiLevelCacheService = new MultiLevelCacheService();
