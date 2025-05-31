
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarkerData } from '../types';
import { databaseService } from '@/services/databaseService';

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

  /**
   * Searches cached places by text query, falling back to Google Places API via Edge Function.
   * Enhanced with better error handling and cache statistics.
   */
  const searchCachedPlaces = useCallback(async (
    query: string,
    center: google.maps.LatLngLiteral,
    radius: number = 5000
  ): Promise<MarkerData[]> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Enhanced search via Edge Function: ${query} at ${center.lat},${center.lng}`);

      const { data, error: functionError } = await supabase.functions.invoke('places-cache-manager', {
        body: {
          action: 'search_and_cache',
          search_query: query,
          latitude: center.lat,
          longitude: center.lng,
          radius: radius
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data && data.success) {
        console.log(`Cache ${data.source}: Found ${data.count} places`);
        
        // Enhanced cache hit rate calculation with smoother updates
        if (data.source === 'cache') {
          setCacheHitRate(prev => prev === null ? 1 : (prev * 0.9 + 0.1));
        } else {
          setCacheHitRate(prev => prev === null ? 0 : (prev * 0.9));
        }

        // Enhanced data transformation with better type handling
        const results = data.results || [];
        const markers: MarkerData[] = results.map((place: any) => ({
          position: {
            lat: Number(place.latitude),
            lng: Number(place.longitude)
          },
          locationId: place.place_id || place.id,
          type: this.mapPlaceTypeToMarkerType(place.primary_type)
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
      console.error('Enhanced search error:', err);
      return [];
    }
  }, []);

  /**
   * Enhanced nearby search with advanced filtering capabilities.
   */
  const searchNearbyPlaces = useCallback(async (
    center: google.maps.LatLngLiteral,
    radius: number = 2000,
    options?: {
      ingredientNames?: string[];
      dietaryRestrictions?: string[];
      placeType?: string;
      limit?: number;
    }
  ): Promise<MarkerData[]> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Enhanced nearby search at ${center.lat},${center.lng} with filters:`, options);

      const results = await databaseService.findPlacesWithIngredients(
        center.lat,
        center.lng,
        radius,
        options?.ingredientNames,
        options?.dietaryRestrictions,
        options?.placeType,
        options?.limit || 20
      );

      if (results && results.length > 0) {
        console.log(`Found ${results.length} enhanced nearby places`);
        
        // Update cache statistics with better tracking
        try {
          await supabase.rpc('update_cache_stats', { 
            hits: 1, 
            misses: 0, 
            saved: 1
          });
        } catch (rpcError) {
          console.warn('Failed to update cache stats:', rpcError);
        }
        
        setCacheHitRate(prev => prev === null ? 1 : (prev * 0.9 + 0.1));

        const markers: MarkerData[] = results.map((place: any) => ({
          position: {
            lat: Number(place.latitude),
            lng: Number(place.longitude)
          },
          locationId: place.place_id,
          type: this.mapPlaceTypeToMarkerType(place.primary_type)
        }));

        setLoading(false);
        return markers;
      } else {
        console.log('No enhanced nearby places found with current filters');
        
        // Trigger background population for better future results
        this.triggerBackgroundPopulation(center, radius).catch(err => 
          console.error('Background population failed:', err)
        );

        setLoading(false);
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search enhanced nearby places';
      setError(errorMessage);
      setLoading(false);
      console.error('Enhanced nearby search error:', err);
      return [];
    }
  }, []);

  /**
   * Enhanced ingredient-based search with dietary compatibility.
   */
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
        type: this.mapPlaceTypeToMarkerType(place.primary_type)
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
        total_places: stats.length > 0 ? stats[0].total_places_cached || 0 : 0,
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
    cacheHitRate
  };
};
