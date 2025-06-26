
import { NutritionalInfo } from '@/models/NutritionalInfo';
import { enhancedCachingService } from '../enhancedCachingService';
import { USDAFood, USDASearchResult, USDAApiService } from './usdaApiService';

export class EnhancedUSDAApiService extends USDAApiService {
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour

  async searchFoods(query: string, pageSize: number = 25): Promise<USDASearchResult> {
    const cacheKey = `usda-search-${query}-${pageSize}`;
    
    // Try to get from cache first
    const cached = enhancedCachingService.getNutritionData(cacheKey);
    if (cached) {
      console.log('USDA search cache hit:', cacheKey);
      return cached;
    }

    try {
      const result = await super.searchFoods(query, pageSize);
      
      // Cache the result
      enhancedCachingService.setNutritionData(cacheKey, result);
      console.log('USDA search cached:', cacheKey);
      
      return result;
    } catch (error) {
      console.error('USDA search failed:', error);
      throw error;
    }
  }

  async getFoodById(fdcId: number): Promise<USDAFood> {
    const cacheKey = `usda-food-${fdcId}`;
    
    // Try to get from cache first
    const cached = enhancedCachingService.getNutritionData(cacheKey);
    if (cached) {
      console.log('USDA food cache hit:', cacheKey);
      return cached;
    }

    try {
      const result = await super.getFoodById(fdcId);
      
      // Cache the result
      enhancedCachingService.setNutritionData(cacheKey, result);
      console.log('USDA food cached:', cacheKey);
      
      return result;
    } catch (error) {
      console.error('USDA food fetch failed:', error);
      throw error;
    }
  }
}

export const enhancedUsdaApiService = new EnhancedUSDAApiService();
