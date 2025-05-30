
import { Location, RestaurantCustomData } from "@/models/Location";
import { locationService } from "./locationService";

export class HybridLocationService {
  
  /**
   * Get location with both Google Places data and custom restaurant data
   */
  async getEnrichedLocation(locationId: string): Promise<Location | null> {
    try {
      // Get base location data (currently from mock, but could be from Google Places)
      const baseLocation = await locationService.getLocationById(locationId);
      if (!baseLocation) return null;

      // Get custom restaurant data if it's a restaurant
      if (baseLocation.type === "Restaurant") {
        const customData = await this.getCustomRestaurantData(locationId);
        if (customData) {
          baseLocation.customData = customData;
        }
      }

      return baseLocation;
    } catch (error) {
      console.error('Error getting enriched location:', error);
      return null;
    }
  }

  /**
   * Get custom restaurant data by location ID
   */
  async getCustomRestaurantData(locationId: string): Promise<RestaurantCustomData | null> {
    try {
      // This would typically fetch from your database
      // For now, returning mock data that demonstrates the structure
      const mockCustomData: RestaurantCustomData = {
        id: locationId,
        businessOwnerId: "owner_123",
        isVerified: true,
        lastUpdated: new Date().toISOString(),
        menuItems: [
          {
            id: "menu_1",
            name: "Organic Caesar Salad",
            price: "$12.99",
            description: "Fresh romaine lettuce with organic croutons",
            image: "/placeholder.svg",
            dietaryTags: ["vegetarian", "organic"],
            rating: 4.5,
            category: "Salads",
            ingredients: ["romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
            nutritionInfo: {
              calories: 280,
              protein: 8,
              carbs: 15,
              fat: 22,
              fiber: 3,
              sodium: 650
            },
            isAvailable: true
          }
        ],
        featuredItems: [
          {
            id: "featured_1",
            name: "Today's Special: Quinoa Bowl",
            price: "$14.99",
            description: "Organic quinoa with seasonal vegetables",
            image: "/placeholder.svg",
            dietaryTags: ["vegan", "gluten-free"],
            rating: 4.8,
            category: "Bowls",
            isSpecialOffer: true,
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        ingredients: [
          {
            id: "ing_1",
            name: "Organic Kale",
            category: "Vegetables",
            isOrganic: true,
            isLocal: true,
            supplier: "Local Farm Co-op",
            availability: "always",
            lastRestocked: new Date().toISOString()
          }
        ],
        specialFeatures: ["farm-to-table", "zero-waste", "locally-sourced"],
        deliveryOptions: [
          {
            type: "pickup",
            isAvailable: true,
            estimatedTime: "15-20 min"
          },
          {
            type: "delivery",
            isAvailable: true,
            estimatedTime: "30-45 min",
            fee: 2.99,
            radius: 3
          },
          {
            type: "dine-in",
            isAvailable: true
          }
        ],
        loyaltyProgram: {
          name: "Green Rewards",
          type: "points",
          description: "Earn 1 point per dollar spent, redeem for free items",
          isActive: true
        },
        businessHours: [
          {
            day: "Monday",
            isOpen: true,
            openTime: "08:00",
            closeTime: "22:00"
          },
          {
            day: "Tuesday",
            isOpen: true,
            openTime: "08:00",
            closeTime: "22:00"
          }
        ]
      };

      return mockCustomData;
    } catch (error) {
      console.error('Error fetching custom restaurant data:', error);
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
