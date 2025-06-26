
interface CacheConfig {
  maxAge: number; // in milliseconds
  version: string;
}

class BrowserCachingService {
  private readonly storageKey = 'app-cache';
  private readonly versionKey = 'app-cache-version';
  private readonly currentVersion = '1.0.0';

  // localStorage for persistent data
  setItem(key: string, data: any, config?: Partial<CacheConfig>): void {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        maxAge: config?.maxAge || 24 * 60 * 60 * 1000, // Default 24 hours
        version: config?.version || this.currentVersion
      };

      localStorage.setItem(`${this.storageKey}-${key}`, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('Failed to cache data in localStorage:', error);
    }
  }

  getItem(key: string): any | null {
    try {
      const cached = localStorage.getItem(`${this.storageKey}-${key}`);
      if (!cached) return null;

      const cacheEntry = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is expired
      if (now - cacheEntry.timestamp > cacheEntry.maxAge) {
        this.removeItem(key);
        return null;
      }

      // Check version compatibility
      if (cacheEntry.version !== this.currentVersion) {
        this.removeItem(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(`${this.storageKey}-${key}`);
    } catch (error) {
      console.warn('Failed to remove cached data:', error);
    }
  }

  // sessionStorage for temporary data
  setSessionItem(key: string, data: any): void {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        version: this.currentVersion
      };

      sessionStorage.setItem(`${this.storageKey}-session-${key}`, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('Failed to cache data in sessionStorage:', error);
    }
  }

  getSessionItem(key: string): any | null {
    try {
      const cached = sessionStorage.getItem(`${this.storageKey}-session-${key}`);
      if (!cached) return null;

      const cacheEntry = JSON.parse(cached);
      
      // Check version compatibility
      if (cacheEntry.version !== this.currentVersion) {
        this.removeSessionItem(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.warn('Failed to retrieve session cached data:', error);
      return null;
    }
  }

  removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(`${this.storageKey}-session-${key}`);
    } catch (error) {
      console.warn('Failed to remove session cached data:', error);
    }
  }

  // User preferences caching
  setUserPreference(key: string, value: any): void {
    this.setItem(`user-pref-${key}`, value, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
  }

  getUserPreference(key: string): any | null {
    return this.getItem(`user-pref-${key}`);
  }

  // Location data caching
  cacheLocationData(key: string, data: any): void {
    this.setItem(`location-${key}`, data, { maxAge: 30 * 60 * 1000 }); // 30 minutes
  }

  getCachedLocationData(key: string): any | null {
    return this.getItem(`location-${key}`);
  }

  // Search results caching
  cacheSearchResults(query: string, results: any): void {
    this.setSessionItem(`search-${query}`, results);
  }

  getCachedSearchResults(query: string): any | null {
    return this.getSessionItem(`search-${query}`);
  }

  // Clear all cache
  clearCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.storageKey)) {
          localStorage.removeItem(key);
        }
      });

      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach(key => {
        if (key.startsWith(this.storageKey)) {
          sessionStorage.removeItem(key);
        }
      });

      console.log('Cache cleared successfully');
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  // Get cache statistics
  getCacheStats(): { localStorage: number; sessionStorage: number } {
    try {
      let localStorageCount = 0;
      let sessionStorageCount = 0;

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.storageKey)) {
          localStorageCount++;
        }
      });

      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(this.storageKey)) {
          sessionStorageCount++;
        }
      });

      return {
        localStorage: localStorageCount,
        sessionStorage: sessionStorageCount
      };
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
      return { localStorage: 0, sessionStorage: 0 };
    }
  }
}

export const browserCachingService = new BrowserCachingService();
