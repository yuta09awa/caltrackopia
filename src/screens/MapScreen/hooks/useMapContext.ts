
import { useMapStore } from '@/features/map/hooks/useMapStore';

// Focused hooks for accessing specific parts of the store
export const useMapState = () => {
  const { mapState, userLocation } = useMapStore();
  return {
    mapState,
    userLocation,
    mapRef: { current: null }, // Will be handled by context
    locations: [], // Will be provided by context
  };
};

export const useMapActions = () => {
  const { 
    updateCenter, 
    updateZoom, 
    updateMarkers, 
    selectLocation, 
    clearMarkers 
  } = useMapStore();
  
  return {
    updateCenter,
    updateZoom,
    updateMarkers,
    selectLocation,
    clearMarkers,
    handleMapLoaded: () => {}, // Placeholder
    handleMapIdle: () => {}, // Placeholder
  };
};

export const useMapSearch = () => {
  const {
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    setSelectedIngredient,
    setSearchQuery,
    setDisplayedSearchQuery
  } = useMapStore();

  return {
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    handleSelectIngredient: async () => {}, // Placeholder
    handleSearchReset: () => {}, // Placeholder
  };
};

export const useMapUI = () => {
  const {
    showInfoCard,
    selectedLocation,
    infoCardPosition,
    setShowInfoCard,
    setSelectedLocationData,
    setInfoCardPosition
  } = useMapStore();

  return {
    mapHeight: '60vh',
    listRef: { current: null }, // Will be handled by component
    handleScroll: () => {},
    showInfoCard,
    selectedLocation,
    infoCardPosition,
    handleLocationSelect: () => {}, // Placeholder
    handleMarkerClick: () => {}, // Placeholder
    handleInfoCardClose: () => {}, // Placeholder
    handleViewDetails: () => {}, // Placeholder
  };
};
