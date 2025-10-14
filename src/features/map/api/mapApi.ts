/**
 * Map API Module
 * Handles map-related API calls (Google Maps, Places API)
 */

import { supabase } from '@/integrations/supabase/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const mapApi = {
  /**
   * Get Google Maps API key from edge function
   */
  getGoogleMapsApiKey: async (): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-google-maps-api-key');

      if (error) throw error;
      
      if (!data?.apiKey) {
        throw new Error('No API key returned from edge function');
      }

      return data.apiKey;
    } catch (error) {
      console.error('Error fetching Google Maps API key:', error);
      throw error;
    }
  },

  /**
   * Get cache statistics
   */
  getCacheStats: async () => {
    const { data, error } = await supabase
      .from('cache_statistics')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;
    return data;
  },

  /**
   * Trigger cache refresh for a specific area
   */
  refreshCache: async (latitude: number, longitude: number, radius: number = 5000) => {
    const { data, error } = await supabase.functions.invoke('places-cache-manager', {
      body: {
        action: 'refresh',
        latitude,
        longitude,
        radius,
      },
    });

    if (error) throw error;
    return data;
  },
};
