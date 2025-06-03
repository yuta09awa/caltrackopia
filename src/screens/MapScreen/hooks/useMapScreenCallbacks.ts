
import { useEffect } from 'react';
import { Ingredient } from '@/models/NutritionalInfo';
import { LatLng } from '@/features/map/hooks/useMapState';
import { useMapInitialization } from './useMapInitialization';
import { useMapEventHandlers } from './useMapEventHandlers';
import { useSearchActions } from './useSearchActions';

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
    stableDependencies
  } = props;

  const searchActions = useSearchActions({
    mapRef,
    mapState,
    stableDependencies,
    handleSelectIngredient,
    handleSearchReset
  });

  const mapInitialization = useMapInitialization({
    currentSearchQuery,
    selectedIngredient,
    mapState,
    stableDependencies,
    onSelectIngredient: searchActions.wrappedHandleSelectIngredient
  });

  const eventHandlers = useMapEventHandlers({
    updateCenter,
    updateZoom,
    stableDependencies
  });

  useEffect(() => {
    if (userLocation) {
      updateCenter(userLocation);
    }
  }, [userLocation, updateCenter]);

  return {
    ...searchActions,
    ...eventHandlers,
    handleMapLoaded: mapInitialization.handleMapLoaded
  };
};
