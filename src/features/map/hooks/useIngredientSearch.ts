
import { useCallback } from 'react';
import { MarkerData } from '../types';
import { useSearchState } from './useSearchState';
import { useEdgeFunctionApi } from './useEdgeFunctionApi';
import { mapPlaceTypeToMarkerType } from '../utils/placeTypeMapper';

export const useIngredientSearch = () => {
  const searchState = useSearchState();
  const { callEdgeFunction } = useEdgeFunctionApi();

  const searchPlacesWithIngredients = useCallback(async (
    center: google.maps.LatLngLiteral,
    ingredientNames: string[],
    options?: {
      dietaryRestrictions?: string[];
      placeType?: string;
      radius?: number;
      limit?: number;
    }
  ): Promise<MarkerData[]> => {
    searchState.startSearch();

    try {
      console.log(`Ingredient search: ${ingredientNames.join(', ')} with options:`, options);

      const results = await callEdgeFunction('places-cache-manager', {
        action: 'search_ingredients',
        ingredients: ingredientNames,
        latitude: center.lat,
        longitude: center.lng,
        radius: options?.radius || 5000,
        dietary_restrictions: options?.dietaryRestrictions,
        place_type: options?.placeType,
        limit: options?.limit || 20
      });

      if (results?.success && results.results) {
        const markers: MarkerData[] = results.results.map((place: any) => ({
          position: {
            lat: Number(place.latitude),
            lng: Number(place.longitude)
          },
          locationId: place.place_id,
          type: mapPlaceTypeToMarkerType(place.primary_type)
        }));

        searchState.completeSearch(markers.length);
        return markers;
      }

      searchState.completeSearch(0);
      return [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places with ingredients';
      searchState.errorSearch(errorMessage);
      console.error('Ingredient search error:', err);
      return [];
    }
  }, [callEdgeFunction, searchState]);

  return {
    searchPlacesWithIngredients,
    ...searchState
  };
};
