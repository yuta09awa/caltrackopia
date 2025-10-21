/**
 * Offline-First Hooks
 * Provides offline-first data access and synchronization
 */

import { useState, useEffect, useCallback } from 'react';
import { indexedDBService } from '@/services/storage/IndexedDBService';
import { offlineQueue } from '@/services/offline/OfflineQueueService';
import { dataSync } from '@/services/sync/DataSyncService';

export interface UseOfflineFirstOptions<T> {
  key: string;
  fetchFn: () => Promise<T>;
  cacheTime?: number;
  syncEnabled?: boolean;
}

export function useOfflineFirst<T>(
  storeName: 'cart' | 'searches' | 'favorites' | 'preferences',
  options: UseOfflineFirstOptions<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try cache first
      const cached = await indexedDBService.get<T>(storeName, options.key);
      
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      // Fetch fresh data if online
      if (isOnline) {
        try {
          const fresh = await options.fetchFn();
          setData(fresh);
          
          // Update cache
          await indexedDBService.set(
            storeName,
            options.key,
            fresh,
            options.cacheTime
          );
        } catch (fetchError) {
          // If fetch fails but we have cache, use it
          if (!cached) {
            throw fetchError;
          }
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [storeName, options.key, options.fetchFn, options.cacheTime, isOnline]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sync = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const update = useCallback(async (updater: (current: T | null) => T) => {
    const newData = updater(data);
    setData(newData);
    
    await indexedDBService.set(storeName, options.key, newData, options.cacheTime);

    // Sync to server if online
    if (isOnline && options.syncEnabled) {
      await dataSync.sync(options.key);
    }
  }, [data, storeName, options.key, options.cacheTime, options.syncEnabled, isOnline]);

  return {
    data,
    loading,
    error,
    isOnline,
    sync,
    update
  };
}

export function useOfflineData<T>(
  storeName: 'cart' | 'searches' | 'favorites' | 'preferences',
  key: string
) {
  const [data, setData] = useState<T | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const stored = await indexedDBService.get<T>(storeName, key);
      setData(stored);
    };
    
    loadData();
  }, [storeName, key]);

  const update = useCallback(async (updater: (current: T | null) => T) => {
    const newData = updater(data);
    setData(newData);
    await indexedDBService.set(storeName, key, newData);
  }, [data, storeName, key]);

  const clear = useCallback(async () => {
    setData(null);
    await indexedDBService.delete(storeName, key);
  }, [storeName, key]);

  return {
    data,
    update,
    clear,
    isOnline
  };
}

export function useSyncStatus() {
  const [syncing, setSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const updateStatus = async () => {
      const status = await offlineQueue.getStatus();
      setPendingCount(status.pending);
    };

    updateStatus();
    const unsubscribe = offlineQueue.onChange(updateStatus);

    return unsubscribe;
  }, []);

  const triggerSync = useCallback(async () => {
    setSyncing(true);
    try {
      await offlineQueue.processQueue();
      setLastSync(new Date());
    } finally {
      setSyncing(false);
    }
  }, []);

  return {
    syncing,
    pendingCount,
    lastSync,
    triggerSync
  };
}
