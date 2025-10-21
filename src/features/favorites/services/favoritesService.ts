/**
 * Favorites Service
 * Manages user favorites with offline support
 */

import { indexedDBService } from '@/services/storage/IndexedDBService';
import { offlineQueue } from '@/services/offline/OfflineQueueService';

export interface Favorite {
  id: string;
  locationId: string;
  locationName: string;
  category: 'restaurant' | 'grocery' | 'market';
  addedAt: number;
  notes?: string;
  tags?: string[];
}

class FavoritesService {
  private readonly STORE_NAME = 'favorites' as const;

  async addFavorite(favorite: Omit<Favorite, 'id' | 'addedAt'>): Promise<Favorite> {
    const newFavorite: Favorite = {
      ...favorite,
      id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: Date.now()
    };

    // Save locally
    await indexedDBService.set(this.STORE_NAME, newFavorite.id, newFavorite);

    // Sync to server if online
    if (navigator.onLine) {
      try {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFavorite)
        });
      } catch (error) {
        // Queue for retry
        await offlineQueue.enqueue({
          url: '/api/favorites',
          method: 'POST',
          body: newFavorite,
          priority: 'normal',
          maxRetries: 3
        });
      }
    }

    return newFavorite;
  }

  async removeFavorite(id: string): Promise<void> {
    await indexedDBService.delete(this.STORE_NAME, id);

    if (navigator.onLine) {
      try {
        await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      } catch (error) {
        await offlineQueue.enqueue({
          url: `/api/favorites/${id}`,
          method: 'DELETE',
          priority: 'normal',
          maxRetries: 3
        });
      }
    }
  }

  async getFavorites(): Promise<Favorite[]> {
    return indexedDBService.getAll<Favorite>(this.STORE_NAME);
  }

  async getFavoritesByCategory(category: Favorite['category']): Promise<Favorite[]> {
    const all = await this.getFavorites();
    return all.filter(fav => fav.category === category);
  }

  async isFavorite(locationId: string): Promise<boolean> {
    const all = await this.getFavorites();
    return all.some(fav => fav.locationId === locationId);
  }

  async updateFavorite(id: string, updates: Partial<Favorite>): Promise<void> {
    const favorites = await this.getFavorites();
    const favorite = favorites.find(f => f.id === id);
    
    if (favorite) {
      const updated = { ...favorite, ...updates };
      await indexedDBService.set(this.STORE_NAME, id, updated);

      if (navigator.onLine) {
        try {
          await fetch(`/api/favorites/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          });
        } catch (error) {
          await offlineQueue.enqueue({
            url: `/api/favorites/${id}`,
            method: 'PATCH',
            body: updates,
            priority: 'normal',
            maxRetries: 3
          });
        }
      }
    }
  }
}

export const favoritesService = new FavoritesService();
