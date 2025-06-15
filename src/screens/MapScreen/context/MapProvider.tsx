
import React, { useRef, useCallback } from 'react';
import { MapProvider as BaseMapProvider, MapContextValue } from './MapContext';
import { useMapState } from '@/features/map/hooks/useMapState';
import { useMapSearch } from '@/features/map/hooks/useMapSearch';
import { useMapInteractions } from '@/features/map/hooks/useMapInteractions';
import { useMapUI } from '@/features/map/hooks/useMapUI';
import { useUserLocation } from '@/features/map/hooks/useUserLocation';
import { useLocations } from '@/features/locations/hooks/useLocations';
import { usePlacesApi } from '@/features/map/hooks/usePlacesApi';
import { useToastManager } from '@/features/map/hooks/useToastManager';
import { Ingredient } from '@/models/NutritionalInfo';
import { LatLng } from '@/features/map/hooks/useMapState';

interface MapProviderProps {
  children: React.ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Core hooks
  const { 
    mapState, 
    updateCenter, 
    updateZoom, 
    updateMarkers, 
    selectLocation, 
    clearMarkers 
  } = useMapState();
  
  const {
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    handleSelectIngredient: baseHandleSelectIngredient,
    handleSearchReset: baseHandleSearchReset
  } = useMapSearch();
  
  const {
    showInfoCard,
    infoCardPosition,
    selectedLocation,
    handleLocationSelect: baseHandleLocationSelect,
    handleMarkerClick: baseHandleMarkerClick,
    handleInfoCardClose: baseHandleInfoCardClose,
    handleViewDetails: baseHandleViewDetails,
  } = useMapInteractions();
  
  const { mapHeight, listRef, handleScroll } = useMapUI();
  const { userLocation } = useUserLocation();
  const { locations } = useLocations();
  const { searchPlacesByText, searchNearbyPlaces } = usePlacesApi();
  const { showInfoToast, showErrorToast } = useToastManager();

  // Enhanced action handlers
  const handleSelectIngredient = useCallback(async (ingredient: Ingredient) => {
    await baseHandleSelectIngredient(
      ingredient,
      mapRef,
      mapState,
      updateMarkers,
      updateCenter,
      searchPlacesByText
    );
  }, [baseHandleSelectIngredient, mapState, updateMarkers, updateCenter, searchPlacesByText]);

  const handleSearchReset = useCallback(() => {
    baseHandleSearchReset(
      clearMarkers,
      mapRef,
      mapState,
      searchNearbyPlaces,
      updateMarkers
    );
  }, [baseHandleSearchReset, clearMarkers, mapState, searchNearbyPlaces, updateMarkers]);

  const handleLocationSelect = useCallback((locationId: string) => {
    baseHandleLocationSelect(locationId, locations, selectLocation);
  }, [baseHandleLocationSelect, locations, selectLocation]);

  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    baseHandleMarkerClick(locationId, position, locations, selectLocation);
  }, [baseHandleMarkerClick, locations, selectLocation]);

  const handleInfoCardClose = useCallback(() => {
    baseHandleInfoCardClose(selectLocation);
  }, [baseHandleInfoCardClose, selectLocation]);

  const handleViewDetails = useCallback((locationId: string) => {
    baseHandleViewDetails(locationId, locations);
    handleInfoCardClose();
  }, [baseHandleViewDetails, locations, handleInfoCardClose]);

  const handleMapLoaded = useCallback(async (map: google.maps.Map) => {
    mapRef.current = map;
    if (!currentSearchQuery) {
      try {
        const nearbyPlaces = await searchNearbyPlaces(map, mapState.center);
        updateMarkers(nearbyPlaces);
        if (nearbyPlaces.length > 0) {
          showInfoToast(`Loaded ${nearbyPlaces.length} nearby places.`);
        }
      } catch (error) {
        console.error('Failed to load initial nearby places:', error);
        showErrorToast('Failed to load nearby places.');
      }
    } else if (selectedIngredient) {
      handleSelectIngredient(selectedIngredient);
    }
  }, [currentSearchQuery, mapState.center, selectedIngredient, searchNearbyPlaces, updateMarkers, showInfoToast, showErrorToast, handleSelectIngredient]);

  const handleMapIdle = useCallback((center: LatLng, zoom: number) => {
    updateCenter(center);
    updateZoom(zoom);
  }, [updateCenter, updateZoom]);

  // Auto-update center when user location changes
  React.useEffect(() => {
    if (userLocation) {
      updateCenter(userLocation);
    }
  }, [userLocation, updateCenter]);

  const contextValue: MapContextValue = {
    // State
    mapState,
    mapRef,
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    mapHeight,
    listRef,
    showInfoCard,
    selectedLocation,
    infoCardPosition,
    userLocation,
    locations,
    
    // Actions
    updateCenter,
    updateZoom,
    updateMarkers,
    selectLocation,
    clearMarkers,
    handleSelectIngredient,
    handleSearchReset,
    handleScroll,
    handleLocationSelect,
    handleMarkerClick,
    handleInfoCardClose,
    handleViewDetails,
    handleMapLoaded,
    handleMapIdle,
  };

  return (
    <BaseMapProvider value={contextValue}>
      {children}
    </BaseMapProvider>
  );
};
