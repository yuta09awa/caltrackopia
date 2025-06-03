
import { useCallback, useMemo, useEffect } from 'react';
import { Ingredient } from '@/models/NutritionalInfo';
import { LatLng } from '@/features/map/hooks/useMapState';

interface UseMapScreenCallbacksProps {
  mapRef: React.RefObject<google.maps.Map | null>;
  mapState: any;
  selectedIngredient: Ingredient | null;
  currentSearchQuery: string;
  handleSelectIngredient: any;
  handleSearchReset: any;
  handleLocationSelect: any;
  handleMarkerClick: any;
  handleInfoCardClose: any;
  handleViewDetails: any;
  updateCenter: (center: LatLng) => void;
  updateZoom: (zoom: number) => void;
  userLocation: LatLng | null;
  stableDependencies: any;
}

export const useMapScreenCallbacks = ({
  mapRef,
  mapState,
  selectedIngredient,
  currentSearchQuery,
  handleSelectIngredient,
  handleSearchReset,
  handleLocationSelect,
  handleMarkerClick,
  handleInfoCardClose,
  handleViewDetails,
  updateCenter,
  updateZoom,
  userLocation,
  stableDependencies
}: UseMapScreenCallbacksProps) => {
  
  // Optimized wrapped handlers with proper dependencies
  const wrappedHandleSelectIngredient = useCallback(async (ingredient: Ingredient) => {
    await handleSelectIngredient(
      ingredient,
      mapRef,
      mapState,
      stableDependencies.updateMarkers,
      stableDependencies.updateCenter,
      stableDependencies.searchPlacesByText
    );
  }, [handleSelectIngredient, mapState, stableDependencies]);

  const wrappedHandleSearchReset = useCallback(() => {
    handleSearchReset(
      stableDependencies.clearMarkers,
      mapRef,
      mapState,
      stableDependencies.searchNearbyPlaces,
      stableDependencies.updateMarkers
    );
  }, [handleSearchReset, mapState, stableDependencies]);

  const wrappedHandleLocationSelect = useCallback((locationId: string) => {
    handleLocationSelect(locationId, stableDependencies.locations, stableDependencies.selectLocation);
  }, [handleLocationSelect, stableDependencies]);

  const wrappedHandleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    handleMarkerClick(locationId, position, stableDependencies.locations, stableDependencies.selectLocation);
  }, [handleMarkerClick, stableDependencies]);

  const wrappedHandleInfoCardClose = useCallback(() => {
    handleInfoCardClose(stableDependencies.selectLocation);
  }, [handleInfoCardClose, stableDependencies]);

  const wrappedHandleViewDetails = useCallback((locationId: string) => {
    handleViewDetails(locationId, stableDependencies.locations);
    wrappedHandleInfoCardClose();
  }, [handleViewDetails, stableDependencies, wrappedHandleInfoCardClose]);

  const handleMapLoaded = useCallback(async (map: google.maps.Map) => {
    mapRef.current = map;
    
    if (!currentSearchQuery) {
      try {
        const nearbyPlaces = await stableDependencies.searchNearbyPlaces(map, mapState.center);
        stableDependencies.updateMarkers(nearbyPlaces);
        if (nearbyPlaces.length > 0) {
          stableDependencies.showInfoToast(`Loaded ${nearbyPlaces.length} nearby places.`);
        }
      } catch (error) {
        console.error('Failed to load initial nearby places:', error);
        stableDependencies.showErrorToast('Failed to load nearby places.');
      }
    } else if (selectedIngredient) {
      wrappedHandleSelectIngredient(selectedIngredient);
    }
  }, [currentSearchQuery, mapState.center, selectedIngredient, wrappedHandleSelectIngredient, stableDependencies]);

  const handleMapIdle = useCallback((center: LatLng, zoom: number) => {
    updateCenter(center);
    updateZoom(zoom);
    console.log('Map idle:', { center, zoom });
  }, [updateCenter, updateZoom]);

  useEffect(() => {
    if (userLocation) {
      updateCenter(userLocation);
    }
  }, [userLocation, updateCenter]);

  return {
    wrappedHandleSelectIngredient,
    wrappedHandleSearchReset,
    wrappedHandleLocationSelect,
    wrappedHandleMarkerClick,
    wrappedHandleInfoCardClose,
    wrappedHandleViewDetails,
    handleMapLoaded,
    handleMapIdle
  };
};
