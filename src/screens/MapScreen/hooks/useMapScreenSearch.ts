
import { useMapSearch } from '@/features/map/hooks/useMapSearch';
import { useMapScreenCore } from './useMapScreenCore';
import { useMemo } from 'react';

export const useMapScreenSearch = () => {
  const core = useMapScreenCore();
  
  const {
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    handleSelectIngredient,
    handleSearchReset
  } = useMapSearch();

  // Memoize stable dependencies for callbacks
  const stableDependencies = useMemo(() => ({
    updateMarkers: core.updateMarkers,
    updateCenter: core.updateCenter,
    selectLocation: core.selectLocation,
    clearMarkers: core.clearMarkers,
    searchPlacesByText: core.searchPlacesByText,
    searchNearbyPlaces: core.searchNearbyPlaces,
    showInfoToast: core.showInfoToast,
    showErrorToast: core.showErrorToast,
    locations: core.locations
  }), [
    core.updateMarkers,
    core.updateCenter,
    core.selectLocation,
    core.clearMarkers,
    core.searchPlacesByText,
    core.searchNearbyPlaces,
    core.showInfoToast,
    core.showErrorToast,
    core.locations
  ]);

  return {
    ...core,
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    handleSelectIngredient,
    handleSearchReset,
    stableDependencies
  };
};
