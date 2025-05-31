import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarkerData } from '../types';
import { databaseService } from '@/services/databaseService';
import { useAppStore } from '@/store/appStore';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheHitRate, setCacheHitRate] = useState<number | null>(null);
  const [resultCount, setResultCount] = useState<number>(0);
  
  const { mapFilters } = useAppStore();

  /**
   * Enhanced search with filter integration
   */
  const searchCachedPlaces = useCallback(async (
    query: string,
    center: google.maps.LatLngLiteral,
    radius: number = 5000
  ): Promise<MarkerData[]> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Enhanced search with filters:`, {
        query,
        center,
        radius,
        filters: mapFilters
      });

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
        console.log(`Cache ${data.source}: Found ${data.count} filtered places`);
        setResultCount(data.count || 0);
        
        // Update cache hit rate
        if (data.source === 'cache') {
          setCacheHitRate(prev => prev === null ? 1 : (prev * 0.9 + 0.1));
        } else {
          setCacheHitRate(prev => prev === null ? 0 : (prev * 0.9));
        }

        const results = data.results || [];
        const markers: MarkerData[] = results.map((place: any) => ({
          position: {
            lat: Number(place.latitude),
            lng: Number(place.longitude)
          },
          locationId: place.place_id || place.id,
          type: mapPlaceTypeToMarkerType(place.primary_type)
        }));

        setLoading(false);
        return markers;
      } else {
        throw new Error('Failed to search places via cache manager');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search cached places';
      setError(errorMessage);
      setLoading(false);
      setResultCount(0);
      console.error('Enhanced search error:', err);
      return [];
    }
  }, [mapFilters]);

  /**
   * Enhanced nearby search with comprehensive filtering
   */
  const searchNearbyPlaces = useCallback(async (
    center: google.maps.LatLngLiteral,
    radius: number = 2000
  ): Promise<MarkerData[]> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Enhanced nearby search with filters:`, {
        center,
        radius,
        filters: mapFilters
      });

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
        // Apply additional client-side filtering for features not yet in database
        const filteredResults = results.filter(place => {
          // Price range filter
          if (mapFilters.priceRange && place.price_level !== undefined) {
            const [minPrice, maxPrice] = mapFilters.priceRange;
            if (place.price_level < minPrice || place.price_level > maxPrice) {
              return false;
            }
          }

          // Exclude ingredients filter (basic implementation)
          if (mapFilters.excludeIngredients.length > 0) {
            // This would need to be enhanced with actual ingredient data
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
        setResultCount(filteredResults.length);
        
        setCacheHitRate(prev => prev === null ? 1 : (prev * 0.9 + 0.1));

        const markers: MarkerData[] = filteredResults.map((place: any) => ({
          position: {
            lat: Number(place.latitude),
            lng: Number(place.longitude)
          },
          locationId: place.place_id,
          type: mapPlaceTypeToMarkerType(place.primary_type)
        }));

        setLoading(false);
        return markers;
      } else {
        console.log('No enhanced nearby places found with current filters');
        setResultCount(0);
        
        // Trigger background population for better future results
        triggerBackgroundPopulation(center, radius).catch(err => 
          console.error('Background population failed:', err)
        );

        setLoading(false);
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search enhanced nearby places';
      setError(errorMessage);
      setLoading(false);
      setResultCount(0);
      console.error('Enhanced nearby search error:', err);
      return [];
    }
  }, [mapFilters]);

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
    setLoading(true);
    setError(null);

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

      const markers: MarkerData[] = results.map((place: any) => ({
        position: {
          lat: Number(place.latitude),
          lng: Number(place.longitude)
        },
        locationId: place.place_id,
        type: mapPlaceTypeToMarkerType(place.primary_type)
      }));

      setLoading(false);
      return markers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places with ingredients';
      setError(errorMessage);
      setLoading(false);
      console.error('Enhanced ingredient search error:', err);
      return [];
    }
  }, []);

  /**
   * Enhanced area population with better error handling.
   */
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

  /**
   * Enhanced cache statistics with better data processing.
   */
  const getCacheStats = useCallback(async () => {
    try {
      const stats = await databaseService.getCacheStats();
      const processedStats = {
        success: true,
        stats: stats,
        total_places: stats && stats.length > 0 ? stats[0].total_places_cached || 0 : 0,
        hit_rate: cacheHitRate,
        last_updated: new Date().toISOString()
      };
      return processedStats;
    } catch (err) {
      console.error('Enhanced cache stats error:', err);
      throw err;
    }
  }, [cacheHitRate]);

  /**
   * Helper method to map place types to marker types.
   */
  const mapPlaceTypeToMarkerType = (placeType: string): 'restaurant' | 'grocery' | 'search-result' => {
    const restaurantTypes = ['restaurant', 'cafe', 'bakery', 'bar', 'fast_food', 'food_court'];
    const groceryTypes = ['grocery_store', 'convenience_store', 'specialty_food_store', 'farmers_market'];
    
    if (restaurantTypes.includes(placeType)) return 'restaurant';
    if (groceryTypes.includes(placeType)) return 'grocery';
    return 'search-result';
  };

  /**
   * Helper method to trigger background population.
   */
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
    loading,
    error,
    cacheHitRate,
    resultCount
  };
};
