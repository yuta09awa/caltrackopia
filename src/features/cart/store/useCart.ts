import { useAppStore } from '@/app/store';
import { useMemo } from 'react';

/**
 * Feature-specific hook for cart state
 * Provides memoized selectors and encapsulates cart logic
 */
export function useCart() {
  const store = useAppStore();

  // Memoized selectors
  const items = useAppStore((state) => state.items);
  const total = useAppStore((state) => state.total);
  const itemCount = useAppStore((state) => state.itemCount);
  const groupedByLocation = useAppStore((state) => state.groupedByLocation);
  const activeLocationId = useAppStore((state) => state.activeLocationId);
  const conflictMode = useAppStore((state) => state.conflictMode);
  const pendingConflict = useAppStore((state) => state.pendingConflict);
  const isLoading = useAppStore((state) => state.isLoading);
  const error = useAppStore((state) => state.error);
  const undoStack = useAppStore((state) => state.undoStack);

  // Computed values
  const isEmpty = useMemo(() => items.length === 0, [items.length]);
  
  const hasMultipleLocations = useMemo(
    () => Object.keys(groupedByLocation).length > 1,
    [groupedByLocation]
  );

  const locationCount = useMemo(
    () => Object.keys(groupedByLocation).length,
    [groupedByLocation]
  );

  const hasPendingConflict = useMemo(
    () => !!pendingConflict,
    [pendingConflict]
  );

  const canUndo = useMemo(
    () => undoStack.length > 0,
    [undoStack.length]
  );

  const activeLocationName = useMemo(() => {
    if (!activeLocationId || items.length === 0) return null;
    return items.find(item => item.locationId === activeLocationId)?.locationName || null;
  }, [activeLocationId, items]);

  // Item-specific selectors
  const getItemQuantity = useMemo(
    () => (itemId: string) => {
      const item = items.find(i => i.id === itemId);
      return item?.quantity || 0;
    },
    [items]
  );

  const hasItem = useMemo(
    () => (itemId: string) => {
      return items.some(i => i.id === itemId);
    },
    [items]
  );

  return {
    // State
    items,
    total,
    itemCount,
    groupedByLocation,
    activeLocationId,
    activeLocationName,
    conflictMode,
    pendingConflict,
    isLoading,
    error,
    undoStack,

    // Actions
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    clearLocation: store.clearLocation,
    calculateTotals: store.calculateTotals,
    resolveConflict: store.resolveConflict,
    setConflictMode: store.setConflictMode,
    clearError: store.clearError,
    addToUndoStack: store.addToUndoStack,
    clearUndoStack: store.clearUndoStack,

    // Computed values
    isEmpty,
    hasMultipleLocations,
    locationCount,
    hasPendingConflict,
    canUndo,
    getItemQuantity,
    hasItem,
  };
}

/**
 * Selector hook for just cart items
 */
export function useCartItems() {
  return useAppStore((state) => state.items);
}

/**
 * Selector hook for cart totals
 */
export function useCartTotals() {
  return useAppStore((state) => ({
    total: state.total,
    itemCount: state.itemCount,
  }));
}

/**
 * Selector hook for cart conflict state
 */
export function useCartConflict() {
  return useAppStore((state) => ({
    pendingConflict: state.pendingConflict,
    conflictMode: state.conflictMode,
    hasPendingConflict: !!state.pendingConflict,
  }));
}

/**
 * Selector hook for items from specific location
 */
export function useLocationCart(locationId: string) {
  return useAppStore((state) => 
    state.items.filter(item => item.locationId === locationId)
  );
}
