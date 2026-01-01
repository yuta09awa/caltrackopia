// ============= CONSOLIDATED MAP HOOKS =============

// PRIMARY MAP INTERFACE - Use this for most map functionality
export { useConsolidatedMap } from './useConsolidatedMap';
export type { ConsolidatedMapHook, ConsolidatedMapOptions } from './useConsolidatedMap';

// CORE MAP BUILDING BLOCKS
export { useMapCore } from './useMapCore';
export { useUserLocation } from './useUserLocation';
export { usePlacesApi } from './usePlacesApi';
export { useToastManager } from './useToastManager';

// SPECIALIZED HOOKS
export { useApiKeyState } from './useApiKeyState';
export { useCacheMetrics } from './useCacheMetrics';
export { useEdgeFunctionApi } from './useEdgeFunctionApi';

// FILTER HOOKS
export { useDietaryRestrictions } from './filters/useDietaryRestrictions';
export { useIngredientSources } from './filters/useIngredientSources';
export { useNutritionGoals } from './filters/useNutritionGoals';
export { usePlaceFilters } from './usePlaceFilters';

// === INTERNAL HOOKS - Not recommended for direct use ===
export { useMapState } from './useMapState';
export { useMapSearch } from './useMapSearch';
export { useMapUI } from './useMapUI';
export { useMapMarkers } from './useMapMarkers';
export { useMapOptions } from './useMapOptions';
export { useInfoCardState } from './useInfoCardState';
export { useSearchState } from './useSearchState';
export { usePlacesApiService } from './usePlacesApiService';
export { useIngredientSearch } from './useIngredientSearch';

// === DEPRECATED - Use usePlacesApi instead ===
export { usePlaceSearch } from './usePlaceSearch';
export { useTextSearch } from './useTextSearch';
export { useNearbySearch } from './useNearbySearch';

// === LEGACY - Will be removed ===
export { useMapRendering } from './useMapRendering';
export { useSimpleMapState } from './useSimpleMapState';
export { useLocationSelection } from './useLocationSelection';
