// ============= CONSOLIDATED MAP HOOKS =============

// PRIMARY MAP INTERFACE - Use this for most map functionality
export { useConsolidatedMap } from './useConsolidatedMap';
export type { ConsolidatedMapHook, ConsolidatedMapOptions } from './useConsolidatedMap';

// CORE MAP BUILDING BLOCKS - For advanced usage or custom implementations
export { useMapCore } from './useMapCore';
export { useUserLocation } from './useUserLocation';
export { usePlacesApi } from './usePlacesApi';
export { useToastManager } from './useToastManager';

// SPECIALIZED HOOKS - For specific functionality
export { useApiKeyState } from './useApiKeyState';
export { useCacheMetrics } from './useCacheMetrics';
export { useEdgeFunctionApi } from './useEdgeFunctionApi';

// FILTER HOOKS - For filtering and search
export { useDietaryRestrictions } from './filters/useDietaryRestrictions';
export { useIngredientSources } from './filters/useIngredientSources';
export { useNutritionGoals } from './filters/useNutritionGoals';

// === INTERNAL HOOKS - Not recommended for direct use ===
// These are used internally by consolidated hooks
export { useMapState } from './useMapState';
export { useMapSearch } from './useMapSearch';
export { useMapUI } from './useMapUI';
export { useMapMarkers } from './useMapMarkers';
export { useMapOptions } from './useMapOptions';
export { useInfoCardState } from './useInfoCardState';
export { useSearchState } from './useSearchState';

// Search implementation hooks
export { usePlaceSearch } from './usePlaceSearch';
export { useTextSearch } from './useTextSearch';
export { useNearbySearch } from './useNearbySearch';
export { useIngredientSearch } from './useIngredientSearch';

// === LEGACY HOOKS - Deprecated, will be removed in future versions ===
// Use useConsolidatedMap instead for new code

// Still in use by UnifiedMapView - will be migrated
export { useMapRendering } from './useMapRendering';

// Still in use by SimpleMapView - will be migrated
export { useSimpleMapState } from './useSimpleMapState';

// Kept for backward compatibility - consider migrating to useConsolidatedMap
export { useMapApi } from './useMapApi';
export { useLocationSelection } from './useLocationSelection';