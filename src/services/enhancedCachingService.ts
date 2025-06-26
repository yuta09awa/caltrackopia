
import { useEnhancedCaching } from '@/hooks/useEnhancedCaching';

interface NutritionCacheEntry {
  nutritionData: any;
  timestamp: number;
}

interface LocationCacheEntry {
  locationData: any;
  timestamp: number;
}

class EnhancedCachingService {
  private nutritionCache = new Map<string, NutritionCacheEntry>();
  private locationCache = new Map<string, LocationCacheEntry>();
  private readonly NUTRITION_TTL = 60 * 60 * 1000; // 1 hour
  private readonly LOCATION_TTL = 30 * 60 * 1000; // 30 minutes

  // Nutrition data caching
  getNutritionData(key: string): any | null {
    const entry = this.nutritionCache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.NUTRITION_TTL) {
      this.nutritionCache.delete(key);
      return null;
    }

    return entry.nutritionData;
  }

  setNutritionData(key: string, data: any): void {
    this.nutritionCache.set(key, {
      nutritionData: data,
      timestamp: Date.now()
    });
  }

  // Location data caching
  getLocationData(key: string): any | null {
    const entry = this.locationCache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.LOCATION_TTL) {
      this.locationCache.delete(key);
      return null;
    }

    return entry.locationData;
  }

  setLocationData(key: string, data: any): void {
    this.locationCache.set(key, {
      locationData: data,
      timestamp: Date.now()
    });
  }

  // Cache management
  clearNutritionCache(): void {
    this.nutritionCache.clear();
  }

  clearLocationCache(): void {
    this.locationCache.clear();
  }

  clearAllCaches(): void {
    this.clearNutritionCache();
    this.clearLocationCache();
  }

  getCacheStats() {
    return {
      nutritionCacheSize: this.nutritionCache.size,
      locationCacheSize: this.locationCache.size,
      totalCacheSize: this.nutritionCache.size + this.locationCache.size
    };
  }
}

export const enhancedCachingService = new EnhancedCachingService();
