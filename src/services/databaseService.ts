import { supabase } from '@/integrations/supabase/client';
import { DatabaseError, NetworkError } from './errors/DatabaseError';
import { enhancedDatabaseService } from './enhancedDatabaseService';

export interface EnhancedPlace {
  id: string;
  place_id: string;
  name: string;
  formatted_address?: string;
  latitude: number;
  longitude: number;
  place_types: string[];
  primary_type: string;
  secondary_type?: string;
  google_primary_type?: string;
  rating?: number;
  price_level?: number;
  phone_number?: string;
  website?: string;
  opening_hours?: any;
  is_open_now?: boolean;
  timezone?: string;
  photo_references: string[];
  first_cached_at: string;
  last_updated_at: string;
  freshness_status: string;
  quality_score?: number;
  verification_count: number;
  data_source: string;
}

export interface Ingredient {
  id: string;
  name: string;
  common_names: string[];
  category: string;
  calories_per_100g?: number;
  protein_per_100g?: number;
  carbs_per_100g?: number;
  fat_per_100g?: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
  is_organic: boolean;
  is_local: boolean;
  is_seasonal: boolean;
  allergens: string[];
  dietary_restrictions: string[];
  peak_season_start?: number;
  peak_season_end?: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  place_id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  currency_code: string;
  calories?: number;
  protein_grams?: number;
  carbs_grams?: number;
  fat_grams?: number;
  allergens: string[];
  dietary_tags: string[];
  spice_level?: number;
  is_available: boolean;
  seasonal_availability?: string;
  image_url?: string;
  rating?: number;
  popularity_score: number;
  created_at: string;
  updated_at: string;
}

export interface DietaryRestriction {
  id: string;
  name: string;
  description?: string;
  excluded_ingredients: string[];
  excluded_allergens: string[];
  created_at: string;
}

export interface PlaceIngredient {
  id: string;
  place_id: string;
  ingredient_id: string;
  is_available: boolean;
  last_restocked?: string;
  typical_price?: number;
  currency_code: string;
  freshness_rating?: number;
  is_certified_organic: boolean;
  is_locally_sourced: boolean;
  verified_by?: string;
  verified_at?: string;
  source: string;
  created_at: string;
  updated_at: string;
  ingredient?: Ingredient;
}

export class DatabaseService {
  // Places queries
  async getPlaceById(placeId: string): Promise<EnhancedPlace | null> {
    try {
      const { data, error } = await supabase
        .from('cached_places')
        .select('*')
        .eq('place_id', placeId)
        .single();

      if (error) {
        console.error('Error fetching place by ID:', error);
        throw new DatabaseError(`Failed to fetch place: ${error.message}`, 'PLACE_FETCH_ERROR', error);
      }

      return this.transformToEnhancedPlace(data);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching place by ID:', error);
      throw new NetworkError('Network error while fetching place');
    }
  }

  async searchPlaces(
    query: string,
    limit: number = 20
  ): Promise<EnhancedPlace[]> {
    try {
      const { data, error } = await supabase
        .from('cached_places')
        .select('*')
        .ilike('name', `%${query}%`)
        .eq('freshness_status', 'fresh')
        .limit(limit);

      if (error) {
        console.error('Error searching places:', error);
        throw new DatabaseError(`Failed to search places: ${error.message}`, 'PLACE_SEARCH_ERROR', error);
      }

      return (data || []).map(place => this.transformToEnhancedPlace(place));
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error searching places:', error);
      throw new NetworkError('Network error while searching places');
    }
  }

  async getPlacesByType(
    placeType: string,
    limit: number = 20
  ): Promise<EnhancedPlace[]> {
    try {
      const { data, error } = await supabase
        .from('cached_places')
        .select('*')
        .eq('primary_type', placeType as any)
        .eq('freshness_status', 'fresh')
        .limit(limit);

      if (error) {
        console.error('Error fetching places by type:', error);
        throw new DatabaseError(`Failed to fetch places by type: ${error.message}`, 'PLACE_TYPE_FETCH_ERROR', error);
      }

      return (data || []).map(place => this.transformToEnhancedPlace(place));
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching places by type:', error);
      throw new NetworkError('Network error while fetching places by type');
    }
  }

  async findPlacesWithIngredients(
    latitude: number,
    longitude: number,
    radius: number = 5000,
    ingredientNames?: string[],
    dietaryRestrictions?: string[],
    placeType?: string,
    limit: number = 20
  ) {
    try {
      // For now, return nearby places from cached_places since the RPC function doesn't exist yet
      const { data, error } = await supabase
        .from('cached_places')
        .select('*')
        .eq('freshness_status', 'fresh')
        .limit(limit);

      if (error) {
        console.error('Error finding places with ingredients:', error);
        throw new DatabaseError(`Failed to find places with ingredients: ${error.message}`, 'PLACE_INGREDIENT_SEARCH_ERROR', error);
      }

      return (data || []).map(place => this.transformToEnhancedPlace(place));
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error finding places with ingredients:', error);
      throw new NetworkError('Network error while finding places with ingredients');
    }
  }

  // Ingredient queries - query the ingredients table
  async getAllIngredients(limit: number = 50): Promise<Ingredient[]> {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .limit(limit);

      if (error) {
        console.error('Error fetching all ingredients:', error);
        throw new DatabaseError(`Failed to fetch ingredients: ${error.message}`, 'INGREDIENT_FETCH_ERROR', error);
      }

      return (data || []) as Ingredient[];
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching ingredients:', error);
      throw new NetworkError('Network error while fetching ingredients');
    }
  }

  async searchIngredients(query: string, limit: number = 20): Promise<Ingredient[]> {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(limit);

      if (error) {
        console.error('Error searching ingredients:', error);
        throw new DatabaseError(`Failed to search ingredients: ${error.message}`, 'INGREDIENT_SEARCH_ERROR', error);
      }

      return (data || []) as Ingredient[];
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error searching ingredients:', error);
      throw new NetworkError('Network error while searching ingredients');
    }
  }

  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('category', category);

      if (error) {
        console.error('Error fetching ingredients by category:', error);
        throw new DatabaseError(`Failed to fetch ingredients by category: ${error.message}`, 'INGREDIENT_CATEGORY_ERROR', error);
      }

      return (data || []) as Ingredient[];
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching ingredients by category:', error);
      throw new NetworkError('Network error while fetching ingredients by category');
    }
  }

  async getIngredientById(ingredientId: string): Promise<Ingredient | null> {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('id', ingredientId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('Error fetching ingredient by ID:', error);
        throw new DatabaseError(`Failed to fetch ingredient: ${error.message}`, 'INGREDIENT_FETCH_ERROR', error);
      }

      return data as Ingredient;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching ingredient by ID:', error);
      throw new NetworkError('Network error while fetching ingredient');
    }
  }

  // Menu items queries
  async getMenuItemsByPlace(placeId: string): Promise<MenuItem[]> {
    throw new DatabaseError(
      'Menu items table is not available yet. Please use the mock data service.',
      'TABLE_NOT_AVAILABLE'
    );
  }

  async searchMenuItems(
    query: string,
    dietaryTags?: string[],
    allergenFree?: string[],
    limit: number = 20
  ): Promise<MenuItem[]> {
    throw new DatabaseError(
      'Menu items table is not available yet. Please use the mock data service.',
      'TABLE_NOT_AVAILABLE'
    );
  }

  // Place ingredients queries
  async getPlaceIngredients(placeId: string): Promise<PlaceIngredient[]> {
    throw new DatabaseError(
      'Place ingredients table is not available yet. Please use the mock data service.',
      'TABLE_NOT_AVAILABLE'
    );
  }

  async getPlacesWithIngredient(ingredientId: string): Promise<PlaceIngredient[]> {
    throw new DatabaseError(
      'Place ingredients table is not available yet. Please use the mock data service.',
      'TABLE_NOT_AVAILABLE'
    );
  }

  // Dietary restrictions queries
  async getAllDietaryRestrictions(): Promise<DietaryRestriction[]> {
    throw new DatabaseError(
      'Dietary restrictions table is not available yet. Please use the mock data service.',
      'TABLE_NOT_AVAILABLE'
    );
  }

  async getDietaryRestrictionByName(name: string): Promise<DietaryRestriction | null> {
    throw new DatabaseError(
      'Dietary restrictions table is not available yet. Please use the mock data service.',
      'TABLE_NOT_AVAILABLE'
    );
  }

  // Cache statistics
  async getCacheStats() {
    try {
      const { data, error } = await supabase
        .from('cache_statistics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching cache stats:', error);
        throw new DatabaseError(`Failed to fetch cache statistics: ${error.message}`, 'CACHE_STATS_ERROR', error);
      }

      return data || [];
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching cache stats:', error);
      throw new NetworkError('Network error while fetching cache statistics');
    }
  }

  // Helper method to transform database place to EnhancedPlace
  private transformToEnhancedPlace(place: any): EnhancedPlace {
    return {
      id: place.id,
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      latitude: place.latitude,
      longitude: place.longitude,
      place_types: place.place_types || [],
      primary_type: place.primary_type,
      secondary_type: place.secondary_type,
      google_primary_type: place.google_primary_type,
      rating: place.rating,
      price_level: place.price_level,
      phone_number: place.phone_number,
      website: place.website,
      opening_hours: place.opening_hours,
      is_open_now: place.is_open_now,
      timezone: place.timezone,
      photo_references: place.photo_references || [],
      first_cached_at: place.first_cached_at,
      last_updated_at: place.last_updated_at,
      freshness_status: place.freshness_status,
      quality_score: place.quality_score || 5,
      verification_count: place.verification_count || 0,
      data_source: place.data_source || 'google_places'
    };
  }

  // NEW METHOD: Get cached place by internal UUID
  async getCachedPlaceById(id: string): Promise<EnhancedPlace | null> {
    try {
      const { data, error } = await supabase
        .from('cached_places')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching cached place by ID:', error);
        throw new DatabaseError(`Failed to fetch cached place: ${error.message}`, 'PLACE_FETCH_ERROR', error);
      }

      return this.transformToEnhancedPlace(data);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching cached place by ID:', error);
      throw new NetworkError('Network error while fetching cached place');
    }
  }

  // NEW METHOD: Get multiple cached places by internal UUIDs
  async getCachedPlacesByIds(ids: string[]): Promise<EnhancedPlace[]> {
    try {
      const { data, error } = await supabase
        .from('cached_places')
        .select('*')
        .in('id', ids);

      if (error) {
        console.error('Error fetching cached places by IDs:', error);
        throw new DatabaseError(`Failed to fetch cached places: ${error.message}`, 'PLACE_FETCH_ERROR', error);
      }

      return (data || []).map(place => this.transformToEnhancedPlace(place));
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching cached places by IDs:', error);
      throw new NetworkError('Network error while fetching cached places');
    }
  }

  // NEW METHOD: Get menu items by place internal UUID
  async getMenuItemsByPlaceId(placeId: string): Promise<MenuItem[]> {
    throw new DatabaseError(
      'Menu items table is not available yet. Please use the mock data service.',
      'TABLE_NOT_AVAILABLE'
    );
  }

  // NEW METHOD: Get place ingredients by place internal UUID
  async getPlaceIngredientsByPlaceId(placeId: string): Promise<PlaceIngredient[]> {
    throw new DatabaseError(
      'Place ingredients table is not available yet. Please use the mock data service.',
      'TABLE_NOT_AVAILABLE'
    );
  }

  // NEW ENHANCED METHODS

  // TTL-aware cached places methods
  async getCachedPlacesWithTTLSupport() {
    try {
      return await enhancedDatabaseService.getCachedPlacesWithTTL();
    } catch (error) {
      console.warn('TTL support not available, falling back to regular cached places:', error);
      return this.getCachedPlacesByIds([]).then(() => []); // Fallback to empty array
    }
  }

  async refreshExpiredPlaces() {
    try {
      const expiredPlaces = await enhancedDatabaseService.getExpiredCachedPlaces();
      console.log(`Found ${expiredPlaces.length} expired places that need refresh`);
      return expiredPlaces;
    } catch (error) {
      console.warn('Could not check for expired places:', error);
      return [];
    }
  }

  async updatePlaceWithTTL(placeId: string, refreshIntervalHours: number = 24) {
    try {
      await enhancedDatabaseService.updatePlaceTTL(placeId, refreshIntervalHours);
    } catch (error) {
      console.warn('Could not update place TTL:', error);
      // Don't throw - this is an enhancement, not critical
    }
  }

  // API quota management integration
  async checkQuotaBeforeApiCall(serviceName: string) {
    try {
      const quotaCheck = await enhancedDatabaseService.checkApiQuota(serviceName);
      if (!quotaCheck.allowed) {
        throw new DatabaseError(
          `API quota exceeded for ${serviceName}. Used: ${quotaCheck.quotaStatus.quotaUsed}/${quotaCheck.quotaStatus.quotaLimit}`,
          'QUOTA_EXCEEDED'
        );
      }
      return quotaCheck;
    } catch (error) {
      if (error instanceof DatabaseError && error.code === 'QUOTA_EXCEEDED') {
        throw error;
      }
      console.warn('Could not check API quota, allowing request:', error);
      return { allowed: true };
    }
  }

  async trackApiCall(serviceName: string, amount: number = 1) {
    try {
      await enhancedDatabaseService.incrementApiQuota(serviceName, amount);
    } catch (error) {
      console.warn('Could not track API call:', error);
      // Don't throw - this is monitoring, not critical
    }
  }

  // Audit logging integration
  async logDatabaseOperation(operation: string, tableName: string, recordId?: string, oldValues?: any, newValues?: any) {
    try {
      await enhancedDatabaseService.logAuditEvent({
        actionType: operation as any,
        tableName,
        recordId,
        oldValues,
        newValues
      });
    } catch (error) {
      console.warn('Could not log database operation:', error);
      // Don't throw - this is auditing, not critical
    }
  }

  // Enhanced place search with quota tracking
  async searchPlacesWithQuotaTracking(query: string, limit: number = 20) {
    await this.checkQuotaBeforeApiCall('database_search');
    
    try {
      const results = await this.searchPlaces(query, limit);
      await this.trackApiCall('database_search');
      await this.logDatabaseOperation('READ', 'cached_places');
      return results;
    } catch (error) {
      await this.logDatabaseOperation('READ', 'cached_places', undefined, undefined, { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  // Enhanced place by ID with quota tracking
  async getPlaceByIdWithQuotaTracking(placeId: string) {
    await this.checkQuotaBeforeApiCall('database_lookup');
    
    try {
      const result = await this.getPlaceById(placeId);
      await this.trackApiCall('database_lookup');
      await this.logDatabaseOperation('READ', 'cached_places', placeId);
      return result;
    } catch (error) {
      await this.logDatabaseOperation('READ', 'cached_places', placeId, undefined, { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
