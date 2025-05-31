
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarkerData } from '../types';

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

      // Call our cache manager Edge Function
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

      if (data.success) {
        console.log(`Cache ${data.source}: Found ${data.count} places`);
        
        // Update cache hit rate for UI feedback
        if (data.source === 'cache') {
          setCacheHitRate(prev => prev ? (prev + 1) / 2 : 1);
        } else {
          setCacheHitRate(prev => prev ? prev / 2 : 0);
        }

        // Convert cached results to MarkerData format
        const markers: MarkerData[] = data.results.map((place: CachedPlaceResult) => ({
          position: {
            lat: Number(place.latitude),
            lng: Number(place.longitude)
          },
          locationId: place.place_id,
          type: 'restaurant'
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

      // Use the Supabase RPC function directly for nearby search
      const { data: cachedResults, error: rpcError } = await supabase.rpc('find_places_within_radius', {
        search_lat: center.lat,
        search_lng: center.lng,
        radius_meters: radius,
        limit_count: 20
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      if (cachedResults && cachedResults.length > 0) {
        console.log(`Found ${cachedResults.length} nearby cached places`);
        
        // Update cache statistics
        await supabase.rpc('update_cache_stats', { hits: 1, misses: 0, saved: 1 });
        setCacheHitRate(prev => prev ? (prev + 1) / 2 : 1);

        const markers: MarkerData[] = cachedResults.map((place: CachedPlaceResult) => ({
          position: {
            lat: Number(place.latitude),
            lng: Number(place.longitude)
          },
          locationId: place.place_id,
          type: 'restaurant'
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
      const { data, error: functionError } = await supabase.functions.invoke('places-cache-manager', {
        body: { action: 'get_stats' }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      return data;
    } catch (err) {
      console.error('Cache stats error:', err);
      throw err;
    }
  }, []);

  return {
    searchCachedPlaces,
    searchNearbyPlaces,
    populateArea,
    getCacheStats,
    loading,
    error,
    cacheHitRate
  };
};
