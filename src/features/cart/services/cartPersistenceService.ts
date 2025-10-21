/**
 * Cart Persistence Service
 * Manages cart state persistence to IndexedDB
 */

import { indexedDBService } from '@/services/storage/IndexedDBService';
import type { CartItem } from '@/types/cart';

const CART_KEY = 'shopping_cart';
const CART_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface PersistedCart {
  items: CartItem[];
  total: number;
  itemCount: number;
  lastModified: number;
}

class CartPersistenceService {
  async saveCart(cart: PersistedCart): Promise<void> {
    await indexedDBService.set(
      'cart',
      CART_KEY,
      { ...cart, lastModified: Date.now() },
      CART_EXPIRY
    );
  }

  async loadCart(): Promise<PersistedCart | null> {
    return indexedDBService.get<PersistedCart>('cart', CART_KEY);
  }

  async clearCart(): Promise<void> {
    await indexedDBService.delete('cart', CART_KEY);
  }

  async syncAcrossTabs(): Promise<void> {
    // Listen for storage events from other tabs
    window.addEventListener('storage', async (event) => {
      if (event.key === 'cart_updated') {
        const cart = await this.loadCart();
        // Dispatch custom event for cart update
        window.dispatchEvent(new CustomEvent('cart_sync', { detail: cart }));
      }
    });
  }

  notifyOtherTabs(): void {
    localStorage.setItem('cart_updated', Date.now().toString());
  }
}

export const cartPersistenceService = new CartPersistenceService();
