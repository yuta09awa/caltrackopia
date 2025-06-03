
import { Location, RestaurantCustomData, MarketCustomData } from "@/models/Location";
import { locationService } from "./locationService";
import { locationResolverService } from "./locationResolverService";
import { customDataService } from "./customDataService";

export class HybridLocationService {
  
  /**
   * Get location with both Google Places data and custom restaurant data
   */
  async getEnrichedLocation(locationId: string): Promise<Location | null> {
    console.log(`[HybridLocationService] Attempting to get enriched location for ID: ${locationId}`);
    
    try {
      const { location: baseLocation, dbPlace } = await locationResolverService.resolveLocation(locationId);

      if (!baseLocation) {
        console.error(`[HybridLocationService] Base location is null after all lookups for ID: ${locationId}`);
        return null;
      }

      // Determine location type and fetch custom data if applicable
      const resolvedType = dbPlace?.primary_type || baseLocation.type.toLowerCase();
      const isRestaurantType = ['restaurant', 'cafe', 'bakery', 'bar', 'fast_food', 'food_court', 'food_truck'].includes(resolvedType);
      const isGroceryType = ['grocery_store', 'supermarket', 'convenience_store', 'specialty_food_store', 'farmers_market', 'health_food_store', 'butcher', 'fish_market', 'deli', 'wine_shop', 'brewery', 'distillery'].includes(resolvedType);

      let customData: RestaurantCustomData | MarketCustomData | undefined = undefined;

      if (isRestaurantType) {
        customData = await customDataService.getCustomRestaurantData(baseLocation.id, dbPlace);
      } else if (isGroceryType) {
        customData = await customDataService.getCustomGroceryData(baseLocation.id, dbPlace);
      }

      return {
        ...baseLocation,
        customData: customData,
      };

    } catch (error) {
      console.error(`[HybridLocationService] Error getting enriched location for ID ${locationId}:`, error);
      return null;
    }
  }

  /**
   * Search locations with enriched data
   */
  async searchEnrichedLocations(query: string): Promise<Location[]> {
    try {
      // Get base locations from existing service
      const baseLocations = await locationService.searchLocations(query);
      
      // Enrich restaurant locations with custom data
      const enrichedLocations = await Promise.all(
        baseLocations.map(async (location) => {
          if (location.type === "Restaurant") {
            const customData = await customDataService.getCustomRestaurantData(location.id, null);
            if (customData) {
              location.customData = customData;
            }
          }
          return location;
        })
      );

      return enrichedLocations;
    } catch (error) {
      console.error('Error searching enriched locations:', error);
      return [];
    }
  }

  /**
   * Update custom restaurant data
   */
  async updateCustomRestaurantData(locationId: string, customData: Partial<RestaurantCustomData>): Promise<boolean> {
    return customDataService.updateCustomRestaurantData(locationId, customData);
  }

  /**
   * Get locations by ingredient availability
   */
  async getLocationsByIngredient(ingredientName: string): Promise<Location[]> {
    try {
      // This would search through custom restaurant data for ingredient availability
      const allLocations = await locationService.getLocations();
      
      // Filter locations that have the specific ingredient
      const locationsWithIngredient = await Promise.all(
        allLocations
          .filter(loc => loc.type === "Restaurant")
          .map(async (location) => {
            const customData = await customDataService.getCustomRestaurantData(location.id, null);
            if (customData?.ingredients.some(ing => 
              ing.name.toLowerCase().includes(ingredientName.toLowerCase())
            )) {
              location.customData = customData;
              return location;
            }
            return null;
          })
      );

      return locationsWithIngredient.filter(loc => loc !== null) as Location[];
    } catch (error) {
      console.error('Error getting locations by ingredient:', error);
      return [];
    }
  }
}

// Export singleton instance
export const hybridLocationService = new HybridLocationService();
