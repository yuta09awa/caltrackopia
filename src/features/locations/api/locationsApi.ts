/**
 * Locations API Module
 * Handles location/places data retrieval with multi-layer caching
 */

import { supabase } from '@/integrations/supabase/client';
import { locationService } from '@/services/locationService';
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
   * Search for locations with 4-tier caching
   * Layer 1: Memory cache (30 min)
   * Layer 2: IndexedDB (24 hours)
   * Layer 3: Supabase cached_places (7 days)
   * Layer 4: Fallback to mock data
   */
  search: async (params: LocationSearchParams): Promise<Location[]> => {
    // If no query, get all locations (uses full caching hierarchy)
    if (!params.query || params.query === '') {
      const locations = await locationService.getLocations();
      
      // Apply type filter if specified
      if (params.type) {
        return locations.filter(loc => loc.primaryType === params.type);
      }
      
      // Apply limit
      return locations.slice(0, params.limit || 1000);
    }
    
    // For search queries, use locationService.searchLocations
    const locations = await locationService.searchLocations(params.query);
    
    // Apply type filter if specified
    let filtered = locations;
    if (params.type) {
      filtered = locations.filter(loc => loc.primaryType === params.type);
    }
    
    // Apply limit
    return filtered.slice(0, params.limit || 20);
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
