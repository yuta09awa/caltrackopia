/**
 * Cart Domain Queries (CQRS Read Operations)
 * All read operations and computed values
 */

import type { CartItem } from '@/types/cart';

export interface CartQueryState {
  items: CartItem[];
  groupedByLocation: Record<string, CartItem[]>;
  activeLocationId: string | null;
  total: number;
  itemCount: number;
}

export class CartQueryHandler {
  constructor(private getState: () => CartQueryState) {}

  /**
   * Get all cart items
   */
  getItems(): CartItem[] {
    return this.getState().items;
  }

  /**
   * Get items grouped by location
   */
  getItemsGroupedByLocation(): Record<string, CartItem[]> {
    return this.getState().groupedByLocation;
  }

  /**
   * Get total price
   */
  getTotal(): number {
    return this.getState().total;
  }

  /**
   * Get total item count
   */
  getItemCount(): number {
    return this.getState().itemCount;
  }

  /**
   * Get active location ID
   */
  getActiveLocationId(): string | null {
    return this.getState().activeLocationId;
  }

  /**
   * Check if cart is empty
   */
  isEmpty(): boolean {
    return this.getState().items.length === 0;
  }

  /**
   * Check if cart has multiple locations
   */
  hasMultipleLocations(): boolean {
    const locationIds = new Set(this.getState().items.map(item => item.locationId));
    return locationIds.size > 1;
  }

  /**
   * Get item by ID
   */
  getItemById(itemId: string): CartItem | undefined {
    return this.getState().items.find(item => item.id === itemId);
  }

  /**
   * Get quantity of specific item
   */
  getItemQuantity(itemId: string): number {
    const item = this.getItemById(itemId);
    return item?.quantity || 0;
  }

  /**
   * Check if item exists in cart
   */
  hasItem(itemId: string): boolean {
    return this.getState().items.some(item => item.id === itemId);
  }

  /**
   * Get items for specific location
   */
  getItemsByLocation(locationId: string): CartItem[] {
    return this.getState().items.filter(item => item.locationId === locationId);
  }

  /**
   * Get location count
   */
  getLocationCount(): number {
    const locationIds = new Set(this.getState().items.map(item => item.locationId));
    return locationIds.size;
  }

  /**
   * Get subtotal for location
   */
  getLocationSubtotal(locationId: string): number {
    return this.getItemsByLocation(locationId)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /**
   * Get cart summary
   */
  getSummary() {
    const state = this.getState();
    return {
      itemCount: state.itemCount,
      total: state.total,
      locationCount: this.getLocationCount(),
      isEmpty: this.isEmpty(),
      hasMultipleLocations: this.hasMultipleLocations(),
    };
  }

  /**
   * Calculate totals (internal use)
   */
  calculateTotals(items: CartItem[]) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const groupedByLocation = items.reduce((groups, item) => {
      if (!groups[item.locationId]) {
        groups[item.locationId] = [];
      }
      groups[item.locationId].push(item);
      return groups;
    }, {} as Record<string, CartItem[]>);

    return { total, itemCount, groupedByLocation };
  }
}
