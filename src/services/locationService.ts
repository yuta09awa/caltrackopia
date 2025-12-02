import { dataService } from './serviceFactory';
import { Location } from '@/features/locations/types';
import { mockLocations } from '@/features/locations/data/mockLocations';
import { EnhancedPlace } from './databaseService';
import { enhancedCachingService } from './enhancedCachingService';
import { mapCacheService } from './storage/MapCacheService';

/**
 * @deprecated Use DataAccessLayer instead.
 * 
 * Migration Guide:
 * - locationService.getLocations() → dataAccess.getAllLocations()
 * - locationService.searchLocations() → dataAccess.searchFrontendLocations()
 * 
 * See: docs/migrations/service-layer-migration.md
 */
class LocationService {
  private readonly MEMORY_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly INDEXEDDB_TTL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get locations with 4-tier caching hierarchy:
   * 1. Memory Cache (30 min TTL) - Fastest
   * 2. IndexedDB Cache (24 hour TTL) - Persistent, offline
   * 3. Supabase cached_places (7 day TTL) - Shared cache
   * 4. Google Maps API - Last resort
   */
  async getLocations(): Promise<Location[]> {
    const cacheKey = 'all-locations';
    
    // Layer 1: Check memory cache first (fastest)
    const memoryCached = enhancedCachingService.getLocationData(cacheKey);
    if (memoryCached) {
      console.log('[Cache L1] Memory cache hit:', cacheKey);
      return memoryCached;
    }

    // Layer 2: Check IndexedDB cache (persistent, offline-capable)
    const indexedDBCached = await mapCacheService.getLocations(cacheKey);
    if (indexedDBCached) {
      console.log('[Cache L2] IndexedDB cache hit:', cacheKey);
      // Populate memory cache for next time
      enhancedCachingService.setLocationData(cacheKey, indexedDBCached);
      return indexedDBCached;
    }

    try {
      // Layer 3: Query Supabase cached_places (shared cache)
      console.log('[Cache L3] Querying Supabase cached_places...');
      const places = await dataService.searchPlaces('', 50);
      
      let locations: Location[];
      
      if (places.length === 0) {
        console.log('[Cache L4] No Supabase data, using mock locations (fallback)');
        locations = mockLocations;
      } else {
        // Transform database places to Location format
        locations = places.map(place => this.mapCachedPlaceToLocation(place));
      }

      // Store in both caches
      enhancedCachingService.setLocationData(cacheKey, locations);
      await mapCacheService.setLocations(cacheKey, locations);
      console.log('[Cache] Stored in L1 (memory) and L2 (IndexedDB)');
      
      return locations;
    } catch (error) {
      console.error('[Cache L4] Error fetching from Supabase, falling back to mock:', error);
      return mockLocations;
    }
  }

  /**
   * Search locations with 4-tier caching hierarchy
   */
  async searchLocations(query: string): Promise<Location[]> {
    const cacheKey = `search-${query}`;
    
    // Layer 1: Check memory cache
    const memoryCached = enhancedCachingService.getLocationData(cacheKey);
    if (memoryCached) {
      console.log('[Search L1] Memory cache hit:', query);
      return memoryCached;
    }

    // Layer 2: Check IndexedDB cache
    const indexedDBCached = await mapCacheService.getSearchResults(query);
    if (indexedDBCached) {
      console.log('[Search L2] IndexedDB cache hit:', query);
      enhancedCachingService.setLocationData(cacheKey, indexedDBCached);
      return indexedDBCached;
    }

    try {
      // Layer 3: Query Supabase
      console.log('[Search L3] Querying Supabase for:', query);
      const places = await dataService.searchPlaces(query, 20);
      
      let locations: Location[];
      
      if (places.length === 0) {
        // Layer 4: Filter mock locations
        console.log('[Search L4] No Supabase results, filtering mock locations');
        locations = mockLocations.filter(loc => 
          loc.name.toLowerCase().includes(query.toLowerCase()) ||
          loc.address.toLowerCase().includes(query.toLowerCase()) ||
          loc.cuisine?.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        locations = places.map(place => this.mapCachedPlaceToLocation(place));
      }

      // Store in both caches
      enhancedCachingService.setLocationData(cacheKey, locations);
      await mapCacheService.setSearchResults(query, locations);
      console.log('[Search] Stored in L1 and L2, results:', locations.length);
      
      return locations;
    } catch (error) {
      console.error('[Search] Error, using mock fallback:', error);
      return mockLocations.filter(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.address.toLowerCase().includes(query.toLowerCase()) ||
        loc.cuisine?.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  /**
   * Clear all location caches
   */
  async clearAllCaches(): Promise<void> {
    enhancedCachingService.clearLocationCache();
    await mapCacheService.clearAll();
    console.log('[LocationService] All caches cleared');
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    const indexedDBStats = await mapCacheService.getStats();
    const memoryStats = enhancedCachingService.getCacheStats();
    
    return {
      memory: {
        locationCacheSize: memoryStats.locationCacheSize,
        nutritionCacheSize: memoryStats.nutritionCacheSize
      },
      indexedDB: indexedDBStats,
      total: {
        entriesAcrossAllLayers: indexedDBStats.totalEntries + memoryStats.locationCacheSize
      }
    };
  }

  mapCachedPlaceToLocation(place: EnhancedPlace): Location {
    return {
      id: place.place_id,
      name: place.name,
      type: this.mapPlaceTypeToLocationType(place.primary_type),
      subType: this.mapPlaceTypeToSubType(place.primary_type),
      rating: place.rating || 4.0,
      distance: "0.5 mi", // This would be calculated based on user location
      address: place.formatted_address || '',
      openNow: place.is_open_now ?? true,
      price: this.mapPriceLevelToString(place.price_level),
      dietaryOptions: this.extractDietaryOptions(place.place_types),
      cuisine: this.extractCuisine(place.place_types),
      coordinates: {
        lat: Number(place.latitude),
        lng: Number(place.longitude)
      },
      images: place.photo_references.slice(0, 2) || ["/placeholder.svg", "/placeholder.svg"]
    };
  }

  private mapPlaceTypeToLocationType(placeType: string): "Restaurant" | "Grocery" {
    const restaurantTypes = ['restaurant', 'cafe', 'bakery', 'bar', 'fast_food'];
    return restaurantTypes.includes(placeType) ? "Restaurant" : "Grocery";
  }

  private mapPlaceTypeToSubType(placeType: string): "Supermarket" | "Health Food Store" | "Farmers Market" | "Convenience Store" | "Food Festival" | "Public Market" | "Department Store" | "Pharmacy" | "Gourmet Market" | "Food Truck" | "Cafe" | "Bakery" | "Bar" | "Fast Food" | "Food Court" | "Butcher" | "Fish Market" | "Deli" | "Wine Shop" | "Brewery" | "Distillery" | undefined {
    const subTypeMap: Record<string, "Supermarket" | "Health Food Store" | "Farmers Market" | "Convenience Store" | "Food Festival" | "Public Market" | "Department Store" | "Pharmacy" | "Gourmet Market" | "Food Truck" | "Cafe" | "Bakery" | "Bar" | "Fast Food" | "Food Court" | "Butcher" | "Fish Market" | "Deli" | "Wine Shop" | "Brewery" | "Distillery"> = {
      'supermarket': 'Supermarket',
      'grocery_or_supermarket': 'Supermarket',
      'health_food_store': 'Health Food Store',
      'farmers_market': 'Farmers Market',
      'convenience_store': 'Convenience Store',
      'food_festival': 'Food Festival',
      'public_market': 'Public Market',
      'department_store': 'Department Store',
      'pharmacy': 'Pharmacy',
      'gourmet_market': 'Gourmet Market',
      'food_truck': 'Food Truck',
      'cafe': 'Cafe',
      'bakery': 'Bakery',
      'bar': 'Bar',
      'fast_food': 'Fast Food',
      'food_court': 'Food Court',
      'butcher': 'Butcher',
      'fish_market': 'Fish Market',
      'deli': 'Deli',
      'wine_shop': 'Wine Shop',
      'brewery': 'Brewery',
      'distillery': 'Distillery'
    };

    return subTypeMap[placeType];
  }

  private mapPriceLevelToString(priceLevel?: number): "$" | "$$" | "$$$" | "$$$$" {
    if (!priceLevel) return "$$";
    switch (priceLevel) {
      case 1: return "$";
      case 2: return "$$";
      case 3: return "$$$";
      case 4: return "$$$$";
      default: return "$$";
    }
  }

  private extractDietaryOptions(placeTypes: string[]): string[] {
    const dietaryMap: Record<string, string> = {
      'vegetarian_restaurant': 'Vegetarian',
      'vegan_restaurant': 'Vegan',
      'health_food_store': 'Organic',
      'bakery': 'Fresh Baked'
    };

    return placeTypes
      .map(type => dietaryMap[type])
      .filter(Boolean);
  }

  private extractCuisine(placeTypes: string[]): string {
    const cuisineMap: Record<string, string> = {
      'italian_restaurant': 'Italian',
      'chinese_restaurant': 'Chinese',
      'mexican_restaurant': 'Mexican',
      'japanese_restaurant': 'Japanese',
      'indian_restaurant': 'Indian',
      'thai_restaurant': 'Thai'
    };

    for (const type of placeTypes) {
      if (cuisineMap[type]) {
        return cuisineMap[type];
      }
    }

    return "Various";
  }
}

export const locationService = new LocationService();
