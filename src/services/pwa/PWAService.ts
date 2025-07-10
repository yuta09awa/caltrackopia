import { logger } from '@/services/logging/LoggingService';

/**
 * PWA service for offline functionality and app installation
 */
export class PWAService {
  private static instance: PWAService;
  private isOnline: boolean = navigator.onLine;
  private deferredPrompt: any = null;
  private offlineQueue: Array<{ url: string; options: RequestInit }> = [];

  private constructor() {
    this.setupEventListeners();
    this.registerServiceWorker();
  }

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  private setupEventListeners(): void {
    // Online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true;
      logger.info('App came online');
      this.processOfflineQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      logger.warn('App went offline');
    });

    // App installation prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      logger.info('PWA install prompt available');
    });

    // App installed
    window.addEventListener('appinstalled', () => {
      logger.info('PWA installed successfully');
      this.deferredPrompt = null;
    });
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        logger.info('Service Worker registered', { scope: registration.scope });

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                logger.info('New service worker available');
                this.notifyUpdate();
              }
            });
          }
        });
      } catch (error) {
        logger.error('Service Worker registration failed', error as Error);
      }
    }
  }

  private notifyUpdate(): void {
    // Dispatch custom event for app to handle update notification
    window.dispatchEvent(new CustomEvent('pwa:update-available'));
  }

  async updateServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }

  /**
   * Install the app
   */
  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      logger.warn('Install prompt not available');
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const result = await this.deferredPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        logger.info('User accepted app installation');
        return true;
      } else {
        logger.info('User dismissed app installation');
        return false;
      }
    } catch (error) {
      logger.error('App installation failed', error as Error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  /**
   * Check if app can be installed
   */
  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  /**
   * Check if app is installed
   */
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  /**
   * Get online status
   */
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Queue request for when online
   */
  queueForOnline(url: string, options: RequestInit = {}): void {
    this.offlineQueue.push({ url, options });
    logger.debug('Request queued for online', { url, queueLength: this.offlineQueue.length });
  }

  /**
   * Process queued requests when back online
   */
  private async processOfflineQueue(): Promise<void> {
    if (this.offlineQueue.length === 0) return;

    logger.info(`Processing ${this.offlineQueue.length} queued requests`);

    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const { url, options } of queue) {
      try {
        await fetch(url, options);
        logger.debug('Queued request processed successfully', { url });
      } catch (error) {
        logger.error('Failed to process queued request', error as Error, { url });
        // Re-queue failed requests
        this.offlineQueue.push({ url, options });
      }
    }
  }

  /**
   * Cache management
   */
  cache = {
    /**
     * Add to cache
     */
    add: async (url: string): Promise<void> => {
      if ('caches' in window) {
        try {
          const cache = await caches.open('app-cache-v1');
          await cache.add(url);
          logger.debug('Added to cache', { url });
        } catch (error) {
          logger.error('Failed to add to cache', error as Error, { url });
        }
      }
    },

    /**
     * Get from cache
     */
    get: async (url: string): Promise<Response | null> => {
      if ('caches' in window) {
        try {
          const cache = await caches.open('app-cache-v1');
          const response = await cache.match(url);
          if (response) {
            logger.debug('Cache hit', { url });
          }
          return response || null;
        } catch (error) {
          logger.error('Failed to get from cache', error as Error, { url });
          return null;
        }
      }
      return null;
    },

    /**
     * Clear cache
     */
    clear: async (): Promise<void> => {
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
          logger.info('Cache cleared');
        } catch (error) {
          logger.error('Failed to clear cache', error as Error);
        }
      }
    }
  };

  /**
   * Background sync for offline actions
   */
  backgroundSync = {
    /**
     * Register background sync
     */
    register: async (tag: string): Promise<void> => {
      if ('serviceWorker' in navigator && 'sync' in (window as any).ServiceWorkerRegistration.prototype) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await (registration as any).sync.register(tag);
          logger.debug('Background sync registered', { tag });
        } catch (error) {
          logger.error('Background sync registration failed', error as Error, { tag });
        }
      }
    }
  };

  /**
   * Share API integration
   */
  share = {
    /**
     * Check if native sharing is available
     */
    isAvailable: (): boolean => {
      return 'share' in navigator;
    },

    /**
     * Share content
     */
    share: async (data: ShareData): Promise<boolean> => {
      if (this.share.isAvailable()) {
        try {
          await navigator.share(data);
          logger.info('Content shared successfully', { title: data.title });
          return true;
        } catch (error) {
          if ((error as Error).name !== 'AbortError') {
            logger.error('Share failed', error as Error);
          }
          return false;
        }
      } else {
        // Fallback to clipboard or custom share UI
        if (data.url) {
          await navigator.clipboard.writeText(data.url);
          logger.info('URL copied to clipboard');
          return true;
        }
        return false;
      }
    }
  };

  /**
   * Get device info for analytics
   */
  getDeviceInfo(): {
    isStandalone: boolean;
    isOnline: boolean;
    isInstallable: boolean;
    platform: string;
    connection?: any;
  } {
    return {
      isStandalone: this.isInstalled(),
      isOnline: this.isOnline,
      isInstallable: this.canInstall(),
      platform: navigator.platform,
      connection: (navigator as any).connection
    };
  }
}

// Export singleton instance
export const pwa = PWAService.getInstance();