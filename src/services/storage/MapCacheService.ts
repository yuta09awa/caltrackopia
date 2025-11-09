/**
 * Map Cache Service
 * Implements IndexedDB persistence layer for map locations with 24-hour TTL
 */

import { indexedDBService } from './IndexedDBService';
import { Location } from '@/features/locations/types';

export interface CachedLocationData {
  locations: Location[];
  query?: string;
  timestamp: number;
}

export interface CacheStats {
  totalEntries: number;
  memoryCacheSize: number;
  indexedDBSize: number;
  lastCleared?: number;
}

class MapCacheService {
  private readonly MAP_LOCATIONS_STORE = 'map_locations' as const;
  private readonly MAP_SEARCHES_STORE = 'map_searches' as const;
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get locations from IndexedDB cache
   */
  async getLocations(key: string): Promise<Location[] | null> {
    try {
      const data = await indexedDBService.get<CachedLocationData>(
        this.MAP_LOCATIONS_STORE,
        key
      );
      
      if (data) {
        console.log('[MapCache] IndexedDB hit:', key);
        return data.locations;
      }
      
      console.log('[MapCache] IndexedDB miss:', key);
      return null;
    } catch (error) {
      console.error('[MapCache] Error getting from IndexedDB:', error);
      return null;
    }
  }

  /**
   * Store locations in IndexedDB cache with 24-hour TTL
   */
  async setLocations(key: string, locations: Location[], query?: string): Promise<void> {
    try {
      const data: CachedLocationData = {
        locations,
        query,
        timestamp: Date.now()
      };
      
      await indexedDBService.set(
        this.MAP_LOCATIONS_STORE,
        key,
        data,
        this.DEFAULT_TTL
      );
      
      console.log('[MapCache] Stored in IndexedDB:', key, `(${locations.length} locations)`);
    } catch (error) {
      console.error('[MapCache] Error storing in IndexedDB:', error);
    }
  }

  /**
   * Get search results from IndexedDB cache
   */
  async getSearchResults(query: string): Promise<Location[] | null> {
    const key = `search-${query.toLowerCase()}`;
    try {
      const data = await indexedDBService.get<CachedLocationData>(
        this.MAP_SEARCHES_STORE,
        key
      );
      
      if (data) {
        console.log('[MapCache] Search cache hit:', query);
        return data.locations;
      }
      
      return null;
    } catch (error) {
      console.error('[MapCache] Error getting search results:', error);
      return null;
    }
  }

  /**
   * Store search results in IndexedDB cache
   */
  async setSearchResults(query: string, locations: Location[]): Promise<void> {
    const key = `search-${query.toLowerCase()}`;
    try {
      const data: CachedLocationData = {
        locations,
        query,
        timestamp: Date.now()
      };
      
      await indexedDBService.set(
        this.MAP_SEARCHES_STORE,
        key,
        data,
        this.DEFAULT_TTL
      );
      
      console.log('[MapCache] Stored search in IndexedDB:', query);
    } catch (error) {
      console.error('[MapCache] Error storing search results:', error);
    }
  }

  /**
   * Clear all map caches
   */
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        indexedDBService.clear(this.MAP_LOCATIONS_STORE),
        indexedDBService.clear(this.MAP_SEARCHES_STORE)
      ]);
      console.log('[MapCache] All caches cleared');
    } catch (error) {
      console.error('[MapCache] Error clearing caches:', error);
    }
  }

  /**
   * Clear expired entries
   */
  async clearExpired(): Promise<void> {
    try {
      const [locationsCleared, searchesCleared] = await Promise.all([
        indexedDBService.clearExpired(this.MAP_LOCATIONS_STORE),
        indexedDBService.clearExpired(this.MAP_SEARCHES_STORE)
      ]);
      console.log(`[MapCache] Cleared ${locationsCleared + searchesCleared} expired entries`);
    } catch (error) {
      console.error('[MapCache] Error clearing expired entries:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    try {
      const [locationsCount, searchesCount] = await Promise.all([
        indexedDBService.count(this.MAP_LOCATIONS_STORE),
        indexedDBService.count(this.MAP_SEARCHES_STORE)
      ]);

      return {
        totalEntries: locationsCount + searchesCount,
        memoryCacheSize: 0, // Will be updated by enhanced caching service
        indexedDBSize: locationsCount + searchesCount
      };
    } catch (error) {
      console.error('[MapCache] Error getting stats:', error);
      return {
        totalEntries: 0,
        memoryCacheSize: 0,
        indexedDBSize: 0
      };
    }
  }
}

export const mapCacheService = new MapCacheService();
