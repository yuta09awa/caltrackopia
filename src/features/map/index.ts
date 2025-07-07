// ============= MAP FEATURE UNIFIED EXPORTS =============

// Primary Interfaces
export { useConsolidatedMap } from './hooks/useConsolidatedMap';
export type { ConsolidatedMapHook, ConsolidatedMapOptions } from './hooks/useConsolidatedMap';

// Core Components
export { default as UnifiedMapView } from './components/core/UnifiedMapView';
export { default as MapRenderer } from './components/core/MapRenderer';
export { default as MapContainer } from './components/MapContainer';

// Hooks - Selective exports for advanced usage
export { 
  useMapCore,
  useUserLocation,
  usePlacesApi,
  useToastManager
} from './hooks';

// Types
export type { 
  LatLng, 
  MarkerData, 
  UnifiedMapState, 
  MapViewProps 
} from './types';

// Utils
export * from './utils/placeTypeMapper';