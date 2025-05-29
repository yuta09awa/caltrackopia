
import { StateCreator } from 'zustand';
import { CartSlice, CartItem } from '@/types/cart';
import { MenuItem, FeaturedItem } from '@/models/Location';

// Utility function to parse price strings like "$12.99" to numbers
const parsePrice = (priceString: string): number => {
  return parseFloat(priceString.replace(/[$,]/g, ''));
};

// Utility function to generate cart item from menu/featured item
const createCartItem = (
  item: MenuItem | FeaturedItem, 
  locationId: string, 
  locationName: string, 
  locationType: 'Restaurant' | 'Grocery'
): CartItem => {
  return {
    id: `${locationId}-${item.id}`,
    name: item.name,
    price: parsePrice(item.price),
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

  addItem: (item, locationId, locationName, locationType) => {
    const state = get();
    const existingItemIndex = state.items.findIndex(cartItem => cartItem.id === `${locationId}-${item.id}`);
    
    let newItems: CartItem[];
    
    if (existingItemIndex >= 0) {
      // Item already exists, increase quantity
      newItems = [...state.items];
      newItems[existingItemIndex].quantity += 1;
    } else {
      // New item, add to cart
      const cartItem = createCartItem(item, locationId, locationName, locationType);
      newItems = [...state.items, cartItem];
    }
    
    set({ items: newItems, activeLocationId: locationId });
    get().calculateTotals();
  },

  removeItem: (itemId) => {
    const state = get();
    const newItems = state.items.filter(item => item.id !== itemId);
    set({ items: newItems });
    get().calculateTotals();
  },

  updateQuantity: (itemId, quantity) => {
    const state = get();
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    
    const newItems = state.items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    set({ items: newItems });
    get().calculateTotals();
  },

  clearCart: () => {
    set({
      items: [],
      groupedByLocation: {},
      activeLocationId: null,
      total: 0,
      itemCount: 0,
    });
  },

  clearLocation: (locationId) => {
    const state = get();
    const newItems = state.items.filter(item => item.locationId !== locationId);
    set({ items: newItems });
    get().calculateTotals();
  },

  calculateTotals: () => {
    const state = get();
    const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
    
    // Group items by location
    const groupedByLocation: Record<string, CartItem[]> = {};
    state.items.forEach(item => {
      if (!groupedByLocation[item.locationId]) {
        groupedByLocation[item.locationId] = [];
      }
      groupedByLocation[item.locationId].push(item);
    });
    
    set({ total, itemCount, groupedByLocation });
  },
});

export type { CartSlice };
