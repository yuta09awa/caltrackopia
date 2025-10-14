/**
 * Locations API Module
 * Handles location/places data retrieval
 */

import { supabase } from '@/integrations/supabase/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type { Location } from '@/features/locations/types';

export interface LocationSearchParams {
  query?: string;
  limit?: number;
  type?: string;
}

export interface NearbySearchParams {
  latitude: number;
  longitude: number;
  radius?: number;
  type?: string;
  limit?: number;
}

export const locationsApi = {
  /**
   * Search for locations
   */
  search: async (params: LocationSearchParams): Promise<Location[]> => {
    let query = supabase
      .from('cached_places')
      .select('*');

    if (params.query) {
      query = query.ilike('name', `%${params.query}%`);
    }

    if (params.type) {
      // Type is passed as string, will be used directly
      query = query.eq('primary_type', params.type as any);
    }

    query = query.limit(params.limit || 20);

    const { data, error } = await query;

    if (error) throw error;
    return data.map(transformToLocation);
  },

  /**
   * Get location by ID
   */
  getById: async (id: string): Promise<Location | null> => {
    const { data, error } = await supabase
      .from('cached_places')
      .select('*')
      .eq('place_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return transformToLocation(data);
  },

  /**
   * Get nearby locations
   */
  getNearby: async (params: NearbySearchParams): Promise<Location[]> => {
    const { latitude, longitude, radius = 5000, type, limit = 20 } = params;

    // Use PostGIS function if available, otherwise fetch all and filter
    const { data, error } = await supabase.rpc('find_places_within_radius', {
      search_lat: latitude,
      search_lng: longitude,
      radius_meters: radius,
      place_type_filter: type as any || null,
      limit_count: limit,
    });

    if (error) {
      console.error('Error fetching nearby places:', error);
      // Fallback to simple query
      return locationsApi.search({ limit });
    }

    return data.map((place: any) => transformToLocation({
      ...place,
      place_id: place.place_id || place.id,
      distance_meters: place.distance_meters,
    }));
  },

  /**
   * Get locations by type
   */
  getByType: async (type: string, limit: number = 20): Promise<Location[]> => {
    const { data, error } = await supabase
      .from('cached_places')
      .select('*')
      .eq('primary_type', type as any)
      .limit(limit);

    if (error) throw error;
    return data.map(transformToLocation);
  },
};

/**
 * Transform database record to Location entity
 */
function transformToLocation(dbPlace: any): Location {
  // Determine if it's a Restaurant or Grocery based on primary_type
  const isGroceryType = ['grocery_store', 'supermarket', 'health_food_store', 
    'farmers_market', 'convenience_store', 'organic_store'].includes(dbPlace.primary_type);
  
  const frontendType: "Restaurant" | "Grocery" = isGroceryType ? "Grocery" : "Restaurant";
  
  // Map price_level to price format
  const priceMap: Record<number, "$" | "$$" | "$$$" | "$$$$"> = {
    1: "$",
    2: "$$",
    3: "$$$",
    4: "$$$$"
  };
  
  // Calculate distance if available
  const distance = dbPlace.distance_meters 
    ? `${(dbPlace.distance_meters / 1000).toFixed(1)} km`
    : '0 km';

  return {
    id: dbPlace.place_id || dbPlace.id,
    place_id: dbPlace.place_id,
    googlePlaceId: dbPlace.place_id,
    name: dbPlace.name || 'Unknown',
    type: frontendType,
    primaryType: dbPlace.primary_type as any,
    address: dbPlace.formatted_address || '',
    phone: dbPlace.phone_number,
    website: dbPlace.website,
    openNow: dbPlace.is_open_now ?? false,
    hours: parseOpeningHours(dbPlace.opening_hours),
    price: priceMap[dbPlace.price_level] || "$$",
    rating: dbPlace.rating ? parseFloat(dbPlace.rating) : 0,
    distance,
    dietaryOptions: [],
    cuisine: dbPlace.primary_type || 'Unknown',
    description: dbPlace.custom_notes,
    images: dbPlace.photo_references || [],
    coordinates: {
      lat: parseFloat(dbPlace.latitude),
      lng: parseFloat(dbPlace.longitude),
    },
    freshnessStatus: dbPlace.freshness_status,
    lastUpdatedAt: dbPlace.last_updated_at,
  };
}

/**
 * Parse opening hours JSONB to array format
 */
function parseOpeningHours(openingHours: any): Array<{ day: string; hours: string }> {
  if (!openingHours || typeof openingHours !== 'object') {
    return [];
  }
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return days.map(day => ({
    day,
    hours: openingHours[day.toLowerCase()] || 'Closed'
  }));
}
