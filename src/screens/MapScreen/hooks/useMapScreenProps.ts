
import { useMemo } from 'react';
import { Ingredient } from '@/models/NutritionalInfo';
import { Location } from '@/features/locations/types';
import { MapState } from '@/features/map/hooks/useMapState';

interface UseMapScreenPropsParams {
  displayedSearchQuery: string;
  mapHeight: string;
  selectedIngredient: Ingredient | null;
  currentSearchQuery: string;
  mapState: MapState;
  showInfoCard: boolean;
  selectedLocation: Location | null;
  infoCardPosition: { x: number; y: number };
  listRef: React.RefObject<HTMLDivElement>;
  wrappedHandleSelectIngredient: (ingredient: Ingredient) => Promise<void>;
  wrappedHandleSearchReset: () => void;
  wrappedHandleLocationSelect: (locationId: string) => void;
  wrappedHandleMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  wrappedHandleInfoCardClose: () => void;
  wrappedHandleViewDetails: (locationId: string) => void;
  handleMapLoaded: (map: google.maps.Map) => Promise<void>;
  handleMapIdle: (center: { lat: number; lng: number }, zoom: number) => void;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const useMapScreenProps = ({
  displayedSearchQuery,
  mapHeight,
  selectedIngredient,
  currentSearchQuery,
  mapState,
  showInfoCard,
  selectedLocation,
  infoCardPosition,
  listRef,
  wrappedHandleSelectIngredient,
  wrappedHandleSearchReset,
  wrappedHandleLocationSelect,
  wrappedHandleMarkerClick,
  wrappedHandleInfoCardClose,
  wrappedHandleViewDetails,
  handleMapLoaded,
  handleMapIdle,
  handleScroll
}: UseMapScreenPropsParams) => {

  // Memoize props objects to prevent unnecessary re-renders
  const headerProps = useMemo(() => ({
    displayedSearchQuery,
    onSelectIngredient: wrappedHandleSelectIngredient,
    onSearchReset: wrappedHandleSearchReset
  }), [displayedSearchQuery, wrappedHandleSelectIngredient, wrappedHandleSearchReset]);

  const contentProps = useMemo(() => ({
    mapHeight,
    selectedIngredient,
    currentSearchQuery,
    mapState,
    showInfoCard,
    selectedLocation,
    infoCardPosition,
    onLocationSelect: wrappedHandleLocationSelect,
    onMarkerClick: wrappedHandleMarkerClick,
    onMapLoaded: handleMapLoaded,
    onMapIdle: handleMapIdle,
    onInfoCardClose: wrappedHandleInfoCardClose,
    onViewDetails: wrappedHandleViewDetails
  }), [
    mapHeight,
    selectedIngredient,
    currentSearchQuery,
    mapState,
    showInfoCard,
    selectedLocation,
    infoCardPosition,
    wrappedHandleLocationSelect,
    wrappedHandleMarkerClick,
    handleMapLoaded,
    handleMapIdle,
    wrappedHandleInfoCardClose,
    wrappedHandleViewDetails
  ]);

  const listProps = useMemo(() => ({
    listRef,
    selectedLocationId: mapState.selectedLocationId,
    onScroll: handleScroll
  }), [listRef, mapState.selectedLocationId, handleScroll]);

  return {
    headerProps,
    contentProps,
    listProps
  };
};
