
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

class DatabaseService {
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

    return data;
  }

  async searchPlaces(
    query: string,
    limit: number = 20
  ): Promise<EnhancedPlace[]> {
    const { data, error } = await supabase
      .from('cached_places')
      .select('*')
      .textSearch('search_vector', query)
      .eq('freshness_status', 'fresh')
      .limit(limit);

    if (error) {
      console.error('Error searching places:', error);
      return [];
    }

    return data || [];
  }

  async getPlacesByType(
    placeType: string,
    limit: number = 20
  ): Promise<EnhancedPlace[]> {
    const { data, error } = await supabase
      .from('cached_places')
      .select('*')
      .eq('primary_type', placeType)
      .eq('freshness_status', 'fresh')
      .order('quality_score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching places by type:', error);
      return [];
    }

    return data || [];
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
    const { data, error } = await supabase.rpc('find_places_with_ingredients', {
      search_lat: latitude,
      search_lng: longitude,
      radius_meters: radius,
      ingredient_names: ingredientNames,
      dietary_restriction_names: dietaryRestrictions,
      place_type_filter: placeType,
      limit_count: limit
    });

    if (error) {
      console.error('Error finding places with ingredients:', error);
      return [];
    }

    return data || [];
  }

  // Ingredients queries
  async getAllIngredients(): Promise<Ingredient[]> {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching ingredients:', error);
      return [];
    }

    return data || [];
  }

  async searchIngredients(query: string, limit: number = 20): Promise<Ingredient[]> {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .textSearch('name', query)
      .limit(limit);

    if (error) {
      console.error('Error searching ingredients:', error);
      return [];
    }

    return data || [];
  }

  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('category', category)
      .order('name');

    if (error) {
      console.error('Error fetching ingredients by category:', error);
      return [];
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
      .eq('place_id', placeId)
      .eq('is_available', true)
      .order('category, name');

    if (error) {
      console.error('Error fetching menu items:', error);
      return [];
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
      .eq('is_available', true);

    if (dietaryTags && dietaryTags.length > 0) {
      queryBuilder = queryBuilder.overlaps('dietary_tags', dietaryTags);
    }

    if (allergenFree && allergenFree.length > 0) {
      queryBuilder = queryBuilder.not('allergens', 'cs', `{${allergenFree.join(',')}}`);
    }

    const { data, error } = await queryBuilder
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching menu items:', error);
      return [];
    }

    return data || [];
  }

  // Place ingredients queries
  async getPlaceIngredients(placeId: string): Promise<PlaceIngredient[]> {
    const { data, error } = await supabase
      .from('place_ingredients')
      .select(`
        *,
        ingredient:ingredients(*)
      `)
      .eq('place_id', placeId)
      .eq('is_available', true)
      .order('ingredient.name');

    if (error) {
      console.error('Error fetching place ingredients:', error);
      return [];
    }

    return data || [];
  }

  async getPlacesWithIngredient(ingredientId: string): Promise<PlaceIngredient[]> {
    const { data, error } = await supabase
      .from('place_ingredients')
      .select(`
        *,
        place:cached_places(*)
      `)
      .eq('ingredient_id', ingredientId)
      .eq('is_available', true);

    if (error) {
      console.error('Error fetching places with ingredient:', error);
      return [];
    }

    return data || [];
  }

  // Dietary restrictions queries
  async getAllDietaryRestrictions(): Promise<DietaryRestriction[]> {
    const { data, error } = await supabase
      .from('dietary_restrictions')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching dietary restrictions:', error);
      return [];
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
      console.error('Error fetching dietary restriction:', error);
      return null;
    }

    return data;
  }

  // Place type mapping queries
  async getPlaceTypeMapping() {
    const { data, error } = await supabase
      .from('place_type_mapping')
      .select('*')
      .order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching place type mapping:', error);
      return [];
    }

    return data || [];
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
}

export const databaseService = new DatabaseService();
