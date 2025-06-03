
import { useRef } from 'react';
import { useLocations } from '@/features/locations/hooks/useLocations';
import { useMapState } from '@/features/map/hooks/useMapState';
import { usePlacesApi } from '@/features/map/hooks/usePlacesApi';
import { useUserLocation } from '@/features/map/hooks/useUserLocation';
import { useToastManager } from '@/features/map/hooks/useToastManager';

export const useMapScreenCore = () => {
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

  return {
    mapRef,
    mapState,
    updateCenter,
    updateZoom,
    updateMarkers,
    selectLocation,
    clearMarkers,
    searchPlacesByText,
    searchNearbyPlaces,
    userLocation,
    locations,
    showSuccessToast,
    showInfoToast,
    showErrorToast
  };
};
