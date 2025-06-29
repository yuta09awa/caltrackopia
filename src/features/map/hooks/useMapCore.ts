
import { useRef, useCallback } from 'react';
import { useMapState } from './useMapState';
import { useUserLocation } from './useUserLocation';
import { usePlacesApi } from './usePlacesApi';
import { useToastManager } from './useToastManager';

export const useMapCore = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const { 
    mapState, 
    updateCenter, 
    updateZoom, 
    updateMarkers, 
    selectLocation, 
    hoverLocation,
    clearMarkers 
  } = useMapState();
  
  const { userLocation } = useUserLocation();
  const { searchPlacesByText, searchNearbyPlaces } = usePlacesApi();
  const { showSuccessToast, showInfoToast, showErrorToast } = useToastManager();

  const setMapRef = useCallback((map: google.maps.Map | null) => {
    mapRef.current = map;
  }, []);

  const handleMapLoaded = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, [setMapRef]);

  const handleMapIdle = useCallback((center: { lat: number; lng: number }, zoom: number) => {
    updateCenter(center);
    updateZoom(zoom);
  }, [updateCenter, updateZoom]);

  return {
    // State
    mapState,
    mapRef,
    userLocation,
    
    // Core actions
    updateCenter,
    updateZoom,
    updateMarkers,
    selectLocation,
    hoverLocation,
    clearMarkers,
    setMapRef,
    
    // API actions
    searchPlacesByText,
    searchNearbyPlaces,
    
    // Event handlers
    handleMapLoaded,
    handleMapIdle,
    
    // Toast notifications
    showSuccessToast,
    showInfoToast,
    showErrorToast
  };
};
