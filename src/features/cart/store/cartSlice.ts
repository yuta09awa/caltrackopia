import { StateCreator } from 'zustand';
import { CartSlice, CartItem } from '@/types/cart';
import { MenuItem, FeaturedItem } from '@/models/Location';
import { cartPersistenceService } from '../services/cartPersistenceService';
import { CartCommandHandler, CartQueryHandler } from '@/domains/core/cart';

// Add UndoAction type
interface UndoAction {
  type: 'remove' | 'clear' | 'quantity';
  itemId?: string;
  item?: CartItem;
  previousQuantity?: number;
  items?: CartItem[];
  timestamp: number;
}

// Enhanced utility function to parse price strings with error handling
const parsePrice = (priceString: string): number => {
  try {
    const cleanPrice = priceString.replace(/[$,]/g, '');
    const price = parseFloat(cleanPrice);
    
    if (isNaN(price) || price < 0) {
      console.error('Invalid price string:', priceString, 'Parsed as:', price);
      return 0;
    }
    
    return price;
  } catch (error) {
    console.error('Error parsing price:', priceString, error);
    return 0;
  }
};

// Utility function to generate cart item from menu/featured item
const createCartItem = (
  item: MenuItem | FeaturedItem, 
  locationId: string, 
  locationName: string, 
  locationType: 'Restaurant' | 'Grocery'
): CartItem => {
  const price = parsePrice(item.price);
  
  if (price === 0) {
    console.warn(`Price parsing failed for item: ${item.name} with price: ${item.price}`);
  }
  
  return {
    id: `${locationId}-${item.id}`,
    name: item.name,
    price,
    quantity: 1,
    locationId,
    locationName,
    locationType,
    description: item.description,
    image: item.image,
    dietaryTags: item.dietaryTags || [],
    originalItem: item,
  };
};

export const createCartSlice: StateCreator<CartSlice> = (set, get) => {
  // Initialize CQRS handlers
  const commandHandler = new CartCommandHandler(get, set);
  const queryHandler = new CartQueryHandler(get);

  return {
    items: [],
    groupedByLocation: {},
    activeLocationId: null,
    conflictMode: 'separate',
    total: 0,
    itemCount: 0,
    isLoading: false,
    error: null,
    pendingConflict: null,
    undoStack: [],

  addItem: async (item, locationId, locationName, locationType) => {
    try {
      await commandHandler.handleAddItem({ item, locationId, locationName, locationType });
      get().calculateTotals();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      set({ error: 'Failed to add item to cart. Please try again.' });
    }
  },

  removeItem: async (itemId) => {
    try {
      const state = get();
      const itemToRemove = state.items.find(item => item.id === itemId);
      
      if (itemToRemove) {
        // Add to undo stack before removing
        get().addToUndoStack({
          type: 'remove',
          itemId,
          item: itemToRemove,
          timestamp: Date.now()
        });
      }

      await commandHandler.handleRemoveItem({ itemId });
      get().calculateTotals();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      set({ error: 'Failed to remove item from cart. Please try again.' });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      // Validate quantity is a positive number
      if (!Number.isInteger(quantity) || quantity < 1) {
        set({ error: 'Invalid quantity. Please enter a valid number.' });
        return;
      }
      
      const state = get();
      const existingItem = state.items.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity !== quantity) {
        // Add to undo stack for quantity changes
        get().addToUndoStack({
          type: 'quantity',
          itemId,
          previousQuantity: existingItem.quantity,
          timestamp: Date.now()
        });
      }

      await commandHandler.handleUpdateQuantity({ itemId, quantity });
      get().calculateTotals();
    } catch (error) {
      console.error('Error updating quantity:', error);
      set({ error: 'Failed to update quantity. Please try again.' });
    }
  },

  clearCart: async () => {
    try {
      const state = get();
      
      if (state.items.length > 0) {
        // Add to undo stack before clearing
        get().addToUndoStack({
          type: 'clear',
          items: [...state.items],
          timestamp: Date.now()
        });
      }

      await commandHandler.handleClearCart({});
      
      set({
        total: 0,
        itemCount: 0,
        groupedByLocation: {},
      });

      // Clear persisted cart
      cartPersistenceService.clearCart().catch(console.error);
    } catch (error) {
      console.error('Error clearing cart:', error);
      set({ error: 'Failed to clear cart. Please try again.' });
    }
  },

  clearLocation: async (locationId) => {
    try {
      await commandHandler.handleClearLocation({ locationId });
      get().calculateTotals();
    } catch (error) {
      console.error('Error clearing location from cart:', error);
      set({ error: 'Failed to clear location from cart. Please try again.' });
    }
  },

  calculateTotals: () => {
    try {
      const state = get();
      const total = state.items.reduce((sum, item) => {
        const itemTotal = item.price * item.quantity;
        if (isNaN(itemTotal)) {
          console.warn(`Invalid calculation for item: ${item.name}, price: ${item.price}, quantity: ${item.quantity}`);
          return sum;
        }
        return sum + itemTotal;
      }, 0);
      
      const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
      
      // Group items by location
      const groupedByLocation: Record<string, CartItem[]> = {};
      state.items.forEach(item => {
        if (!groupedByLocation[item.locationId]) {
          groupedByLocation[item.locationId] = [];
        }
        groupedByLocation[item.locationId].push(item);
      });
      
      set({ total, itemCount, groupedByLocation, error: null });
      
      // Persist cart to IndexedDB
      cartPersistenceService.saveCart({
        items: state.items,
        total,
        itemCount,
        lastModified: Date.now()
      }).catch(error => {
        console.error('Failed to persist cart:', error);
      });
    } catch (error) {
      console.error('Error calculating totals:', error);
      set({ error: 'Error calculating cart totals. Please refresh the page.' });
    }
  },

  resolveConflict: async (action: 'replace' | 'cancel') => {
    try {
      await commandHandler.handleResolveConflict({ action });
      get().calculateTotals();
    } catch (error) {
      console.error('Error resolving conflict:', error);
      set({ error: 'Failed to resolve conflict. Please try again.' });
    }
  },

  setConflictMode: (mode: 'replace' | 'separate' | 'merge') => {
    set({ conflictMode: mode });
  },

  clearError: () => {
    set({ error: null });
  },
  // New undo system methods
  addToUndoStack: (action: UndoAction) => {
    const state = get();
    const newUndoStack = [...state.undoStack, action];
    
    // Keep only last 10 actions to prevent memory issues
    if (newUndoStack.length > 10) {
      newUndoStack.shift();
    }
    
    set({ undoStack: newUndoStack });
  },

  clearUndoStack: () => {
    set({ undoStack: [] });
  },
  };
};

// Memoized selectors
export const selectCartItems = (state: CartSlice) => state.items;
export const selectCartTotal = (state: CartSlice) => state.total;
export const selectCartItemCount = (state: CartSlice) => state.itemCount;
export const selectGroupedByLocation = (state: CartSlice) => state.groupedByLocation;
export const selectActiveLocationId = (state: CartSlice) => state.activeLocationId;
export const selectConflictMode = (state: CartSlice) => state.conflictMode;
export const selectPendingConflict = (state: CartSlice) => state.pendingConflict;
export const selectCartIsLoading = (state: CartSlice) => state.isLoading;
export const selectCartError = (state: CartSlice) => state.error;
export const selectUndoStack = (state: CartSlice) => state.undoStack;
export const selectCartIsEmpty = (state: CartSlice) => state.items.length === 0;
export const selectHasMultipleLocations = (state: CartSlice) => 
  Object.keys(state.groupedByLocation).length > 1;
export const selectCanUndo = (state: CartSlice) => state.undoStack.length > 0;

export type { CartSlice };
