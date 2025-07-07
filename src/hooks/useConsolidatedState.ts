import { useState, useCallback, useEffect } from 'react';
import { useStandardAsyncState, useStandardCache } from './useStandardizedHooks';

/**
 * Consolidated state management hook that combines:
 * - Async state management
 * - Caching with TTL
 * - Loading/error states
 * - Optimistic updates
 */
export function useConsolidatedState<T>(
  key: string,
  initialData: T | null = null,
  options: {
    ttl?: number;
    enableCache?: boolean;
    enableOptimisticUpdates?: boolean;
  } = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    enableCache = true,
    enableOptimisticUpdates = false
  } = options;

  // Core state management
  const asyncState = useStandardAsyncState<T>(initialData);
  
  // Caching layer
  const cache = useStandardCache<T>(key, ttl);
  
  // Optimistic update state
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const [isOptimistic, setIsOptimistic] = useState(false);

  // Initialize from cache
  useEffect(() => {
    if (enableCache && !asyncState.data) {
      const cachedData = cache.get();
      if (cachedData) {
        asyncState.setData(cachedData);
      }
    }
  }, [enableCache, asyncState.data, cache, asyncState]);

  // Execute operation with caching
  const execute = useCallback(async (
    asyncFn: () => Promise<T>,
    options: {
      skipCache?: boolean;
      optimisticData?: T;
    } = {}
  ): Promise<T | null> => {
    const { skipCache = false, optimisticData: optData } = options;

    // Handle optimistic updates
    if (enableOptimisticUpdates && optData) {
      setOptimisticData(optData);
      setIsOptimistic(true);
    }

    try {
      const result = await asyncState.execute(asyncFn);
      
      if (result && enableCache && !skipCache) {
        cache.set(result);
      }

      // Clear optimistic state on success
      if (isOptimistic) {
        setIsOptimistic(false);
        setOptimisticData(null);
      }

      return result;
    } catch (error) {
      // Revert optimistic updates on error
      if (isOptimistic) {
        setIsOptimistic(false);
        setOptimisticData(null);
      }
      throw error;
    }
  }, [asyncState, enableCache, cache, enableOptimisticUpdates, isOptimistic]);

  // Get current data (optimistic or actual)
  const getCurrentData = useCallback(() => {
    if (isOptimistic && optimisticData) {
      return optimisticData;
    }
    return asyncState.data;
  }, [isOptimistic, optimisticData, asyncState.data]);

  // Invalidate cache and refresh
  const refresh = useCallback(async (asyncFn: () => Promise<T>) => {
    if (enableCache) {
      cache.invalidate();
    }
    return execute(asyncFn, { skipCache: true });
  }, [execute, enableCache, cache]);

  // Check if data is stale
  const isStale = useCallback(() => {
    return enableCache ? !cache.has() : false;
  }, [enableCache, cache]);

  return {
    // Data
    data: getCurrentData(),
    loading: asyncState.loading,
    error: asyncState.error,
    lastUpdated: asyncState.lastUpdated,
    
    // States
    isOptimistic,
    isStale: isStale(),
    
    // Actions
    execute,
    refresh,
    reset: asyncState.reset,
    setData: asyncState.setData,
    setError: asyncState.setError,
    
    // Cache actions
    invalidateCache: cache.invalidate,
    hasCache: cache.has
  };
}

/**
 * Hook for managing multiple related pieces of state
 */
export function useConsolidatedMultiState<T extends Record<string, any>>(
  keys: (keyof T)[],
  options: {
    ttl?: number;
    enableCache?: boolean;
  } = {}
) {
  const states = keys.reduce((acc, key) => {
    acc[key] = useConsolidatedState<T[keyof T]>(
      String(key),
      null,
      options
    );
    return acc;
  }, {} as Record<keyof T, ReturnType<typeof useConsolidatedState>>);

  const loading = Object.values(states).some(state => state.loading);
  const error = Object.values(states).find(state => state.error)?.error || null;

  const executeAll = useCallback(async (
    asyncFns: Partial<Record<keyof T, () => Promise<T[keyof T]>>>
  ) => {
    const promises = Object.entries(asyncFns).map(([key, fn]) => {
      if (fn && states[key as keyof T]) {
        return states[key as keyof T].execute(fn);
      }
      return Promise.resolve(null);
    });

    return Promise.all(promises);
  }, [states]);

  const resetAll = useCallback(() => {
    Object.values(states).forEach(state => state.reset());
  }, [states]);

  return {
    states,
    loading,
    error,
    executeAll,
    resetAll
  };
}