import { useCallback } from 'react';
import { MarkerData } from '../types';
import { useTextSearch } from './useTextSearch';
import { useNearbySearch } from './useNearbySearch';
import { useIngredientSearch } from './useIngredientSearch';
import { usePlacesApiService } from './usePlacesApiService';

export const usePlacesApi = () => {
  const textSearch = useTextSearch();
  const nearbySearch = useNearbySearch();
  const ingredientSearch = useIngredientSearch();
  const { getPlaceDetails, waitForPlacesApi, getProvider } = usePlacesApiService();

  const searchNearbyPlaces = useCallback(async (
    map: google.maps.Map,
    center: google.maps.LatLngLiteral,
    radius: number = 2000
  ): Promise<MarkerData[]> => {
    return nearbySearch.searchNearbyPlaces(map, center, radius);
  }, [nearbySearch.searchNearbyPlaces]);

  return {
    // Core search functions
    searchPlacesByText: textSearch.searchPlacesByText,
    searchNearbyPlaces,
    searchPlacesWithIngredients: ingredientSearch.searchPlacesWithIngredients,
    
    // Place details
    getPlaceDetails,
    
    // State
    loading: textSearch.loading || nearbySearch.loading || ingredientSearch.loading,
    error: textSearch.error || nearbySearch.error || ingredientSearch.error,
    resultCount: textSearch.resultCount || nearbySearch.resultCount || ingredientSearch.resultCount,
    
    // Provider access (for advanced use)
    waitForPlacesApi,
    getProvider
  };
};
