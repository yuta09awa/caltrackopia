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
export { useMapInteractions } from './useMapInteractions';
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

// === LEGACY HOOKS - Will be removed ===
// Use useConsolidatedMap instead
export { useMapApi } from './useMapApi';
export { useMapCamera } from './useMapCamera';
export { useMapRendering } from './useMapRendering';
export { useLocationSelection } from './useLocationSelection';
export { useMarkerInteractions } from './useMarkerInteractions';
export { useNavigationActions } from './useNavigationActions';
export { usePlaceFilters } from './usePlaceFilters';
export { usePlacesApiService } from './usePlacesApiService';
export { useCachedPlacesApi } from './useCachedPlacesApi';
export { useFilteredResults } from './useFilteredResults';
export { useSimpleMapState } from './useSimpleMapState';
export { useCoreMapState } from './useCoreMapState';