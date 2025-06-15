
import { useAppStore } from '@/store/appStore';
import { useCallback } from 'react';

export const useMapStore = () => {
  const store = useAppStore();

  // Map state selectors
  const mapState = store.mapState;
  const userLocation = store.userLocation;
  const selectedIngredient = store.selectedIngredient;
  const currentSearchQuery = store.currentSearchQuery;
  const displayedSearchQuery = store.displayedSearchQuery;
  const showInfoCard = store.showInfoCard;
  const selectedLocation = store.selectedLocation;
  const infoCardPosition = store.infoCardPosition;

  // Map actions
  const updateCenter = store.updateCenter;
  const updateZoom = store.updateZoom;
  const updateMarkers = store.updateMarkers;
  const selectLocation = store.selectLocation;
  const setUserLocation = store.setUserLocation;
  const setSelectedIngredient = store.setSelectedIngredient;
  const setSearchQuery = store.setSearchQuery;
  const setDisplayedSearchQuery = store.setDisplayedSearchQuery;
  const setShowInfoCard = store.setShowInfoCard;
  const setSelectedLocationData = store.setSelectedLocationData;
  const setInfoCardPosition = store.setInfoCardPosition;
  const clearMarkers = store.clearMarkers;
  const resetMapState = store.resetMapState;

  return {
    // State
    mapState,
    userLocation,
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    showInfoCard,
    selectedLocation,
    infoCardPosition,

    // Actions
    updateCenter,
    updateZoom,
    updateMarkers,
    selectLocation,
    setUserLocation,
    setSelectedIngredient,
    setSearchQuery,
    setDisplayedSearchQuery,
    setShowInfoCard,
    setSelectedLocationData,
    setInfoCardPosition,
    clearMarkers,
    resetMapState,
  };
};
