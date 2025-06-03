
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
  handleLocationSelect: (locationId: string) => void;
  handleMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  handleInfoCardClose: () => void;
  handleViewDetails: (locationId: string) => void;
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
  handleLocationSelect,
  handleMarkerClick,
  handleInfoCardClose,
  handleViewDetails,
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
    onLocationSelect: handleLocationSelect,
    onMarkerClick: handleMarkerClick,
    onMapLoaded: handleMapLoaded,
    onMapIdle: handleMapIdle,
    onInfoCardClose: handleInfoCardClose,
    onViewDetails: handleViewDetails
  }), [
    mapHeight,
    selectedIngredient,
    currentSearchQuery,
    mapState,
    showInfoCard,
    selectedLocation,
    infoCardPosition,
    handleLocationSelect,
    handleMarkerClick,
    handleMapLoaded,
    handleMapIdle,
    handleInfoCardClose,
    handleViewDetails
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
