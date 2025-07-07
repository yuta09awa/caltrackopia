// ============= UNIFIED HOOK EXPORTS =============

// API Hooks - Single source of truth
export {
  useApiMutation,
  useApiQuery,
  useAsyncState,
  useApi
} from './useUnifiedApi';

// Standardized Common Hooks
export {
  useStandardAsyncState,
  useStandardCache,
  useStandardSearch,
  useStandardPagination
} from './useStandardizedHooks';

// Consolidated State Management
export {
  useConsolidatedState,
  useConsolidatedMultiState
} from './useConsolidatedState';

// Utility Hooks
export { useDebounce } from './useDebounce';
export { useCurrency } from './useCurrency';
export { useInternationalization } from './useInternationalization';
export { usePerformanceMonitor } from './usePerformanceMonitor';
export { useSearchHistory } from './useSearchHistory';
export { useUndoSystem } from './useUndoSystem';
export { useInfiniteScroll } from './useInfiniteScroll';

// Cart & Shopping Hooks
export { useCartOperations } from './useCartOperations';
export { useCartAnalytics } from './useCartAnalytics';
export { useCartConflictResolution } from './useCartConflictResolution';

// Location & Map Hooks
export { useHybridLocation } from './useHybridLocation';

// Ingredient & Nutrition Hooks
export { useIngredientSearch } from './useIngredientSearch';
export { useEnhancedIngredientSearch } from './useEnhancedIngredientSearch';

// Caching Hooks
export { useEnhancedCaching } from './useEnhancedCaching';

// UI Hooks
export { useIsMobile } from './use-mobile';
export { useToast } from './use-toast';

// === DEPRECATED HOOKS - DO NOT USE ===
// These will be removed in future versions
// export { ... } from './use-api.deprecated';
// export { ... } from './useAPI.deprecated';