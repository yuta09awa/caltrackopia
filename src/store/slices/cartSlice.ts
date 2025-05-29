
import { StateCreator } from 'zustand';
import { CartSlice, CartItem } from '@/types/cart';
import { MenuItem, FeaturedItem } from '@/models/Location';

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

export const createCartSlice: StateCreator<CartSlice> = (set, get) => ({
  items: [],
  groupedByLocation: {},
  activeLocationId: null,
  conflictMode: 'separate',
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
  pendingConflict: null,

  addItem: (item, locationId, locationName, locationType) => {
    try {
      const state = get();
      
      // Check for location conflicts
      if (state.items.length > 0 && state.activeLocationId && state.activeLocationId !== locationId) {
        // Set pending conflict for UI to handle
        set({
          pendingConflict: {
            item,
            locationId,
            locationName,
            locationType,
            currentLocationName: state.items[0]?.locationName || 'Unknown Location'
          }
        });
        return;
      }
      
      const existingItemIndex = state.items.findIndex(cartItem => cartItem.id === `${locationId}-${item.id}`);
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Item already exists, increase quantity
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += 1;
      } else {
        // New item, add to cart
        const cartItem = createCartItem(item, locationId, locationName, locationType);
        
        // Validate cart item was created successfully
        if (cartItem.price === 0 && item.price !== '0' && item.price !== '$0' && item.price !== '$0.00') {
          set({ error: `Unable to add ${item.name}: Invalid price format` });
          return;
        }
        
        newItems = [...state.items, cartItem];
      }
      
      set({ 
        items: newItems, 
        activeLocationId: locationId, 
        error: null,
        pendingConflict: null 
      });
      get().calculateTotals();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      set({ error: 'Failed to add item to cart. Please try again.' });
    }
  },

  removeItem: (itemId) => {
    try {
      const state = get();
      const newItems = state.items.filter(item => item.id !== itemId);
      set({ items: newItems, error: null });
      get().calculateTotals();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      set({ error: 'Failed to remove item from cart. Please try again.' });
    }
  },

  updateQuantity: (itemId, quantity) => {
    try {
      const state = get();
      
      if (quantity <= 0) {
        get().removeItem(itemId);
        return;
      }
      
      // Validate quantity is a positive number
      if (!Number.isInteger(quantity) || quantity < 1) {
        set({ error: 'Invalid quantity. Please enter a valid number.' });
        return;
      }
      
      const newItems = state.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      set({ items: newItems, error: null });
      get().calculateTotals();
    } catch (error) {
      console.error('Error updating quantity:', error);
      set({ error: 'Failed to update quantity. Please try again.' });
    }
  },

  clearCart: () => {
    try {
      set({
        items: [],
        groupedByLocation: {},
        activeLocationId: null,
        total: 0,
        itemCount: 0,
        error: null,
        pendingConflict: null,
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      set({ error: 'Failed to clear cart. Please try again.' });
    }
  },

  clearLocation: (locationId) => {
    try {
      const state = get();
      const newItems = state.items.filter(item => item.locationId !== locationId);
      set({ items: newItems, error: null });
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
    } catch (error) {
      console.error('Error calculating totals:', error);
      set({ error: 'Error calculating cart totals. Please refresh the page.' });
    }
  },

  resolveConflict: (action: 'replace' | 'cancel') => {
    const state = get();
    
    if (!state.pendingConflict) return;
    
    if (action === 'replace') {
      // Clear cart and add the new item
      get().clearCart();
      const { item, locationId, locationName, locationType } = state.pendingConflict;
      get().addItem(item, locationId, locationName, locationType);
    }
    
    set({ pendingConflict: null });
  },

  clearError: () => {
    set({ error: null });
  },
});

export type { CartSlice };
