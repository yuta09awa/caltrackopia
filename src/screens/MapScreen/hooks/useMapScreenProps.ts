
import { useMemo } from 'react';
import { Ingredient } from '@/models/NutritionalInfo';
import { Location } from '@/features/locations/types';
import { MapState } from '@/features/map/hooks/useMapState';

interface MapScreenCallbacks {
  wrappedHandleSelectIngredient: (ingredient: Ingredient) => Promise<void>;
  wrappedHandleSearchReset: () => void;
  handleLocationSelect: (locationId: string) => void;
  handleMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  handleInfoCardClose: () => void;
  handleViewDetails: (locationId: string) => void;
  handleMapLoaded: (map: google.maps.Map) => Promise<void>;
  handleMapIdle: (center: { lat: number; lng: number }, zoom: number) => void;
}

interface MapScreenState {
  displayedSearchQuery: string;
  mapHeight: string;
  selectedIngredient: Ingredient | null;
  currentSearchQuery: string;
  mapState: MapState;
  showInfoCard: boolean;
  selectedLocation: Location | null;
  infoCardPosition: { x: number; y: number };
  listRef: React.RefObject<HTMLDivElement>;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const useMapScreenProps = (state: MapScreenState, callbacks: MapScreenCallbacks) => {
  // Memoize props objects to prevent unnecessary re-renders
  const headerProps = useMemo(() => ({
    displayedSearchQuery: state.displayedSearchQuery,
    onSelectIngredient: callbacks.wrappedHandleSelectIngredient,
    onSearchReset: callbacks.wrappedHandleSearchReset
  }), [state.displayedSearchQuery, callbacks.wrappedHandleSelectIngredient, callbacks.wrappedHandleSearchReset]);

  const contentProps = useMemo(() => ({
    mapHeight: state.mapHeight,
    selectedIngredient: state.selectedIngredient,
    currentSearchQuery: state.currentSearchQuery,
    mapState: state.mapState,
    showInfoCard: state.showInfoCard,
    selectedLocation: state.selectedLocation,
    infoCardPosition: state.infoCardPosition,
    onLocationSelect: callbacks.handleLocationSelect,
    onMarkerClick: callbacks.handleMarkerClick,
    onMapLoaded: callbacks.handleMapLoaded,
    onMapIdle: callbacks.handleMapIdle,
    onInfoCardClose: callbacks.handleInfoCardClose,
    onViewDetails: callbacks.handleViewDetails
  }), [
    state.mapHeight,
    state.selectedIngredient,
    state.currentSearchQuery,
    state.mapState,
    state.showInfoCard,
    state.selectedLocation,
    state.infoCardPosition,
    callbacks.handleLocationSelect,
    callbacks.handleMarkerClick,
    callbacks.handleMapLoaded,
    callbacks.handleMapIdle,
    callbacks.handleInfoCardClose,
    callbacks.handleViewDetails
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
