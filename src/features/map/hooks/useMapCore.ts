
import { useRef, useCallback, useState } from 'react';
import { useUserLocation } from './useUserLocation';
import { usePlacesApi } from './usePlacesApi';
import { useToastManager } from './useToastManager';
import { UnifiedMapState, LatLng, MarkerData } from '../types';

const DEFAULT_CENTER = { lat: 40.7589, lng: -73.9851 }; // NYC
const DEFAULT_ZOOM = 12;

export const useMapCore = (initialCenter?: LatLng, initialZoom?: number) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const [mapState, setMapState] = useState<UnifiedMapState>({
    center: initialCenter || DEFAULT_CENTER,
    zoom: initialZoom || DEFAULT_ZOOM,
    markers: [],
    selectedLocationId: null,
    hoveredLocationId: null,
    isLoading: false,
    error: null
  });
  
  const { userLocation } = useUserLocation();
  const { searchPlacesByText, searchNearbyPlaces } = usePlacesApi();
  const { showSuccessToast, showInfoToast, showErrorToast } = useToastManager();

  const updateMapState = useCallback((updates: Partial<UnifiedMapState>) => {
    setMapState(prev => ({ ...prev, ...updates }));
  }, []);

  const setMapRef = useCallback((map: google.maps.Map | null) => {
    mapRef.current = map;
  }, []);

  const handleMapLoaded = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, [setMapRef]);

  const handleMapIdle = useCallback((center: LatLng, zoom: number) => {
    updateMapState({ center, zoom });
  }, [updateMapState]);

  // Convenience methods
  const updateCenter = useCallback((center: LatLng) => {
    updateMapState({ center });
  }, [updateMapState]);

  const updateZoom = useCallback((zoom: number) => {
    updateMapState({ zoom });
  }, [updateMapState]);

  const updateMarkers = useCallback((markers: MarkerData[]) => {
    updateMapState({ markers });
  }, [updateMapState]);

  const selectLocation = useCallback((locationId: string | null) => {
    updateMapState({ selectedLocationId: locationId });
  }, [updateMapState]);

  const hoverLocation = useCallback((locationId: string | null) => {
    updateMapState({ hoveredLocationId: locationId });
  }, [updateMapState]);

  const clearMarkers = useCallback(() => {
    updateMapState({ markers: [] });
  }, [updateMapState]);

  const setLoading = useCallback((isLoading: boolean) => {
    updateMapState({ isLoading });
  }, [updateMapState]);

  const setError = useCallback((error: string | null) => {
    updateMapState({ error });
  }, [updateMapState]);

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
    setLoading,
    setError,
    
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
