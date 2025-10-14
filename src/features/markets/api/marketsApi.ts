/**
 * Markets API Module
 * Handles farmers markets, food festivals, and convenience stores data
 */

import { supabase } from '@/integrations/supabase/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const marketsApi = {
  /**
   * Get all markets
   */
  list: async (limit: number = 50) => {
    // Markets are currently stored as cached_places with specific types
    const { data, error } = await supabase
      .from('cached_places')
      .select('*')
      .in('primary_type', ['farmers_market', 'convenience_store'] as any)
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Get market by ID
   */
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('cached_places')
      .select('*')
      .eq('place_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  },

  /**
   * Get nearby markets
   */
  getNearby: async (latitude: number, longitude: number, radius: number = 10000) => {
    const { data, error } = await supabase.rpc('find_places_within_radius', {
      search_lat: latitude,
      search_lng: longitude,
      radius_meters: radius,
      place_type_filter: null,
      limit_count: 50,
    });

    if (error) {
      console.error('Error fetching nearby markets:', error);
      return marketsApi.list();
    }

    // Filter for market types on client side
    const marketTypes = ['farmers_market', 'convenience_store'];
    return data.filter((place: any) => marketTypes.includes(place.primary_type));
  },
};
