
import { DatabaseService } from './databaseService';
import { MockDataService } from './mockDataService';

// Environment-based service switching
const isDevelopment = import.meta.env.DEV;
const forceMockData = import.meta.env.VITE_FORCE_MOCK_DATA === 'true';

export interface IDataService {
  // Place methods
  searchPlaces(query: string, limit?: number): Promise<any[]>;
  getPlaceById(placeId: string): Promise<any | null>;
  getPlacesByType(placeType: string, limit?: number): Promise<any[]>;
  findPlacesWithIngredients(
    latitude: number,
    longitude: number,
    radius?: number,
    ingredientNames?: string[],
    dietaryRestrictions?: string[],
    placeType?: string,
    limit?: number
  ): Promise<any[]>;
  getCachedPlaceById(id: string): Promise<any | null>;
  getCachedPlacesByIds(ids: string[]): Promise<any[]>;
  getCacheStats(): Promise<any[]>;

  // Ingredient methods
  getAllIngredients(): Promise<any[]>;
  searchIngredients(query: string, limit?: number): Promise<any[]>;
  getIngredientsByCategory(category: string): Promise<any[]>;
  getIngredientById(ingredientId: string): Promise<any | null>;

  // Menu methods
  getMenuItemsByPlace(placeId: string): Promise<any[]>;
  getMenuItemsByPlaceId(placeId: string): Promise<any[]>;

  // Place ingredient methods
  getPlaceIngredients(placeId: string): Promise<any[]>;
  getPlaceIngredientsByPlaceId(placeId: string): Promise<any[]>;
  getPlacesWithIngredient(ingredientId: string): Promise<any[]>;

  // Dietary restriction methods
  getAllDietaryRestrictions(): Promise<any[]>;
  getDietaryRestrictionByName(name: string): Promise<any | null>;
}

// Service factory that returns appropriate service based on environment
export function createDataService(): IDataService {
  if (forceMockData || (isDevelopment && !import.meta.env.VITE_USE_REAL_DATA)) {
    console.log('Using MockDataService for data operations');
    return new MockDataService();
  }
  
  console.log('Using DatabaseService for data operations');
  return new DatabaseService();
}

// Singleton instance
export const dataService = createDataService();
