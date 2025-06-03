
import { useCallback } from 'react';
import { MarkerData } from '../types';
import { usePlaceSearch } from './usePlaceSearch';
import { useMapApi } from './useMapApi';

export const usePlacesApi = () => {
  const { 
    searchPlacesByText,
    searchNearbyPlaces: searchNearbyPlacesCore,
    searchPlacesWithIngredients,
    loading,
    error,
    resultCount
  } = usePlaceSearch();

  const { getPlaceDetails } = useMapApi();

  const searchNearbyPlaces = useCallback(async (
    map: google.maps.Map,
    center: google.maps.LatLngLiteral,
    radius: number = 2000
  ): Promise<MarkerData[]> => {
    return searchNearbyPlacesCore(map, center, radius);
  }, [searchNearbyPlacesCore]);

  return {
    searchPlacesByText,
    searchNearbyPlaces,
    searchPlacesWithIngredients,
    getPlaceDetails,
    loading,
    error,
    resultCount
  };
};
