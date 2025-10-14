/**
 * Cart API Module
 * Future: Backend cart persistence
 * Currently: Cart is managed in Zustand store (client-side)
 */

import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  locationId: string;
  locationName: string;
}

export const cartApi = {
  /**
   * Get cart (future API endpoint)
   * Currently returns empty - cart is in Zustand
   */
  get: async (): Promise<CartItem[]> => {
    // Future: Fetch from backend
    // const response = await apiClient.get<CartItem[]>(API_ENDPOINTS.cart.get);
    // return response;
    return [];
  },

  /**
   * Add item to cart (future API endpoint)
   */
  add: async (item: CartItem): Promise<void> => {
    // Future: POST to backend
    // await apiClient.post(API_ENDPOINTS.cart.add, item);
    console.log('Cart add - handled by Zustand store');
  },

  /**
   * Remove item from cart (future API endpoint)
   */
  remove: async (itemId: string): Promise<void> => {
    // Future: DELETE from backend
    // await apiClient.delete(API_ENDPOINTS.cart.remove, { params: { itemId } });
    console.log('Cart remove - handled by Zustand store');
  },

  /**
   * Update item quantity (future API endpoint)
   */
  update: async (itemId: string, quantity: number): Promise<void> => {
    // Future: PUT to backend
    // await apiClient.put(API_ENDPOINTS.cart.update, { itemId, quantity });
    console.log('Cart update - handled by Zustand store');
  },

  /**
   * Clear cart (future API endpoint)
   */
  clear: async (): Promise<void> => {
    // Future: POST to backend
    // await apiClient.post(API_ENDPOINTS.cart.clear);
    console.log('Cart clear - handled by Zustand store');
  },
};
