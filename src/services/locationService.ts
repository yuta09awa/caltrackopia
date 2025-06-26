import { dataService } from './serviceFactory';
import { Location } from '@/features/locations/types';
import { mockLocations } from '@/features/locations/data/mockLocations';
import { EnhancedPlace } from './databaseService';
import { enhancedCachingService } from './enhancedCachingService';

class LocationService {
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  async getLocations(): Promise<Location[]> {
    const cacheKey = 'all-locations';
    
    // Try to get from cache first
    const cached = enhancedCachingService.getLocationData(cacheKey);
    if (cached) {
      console.log('Locations cache hit:', cacheKey);
      return cached;
    }

    try {
      // Try to get places from the database service
      const places = await dataService.searchPlaces('', 50);
      
      let locations: Location[];
      
      if (places.length === 0) {
        console.log('No places found in database, using mock locations');
        locations = mockLocations;
      } else {
        // Transform database places to Location format
        locations = places.map(place => this.mapCachedPlaceToLocation(place));
      }

      // Cache the result
      enhancedCachingService.setLocationData(cacheKey, locations);
      console.log('Locations cached:', cacheKey);
      
      return locations;
    } catch (error) {
      console.error('Error fetching locations from database:', error);
      console.log('Falling back to mock locations');
      return mockLocations;
    }
  }

  async searchLocations(query: string): Promise<Location[]> {
    const cacheKey = `location-search-${query}`;
    
    // Try to get from cache first
    const cached = enhancedCachingService.getLocationData(cacheKey);
    if (cached) {
      console.log('Location search cache hit:', cacheKey);
      return cached;
    }

    try {
      const places = await dataService.searchPlaces(query, 20);
      
      let locations: Location[];
      
      if (places.length === 0) {
        // Filter mock locations by query
        locations = mockLocations.filter(loc => 
          loc.name.toLowerCase().includes(query.toLowerCase()) ||
          loc.address.toLowerCase().includes(query.toLowerCase()) ||
          loc.cuisine?.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        locations = places.map(place => this.mapCachedPlaceToLocation(place));
      }

      // Cache the result
      enhancedCachingService.setLocationData(cacheKey, locations);
      console.log('Location search cached:', cacheKey);
      
      return locations;
    } catch (error) {
      console.error('Error searching locations:', error);
      return mockLocations.filter(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.address.toLowerCase().includes(query.toLowerCase()) ||
        loc.cuisine?.toLowerCase().includes(query.toLowerCase())
      );
    }
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
