/**
 * Data Sync Service
 * Handles bidirectional data synchronization with conflict resolution
 */

import { indexedDBService } from '../storage/IndexedDBService';

export type ConflictResolution = 'server-wins' | 'client-wins' | 'merge';

export interface SyncConfig {
  endpoint: string;
  conflictResolution: ConflictResolution;
  syncInterval?: number;
}

export interface SyncMetadata {
  lastSync: number;
  lastModified: number;
  version: number;
  hash?: string;
}

class DataSyncService {
  private configs = new Map<string, SyncConfig>();
  private syncTimers = new Map<string, NodeJS.Timeout>();

  configure(key: string, config: SyncConfig): void {
    this.configs.set(key, config);

    // Set up automatic sync if interval specified
    if (config.syncInterval) {
      this.clearTimer(key);
      const timer = setInterval(() => this.sync(key), config.syncInterval);
      this.syncTimers.set(key, timer);
    }
  }

  async sync(key: string): Promise<void> {
    const config = this.configs.get(key);
    if (!config) {
      throw new Error(`No sync config found for key: ${key}`);
    }

    const metadata = await this.getMetadata(key);
    const localData = await indexedDBService.get(this.getStoreName(key), key);

    try {
      // Fetch server data
      const response = await fetch(config.endpoint, {
        method: 'GET',
        headers: {
          'If-Modified-Since': new Date(metadata?.lastSync || 0).toUTCString()
        }
      });

      if (response.status === 304) {
        // Not modified - no sync needed
        return;
      }

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      const serverData = await response.json();

      // Conflict resolution
      const resolvedData = await this.resolveConflict(
        localData,
        serverData,
        config.conflictResolution,
        metadata
      );

      // Update local data
      await indexedDBService.set(
        this.getStoreName(key),
        key,
        resolvedData
      );

      // Update metadata
      await this.updateMetadata(key, {
        lastSync: Date.now(),
        lastModified: Date.now(),
        version: (metadata?.version || 0) + 1
      });

      // Push local changes to server if needed
      if (localData && config.conflictResolution !== 'server-wins') {
        await this.pushToServer(key, resolvedData, config);
      }
    } catch (error) {
      console.error('Sync error:', error);
      throw error;
    }
  }

  private async resolveConflict(
    local: any,
    server: any,
    strategy: ConflictResolution,
    metadata: SyncMetadata | null
  ): Promise<any> {
    if (!local) return server;
    if (!server) return local;

    switch (strategy) {
      case 'server-wins':
        return server;
      
      case 'client-wins':
        return local;
      
      case 'merge':
        // Simple merge strategy - can be customized per feature
        if (Array.isArray(local) && Array.isArray(server)) {
          return this.mergeArrays(local, server);
        }
        if (typeof local === 'object' && typeof server === 'object') {
          return { ...server, ...local };
        }
        return local; // Default to local for primitive types
    }
  }

  private mergeArrays(local: any[], server: any[]): any[] {
    const merged = new Map();
    
    // Add server items
    server.forEach(item => {
      const id = item.id || JSON.stringify(item);
      merged.set(id, item);
    });
    
    // Add/override with local items
    local.forEach(item => {
      const id = item.id || JSON.stringify(item);
      merged.set(id, item);
    });
    
    return Array.from(merged.values());
  }

  private async pushToServer(key: string, data: any, config: SyncConfig): Promise<void> {
    try {
      await fetch(config.endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Push to server failed:', error);
      // Queue for retry
    }
  }

  private async getMetadata(key: string): Promise<SyncMetadata | null> {
    return indexedDBService.get('sync_metadata', key);
  }

  private async updateMetadata(key: string, metadata: SyncMetadata): Promise<void> {
    await indexedDBService.set('sync_metadata', key, metadata);
  }

  async getStatus(key: string): Promise<SyncMetadata | null> {
    return this.getMetadata(key);
  }

  private getStoreName(key: string): any {
    // Map keys to store names
    const storeMap: Record<string, string> = {
      cart: 'cart',
      favorites: 'favorites',
      preferences: 'preferences'
    };
    return storeMap[key] || 'preferences';
  }

  private clearTimer(key: string): void {
    const timer = this.syncTimers.get(key);
    if (timer) {
      clearInterval(timer);
      this.syncTimers.delete(key);
    }
  }

  destroy(): void {
    this.syncTimers.forEach(timer => clearInterval(timer));
    this.syncTimers.clear();
    this.configs.clear();
  }
}

export const dataSync = new DataSyncService();
