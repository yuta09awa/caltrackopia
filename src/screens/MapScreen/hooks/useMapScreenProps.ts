
import { useMemo } from 'react';
import { MapScreenState, MapScreenCallbacks, MapScreenProps } from '../types';

export const useMapScreenProps = (
  state: MapScreenState, 
  callbacks: MapScreenCallbacks
): MapScreenProps => {
  
  const headerProps = useMemo(() => ({
    displayedSearchQuery: state.displayedSearchQuery,
    onSelectIngredient: callbacks.onSelectIngredient,
    onSearchReset: callbacks.onSearchReset
  }), [state.displayedSearchQuery, callbacks.onSelectIngredient, callbacks.onSearchReset]);

  const contentProps = useMemo(() => ({
    mapHeight: state.mapHeight,
    selectedIngredient: state.selectedIngredient,
    currentSearchQuery: state.currentSearchQuery,
    mapState: state.mapState,
    showInfoCard: state.showInfoCard,
    selectedLocation: state.selectedLocation,
    infoCardPosition: state.infoCardPosition,
    onLocationSelect: callbacks.onLocationSelect,
    onMarkerClick: callbacks.onMarkerClick,
    onMapLoaded: callbacks.onMapLoaded,
    onMapIdle: callbacks.onMapIdle,
    onInfoCardClose: callbacks.onInfoCardClose,
    onViewDetails: callbacks.onViewDetails
  }), [
    state.mapHeight,
    state.selectedIngredient,
    state.currentSearchQuery,
    state.mapState,
    state.showInfoCard,
    state.selectedLocation,
    state.infoCardPosition,
    callbacks.onLocationSelect,
    callbacks.onMarkerClick,
    callbacks.onMapLoaded,
    callbacks.onMapIdle,
    callbacks.onInfoCardClose,
    callbacks.onViewDetails
  ]);

  const listProps = useMemo(() => ({
    listRef: state.listRef,
    selectedLocationId: state.mapState.selectedLocationId,
    onScroll: state.handleScroll
  }), [state.listRef, state.mapState.selectedLocationId, state.handleScroll]);

  return {
    headerProps,
    contentProps,
    listProps
  };
};
