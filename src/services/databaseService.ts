
import { supabase } from '@/integrations/supabase/client';

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
    const { data, error } = await supabase
      .from('cached_places')
      .select('*')
      .eq('place_id', placeId)
      .single();

    if (error) {
      console.error('Error fetching place by ID:', error);
      return null;
    }

    return this.transformToEnhancedPlace(data);
  }

  async searchPlaces(
    query: string,
    limit: number = 20
  ): Promise<EnhancedPlace[]> {
    const { data, error } = await supabase
      .from('cached_places')
      .select('*')
      .ilike('name', `%${query}%`)
      .eq('freshness_status', 'fresh')
      .limit(limit);

    if (error) {
      console.error('Error searching places:', error);
      return [];
    }

    return (data || []).map(place => this.transformToEnhancedPlace(place));
  }

  async getPlacesByType(
    placeType: string,
    limit: number = 20
  ): Promise<EnhancedPlace[]> {
    const { data, error } = await supabase
      .from('cached_places')
      .select('*')
      .eq('primary_type', placeType as any)
      .eq('freshness_status', 'fresh')
      .limit(limit);

    if (error) {
      console.error('Error fetching places by type:', error);
      return [];
    }

    return (data || []).map(place => this.transformToEnhancedPlace(place));
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
    // For now, return nearby places from cached_places since the RPC function doesn't exist yet
    const { data, error } = await supabase
      .from('cached_places')
      .select('*')
      .eq('freshness_status', 'fresh')
      .limit(limit);

    if (error) {
      console.error('Error finding places with ingredients:', error);
      return [];
    }

    return (data || []).map(place => this.transformToEnhancedPlace(place));
  }

  // Ingredient queries - will throw errors until ingredients table is implemented
  async getAllIngredients(): Promise<Ingredient[]> {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*');

    if (error) {
      console.error('Error fetching ingredients:', error);
      throw new Error('Ingredients table not available yet');
    }

    return data || [];
  }

  async searchIngredients(query: string, limit: number = 20): Promise<Ingredient[]> {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Error searching ingredients:', error);
      throw new Error('Ingredients table not available yet');
    }

    return data || [];
  }

  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('category', category);

    if (error) {
      console.error('Error fetching ingredients by category:', error);
      throw new Error('Ingredients table not available yet');
    }

    return data || [];
  }

  async getIngredientById(ingredientId: string): Promise<Ingredient | null> {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('id', ingredientId)
      .single();

    if (error) {
      console.error('Error fetching ingredient by ID:', error);
      return null;
    }

    return data;
  }

  // Menu items queries
  async getMenuItemsByPlace(placeId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('place_id', placeId);

    if (error) {
      console.error('Error fetching menu items:', error);
      throw new Error('Menu items table not available yet');
    }

    return data || [];
  }

  async searchMenuItems(
    query: string,
    dietaryTags?: string[],
    allergenFree?: string[],
    limit: number = 20
  ): Promise<MenuItem[]> {
    let queryBuilder = supabase
      .from('menu_items')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(limit);

    if (dietaryTags && dietaryTags.length > 0) {
      queryBuilder = queryBuilder.overlaps('dietary_tags', dietaryTags);
    }

    if (allergenFree && allergenFree.length > 0) {
      queryBuilder = queryBuilder.not('allergens', 'cs', `{${allergenFree.join(',')}}`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error searching menu items:', error);
      throw new Error('Menu items table not available yet');
    }

    return data || [];
  }

  // Place ingredients queries
  async getPlaceIngredients(placeId: string): Promise<PlaceIngredient[]> {
    const { data, error } = await supabase
      .from('place_ingredients')
      .select('*, ingredient:ingredients(*)')
      .eq('place_id', placeId);

    if (error) {
      console.error('Error fetching place ingredients:', error);
      throw new Error('Place ingredients table not available yet');
    }

    return data || [];
  }

  async getPlacesWithIngredient(ingredientId: string): Promise<PlaceIngredient[]> {
    const { data, error } = await supabase
      .from('place_ingredients')
      .select('*, ingredient:ingredients(*)')
      .eq('ingredient_id', ingredientId);

    if (error) {
      console.error('Error fetching places with ingredient:', error);
      throw new Error('Place ingredients table not available yet');
    }

    return data || [];
  }

  // Dietary restrictions queries
  async getAllDietaryRestrictions(): Promise<DietaryRestriction[]> {
    const { data, error } = await supabase
      .from('dietary_restrictions')
      .select('*');

    if (error) {
      console.error('Error fetching dietary restrictions:', error);
      throw new Error('Dietary restrictions table not available yet');
    }

    return data || [];
  }

  async getDietaryRestrictionByName(name: string): Promise<DietaryRestriction | null> {
    const { data, error } = await supabase
      .from('dietary_restrictions')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      console.error('Error fetching dietary restriction by name:', error);
      return null;
    }

    return data;
  }

  // Cache statistics
  async getCacheStats() {
    const { data, error } = await supabase
      .from('cache_statistics')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Error fetching cache stats:', error);
      return [];
    }

    return data || [];
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
    const { data, error } = await supabase
      .from('cached_places')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching cached place by ID:', error);
      return null;
    }

    return this.transformToEnhancedPlace(data);
  }

  // NEW METHOD: Get multiple cached places by internal UUIDs
  async getCachedPlacesByIds(ids: string[]): Promise<EnhancedPlace[]> {
    const { data, error } = await supabase
      .from('cached_places')
      .select('*')
      .in('id', ids);

    if (error) {
      console.error('Error fetching cached places by IDs:', error);
      return [];
    }

    return (data || []).map(place => this.transformToEnhancedPlace(place));
  }

  // NEW METHOD: Get menu items by place internal UUID
  async getMenuItemsByPlaceId(placeId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('place_id', placeId);

    if (error) {
      console.error('Error fetching menu items by place ID:', error);
      throw new Error('Menu items table not available yet');
    }

    return data || [];
  }

  // NEW METHOD: Get place ingredients by place internal UUID
  async getPlaceIngredientsByPlaceId(placeId: string): Promise<PlaceIngredient[]> {
    const { data, error } = await supabase
      .from('place_ingredients')
      .select('*, ingredient:ingredients(*)')
      .eq('place_id', placeId);

    if (error) {
      console.error('Error fetching place ingredients by place ID:', error);
      throw new Error('Place ingredients table not available yet');
    }

    return data || [];
  }
}

export const databaseService = new DatabaseService();
