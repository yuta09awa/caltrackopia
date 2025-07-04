import { useState, useCallback, useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';

// Standard loading/error/data state pattern
export interface StandardState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

/**
 * Standardized async state hook with common patterns
 */
export function useStandardAsyncState<T>(
  initialData: T | null = null
): StandardState<T> & {
  setData: (data: T | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
  execute: (asyncFn: () => Promise<T>) => Promise<T | null>;
} {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
    setLastUpdated(null);
  }, [initialData]);

  const execute = useCallback(async (asyncFn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      setData(result);
      setLastUpdated(new Date());
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdated,
    setData,
    setLoading,
    setError,
    reset,
    execute
  };
}

/**
 * Standardized cache hook with TTL and invalidation
 */
export function useStandardCache<T>(
  key: string,
  ttlMs: number = 5 * 60 * 1000 // 5 minutes default
) {
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());

  const get = useCallback((cacheKey: string = key): T | null => {
    const cached = cacheRef.current.get(cacheKey);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > ttlMs;
    if (isExpired) {
      cacheRef.current.delete(cacheKey);
      return null;
    }
    
    return cached.data;
  }, [key, ttlMs]);

  const set = useCallback((data: T, cacheKey: string = key) => {
    cacheRef.current.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }, [key]);

  const invalidate = useCallback((cacheKey?: string) => {
    if (cacheKey) {
      cacheRef.current.delete(cacheKey);
    } else {
      cacheRef.current.clear();
    }
  }, []);

  const has = useCallback((cacheKey: string = key): boolean => {
    const cached = cacheRef.current.get(cacheKey);
    if (!cached) return false;
    
    const isExpired = Date.now() - cached.timestamp > ttlMs;
    if (isExpired) {
      cacheRef.current.delete(cacheKey);
      return false;
    }
    
    return true;
  }, [key, ttlMs]);

  return { get, set, invalidate, has };
}

/**
 * Standardized debounced search hook
 */
export function useStandardSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  debounceMs: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const executeSearch = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const searchResults = await searchFn(debouncedQuery);
        setResults(searchResults);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Search failed');
        setError(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [debouncedQuery, searchFn]);

  const clearResults = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearResults
  };
}

/**
 * Standardized pagination hook
 */
export function useStandardPagination<T>(
  fetchFn: (page: number, pageSize: number) => Promise<{ items: T[]; total: number }>,
  initialPageSize: number = 20
) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadPage = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn(targetPage, pageSize);
      setItems(result.items);
      setTotal(result.total);
      setPage(targetPage);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load page');
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, pageSize]);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const nextPage = useCallback(() => {
    const maxPage = Math.ceil(total / pageSize);
    if (page < maxPage) {
      loadPage(page + 1);
    }
  }, [page, total, pageSize, loadPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      loadPage(page - 1);
    }
  }, [page, loadPage]);

  const goToPage = useCallback((targetPage: number) => {
    const maxPage = Math.ceil(total / pageSize);
    const validPage = Math.max(1, Math.min(targetPage, maxPage));
    loadPage(validPage);
  }, [total, pageSize, loadPage]);

  return {
    page,
    pageSize,
    items,
    total,
    loading,
    error,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
    reload: () => loadPage(page)
  };
}