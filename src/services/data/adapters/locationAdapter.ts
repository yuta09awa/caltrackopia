import { Location } from '@/models/Location';
import { EnhancedPlace } from '@/services/databaseService';
import { EdgeRestaurant } from '@/lib/edge-api-client';

// ================= CONSTANTS & MAPPINGS =================

const PRICE_MAP: Record<number, "$" | "$$" | "$$$" | "$$$$"> = {
  1: "$", 2: "$$", 3: "$$$", 4: "$$$$"
};

const TYPE_MAP: Record<string, "Restaurant" | "Grocery"> = {
  'restaurant': 'Restaurant',
  'cafe': 'Restaurant',
  'bakery': 'Restaurant',
  'bar': 'Restaurant',
  'fast_food': 'Restaurant',
  'meal_takeaway': 'Restaurant',
  'meal_delivery': 'Restaurant',
  'supermarket': 'Grocery',
  'grocery_or_supermarket': 'Grocery',
  'convenience_store': 'Grocery',
  'liquor_store': 'Grocery',
  'health_food_store': 'Grocery'
};

const SUBTYPE_MAP: Record<string, Location['subType']> = {
  'supermarket': 'Supermarket',
  'health_food_store': 'Health Food Store',
  'farmers_market': 'Farmers Market',
  'convenience_store': 'Convenience Store',
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

const CUISINE_MAP: Record<string, string> = {
  'italian_restaurant': 'Italian',
  'chinese_restaurant': 'Chinese',
  'mexican_restaurant': 'Mexican',
  'japanese_restaurant': 'Japanese',
  'indian_restaurant': 'Indian',
  'thai_restaurant': 'Thai',
  'american_restaurant': 'American',
  'french_restaurant': 'French',
  'mediterranean_restaurant': 'Mediterranean',
  'vegetarian_restaurant': 'Vegetarian',
  'vegan_restaurant': 'Vegan',
  'seafood_restaurant': 'Seafood',
  'steak_house': 'Steakhouse',
  'pizza_restaurant': 'Pizza',
  'hamburger_restaurant': 'Burgers',
  'sushi_restaurant': 'Sushi',
  'ramen_restaurant': 'Ramen',
  'korean_restaurant': 'Korean',
  'vietnamese_restaurant': 'Vietnamese',
  'middle_eastern_restaurant': 'Middle Eastern',
  'greek_restaurant': 'Greek'
};

const DIETARY_MAP: Record<string, string> = {
  'vegetarian_restaurant': 'Vegetarian',
  'vegan_restaurant': 'Vegan',
  'health_food_store': 'Organic',
  'bakery': 'Fresh Baked',
  'gluten_free_restaurant': 'Gluten-Free'
};

const DEFAULT_IMAGES = ["/placeholder.svg", "/placeholder.svg"];

// ================= ADAPTER IMPLEMENTATION =================

export const locationAdapter = {
  /**
   * Converts a raw DB EnhancedPlace to a frontend Location object
   */
  toLocationFromEnhancedPlace(place: EnhancedPlace): Location {
    const primaryType = place.primary_type || 'restaurant';
    const placeTypes = place.place_types || [];

    return {
      id: place.place_id,
      place_id: place.place_id,

      name: place.name || 'Unknown Location',
      type: this.mapPrimaryType(primaryType),
      subType: this.mapSubType(primaryType),
      
      rating: place.rating || 0,
      openNow: place.is_open_now ?? false,
      
      distance: "0 km",
      
      address: place.formatted_address || '',
      price: this.mapPriceLevel(place.price_level),
      
      dietaryOptions: this.extractDietaryOptions(placeTypes),
      cuisine: this.extractCuisine(placeTypes),
      
      coordinates: {
        lat: Number(place.latitude) || 0,
        lng: Number(place.longitude) || 0
      },
      
      images: (place.photo_references && place.photo_references.length > 0) 
        ? place.photo_references 
        : DEFAULT_IMAGES,

      phone: place.phone_number,
      website: place.website,
      hours: place.opening_hours as any
    };
  },

  /**
   * Converts an Edge API result to a frontend Location object
   */
  toLocationFromEdgeRestaurant(place: EdgeRestaurant): Location {
    const primaryType = place.primary_type || 'restaurant';
    const placeTypes = place.place_types || [];

    return {
      id: place.place_id,
      place_id: place.place_id,
      name: place.name || 'Unknown Location',
      type: this.mapPrimaryType(primaryType),
      subType: this.mapSubType(primaryType),
      
      rating: place.rating || 0,
      openNow: place.is_open_now ?? false,
      
      distance: place.distance_meters 
        ? `${(place.distance_meters / 1000).toFixed(1)} km` 
        : "0 km",
      
      address: place.formatted_address || '',
      price: this.mapPriceLevel(place.price_level),
      
      dietaryOptions: this.extractDietaryOptions(placeTypes),
      cuisine: this.extractCuisine(place.cuisine_types || placeTypes),
      
      coordinates: {
        lat: place.latitude,
        lng: place.longitude
      },
      
      images: (place.photo_references && place.photo_references.length > 0)
        ? place.photo_references
        : DEFAULT_IMAGES,

      phone: place.phone_number,
      website: place.website,
      hours: place.opening_hours
    };
  },

  // ================= HELPERS =================

  mapPriceLevel(level?: number): "$" | "$$" | "$$$" | "$$$$" {
    if (!level) return "$$";
    return PRICE_MAP[level] || "$$";
  },

  mapPrimaryType(type?: string): "Restaurant" | "Grocery" {
    if (!type) return "Restaurant";
    return TYPE_MAP[type.toLowerCase()] || "Grocery";
  },

  mapSubType(type?: string): Location['subType'] | undefined {
    if (!type) return undefined;
    return SUBTYPE_MAP[type.toLowerCase()];
  },

  extractDietaryOptions(types: string[] = []): string[] {
    return types.map(t => DIETARY_MAP[t]).filter(Boolean);
  },

  extractCuisine(types: string[] = []): string {
    for (const t of types) {
      if (CUISINE_MAP[t]) return CUISINE_MAP[t];
    }
    return "Various";
  }
};
