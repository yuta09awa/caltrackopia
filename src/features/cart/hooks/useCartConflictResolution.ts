
import { useCallback, useMemo } from 'react';
import { useAppStore } from '@/app/store';
import { ConflictMode, ConflictAction } from '@/types/cartConflict';
import { MenuItem, FeaturedItem } from '@/models/Location';
import { toast } from 'sonner';

export const useCartConflictResolution = () => {
  const { 
    items, 
    pendingConflict, 
    conflictMode,
    setConflictMode,
    addItem,
    clearCart,
    resolveConflict 
  } = useAppStore();

  const handleConflictAction = useCallback((action: ConflictAction) => {
    if (!pendingConflict) return;

    const { item, locationId, locationName, locationType } = pendingConflict;

    switch (action.type) {
      case 'replace':
        clearCart();
        addItem(item, locationId, locationName, locationType);
        toast.success(`Cart cleared and ${item.name} added from ${locationName}`);
        break;

      case 'separate':
        // Add item to separate location group
        addItem(item, locationId, locationName, locationType);
        toast.success(`${item.name} added to separate location group`);
        break;

      case 'merge':
        // Convert existing items to new location and add new item
        const existingItems = [...items];
        clearCart();
        
        // Re-add existing items with new location
        existingItems.forEach(existingItem => {
          addItem(existingItem.originalItem, locationId, locationName, locationType);
        });
        
        // Add the new item
        addItem(item, locationId, locationName, locationType);
        toast.success(`Cart merged with ${locationName}`);
        break;

      case 'cancel':
        toast.info('Item not added to cart');
        break;
    }

    resolveConflict(action.type === 'cancel' ? 'cancel' : 'replace');
  }, [pendingConflict, items, addItem, clearCart, resolveConflict]);

  const setUserConflictPreference = useCallback((mode: ConflictMode, remember: boolean = false) => {
    setConflictMode(mode);
    
    if (remember) {
      localStorage.setItem('cart-conflict-preference', JSON.stringify({
        mode,
        timestamp: Date.now()
      }));
    }
  }, [setConflictMode]);

  const getStoredConflictPreference = useCallback((): ConflictMode | null => {
    try {
      const stored = localStorage.getItem('cart-conflict-preference');
      if (stored) {
        const { mode } = JSON.parse(stored);
        return mode;
      }
    } catch (error) {
      console.warn('Failed to parse stored conflict preference:', error);
    }
    return null;
  }, []);

  return {
    handleConflictAction,
    setUserConflictPreference,
    getStoredConflictPreference,
    currentConflictMode: conflictMode,
    hasPendingConflict: !!pendingConflict,
    pendingConflict
  };
};
