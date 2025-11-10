/**
 * Cart Domain Commands (CQRS Write Operations)
 * All state-modifying operations go through commands
 */

import type { MenuItem, FeaturedItem } from '@/models/Location';
import type { CartItem, PendingConflict } from '@/types/cart';
import { eventBus } from '../EventBus';
import { CartEvents } from './events';

// Command interfaces
export interface AddItemCommand {
  item: MenuItem | FeaturedItem;
  locationId: string;
  locationName: string;
  locationType: 'Restaurant' | 'Grocery';
}

export interface RemoveItemCommand {
  itemId: string;
}

export interface UpdateQuantityCommand {
  itemId: string;
  quantity: number;
}

export interface ClearCartCommand {
  reason?: string;
}

export interface ClearLocationCommand {
  locationId: string;
}

export interface ResolveConflictCommand {
  action: 'replace' | 'cancel';
}

// Command handlers
export class CartCommandHandler {
  constructor(
    private getState: () => {
      items: CartItem[];
      activeLocationId: string | null;
      pendingConflict: PendingConflict | null;
    },
    private setState: (updater: (state: any) => any) => void
  ) {}

  /**
   * Handle add item command
   */
  async handleAddItem(command: AddItemCommand): Promise<void> {
    const { item, locationId, locationName, locationType } = command;
    const state = this.getState();

    // Check for location conflict
    if (state.activeLocationId && state.activeLocationId !== locationId) {
      this.setState((draft) => {
        draft.pendingConflict = {
          item,
          locationId,
          locationName,
          locationType,
          currentLocationName: state.items.find(i => i.locationId === state.activeLocationId)?.locationName || 'Unknown',
        };
      });

      await eventBus.publish({
        type: CartEvents.CONFLICT_DETECTED,
        payload: {
          currentLocationId: state.activeLocationId,
          newLocationId: locationId,
          itemName: item.name,
        },
        timestamp: Date.now(),
      });
      return;
    }

    // Add item to cart
    const cartItem = this.createCartItem(item, locationId, locationName, locationType);
    
    this.setState((draft) => {
      const existingItem = draft.items.find((i: CartItem) => i.id === cartItem.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        draft.items.push(cartItem);
      }
      
      draft.activeLocationId = locationId;
    });

    await eventBus.publish({
      type: CartEvents.ITEM_ADDED,
      payload: { item: cartItem, locationId, locationName },
      timestamp: Date.now(),
    });
  }

  /**
   * Handle remove item command
   */
  async handleRemoveItem(command: RemoveItemCommand): Promise<void> {
    const state = this.getState();
    const item = state.items.find(i => i.id === command.itemId);
    
    if (!item) return;

    this.setState((draft) => {
      draft.items = draft.items.filter((i: CartItem) => i.id !== command.itemId);
      
      if (draft.items.length === 0) {
        draft.activeLocationId = null;
      }
    });

    await eventBus.publish({
      type: CartEvents.ITEM_REMOVED,
      payload: { itemId: command.itemId, item },
      timestamp: Date.now(),
    });
  }

  /**
   * Handle update quantity command
   */
  async handleUpdateQuantity(command: UpdateQuantityCommand): Promise<void> {
    const state = this.getState();
    const item = state.items.find(i => i.id === command.itemId);
    
    if (!item) return;

    const oldQuantity = item.quantity;

    if (command.quantity <= 0) {
      await this.handleRemoveItem({ itemId: command.itemId });
      return;
    }

    this.setState((draft) => {
      const targetItem = draft.items.find((i: CartItem) => i.id === command.itemId);
      if (targetItem) {
        targetItem.quantity = command.quantity;
      }
    });

    await eventBus.publish({
      type: CartEvents.QUANTITY_UPDATED,
      payload: {
        itemId: command.itemId,
        oldQuantity,
        newQuantity: command.quantity,
      },
      timestamp: Date.now(),
    });
  }

  /**
   * Handle clear cart command
   */
  async handleClearCart(command: ClearCartCommand): Promise<void> {
    const state = this.getState();
    const itemCount = state.items.length;
    const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    this.setState((draft) => {
      draft.items = [];
      draft.activeLocationId = null;
      draft.pendingConflict = null;
    });

    await eventBus.publish({
      type: CartEvents.CART_CLEARED,
      payload: { itemCount, total },
      timestamp: Date.now(),
      metadata: { source: command.reason },
    });
  }

  /**
   * Handle clear location command
   */
  async handleClearLocation(command: ClearLocationCommand): Promise<void> {
    const state = this.getState();
    const locationItems = state.items.filter(i => i.locationId === command.locationId);
    const itemCount = locationItems.length;

    this.setState((draft) => {
      draft.items = draft.items.filter((i: CartItem) => i.locationId !== command.locationId);
      
      if (draft.activeLocationId === command.locationId) {
        draft.activeLocationId = draft.items.length > 0 ? draft.items[0].locationId : null;
      }
    });

    await eventBus.publish({
      type: CartEvents.LOCATION_CLEARED,
      payload: { locationId: command.locationId, itemCount },
      timestamp: Date.now(),
    });
  }

  /**
   * Handle resolve conflict command
   */
  async handleResolveConflict(command: ResolveConflictCommand): Promise<void> {
    const state = this.getState();
    
    if (!state.pendingConflict) return;

    if (command.action === 'replace') {
      const { item, locationId, locationName, locationType } = state.pendingConflict;
      
      this.setState((draft) => {
        draft.items = [];
        draft.activeLocationId = locationId;
        draft.pendingConflict = null;
      });

      // Add the new item
      await this.handleAddItem({ item, locationId, locationName, locationType });
    } else {
      this.setState((draft) => {
        draft.pendingConflict = null;
      });
    }

    await eventBus.publish({
      type: CartEvents.CONFLICT_RESOLVED,
      payload: {
        action: command.action,
        locationId: state.pendingConflict.locationId,
      },
      timestamp: Date.now(),
    });
  }

  // Helper methods
  private createCartItem(
    item: MenuItem | FeaturedItem,
    locationId: string,
    locationName: string,
    locationType: 'Restaurant' | 'Grocery'
  ): CartItem {
    const price = this.parsePrice(item.price);
    
    return {
      id: `${locationId}-${item.name}`,
      name: item.name,
      price,
      quantity: 1,
      locationId,
      locationName,
      locationType,
      description: item.description,
      image: item.image || '/placeholder.svg',
      dietaryTags: item.dietaryTags || [],
      originalItem: item,
    };
  }

  private parsePrice(priceString: string | number): number {
    if (typeof priceString === 'number') return priceString;
    const cleaned = priceString.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
}
