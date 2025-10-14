export { useCartOperations } from './useCartOperations';
export { useCartAnalytics } from './useCartAnalytics';
export { useCartConflictResolution } from './useCartConflictResolution';

// Re-export store hooks for convenience
export { 
  useCart,
  useCartItems,
  useCartTotals,
  useCartConflict,
  useLocationCart
} from '../store/useCart';
