
import { useTextSearch } from './useTextSearch';
import { useNearbySearch } from './useNearbySearch';
import { useIngredientSearch } from './useIngredientSearch';

export const usePlaceSearch = () => {
  const textSearch = useTextSearch();
  const nearbySearch = useNearbySearch();
  const ingredientSearch = useIngredientSearch();

  return {
    searchPlacesByText: textSearch.searchPlacesByText,
    searchNearbyPlaces: nearbySearch.searchNearbyPlaces,
    searchPlacesWithIngredients: ingredientSearch.searchPlacesWithIngredients,
    loading: textSearch.loading || nearbySearch.loading || ingredientSearch.loading,
    error: textSearch.error || nearbySearch.error || ingredientSearch.error,
    resultCount: textSearch.resultCount || nearbySearch.resultCount || ingredientSearch.resultCount
  };
};
