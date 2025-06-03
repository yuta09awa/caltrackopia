
import { RestaurantCustomData, MarketCustomData } from "@/models/Location";
import { databaseService } from "./databaseService";
import { mockLocations } from "@/features/locations/data/mockLocations";

export class CustomDataService {
  
  /**
   * Get custom restaurant data with proper fallback handling
   */
  async getCustomRestaurantData(placeId: string, dbPlace: any | null): Promise<RestaurantCustomData | null> {
    console.log(`[CustomDataService] Getting custom restaurant data for ID: ${placeId}, from DB: ${!!dbPlace}`);
    
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
          // Ensure we return only RestaurantCustomData
          const customData = mockRestaurant.customData;
          if ('menuItems' in customData) {
            return customData as RestaurantCustomData;
          }
        }
        return null;
      }
    } catch (error) {
      console.error(`[CustomDataService] Error fetching custom restaurant data:`, error);
      return null;
    }
  }

  /**
   * Get custom grocery data with proper fallback handling  
   */
  async getCustomGroceryData(placeId: string, dbPlace: any | null): Promise<MarketCustomData | null> {
    console.log(`[CustomDataService] Getting custom grocery data for ID: ${placeId}, from DB: ${!!dbPlace}`);
    
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
          // Create a MarketCustomData from the mock data
          return {
            id: placeId,
            description: mockGrocery.description || mockGrocery.name,
            hours: [],
            features: [],
            vendors: [],
            events: [],
            sections: [],
            highlights: [],
            isVerified: false,
            lastUpdated: new Date().toISOString(),
          };
        }
        return null;
      }
    } catch (error) {
      console.error(`[CustomDataService] Error fetching custom grocery data:`, error);
      return null;
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
}

// Export singleton instance
export const customDataService = new CustomDataService();
