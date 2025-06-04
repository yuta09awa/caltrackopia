
import React, { useCallback } from 'react';
import { Ingredient } from '@/models/NutritionalInfo';
import { useSearchActions } from './useSearchActions';
import { useMapInitialization } from './useMapInitialization';
import { useMapScreenHandlers } from './useMapScreenHandlers';

interface UseMapScreenCallbacksProps {
  mapRef: React.RefObject<google.maps.Map | null>;
  mapState: any;
  selectedIngredient: Ingredient | null;
  currentSearchQuery: string;
  handleSelectIngredient: any;
  handleSearchReset: any;
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

  const searchActions = useSearchActions({
    mapRef,
    mapState,
    stableDependencies: dependencies,
    handleSelectIngredient,
    handleSearchReset
  });

  const mapInitialization = useMapInitialization({
    currentSearchQuery,
    selectedIngredient,
    mapState,
    stableDependencies: dependencies,
    onSelectIngredient: searchActions.wrappedHandleSelectIngredient
  });

  const eventHandlers = useMapScreenHandlers({
    updateCenter,
    updateZoom,
    handleLocationSelect,
    handleMarkerClick,
    handleInfoCardClose,
    handleViewDetails,
    stableDependencies: dependencies
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

  return {
    onSelectIngredient: searchActions.wrappedHandleSelectIngredient,
    onSearchReset: searchActions.wrappedHandleSearchReset,
    onLocationSelect: eventHandlers.handleLocationSelect,
    onMarkerClick: eventHandlers.handleMarkerClick,
    onInfoCardClose: eventHandlers.handleInfoCardClose,
    onViewDetails: eventHandlers.handleViewDetails,
    onMapLoaded: mapInitialization.handleMapLoaded,
    onMapIdle: eventHandlers.handleMapIdle
  };
};
