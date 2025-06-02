
import { EnhancedPlace, Ingredient, DietaryRestriction, MenuItem, PlaceIngredient } from './databaseService';

export class MockDataService {
  // Mock ingredients data
  getMockIngredients(): Ingredient[] {
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
      },
      {
        id: '3',
        name: 'Salmon',
        common_names: ['atlantic salmon', 'fresh salmon'],
        category: 'seafood',
        calories_per_100g: 208,
        protein_per_100g: 25.4,
        carbs_per_100g: 0,
        fat_per_100g: 12.4,
        fiber_per_100g: 0,
        is_organic: false,
        is_local: true,
        is_seasonal: true,
        allergens: ['fish'],
        dietary_restrictions: ['pescatarian'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  // Mock dietary restrictions
  getMockDietaryRestrictions(): DietaryRestriction[] {
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

  // Mock menu items
  getMockMenuItems(): MenuItem[] {
    return [
      {
        id: '1',
        place_id: 'test-place-1',
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with parmesan and croutons',
        category: 'salads',
        price: 12.99,
        currency_code: 'USD',
        calories: 320,
        protein_grams: 8,
        carbs_grams: 15,
        fat_grams: 25,
        allergens: ['dairy', 'gluten'],
        dietary_tags: ['vegetarian'],
        spice_level: 0,
        is_available: true,
        seasonal_availability: 'year-round',
        rating: 4.2,
        popularity_score: 85,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  // Mock place ingredients
  getMockPlaceIngredients(): PlaceIngredient[] {
    return [
      {
        id: '1',
        place_id: 'test-place-1',
        ingredient_id: '1',
        is_available: true,
        last_restocked: new Date().toISOString(),
        typical_price: 3.99,
        currency_code: 'USD',
        freshness_rating: 4.5,
        is_certified_organic: true,
        is_locally_sourced: true,
        verified_by: 'staff',
        verified_at: new Date().toISOString(),
        source: 'local_farm',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  // Database-compatible methods
  async searchPlaces(query: string, limit: number = 20): Promise<EnhancedPlace[]> {
    // Return empty array since mock data doesn't have places
    console.log(`Mock searchPlaces called with query: ${query}, limit: ${limit}`);
    return [];
  }

  async getPlaceById(placeId: string): Promise<EnhancedPlace | null> {
    console.log(`Mock getPlaceById called with ID: ${placeId}`);
    return null;
  }

  async getPlacesByType(placeType: string, limit: number = 20): Promise<EnhancedPlace[]> {
    console.log(`Mock getPlacesByType called with type: ${placeType}, limit: ${limit}`);
    return [];
  }

  async findPlacesWithIngredients(
    latitude: number,
    longitude: number,
    radius: number = 5000,
    ingredientNames?: string[],
    dietaryRestrictions?: string[],
    placeType?: string,
    limit: number = 20
  ): Promise<EnhancedPlace[]> {
    console.log(`Mock findPlacesWithIngredients called`);
    return [];
  }

  async getCachedPlaceById(id: string): Promise<EnhancedPlace | null> {
    console.log(`Mock getCachedPlaceById called with ID: ${id}`);
    return null;
  }

  async getCachedPlacesByIds(ids: string[]): Promise<EnhancedPlace[]> {
    console.log(`Mock getCachedPlacesByIds called with IDs: ${ids.join(', ')}`);
    return [];
  }

  async getCacheStats() {
    console.log('Mock getCacheStats called');
    return [];
  }

  // Search methods that mirror DatabaseService interface
  async getAllIngredients(): Promise<Ingredient[]> {
    return this.getMockIngredients();
  }

  async searchIngredients(query: string, limit: number = 20): Promise<Ingredient[]> {
    return this.getMockIngredients().filter(ing => 
      ing.name.toLowerCase().includes(query.toLowerCase()) ||
      ing.category.toLowerCase().includes(query.toLowerCase()) ||
      ing.common_names.some(name => name.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, limit);
  }

  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    return this.getMockIngredients().filter(ing => 
      ing.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getIngredientById(ingredientId: string): Promise<Ingredient | null> {
    return this.getMockIngredients().find(ing => ing.id === ingredientId) || null;
  }

  async getAllDietaryRestrictions(): Promise<DietaryRestriction[]> {
    return this.getMockDietaryRestrictions();
  }

  async getDietaryRestrictionByName(name: string): Promise<DietaryRestriction | null> {
    return this.getMockDietaryRestrictions().find(r => r.name === name) || null;
  }

  async getMenuItemsByPlace(placeId: string): Promise<MenuItem[]> {
    return this.getMockMenuItems().filter(item => item.place_id === placeId);
  }

  async getMenuItemsByPlaceId(placeId: string): Promise<MenuItem[]> {
    return this.getMockMenuItems().filter(item => item.place_id === placeId);
  }

  async getPlaceIngredients(placeId: string): Promise<PlaceIngredient[]> {
    return this.getMockPlaceIngredients().filter(item => item.place_id === placeId);
  }

  async getPlaceIngredientsByPlaceId(placeId: string): Promise<PlaceIngredient[]> {
    return this.getMockPlaceIngredients().filter(item => item.place_id === placeId);
  }

  async getPlacesWithIngredient(ingredientId: string): Promise<PlaceIngredient[]> {
    return this.getMockPlaceIngredients().filter(item => item.ingredient_id === ingredientId);
  }
}

export const mockDataService = new MockDataService();
