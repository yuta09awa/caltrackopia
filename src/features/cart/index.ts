// Cart feature public API
export { default as CartSheet } from './components/CartSheet';
export { default as AddToCartButton } from './components/AddToCartButton';
export { default as CartItemDisplay } from './components/CartItemDisplay';
export { default as QuantitySelector } from './components/QuantitySelector';

export { useCartOperations } from './hooks/useCartOperations';
export { useCartAnalytics } from './hooks/useCartAnalytics';
export { useCartConflictResolution } from './hooks/useCartConflictResolution';

// Store hooks
export { 
  useCart,
  useCartItems,
  useCartTotals,
  useCartConflict,
  useLocationCart
} from './store/useCart';

export { createCartSlice } from './store/cartSlice';
export type { CartSlice } from './store/cartSlice';
