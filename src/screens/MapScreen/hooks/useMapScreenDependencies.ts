
import { useMemo } from 'react';
import { useMapScreenCore } from './useMapScreenCore';

export const useMapScreenDependencies = () => {
  const core = useMapScreenCore();
  
  // Create stable dependencies object with only essential functions
  const dependencies = useMemo(() => ({
    // Map operations
    updateMarkers: core.updateMarkers,
    updateCenter: core.updateCenter,
    selectLocation: core.selectLocation,
    clearMarkers: core.clearMarkers,
    
    // Search operations
    searchPlacesByText: core.searchPlacesByText,
    searchNearbyPlaces: core.searchNearbyPlaces,
    
    // Toast notifications
    showInfoToast: core.showInfoToast,
    showErrorToast: core.showErrorToast,
    
    // Data
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
    dependencies
  };
};
