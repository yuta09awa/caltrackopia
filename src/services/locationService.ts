
import { dataService } from './serviceFactory';
import { Location } from '@/features/locations/types';
import { mockLocations } from '@/features/locations/data/mockLocations';

class LocationService {
  async getLocations(): Promise<Location[]> {
    try {
      // Try to get places from the database service
      const places = await dataService.searchPlaces('', 50);
      
      if (places.length === 0) {
        console.log('No places found in database, using mock locations');
        return mockLocations;
      }

      // Transform database places to Location format
      const locations: Location[] = places.map(place => ({
        id: place.place_id,
        name: place.name,
        type: this.mapPlaceTypeToLocationType(place.primary_type),
        subType: place.secondary_type,
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
      }));

      return locations;
    } catch (error) {
      console.error('Error fetching locations from database:', error);
      console.log('Falling back to mock locations');
      return mockLocations;
    }
  }

  private mapPlaceTypeToLocationType(placeType: string): "Restaurant" | "Grocery" {
    const restaurantTypes = ['restaurant', 'cafe', 'bakery', 'bar', 'fast_food'];
    return restaurantTypes.includes(placeType) ? "Restaurant" : "Grocery";
  }

  private mapPriceLevelToString(priceLevel?: number): string {
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
