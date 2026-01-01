import { useCallback } from 'react';
import { MarkerData } from '../types';
import { usePlaceSearch } from './usePlaceSearch';
import { usePlacesApiService } from './usePlacesApiService';

export const usePlacesApi = () => {
  const { 
    searchPlacesByText,
    searchNearbyPlaces: searchNearbyPlacesCore,
    searchPlacesWithIngredients,
    loading,
    error,
    resultCount
  } = usePlaceSearch();

  const { getPlaceDetails, waitForPlacesApi, getProvider } = usePlacesApiService();

  const searchNearbyPlaces = useCallback(async (
    map: google.maps.Map,
    center: google.maps.LatLngLiteral,
    radius: number = 2000
  ): Promise<MarkerData[]> => {
    return searchNearbyPlacesCore(map, center, radius);
  }, [searchNearbyPlacesCore]);

  return {
    // Core search functions
    searchPlacesByText,
    searchNearbyPlaces,
    searchPlacesWithIngredients,
    
    // Place details
    getPlaceDetails,
    
    // State
    loading,
    error,
    resultCount,
    
    // Provider access (for advanced use)
    waitForPlacesApi,
    getProvider
  };
};
