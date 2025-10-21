/**
 * Cart Persistence Hook
 * Initializes cart from IndexedDB on app load
 */

import { useEffect } from 'react';
import { useCart } from '../store/useCart';
import { cartPersistenceService } from '../services/cartPersistenceService';

export function useCartPersistence() {
  const cart = useCart();

  useEffect(() => {
    const initializeCart = async () => {
      try {
        const persistedCart = await cartPersistenceService.loadCart();
        
        if (persistedCart && persistedCart.items.length > 0) {
          // Restore cart items
          persistedCart.items.forEach(item => {
            cart.addItem(
              item.originalItem,
              item.locationId,
              item.locationName,
              item.locationType
            );
          });
          
          console.log('Cart restored from IndexedDB:', persistedCart);
        }
      } catch (error) {
        console.error('Failed to initialize cart from IndexedDB:', error);
      }
    };

    initializeCart();
    
    // Set up cross-tab sync
    cartPersistenceService.syncAcrossTabs();
    
    const handleCartSync = ((event: CustomEvent) => {
      // Handle cart updates from other tabs
      console.log('Cart synced from another tab:', event.detail);
    }) as EventListener;
    
    window.addEventListener('cart_sync', handleCartSync);
    
    return () => {
      window.removeEventListener('cart_sync', handleCartSync);
    };
  }, []); // Run only once on mount

  return null;
}
