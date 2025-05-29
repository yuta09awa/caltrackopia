
import { MenuItem, FeaturedItem } from '@/models/Location';

export interface CartItem {
  id: string;
  name: string;
  price: number; // Converted from string prices like "$12.99"
  quantity: number;
  locationId: string;
  locationName: string;
  locationType: 'Restaurant' | 'Grocery';
  description?: string;
  image: string;
  dietaryTags: string[];
  originalItem: MenuItem | FeaturedItem;
}

export interface PendingConflict {
  item: MenuItem | FeaturedItem;
  locationId: string;
  locationName: string;
  locationType: 'Restaurant' | 'Grocery';
  currentLocationName: string;
}

interface UndoAction {
  type: 'remove' | 'clear' | 'quantity';
  itemId?: string;
  item?: CartItem;
  previousQuantity?: number;
  items?: CartItem[];
  timestamp: number;
}

export interface CartState {
  items: CartItem[];
  groupedByLocation: Record<string, CartItem[]>;
  activeLocationId: string | null;
  conflictMode: 'replace' | 'separate' | 'merge';
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  pendingConflict: PendingConflict | null;
  undoStack: UndoAction[];
}

export interface CartActions {
  addItem: (item: MenuItem | FeaturedItem, locationId: string, locationName: string, locationType: 'Restaurant' | 'Grocery') => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  clearLocation: (locationId: string) => void;
  calculateTotals: () => void;
  resolveConflict: (action: 'replace' | 'cancel') => void;
  setConflictMode: (mode: 'replace' | 'separate' | 'merge') => void;
  clearError: () => void;
  addToUndoStack: (action: UndoAction) => void;
  clearUndoStack: () => void;
}

export type CartSlice = CartState & CartActions;

export type { UndoAction };
