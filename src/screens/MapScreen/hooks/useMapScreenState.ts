
import { useRef, useMemo } from 'react';
import { useLocations } from '@/features/locations/hooks/useLocations';
import { useMapState } from '@/features/map/hooks/useMapState';
import { usePlacesApi } from '@/features/map/hooks/usePlacesApi';
import { useUserLocation } from '@/features/map/hooks/useUserLocation';
import { useMapSearch } from '@/features/map/hooks/useMapSearch';
import { useMapInteractions } from '@/features/map/hooks/useMapInteractions';
import { useMapUI } from '@/features/map/hooks/useMapUI';
import { useToastManager } from '@/features/map/hooks/useToastManager';

export const useMapScreenState = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const { locations } = useLocations();
  const { 
    mapState, 
    updateCenter, 
    updateZoom, 
    updateMarkers, 
    selectLocation, 
    clearMarkers 
  } = useMapState();
  
  const { searchPlacesByText, searchNearbyPlaces } = usePlacesApi();
  const { userLocation } = useUserLocation();
  const { showSuccessToast, showInfoToast, showErrorToast } = useToastManager();
  
  const {
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    handleSelectIngredient,
    handleSearchReset
  } = useMapSearch();
  
  const {
    showInfoCard,
    infoCardPosition,
    selectedLocation,
    handleLocationSelect,
    handleMarkerClick,
    handleInfoCardClose,
    handleViewDetails
  } = useMapInteractions();
  
  const { mapHeight, listRef, handleScroll } = useMapUI();

  // Memoize stable dependencies for callbacks
  const stableDependencies = useMemo(() => ({
    updateMarkers,
    updateCenter,
    selectLocation,
    clearMarkers,
    searchPlacesByText,
    searchNearbyPlaces,
    showInfoToast,
    showErrorToast,
    locations
  }), [
    updateMarkers,
    updateCenter,
    selectLocation,
    clearMarkers,
    searchPlacesByText,
    searchNearbyPlaces,
    showInfoToast,
    showErrorToast,
    locations
  ]);

  return {
    mapRef,
    mapState,
    updateCenter,
    updateZoom,
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    handleSelectIngredient,
    handleSearchReset,
    showInfoCard,
    infoCardPosition,
    selectedLocation,
    handleLocationSelect,
    handleMarkerClick,
    handleInfoCardClose,
    handleViewDetails,
    mapHeight,
    listRef,
    handleScroll,
    stableDependencies,
    userLocation
  };
};
