
import { useMapSearch } from '@/features/map/hooks/useMapSearch';
import { useMapScreenDependencies } from './useMapScreenDependencies';
import { useCallback } from 'react';
import { Ingredient } from '@/models/NutritionalInfo';

export const useMapScreenSearch = () => {
  const core = useMapScreenDependencies();
  
  const {
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    handleSelectIngredient: baseHandleSelectIngredient,
    handleSearchReset: baseHandleSearchReset
  } = useMapSearch();

  const handleSelectIngredient = useCallback(async (ingredient: Ingredient) => {
    await baseHandleSelectIngredient(
      ingredient,
      core.mapRef,
      core.mapState,
      core.dependencies.updateMarkers,
      core.dependencies.updateCenter,
      core.dependencies.searchPlacesByText
    );
  }, [baseHandleSelectIngredient, core.mapRef, core.mapState, core.dependencies]);

  const handleSearchReset = useCallback(() => {
    baseHandleSearchReset(
      core.dependencies.clearMarkers,
      core.mapRef,
      core.mapState,
      core.dependencies.searchNearbyPlaces,
      core.dependencies.updateMarkers
    );
  }, [baseHandleSearchReset, core.mapRef, core.mapState, core.dependencies]);

  return {
    ...core,
    selectedIngredient,
    currentSearchQuery,
    displayedSearchQuery,
    handleSelectIngredient,
    handleSearchReset
  };
};
