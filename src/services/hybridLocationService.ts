import { Location, RestaurantCustomData } from "@/models/Location";
import { locationService } from "./locationService";

export class HybridLocationService {
  
  /**
   * Get location with both Google Places data and custom restaurant data
   */
  async getEnrichedLocation(locationId: string): Promise<Location | null> {
    console.log(`[HybridLocationService] Attempting to get enriched location for ID: ${locationId}`);
    
    try {
      let baseLocation: Location | null = null;
      let dbPlace: any = null;

      // Step 1: Try to fetch by database UUID (primary method)
      console.log(`[HybridLocationService] Step 1: Trying database lookup by UUID: ${locationId}`);
      dbPlace = await databaseService.getCachedPlaceById(locationId);
      
      if (dbPlace) {
        console.log(`[HybridLocationService] Found DB entry by UUID: ${locationId}`);
        baseLocation = locationService.mapCachedPlaceToLocation(dbPlace);
      } else {
        // Step 2: Try to fetch by Google place_id (fallback for legacy data)
        console.log(`[HybridLocationService] Step 2: Trying database lookup by place_id: ${locationId}`);
        dbPlace = await databaseService.getPlaceById(locationId);
        
        if (dbPlace) {
          console.log(`[HybridLocationService] Found DB entry by place_id: ${locationId}`);
          baseLocation = locationService.mapCachedPlaceToLocation(dbPlace);
        } else {
          // Step 3: Fallback to mock data
          console.log(`[HybridLocationService] Step 3: Trying mock data lookup: ${locationId}`);
          const mockLocation = mockLocations.find(loc => loc.id === locationId);
          
          if (mockLocation) {
            console.log(`[HybridLocationService] Found mock data for ID: ${locationId}`);
            baseLocation = JSON.parse(JSON.stringify(mockLocation)) as Location;
          } else {
            console.error(`[HybridLocationService] Location not found in DB or mock data: ${locationId}`);
            return null;
          }
        }
      }

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
        customData = await this.getCustomRestaurantData(baseLocation.id, dbPlace);
      } else if (isGroceryType) {
        customData = await this.getCustomGroceryData(baseLocation.id, dbPlace);
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
   * SIMPLIFIED: Get custom restaurant data with proper fallback handling
   */
  async getCustomRestaurantData(placeId: string, dbPlace: any | null): Promise<RestaurantCustomData | null> {
    console.log(`[HybridLocationService] Getting custom restaurant data for ID: ${placeId}, from DB: ${!!dbPlace}`);
    
    try {
      if (dbPlace) {
        // Fetch from database (when tables are available)
        const menuItems = await databaseService.getMenuItemsByPlaceId(dbPlace.id);
        // Since tables don't exist yet, this will return empty arrays
        return {
          id: placeId,
          businessOwnerId: "owner_temp",
          menuItems: [],
          featuredItems: [],
          ingredients: [],
          specialFeatures: ["Outdoor Seating", "WiFi"],
          deliveryOptions: [
            { type: "pickup", isAvailable: true, estimatedTime: "15-20 min" },
            { type: "delivery", isAvailable: true, estimatedTime: "30-45 min", fee: 3.99, radius: 5 }
          ],
          loyaltyProgram: { name: "Rewards", type: "points", description: "Earn points", isActive: true },
          businessHours: [],
          isVerified: dbPlace.verification_count > 0,
          lastUpdated: dbPlace.last_updated_at,
        };
      } else {
        // Fallback to mock data
        const mockRestaurant = mockLocations.find(loc => loc.id === placeId && loc.type === "Restaurant");
        if (mockRestaurant?.customData) {
          return mockRestaurant.customData as RestaurantCustomData;
        }
        return null;
      }
    } catch (error) {
      console.error(`[HybridLocationService] Error fetching custom restaurant data:`, error);
      return null;
    }
  }

  /**
   * SIMPLIFIED: Get custom grocery data with proper fallback handling  
   */
  async getCustomGroceryData(placeId: string, dbPlace: any | null): Promise<MarketCustomData | null> {
    console.log(`[HybridLocationService] Getting custom grocery data for ID: ${placeId}, from DB: ${!!dbPlace}`);
    
    try {
      if (dbPlace) {
        // Fetch from database (when tables are available)
        return {
          id: placeId,
          description: dbPlace.custom_notes || dbPlace.name,
          hours: [],
          features: ["Parking", "Wheelchair Accessible"],
          vendors: [],
          events: [],
          sections: [
            { name: "Produce", description: "Fresh fruits and vegetables", popular: ["Apples", "Bananas"] }
          ],
          highlights: [],
          isVerified: dbPlace.verification_count > 0,
          lastUpdated: dbPlace.last_updated_at,
        };
      } else {
        // Fallback to mock data
        const mockGrocery = mockLocations.find(loc => loc.id === placeId && loc.type === "Grocery");
        if (mockGrocery?.customData) {
          return mockGrocery.customData as MarketCustomData;
        }
        return null;
      }
    } catch (error) {
      console.error(`[HybridLocationService] Error fetching custom grocery data:`, error);
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
            const customData = await this.getCustomRestaurantData(location.id);
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
    try {
      // This would typically update your database
      console.log('Updating custom restaurant data for:', locationId, customData);
      return true;
    } catch (error) {
      console.error('Error updating custom restaurant data:', error);
      return false;
    }
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
            const customData = await this.getCustomRestaurantData(location.id);
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
