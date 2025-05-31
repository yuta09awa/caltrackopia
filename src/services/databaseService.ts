
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

  // Enhanced ingredient queries - using mock data since ingredients table doesn't exist yet
  async getAllIngredients(): Promise<Ingredient[]> {
    console.warn('Ingredients table not available yet, returning mock data');
    return this.getMockIngredients();
  }

  async searchIngredients(query: string, limit: number = 20): Promise<Ingredient[]> {
    console.warn('Ingredients table not available yet, returning filtered mock data');
    return this.getMockIngredients().filter(ing => 
      ing.name.toLowerCase().includes(query.toLowerCase()) ||
      ing.category.toLowerCase().includes(query.toLowerCase()) ||
      ing.common_names.some(name => name.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, limit);
  }

  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    console.warn('Ingredients table not available yet, returning filtered mock data');
    return this.getMockIngredients().filter(ing => 
      ing.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getIngredientById(ingredientId: string): Promise<Ingredient | null> {
    console.warn('Ingredients table not available yet, returning mock data');
    return this.getMockIngredients().find(ing => ing.id === ingredientId) || null;
  }

  // Menu items queries
  async getMenuItemsByPlace(placeId: string): Promise<MenuItem[]> {
    console.warn('Menu items table not available yet, returning mock data');
    return [];
  }

  async searchMenuItems(
    query: string,
    dietaryTags?: string[],
    allergenFree?: string[],
    limit: number = 20
  ): Promise<MenuItem[]> {
    console.warn('Menu items table not available yet, returning mock data');
    return [];
  }

  // Place ingredients queries
  async getPlaceIngredients(placeId: string): Promise<PlaceIngredient[]> {
    console.warn('Place ingredients table not available yet, returning mock data');
    return [];
  }

  async getPlacesWithIngredient(ingredientId: string): Promise<PlaceIngredient[]> {
    console.warn('Place ingredients table not available yet, returning mock data');
    return [];
  }

  // Enhanced dietary restrictions queries with fallback data
  async getAllDietaryRestrictions(): Promise<DietaryRestriction[]> {
    try {
      // Since the dietary_restrictions table doesn't exist in Supabase yet, 
      // we'll return mock data for now
      console.warn('Dietary restrictions table not available, using mock data');
      return this.getMockDietaryRestrictions();
    } catch (error) {
      console.warn('Error fetching dietary restrictions, using mock data:', error);
      return this.getMockDietaryRestrictions();
    }
  }

  async getDietaryRestrictionByName(name: string): Promise<DietaryRestriction | null> {
    try {
      // Since the dietary_restrictions table doesn't exist in Supabase yet, 
      // we'll return mock data for now
      console.warn('Dietary restrictions table not available, using mock data');
      return this.getMockDietaryRestrictions().find(r => r.name === name) || null;
    } catch (error) {
      console.warn('Error fetching dietary restriction by name, using mock data:', error);
      return this.getMockDietaryRestrictions().find(r => r.name === name) || null;
    }
  }

  // Mock ingredients data for fallback
  private getMockIngredients(): Ingredient[] {
    return [
      {
        id: '1',
        name: 'Spinach',
        common_names: ['baby spinach', 'leaf spinach'],
        category: 'vegetables',
        calories_per_100g: 23,
        protein_per_100g: 2.9,
        carbs_per_100g: 3.6,
        fat_per_100g: 0.4,
        fiber_per_100g: 2.2,
        is_organic: false,
        is_local: true,
        is_seasonal: true,
        allergens: [],
        dietary_restrictions: ['vegan', 'vegetarian', 'gluten-free'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Quinoa',
        common_names: ['quinoa grain', 'superfood grain'],
        category: 'grains',
        calories_per_100g: 368,
        protein_per_100g: 14.1,
        carbs_per_100g: 64.2,
        fat_per_100g: 6.1,
        fiber_per_100g: 7.0,
        is_organic: true,
        is_local: false,
        is_seasonal: false,
        allergens: [],
        dietary_restrictions: ['vegan', 'vegetarian', 'gluten-free'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  // Mock dietary restrictions for fallback
  private getMockDietaryRestrictions(): DietaryRestriction[] {
    return [
      {
        id: '1',
        name: 'Vegan',
        description: 'No animal products',
        excluded_ingredients: ['meat', 'dairy', 'eggs', 'honey'],
        excluded_allergens: ['dairy', 'eggs'],
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Vegetarian',
        description: 'No meat or fish',
        excluded_ingredients: ['meat', 'fish', 'poultry'],
        excluded_allergens: [],
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Gluten Free',
        description: 'No gluten-containing grains',
        excluded_ingredients: ['wheat', 'barley', 'rye', 'oats'],
        excluded_allergens: ['gluten'],
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Dairy Free',
        description: 'No dairy products',
        excluded_ingredients: ['milk', 'cheese', 'butter', 'cream'],
        excluded_allergens: ['dairy'],
        created_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Nut Free',
        description: 'No tree nuts or peanuts',
        excluded_ingredients: ['almonds', 'walnuts', 'peanuts', 'cashews'],
        excluded_allergens: ['nuts', 'peanuts'],
        created_at: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Kosher',
        description: 'Follows Jewish dietary laws',
        excluded_ingredients: ['pork', 'shellfish', 'non-kosher meat'],
        excluded_allergens: [],
        created_at: new Date().toISOString()
      },
      {
        id: '7',
        name: 'Halal',
        description: 'Follows Islamic dietary laws',
        excluded_ingredients: ['pork', 'alcohol', 'non-halal meat'],
        excluded_allergens: [],
        created_at: new Date().toISOString()
      },
      {
        id: '8',
        name: 'Paleo',
        description: 'Paleolithic diet - no processed foods',
        excluded_ingredients: ['grains', 'legumes', 'dairy', 'processed_sugar'],
        excluded_allergens: ['gluten', 'dairy'],
        created_at: new Date().toISOString()
      }
    ];
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
    console.warn('Menu items table not available yet, returning empty array');
    return [];
  }

  // NEW METHOD: Get place ingredients by place internal UUID
  async getPlaceIngredientsByPlaceId(placeId: string): Promise<PlaceIngredient[]> {
    console.warn('Place ingredients table not available yet, returning empty array');
    return [];
  }
}

export const databaseService = new DatabaseService();
