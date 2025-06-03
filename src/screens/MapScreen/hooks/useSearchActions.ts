
import { useCallback } from 'react';
import { Ingredient } from '@/models/NutritionalInfo';

interface UseSearchActionsProps {
  mapRef: React.RefObject<google.maps.Map | null>;
  mapState: any;
  stableDependencies: any;
  handleSelectIngredient: any;
  handleSearchReset: any;
}

export const useSearchActions = ({
  mapRef,
  mapState,
  stableDependencies,
  handleSelectIngredient,
  handleSearchReset
}: UseSearchActionsProps) => {

  const wrappedHandleSelectIngredient = useCallback(async (ingredient: Ingredient) => {
    await handleSelectIngredient(
      ingredient,
      mapRef,
      mapState,
      stableDependencies.updateMarkers,
      stableDependencies.updateCenter,
      stableDependencies.searchPlacesByText
    );
  }, [handleSelectIngredient, mapState, stableDependencies, mapRef]);

  const wrappedHandleSearchReset = useCallback(() => {
    handleSearchReset(
      stableDependencies.clearMarkers,
      mapRef,
      mapState,
      stableDependencies.searchNearbyPlaces,
      stableDependencies.updateMarkers
    );
  }, [handleSearchReset, mapState, stableDependencies, mapRef]);

  return {
    wrappedHandleSelectIngredient,
    wrappedHandleSearchReset
  };
};
