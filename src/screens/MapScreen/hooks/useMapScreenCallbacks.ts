
import React, { useCallback } from 'react';
import { Ingredient } from '@/models/NutritionalInfo';
import { useMapInitialization } from './useMapInitialization';

interface UseMapScreenCallbacksProps {
  mapRef: React.RefObject<google.maps.Map | null>;
  mapState: any;
  selectedIngredient: Ingredient | null;
  currentSearchQuery: string;
  handleSelectIngredient: (ingredient: Ingredient) => Promise<void>;
  handleSearchReset: () => void;
  updateCenter: any;
  updateZoom: any;
  userLocation: any;
  dependencies: any;
  handleLocationSelect: any;
  handleMarkerClick: any;
  handleInfoCardClose: any;
  handleViewDetails: any;
}

export const useMapScreenCallbacks = (props: UseMapScreenCallbacksProps) => {
  const {
    mapRef,
    mapState,
    selectedIngredient,
    currentSearchQuery,
    handleSelectIngredient,
    handleSearchReset,
    updateCenter,
    updateZoom,
    userLocation,
    dependencies,
    handleLocationSelect,
    handleMarkerClick,
    handleInfoCardClose,
    handleViewDetails
  } = props;

  const mapInitialization = useMapInitialization({
    currentSearchQuery,
    selectedIngredient,
    mapState,
    stableDependencies: dependencies,
    onSelectIngredient: handleSelectIngredient
  });

  // User location effect
  const handleUserLocationUpdate = useCallback(() => {
    if (userLocation) {
      updateCenter(userLocation);
    }
  }, [userLocation, updateCenter]);

  // Auto-update center when user location changes
  React.useEffect(() => {
    handleUserLocationUpdate();
  }, [handleUserLocationUpdate]);

  const handleMapIdle = useCallback((center: any, zoom: number) => {
    updateCenter(center);
    updateZoom(zoom);
  }, [updateCenter, updateZoom]);

  return {
    onSelectIngredient: handleSelectIngredient,
    onSearchReset: handleSearchReset,
    onLocationSelect: handleLocationSelect,
    onMarkerClick: handleMarkerClick,
    onInfoCardClose: handleInfoCardClose,
    onViewDetails: handleViewDetails,
    onMapLoaded: mapInitialization.handleMapLoaded,
    onMapIdle: handleMapIdle
  };
};
