
import { useCallback, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarkerData } from '../types';
import { databaseService } from '@/services/databaseService';
import { useAppStore } from '@/store/appStore';
import { useSearchState } from './useSearchState';

export interface CachedPlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
  primary_type: string;
  rating: number;
  price_level: number;
  is_open_now: boolean;
  distance_meters: number;
  available_ingredients?: string[];
  dietary_compatible?: boolean;
}

export const useCachedPlacesApi = () => {
  const { mapFilters } = useAppStore();
  const searchState = useSearchState();
  const [cacheHitRate, setCacheHitRate] = useState<number | null>(null);
  const cacheHits = useRef(0);
  const cacheMisses = useRef(0);

  const updateCacheStats = useCallback((hit: boolean) => {
    if (hit) {
      cacheHits.current++;
    } else {
      cacheMisses.current++;
    }
    
    const total = cacheHits.current + cacheMisses.current;
    if (total > 0) {
      setCacheHitRate(cacheHits.current / total);
    }
  }, []);

  const searchNearbyPlaces = useCallback(async (
    center: google.maps.LatLngLiteral,
    radius: number = 2000
  ): Promise<MarkerData[]> => {
    searchState.startSearch();

    try {
      console.log(`Enhanced nearby search with filters:`, { center, radius, filters: mapFilters });

      const results = await databaseService.findPlacesWithIngredients(
        center.lat,
        center.lng,
        radius,
        mapFilters.includeIngredients.length > 0 ? mapFilters.includeIngredients : undefined,
        mapFilters.dietary.length > 0 ? mapFilters.dietary : undefined,
        mapFilters.cuisine !== 'all' ? mapFilters.cuisine : undefined,
        20
      );

      if (results && results.length > 0) {
        updateCacheStats(true);
        
        const filteredResults = results.filter(place => {
          // Price range filter
          if (mapFilters.priceRange && place.price_level !== undefined && place.price_level !== null) {
            const [minPrice, maxPrice] = mapFilters.priceRange;
            if (place.price_level < minPrice || place.price_level > maxPrice) {
              return false;
            }
          }

          // Exclude ingredients filter
          if (mapFilters.excludeIngredients.length > 0) {
            const placeName = place.name.toLowerCase();
            const hasExcludedIngredient = mapFilters.excludeIngredients.some(ingredient =>
              placeName.includes(ingredient.toLowerCase())
            );
            if (hasExcludedIngredient) {
              return false;
            }
          }

          return true;
        });

        console.log(`Found ${filteredResults.length} enhanced nearby places after filtering`);
        
        const markers: MarkerData[] = filteredResults.map((place: any) => ({
          position: { lat: Number(place.latitude), lng: Number(place.longitude) },
          id: place.place_id,
          type: mapPlaceTypeToMarkerType(place.primary_type)
        }));

        searchState.completeSearch(filteredResults.length);
        return markers;
      } else {
        updateCacheStats(false);
        console.log('No enhanced nearby places found with current filters');
        triggerBackgroundPopulation(center, radius).catch(err => 
          console.error('Background population failed:', err)
        );
        searchState.completeSearch(0);
        return [];
      }
    } catch (err) {
      updateCacheStats(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to search enhanced nearby places';
      searchState.errorSearch(errorMessage);
      console.error('Enhanced nearby search error:', err);
      return [];
    }
  }, [mapFilters, searchState, updateCacheStats]);

  const searchCachedPlaces = useCallback(async (
    query: string,
    center: google.maps.LatLngLiteral,
    radius: number = 5000
  ): Promise<MarkerData[]> => {
    searchState.startSearch();

    try {
      console.log(`Enhanced search with filters:`, { query, center, radius, filters: mapFilters });

      const { data, error: functionError } = await supabase.functions.invoke('places-cache-manager', {
        body: {
          action: 'search_and_cache',
          search_query: query,
          latitude: center.lat,
          longitude: center.lng,
          radius: radius,
          filters: {
            dietary: mapFilters.dietary,
            nutrition: mapFilters.nutrition,
            sources: mapFilters.sources,
            includeIngredients: mapFilters.includeIngredients,
            excludeIngredients: mapFilters.excludeIngredients,
            priceRange: mapFilters.priceRange,
            cuisine: mapFilters.cuisine !== 'all' ? mapFilters.cuisine : null,
            groceryCategory: mapFilters.groceryCategory !== 'all' ? mapFilters.groceryCategory : null
          }
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data && data.success) {
        updateCacheStats(data.source === 'cache');
        console.log(`Cache ${data.source}: Found ${data.count} filtered places`);
        
        const results = data.results || [];
        const markers: MarkerData[] = results.map((place: any) => ({
          position: { lat: Number(place.latitude), lng: Number(place.longitude) },
          id: place.place_id || place.id,
          type: mapPlaceTypeToMarkerType(place.primary_type)
        }));

        searchState.completeSearch(data.count || 0);
        return markers;
      } else {
        throw new Error('Failed to search places via cache manager');
      }
    } catch (err) {
      updateCacheStats(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to search cached places';
      searchState.errorSearch(errorMessage);
      console.error('Enhanced search error:', err);
      return [];
    }
  }, [mapFilters, searchState, updateCacheStats]);

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
      console.log(`Enhanced ingredient search: ${ingredientNames.join(', ')} with options:`, options);

      const results = await databaseService.findPlacesWithIngredients(
        center.lat,
        center.lng,
        options?.radius || 5000,
        ingredientNames,
        options?.dietaryRestrictions,
        options?.placeType,
        options?.limit || 20
      );

      updateCacheStats(results.length > 0);

      const markers: MarkerData[] = results.map((place: any) => ({
        position: {
          lat: Number(place.latitude),
          lng: Number(place.longitude)
        },
        id: place.place_id,
        type: mapPlaceTypeToMarkerType(place.primary_type)
      }));

      searchState.completeSearch(markers.length);
      return markers;
    } catch (err) {
      updateCacheStats(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places with ingredients';
      searchState.errorSearch(errorMessage);
      console.error('Enhanced ingredient search error:', err);
      return [];
    }
  }, [searchState, updateCacheStats]);

  const populateArea = useCallback(async (areaId?: string) => {
    try {
      const { data, error: functionError } = await supabase.functions.invoke('places-cache-manager', {
        body: {
          action: 'populate_area',
          area_id: areaId
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      return data;
    } catch (err) {
      console.error('Enhanced area population error:', err);
      throw err;
    }
  }, []);

  const getCacheStats = useCallback(async () => {
    try {
      const stats = await databaseService.getCacheStats();
      return stats;
    } catch (err) {
      console.error('Enhanced cache stats error:', err);
      throw err;
    }
  }, []);

  const mapPlaceTypeToMarkerType = (placeType: string): 'restaurant' | 'grocery' | 'search-result' => {
    const restaurantTypes = ['restaurant', 'cafe', 'bakery', 'bar', 'fast_food', 'food_court'];
    const groceryTypes = ['grocery_store', 'convenience_store', 'specialty_food_store', 'farmers_market'];
    
    if (restaurantTypes.includes(placeType)) return 'restaurant';
    if (groceryTypes.includes(placeType)) return 'grocery';
    return 'search-result';
  };

  const triggerBackgroundPopulation = async (center: google.maps.LatLngLiteral, radius: number) => {
    try {
      await supabase.functions.invoke('places-cache-manager', {
        body: {
          action: 'search_and_cache',
          search_query: 'restaurant',
          latitude: center.lat,
          longitude: center.lng,
          radius: radius
        }
      });
    } catch (error) {
      console.warn('Background population failed:', error);
    }
  };

  return {
    searchCachedPlaces,
    searchNearbyPlaces,
    searchPlacesWithIngredients,
    populateArea,
    getCacheStats,
    cacheHitRate,
    ...searchState
  };
};
