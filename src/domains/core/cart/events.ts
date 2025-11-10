/**
 * Cart Domain Events
 * Events published by cart domain for other domains to consume
 */

import type { CartItem } from '@/types/cart';
import type { DomainEvent } from '../EventBus';

export const CartEvents = {
  ITEM_ADDED: 'cart.item.added',
  ITEM_REMOVED: 'cart.item.removed',
  QUANTITY_UPDATED: 'cart.quantity.updated',
  CART_CLEARED: 'cart.cleared',
  LOCATION_CLEARED: 'cart.location.cleared',
  CONFLICT_DETECTED: 'cart.conflict.detected',
  CONFLICT_RESOLVED: 'cart.conflict.resolved',
  CHECKOUT_STARTED: 'cart.checkout.started',
} as const;

export interface CartItemAddedEvent extends DomainEvent {
  type: typeof CartEvents.ITEM_ADDED;
  payload: {
    item: CartItem;
    locationId: string;
    locationName: string;
  };
}

export interface CartItemRemovedEvent extends DomainEvent {
  type: typeof CartEvents.ITEM_REMOVED;
  payload: {
    itemId: string;
    item: CartItem;
  };
}

export interface CartQuantityUpdatedEvent extends DomainEvent {
  type: typeof CartEvents.QUANTITY_UPDATED;
  payload: {
    itemId: string;
    oldQuantity: number;
    newQuantity: number;
  };
}

export interface CartClearedEvent extends DomainEvent {
  type: typeof CartEvents.CART_CLEARED;
  payload: {
    itemCount: number;
    total: number;
  };
}

export interface CartLocationClearedEvent extends DomainEvent {
  type: typeof CartEvents.LOCATION_CLEARED;
  payload: {
    locationId: string;
    itemCount: number;
  };
}

export interface CartConflictDetectedEvent extends DomainEvent {
  type: typeof CartEvents.CONFLICT_DETECTED;
  payload: {
    currentLocationId: string;
    newLocationId: string;
    itemName: string;
  };
}

export interface CartConflictResolvedEvent extends DomainEvent {
  type: typeof CartEvents.CONFLICT_RESOLVED;
  payload: {
    action: 'replace' | 'cancel';
    locationId: string;
  };
}

export interface CartCheckoutStartedEvent extends DomainEvent {
  type: typeof CartEvents.CHECKOUT_STARTED;
  payload: {
    itemCount: number;
    total: number;
    locationId: string;
  };
}

export type CartDomainEvent =
  | CartItemAddedEvent
  | CartItemRemovedEvent
  | CartQuantityUpdatedEvent
  | CartClearedEvent
  | CartLocationClearedEvent
  | CartConflictDetectedEvent
  | CartConflictResolvedEvent
  | CartCheckoutStartedEvent;
