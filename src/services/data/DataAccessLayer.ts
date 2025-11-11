import { ServiceBase } from '../base/ServiceBase';
import { DatabaseService, type EnhancedPlace, type Ingredient, type MenuItem, type DietaryRestriction, type PlaceIngredient } from '../databaseService';
import { MockDataService } from '../mockDataService';
import { DatabaseError } from '../errors/DatabaseError';
import { unifiedCacheService } from '../cache/UnifiedCacheService';

/**
 * Unified Data Access Layer
 * 
 * Single source of truth for ALL data operations in the application.
 * Provides consistent interface regardless of data source (database, mock, cache).
 * 
 * @example
 * ```typescript
 * import { dataAccess } from '@/services';
 * 
 * // Search places
 * const places = await dataAccess.searchPlaces('pizza');
 * 
 * // Get ingredients
 * const ingredients = await dataAccess.searchIngredients('tomato');
 * ```
 */
export class DataAccessLayer extends ServiceBase {
  private dbService: DatabaseService;
  private mockService: MockDataService;
  private useMockData: boolean;

  constructor() {
    super();
    this.dbService = new DatabaseService();
    this.mockService = new MockDataService();
    
    // Determine if we should use mock data
    this.useMockData = import.meta.env.VITE_FORCE_MOCK_DATA === 'true' || 
                       (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_DATA);
  }

  getName(): string {
    return 'DataAccessLayer';
  }

  getVersion(): string {
    return '1.0.0';
  }

  // ============= PLACE OPERATIONS =============
  
  /**
   * Get a place by its ID
   * Uses 3-tier caching: Memory → IndexedDB → Supabase
   */
  async getPlace(id: string): Promise<EnhancedPlace | null> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return null;
      }

      return unifiedCacheService.get(
        'places',
        `place:${id}`,
        async () => this.dbService.getPlaceById(id),
        { ttl: 5 * 60 * 1000 } // 5 min cache
      );
    }, 'Getting place by ID');
  }

  /**
   * Search places by query string
   * Uses 3-tier caching with query-based keys
   */
  async searchPlaces(query: string, limit?: number): Promise<EnhancedPlace[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.searchPlaces(query, limit);
      }

      return unifiedCacheService.get(
        'searches',
        `search:${query}:${limit || 'all'}`,
        async () => this.dbService.searchPlaces(query, limit),
        { ttl: 2 * 60 * 1000 } // 2 min cache for searches
      );
    }, 'Searching places');
  }

  /**
   * Get places by type
   * Uses 3-tier caching
   */
  async getPlacesByType(placeType: string, limit?: number): Promise<EnhancedPlace[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getPlacesByType(placeType, limit);
      }

      return unifiedCacheService.get(
        'places',
        `type:${placeType}:${limit || 'all'}`,
        async () => this.dbService.getPlacesByType(placeType, limit),
        { ttl: 5 * 60 * 1000 } // 5 min cache
      );
    }, 'Getting places by type');
  }

  /**
   * Find places with specific ingredients
   */
  async findPlacesWithIngredients(
    latitude: number,
    longitude: number,
    radius?: number,
    ingredientNames?: string[],
    dietaryRestrictions?: string[],
    placeType?: string,
    limit?: number
  ): Promise<EnhancedPlace[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.findPlacesWithIngredients(
          latitude,
          longitude,
          radius,
          ingredientNames,
          dietaryRestrictions,
          placeType,
          limit
        );
      }
      return this.dbService.findPlacesWithIngredients(
        latitude,
        longitude,
        radius,
        ingredientNames,
        dietaryRestrictions,
        placeType,
        limit
      );
    }, 'Finding places with ingredients');
  }

  /**
   * Get cached place by internal UUID
   */
  async getCachedPlaceById(id: string): Promise<EnhancedPlace | null> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getCachedPlaceById(id);
      }
      return this.dbService.getCachedPlaceById(id);
    }, 'Getting cached place by ID');
  }

  /**
   * Get multiple cached places by IDs
   */
  async getCachedPlacesByIds(ids: string[]): Promise<EnhancedPlace[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getCachedPlacesByIds(ids);
      }
      return this.dbService.getCachedPlacesByIds(ids);
    }, 'Getting cached places by IDs');
  }

  // ============= INGREDIENT OPERATIONS =============

  /**
   * Get all ingredients
   * Uses 3-tier caching (ingredients rarely change)
   */
  async getAllIngredients(): Promise<Ingredient[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getAllIngredients();
      }
      
      return unifiedCacheService.get(
        'ingredients',
        'all',
        async () => {
          try {
            return await this.dbService.getAllIngredients();
          } catch (error) {
            if (error instanceof DatabaseError && error.code === 'TABLE_NOT_AVAILABLE') {
              console.warn('Ingredients table not available, falling back to mock data');
              return this.mockService.getAllIngredients();
            }
            throw error;
          }
        },
        { ttl: 10 * 60 * 1000 } // 10 min cache
      );
    }, 'Getting all ingredients');
  }

  /**
   * Search ingredients by query
   * Uses 3-tier caching
   */
  async searchIngredients(query: string, limit?: number): Promise<Ingredient[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.searchIngredients(query, limit);
      }
      
      return unifiedCacheService.get(
        'ingredients',
        `search:${query}:${limit || 'all'}`,
        async () => {
          try {
            return await this.dbService.searchIngredients(query, limit);
          } catch (error) {
            if (error instanceof DatabaseError && error.code === 'TABLE_NOT_AVAILABLE') {
              console.warn('Ingredients table not available, falling back to mock data');
              return this.mockService.searchIngredients(query, limit);
            }
            throw error;
          }
        },
        { ttl: 5 * 60 * 1000 } // 5 min cache
      );
    }, 'Searching ingredients');
  }

  /**
   * Get ingredients by category
   */
  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getIngredientsByCategory(category);
      }
      
      try {
        return await this.dbService.getIngredientsByCategory(category);
      } catch (error) {
        if (error instanceof DatabaseError && error.code === 'TABLE_NOT_AVAILABLE') {
          console.warn('Ingredients table not available, falling back to mock data');
          return this.mockService.getIngredientsByCategory(category);
        }
        throw error;
      }
    }, 'Getting ingredients by category');
  }

  /**
   * Get ingredient by ID
   */
  async getIngredientById(ingredientId: string): Promise<Ingredient | null> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getIngredientById(ingredientId);
      }
      
      try {
        return await this.dbService.getIngredientById(ingredientId);
      } catch (error) {
        if (error instanceof DatabaseError && error.code === 'TABLE_NOT_AVAILABLE') {
          console.warn('Ingredients table not available, falling back to mock data');
          return this.mockService.getIngredientById(ingredientId);
        }
        throw error;
      }
    }, 'Getting ingredient by ID');
  }

  // ============= MENU OPERATIONS =============

  /**
   * Get menu items for a place
   */
  async getMenuItemsByPlace(placeId: string): Promise<MenuItem[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getMenuItemsByPlace(placeId);
      }
      
      try {
        return await this.dbService.getMenuItemsByPlace(placeId);
      } catch (error) {
        if (error instanceof DatabaseError && error.code === 'TABLE_NOT_AVAILABLE') {
          console.warn('Menu items table not available, falling back to mock data');
          return this.mockService.getMenuItemsByPlace(placeId);
        }
        throw error;
      }
    }, 'Getting menu items by place');
  }

  /**
   * Get menu items by place internal UUID
   */
  async getMenuItemsByPlaceId(placeId: string): Promise<MenuItem[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getMenuItemsByPlaceId(placeId);
      }
      
      try {
        return await this.dbService.getMenuItemsByPlaceId(placeId);
      } catch (error) {
        if (error instanceof DatabaseError && error.code === 'TABLE_NOT_AVAILABLE') {
          console.warn('Menu items table not available, falling back to mock data');
          return this.mockService.getMenuItemsByPlaceId(placeId);
        }
        throw error;
      }
    }, 'Getting menu items by place ID');
  }

  // ============= PLACE INGREDIENT OPERATIONS =============

  /**
   * Get ingredients available at a place
   */
  async getPlaceIngredients(placeId: string): Promise<PlaceIngredient[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getPlaceIngredients(placeId);
      }
      
      try {
        return await this.dbService.getPlaceIngredients(placeId);
      } catch (error) {
        if (error instanceof DatabaseError && error.code === 'TABLE_NOT_AVAILABLE') {
          console.warn('Place ingredients table not available, falling back to mock data');
          return this.mockService.getPlaceIngredients(placeId);
        }
        throw error;
      }
    }, 'Getting place ingredients');
  }

  /**
   * Get place ingredients by place internal UUID
   */
  async getPlaceIngredientsByPlaceId(placeId: string): Promise<PlaceIngredient[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getPlaceIngredientsByPlaceId(placeId);
      }
      
      try {
        return await this.dbService.getPlaceIngredientsByPlaceId(placeId);
      } catch (error) {
        if (error instanceof DatabaseError && error.code === 'TABLE_NOT_AVAILABLE') {
          console.warn('Place ingredients table not available, falling back to mock data');
          return this.mockService.getPlaceIngredientsByPlaceId(placeId);
        }
        throw error;
      }
    }, 'Getting place ingredients by place ID');
  }

  /**
   * Get places that have a specific ingredient
   */
  async getPlacesWithIngredient(ingredientId: string): Promise<PlaceIngredient[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getPlacesWithIngredient(ingredientId);
      }
      
      try {
        return await this.dbService.getPlacesWithIngredient(ingredientId);
      } catch (error) {
        if (error instanceof DatabaseError && error.code === 'TABLE_NOT_AVAILABLE') {
          console.warn('Place ingredients table not available, falling back to mock data');
          return this.mockService.getPlacesWithIngredient(ingredientId);
        }
        throw error;
      }
    }, 'Getting places with ingredient');
  }

  // ============= DIETARY RESTRICTION OPERATIONS =============

  /**
   * Get all dietary restrictions
   */
  async getAllDietaryRestrictions(): Promise<DietaryRestriction[]> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getAllDietaryRestrictions();
      }
      
      try {
        return await this.dbService.getAllDietaryRestrictions();
      } catch (error) {
        if (error instanceof DatabaseError && error.code === 'TABLE_NOT_AVAILABLE') {
          console.warn('Dietary restrictions table not available, falling back to mock data');
          return this.mockService.getAllDietaryRestrictions();
        }
        throw error;
      }
    }, 'Getting all dietary restrictions');
  }

  /**
   * Get dietary restriction by name
   */
  async getDietaryRestrictionByName(name: string): Promise<DietaryRestriction | null> {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getDietaryRestrictionByName(name);
      }
      
      try {
        return await this.dbService.getDietaryRestrictionByName(name);
      } catch (error) {
        if (error instanceof DatabaseError && error.code === 'TABLE_NOT_AVAILABLE') {
          console.warn('Dietary restrictions table not available, falling back to mock data');
          return this.mockService.getDietaryRestrictionByName(name);
        }
        throw error;
      }
    }, 'Getting dietary restriction by name');
  }

  // ============= CACHE OPERATIONS =============

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    return this.executeWithStateManagement(async () => {
      if (this.useMockData) {
        return this.mockService.getCacheStats();
      }
      return this.dbService.getCacheStats();
    }, 'Getting cache statistics');
  }
}

// Export singleton instance
export const dataAccess = new DataAccessLayer();
