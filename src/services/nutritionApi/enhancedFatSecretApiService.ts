
import { NutritionalInfo } from '@/models/NutritionalInfo';
import { enhancedCachingService } from '../enhancedCachingService';
import { FatSecretFood, FatSecretSearchResult, FatSecretApiService } from './fatSecretApiService';

export class EnhancedFatSecretApiService extends FatSecretApiService {
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour

  async searchFoods(query: string, pageNumber: number = 0): Promise<FatSecretSearchResult> {
    const cacheKey = `fatsecret-search-${query}-${pageNumber}`;
    
    // Try to get from cache first
    const cached = enhancedCachingService.getLocationData(cacheKey);
    if (cached) {
      console.log('FatSecret search cache hit:', cacheKey);
      return cached;
    }

    try {
      const result = await super.searchFoods(query, pageNumber);
      
      // Cache the result
      enhancedCachingService.setLocationData(cacheKey, result);
      console.log('FatSecret search cached:', cacheKey);
      
      return result;
    } catch (error) {
      console.error('FatSecret search failed:', error);
      throw error;
    }
  }

  async getFoodById(foodId: string): Promise<FatSecretFood> {
    const cacheKey = `fatsecret-food-${foodId}`;
    
    // Try to get from cache first
    const cached = enhancedCachingService.getNutritionData(cacheKey);
    if (cached) {
      console.log('FatSecret food cache hit:', cacheKey);
      return cached;
    }

    try {
      const result = await super.getFoodById(foodId);
      
      // Cache the result
      enhancedCachingService.setNutritionData(cacheKey, result);
      console.log('FatSecret food cached:', cacheKey);
      
      return result;
    } catch (error) {
      console.error('FatSecret food fetch failed:', error);
      throw error;
    }
  }
}

export const enhancedFatSecretApiService = new EnhancedFatSecretApiService();
