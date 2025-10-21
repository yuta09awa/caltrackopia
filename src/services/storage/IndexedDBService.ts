/**
 * IndexedDB Service
 * Provides structured offline storage with type safety
 */

const DB_NAME = 'caltrackopia_db';
const DB_VERSION = 1;

export interface StoredItem<T = any> {
  id: string;
  data: T;
  timestamp: number;
  expiresAt?: number;
}

export type StoreName = 'cart' | 'searches' | 'favorites' | 'preferences' | 'offline_queue' | 'sync_metadata';

class IndexedDBService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        const stores: StoreName[] = ['cart', 'searches', 'favorites', 'preferences', 'offline_queue', 'sync_metadata'];
        
        stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
        });
      };
    });

    return this.initPromise;
  }

  async set<T>(storeName: StoreName, id: string, data: T, expiresInMs?: number): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const item: StoredItem<T> = {
      id,
      data,
      timestamp: Date.now(),
      expiresAt: expiresInMs ? Date.now() + expiresInMs : undefined
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: StoreName, id: string): Promise<T | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise<T | null>((resolve, reject) => {
      const request = store.get(id);
      
      request.onsuccess = () => {
        const item = request.result as StoredItem<T> | undefined;
        
        if (!item) {
          resolve(null);
          return;
        }

        // Check expiration
        if (item.expiresAt && Date.now() > item.expiresAt) {
          this.delete(storeName, id);
          resolve(null);
          return;
        }

        resolve(item.data);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: StoreName): Promise<T[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise<T[]>((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        const items = (request.result as StoredItem<T>[]) || [];
        const now = Date.now();
        
        // Filter expired items and extract data
        const validItems = items
          .filter(item => !item.expiresAt || now <= item.expiresAt)
          .map(item => item.data);
        
        resolve(validItems);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: StoreName, id: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: StoreName): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    await new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearExpired(storeName: StoreName): Promise<number> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const now = Date.now();
    let deletedCount = 0;

    return new Promise<number>((resolve, reject) => {
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null;
        
        if (cursor) {
          const item = cursor.value as StoredItem;
          
          if (item.expiresAt && now > item.expiresAt) {
            cursor.delete();
            deletedCount++;
          }
          
          cursor.continue();
        } else {
          resolve(deletedCount);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async count(storeName: StoreName): Promise<number> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise<number>((resolve, reject) => {
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBService = new IndexedDBService();
