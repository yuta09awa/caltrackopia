
import { useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number;
}

export const useEnhancedCaching = <T>(options: CacheOptions = {}) => {
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options; // Default 5 minutes TTL
  const cache = useRef<Map<string, CacheEntry<T>>>(new Map());

  const get = useCallback((key: string): T | null => {
    const entry = cache.current.get(key);
    
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      cache.current.delete(key);
      return null;
    }
    
    return entry.data;
  }, []);

  const set = useCallback((key: string, data: T, customTtl?: number): void => {
    // If cache exceeds max size, remove oldest entries
    if (cache.current.size >= maxSize) {
      const firstKey = cache.current.keys().next().value;
      if (firstKey) {
        cache.current.delete(firstKey);
      }
    }
    
    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl: customTtl || ttl
    });
  }, [ttl, maxSize]);

  const has = useCallback((key: string): boolean => {
    const entry = cache.current.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      cache.current.delete(key);
      return false;
    }
    
    return true;
  }, []);

  const clear = useCallback((): void => {
    cache.current.clear();
  }, []);

  const remove = useCallback((key: string): void => {
    cache.current.delete(key);
  }, []);

  const size = useCallback((): number => {
    return cache.current.size;
  }, []);

  return {
    get,
    set,
    has,
    clear,
    remove,
    size
  };
};
