
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

  const searchCachedPlaces = useCallback(async (
    query: string,
    center: google.maps.LatLngLiteral,
    radius: number = 5000
  ): Promise<MarkerData[]> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Searching cached places: ${query} at ${center.lat},${center.lng}`);

      // Call our enhanced cache manager Edge Function
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
        
        // Update cache hit rate for UI feedback
        if (data.source === 'cache') {
          setCacheHitRate(prev => prev ? (prev + 1) / 2 : 1);
        } else {
          setCacheHitRate(prev => prev ? prev / 2 : 0);
        }

        // Convert cached results to MarkerData format
        const results = data.results || [];
        const markers: MarkerData[] = results.map((place: any) => ({
          position: {
            lat: Number(place.latitude),
            lng: Number(place.longitude)
          },
          locationId: place.place_id,
          type: place.primary_type === 'restaurant' || place.primary_type === 'cafe' ? 'restaurant' : 'grocery'
        }));

        setLoading(false);
        return markers;
      } else {
        throw new Error('Failed to search places');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search cached places';
      setError(errorMessage);
      setLoading(false);
      console.error('Cached places search error:', err);
      return [];
    }
  }, []);

  const searchNearbyPlaces = useCallback(async (
    center: google.maps.LatLngLiteral,
    radius: number = 2000
  ): Promise<MarkerData[]> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Searching nearby cached places at ${center.lat},${center.lng}`);

      // Use the database service for nearby search
      const results = await databaseService.findPlacesWithIngredients(
        center.lat,
        center.lng,
        radius,
        undefined, // no ingredient filter
        undefined, // no dietary restrictions
        undefined, // no place type filter
        20
      );

      if (results && results.length > 0) {
        console.log(`Found ${results.length} nearby cached places`);
        
        // Update cache statistics
        try {
          await supabase.rpc('update_cache_stats', { 
            hits: 1, 
            misses: 0, 
            saved: 1
          });
        } catch (rpcError) {
          console.warn('Failed to update cache stats:', rpcError);
        }
        
        setCacheHitRate(prev => prev ? (prev + 1) / 2 : 1);

        const markers: MarkerData[] = results.map((place: any) => ({
          position: {
            lat: Number(place.latitude),
            lng: Number(place.longitude)
          },
          locationId: place.place_id,
          type: place.primary_type === 'restaurant' || place.primary_type === 'cafe' ? 'restaurant' : 'grocery'
        }));

        setLoading(false);
        return markers;
      } else {
        // No cached results, trigger background population
        console.log('No cached nearby places, triggering background population');
        
        // Trigger background population (don't wait for it)
        supabase.functions.invoke('places-cache-manager', {
          body: {
            action: 'search_and_cache',
            search_query: 'restaurant',
            latitude: center.lat,
            longitude: center.lng,
            radius: radius
          }
        }).catch(err => console.error('Background population failed:', err));

        setLoading(false);
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search nearby places';
      setError(errorMessage);
      setLoading(false);
      console.error('Nearby places search error:', err);
      return [];
    }
  }, []);

  const searchPlacesWithIngredients = useCallback(async (
    center: google.maps.LatLngLiteral,
    ingredientNames: string[],
    dietaryRestrictions?: string[],
    placeType?: string,
    radius: number = 5000
  ): Promise<MarkerData[]> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Searching places with ingredients: ${ingredientNames.join(', ')}`);

      const results = await databaseService.findPlacesWithIngredients(
        center.lat,
        center.lng,
        radius,
        ingredientNames,
        dietaryRestrictions,
        placeType,
        20
      );

      const markers: MarkerData[] = results.map((place: any) => ({
        position: {
          lat: Number(place.latitude),
          lng: Number(place.longitude)
        },
        locationId: place.place_id,
        type: place.primary_type === 'restaurant' || place.primary_type === 'cafe' ? 'restaurant' : 'grocery'
      }));

      setLoading(false);
      return markers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places with ingredients';
      setError(errorMessage);
      setLoading(false);
      console.error('Places with ingredients search error:', err);
      return [];
    }
  }, []);

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
      console.error('Area population error:', err);
      throw err;
    }
  }, []);

  const getCacheStats = useCallback(async () => {
    try {
      const stats = await databaseService.getCacheStats();
      return { success: true, stats, total_places: stats.length > 0 ? stats[0].total_places_cached : 0 };
    } catch (err) {
      console.error('Cache stats error:', err);
      throw err;
    }
  }, []);

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
