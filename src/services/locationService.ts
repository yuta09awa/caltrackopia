
import { Location } from "@/models/Location";
import { databaseService } from "./databaseService";
import { mockLocations } from "@/features/locations/data/mockLocations";

export class LocationService {
  /**
   * Fetch all locations from the enhanced database
   */
  async getLocations(): Promise<Location[]> {
    try {
      const places = await databaseService.getPlacesByType('restaurant', 50);
      const groceryPlaces = await databaseService.getPlacesByType('grocery_store', 50);
      
      const allPlaces = [...places, ...groceryPlaces];
      return allPlaces.map(place => this.transformPlaceToLocation(place));
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Return mock data as fallback for MVP
      return this.getMockLocations();
    }
  }

  /**
   * Fetch locations by type using the enhanced database
   */
  async getLocationsByType(type: string): Promise<Location[]> {
    try {
      if (type === 'all') {
        return this.getLocations();
      }

      // Map frontend types to database place types
      const dbType = this.mapTypeToDbType(type);
      const places = await databaseService.getPlacesByType(dbType, 50);
      
      return places.map(place => this.transformPlaceToLocation(place));
    } catch (error) {
      console.error('Error fetching locations by type:', error);
      // Return filtered mock data as fallback
      const mockLocations = this.getMockLocations();
      return mockLocations.filter(location => 
        type === 'all' || location.type.toLowerCase() === type.toLowerCase()
      );
    }
  }

  /**
   * Search locations by name or cuisine using enhanced search
   */
  async searchLocations(query: string): Promise<Location[]> {
    try {
      const places = await databaseService.searchPlaces(query, 50);
      return places.map(place => this.transformPlaceToLocation(place));
    } catch (error) {
      console.error('Error searching locations:', error);
      // Return filtered mock data as fallback
      const mockLocations = this.getMockLocations();
      return mockLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.cuisine.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  /**
   * Get a single location by ID
   */
  async getLocationById(id: string): Promise<Location | null> {
    try {
      const place = await databaseService.getPlaceById(id);
      if (place) {
        return this.transformPlaceToLocation(place);
      }
      return null;
    } catch (error) {
      console.error('Error fetching location by ID:', error);
      // Return mock data as fallback
      const mockLocations = this.getMockLocations();
      return mockLocations.find(location => location.id === id) || null;
    }
  }

  /**
   * Search locations with ingredient availability
   */
  async searchLocationsByIngredients(
    center: google.maps.LatLngLiteral,
    ingredientNames: string[],
    radius: number = 5000
  ): Promise<Location[]> {
    try {
      const results = await databaseService.findPlacesWithIngredients(
        center.lat,
        center.lng,
        radius,
        ingredientNames
      );

      return results.map(result => {
        const location = this.transformPlaceToLocation(result as any);
        // Note: ingredient availability would be added here when the database schema supports it
        return location;
      });
    } catch (error) {
      console.error('Error searching locations by ingredients:', error);
      return [];
    }
  }

  /**
   * Transform database place to Location model
   */
  private transformPlaceToLocation(place: any): Location {
    return {
      id: place.place_id,
      name: place.name,
      type: this.mapDbTypeToFrontendType(place.primary_type),
      subType: this.mapDbTypeToSubType(place.primary_type),
      rating: place.rating || 0,
      distance: '0.5 km', // This would need distance calculation
      address: place.formatted_address || '',
      phone: place.phone_number,
      website: place.website,
      openNow: place.is_open_now ?? true,
      hours: this.transformOpeningHours(place.opening_hours),
      price: this.mapPriceLevelToPrice(place.price_level),
      dietaryOptions: [], // Would need to be derived from menu items or ingredients
      cuisine: this.mapPlaceTypeToCuisine(place.primary_type),
      description: `Quality score: ${place.quality_score || 'N/A'}`,
      images: place.photo_references?.map((ref: string) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=YOUR_API_KEY`
      ) || ['/placeholder.svg'],
      coordinates: {
        lat: place.latitude,
        lng: place.longitude
      },
      googlePlaceId: place.place_id,
      customData: undefined // Will be populated by hybrid service if needed
    };
  }

  /**
   * Map frontend type to database place type
   */
  private mapTypeToDbType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'restaurant': 'restaurant',
      'grocery': 'grocery_store',
      'farmers-market': 'farmers_market',
      'convenience-store': 'convenience_store',
      'food-festival': 'other'
    };
    return typeMap[type] || 'other';
  }

  /**
   * Map database place type to frontend type
   */
  private mapDbTypeToFrontendType(dbType: string): "Restaurant" | "Grocery" {
    const restaurantTypes = ['restaurant', 'cafe', 'bakery', 'bar', 'fast_food', 'food_court'];
    return restaurantTypes.includes(dbType) ? 'Restaurant' : 'Grocery';
  }

  /**
   * Map database place type to subtype
   */
  private mapDbTypeToSubType(dbType: string): "Supermarket" | "Health Food Store" | "Farmers Market" | "Convenience Store" | "Food Festival" | "Public Market" | "Department Store" | "Pharmacy" | "Gourmet Market" | undefined {
    const subTypeMap: { [key: string]: "Supermarket" | "Health Food Store" | "Farmers Market" | "Convenience Store" | "Food Festival" | "Public Market" | "Department Store" | "Pharmacy" | "Gourmet Market" } = {
      'grocery_store': 'Supermarket',
      'convenience_store': 'Convenience Store',
      'specialty_food_store': 'Health Food Store',
      'farmers_market': 'Farmers Market',
      'pharmacy': 'Pharmacy'
    };
    return subTypeMap[dbType];
  }

  /**
   * Map price level to price string
   */
  private mapPriceLevelToPrice(priceLevel?: number): "$" | "$$" | "$$$" | "$$$$" {
    switch (priceLevel) {
      case 1: return "$";
      case 2: return "$$";
      case 3: return "$$$";
      case 4: return "$$$$";
      default: return "$$";
    }
  }

  /**
   * Map place type to cuisine
   */
  private mapPlaceTypeToCuisine(placeType: string): string {
    const cuisineMap: { [key: string]: string } = {
      'restaurant': 'International',
      'cafe': 'Cafe',
      'bakery': 'Bakery',
      'bar': 'Bar & Grill',
      'fast_food': 'Fast Food',
      'grocery_store': 'Grocery',
      'convenience_store': 'Convenience'
    };
    return cuisineMap[placeType] || 'Various';
  }

  /**
   * Transform opening hours from Google format
   */
  private transformOpeningHours(openingHours: any): Array<{ day: string; hours: string }> {
    if (!openingHours?.weekday_text) {
      return [];
    }

    return openingHours.weekday_text.map((dayText: string) => {
      const [day, ...hoursParts] = dayText.split(': ');
      return {
        day: day,
        hours: hoursParts.join(': ') || 'Closed'
      };
    });
  }

  /**
   * Mock data for development/fallback - now uses consolidated data
   */
  private getMockLocations(): Location[] {
    return mockLocations;
  }
}

// Export singleton instance
export const locationService = new LocationService();
