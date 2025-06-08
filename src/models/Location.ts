
import { Database } from "@/integrations/supabase/types";

// Re-export from models for backward compatibility
export type LocationType = 'all' | 'restaurant' | 'grocery' | 'farmers-market' | 'convenience-store' | 'food-festival';
export type SortOption = 'default' | 'rating-high' | 'rating-low' | 'distance-near' | 'distance-far' | 'open-first';

// Define the PlaceType enum directly from Supabase types for consistency
export type PlaceType = Database['public']['Enums']['place_type'];

// NEW: Dual rating system interface
export interface DualRating {
  google?: {
    rating: number;
    reviewCount?: number;
    lastUpdated?: string;
  };
  yelp?: {
    rating: number;
    reviewCount?: number;
    lastUpdated?: string;
  };
  composite?: {
    rating: number; // Weighted average of available ratings
    confidence: number; // 0-1 confidence based on review counts
  };
}

export interface Location {
  id: string; // UUID from cached_places
  place_id?: string; // Google Place ID, now stored in DB
  googlePlaceId?: string; // Keep Google Places ID for reference (legacy)
  name: string;
  type: "Restaurant" | "Grocery"; // Frontend simplified type
  subType?: "Supermarket" | "Health Food Store" | "Farmers Market" | "Convenience Store" | "Food Festival" | "Public Market" | "Department Store" | "Pharmacy" | "Gourmet Market" | "Food Truck" | "Cafe" | "Bakery" | "Bar" | "Fast Food" | "Food Court" | "Butcher" | "Fish Market" | "Deli" | "Wine Shop" | "Brewery" | "Distillery"; // More granular frontend subType
  
  // New fields from cached_places table
  primaryType?: PlaceType; // Direct mapping to DB enum
  secondaryType?: PlaceType; // Direct mapping to DB enum
  googlePrimaryType?: string; // Original Google type string
  timezone?: string; // IANA timezone identifier
  qualityScore?: number; // From DB: quality_score
  dataSource?: string; // From DB: data_source
  verificationCount?: number; // From DB: verification_count
  nextRefreshAt?: string; // From DB: next_refresh_at
  firstCachedAt?: string; // From DB: first_cached_at
  lastUpdatedAt?: string; // From DB: last_updated_at
  freshnessStatus?: Database['public']['Enums']['freshness_status']; // From DB: freshness_status
  searchVector?: string; // Not directly used on frontend, but good to know it exists

  // UPDATED: Replace single rating with dual rating system
  rating: number; // Legacy field for backward compatibility (will use composite rating)
  ratings?: DualRating; // NEW: Comprehensive rating system
  
  distance: string; // Calculated distance, not directly from DB
  address: string;
  phone?: string;
  website?: string;
  openNow: boolean;
  hours?: Array<{ day: string; hours: string }>; // Parsed from opening_hours JSONB
  price: "$" | "$$" | "$$$" | "$$$$"; // Mapped from price_level
  dietaryOptions: string[]; // Enriched from other tables/logic
  cuisine: string; // Enriched from other tables/logic
  description?: string; // From custom_notes or Google description
  images: string[]; // From photo_references
  
  coordinates?: { lat: number; lng: number }; // From location GEOGRAPHY type

  // Market-specific properties (for backward compatibility with existing code)
  seasonality?: string;
  vendorCount?: number;
  schedule?: string;
  vendors?: Vendor[];
  events?: Event[];
  sections?: Section[];
  features?: string[];
  highlights?: HighlightItem[];

  // Custom data for restaurants/markets - now sourced from DB
  customData?: RestaurantCustomData | MarketCustomData; 
}

// For backward compatibility, export Market as alias to Location
export type Market = Location;

// Custom data interfaces, now reflecting data from new tables
export interface RestaurantCustomData {
  id: string; // Matches cached_places.id
  businessOwnerId?: string; // Could be a foreign key to a 'users' table
  menuItems: MenuItem[]; // From menu_items table
  featuredItems: FeaturedItem[]; // Derived from menu_items or a separate 'featured_items' table
  ingredients: IngredientInfo[]; // From place_ingredients joined with ingredients
  specialFeatures: string[]; // Custom features, potentially from a new table or JSONB field
  deliveryOptions: DeliveryOption[]; // Custom delivery options
  loyaltyProgram?: LoyaltyProgram; // Custom loyalty program info
  businessHours?: CustomBusinessHours[]; // More detailed custom hours
  isVerified: boolean; // Derived from verification_count
  lastUpdated: string; // From cached_places.last_updated_at
  promotions?: Promotion[]; // NEW: For specific promotional offers
}

// New interface for Market specific custom data (e.g., Farmers Markets, Convenience Stores)
export interface MarketCustomData {
  id: string; // Matches cached_places.id
  description: string; // From cached_places.custom_notes or similar
  hours: CustomBusinessHours[]; // Detailed custom hours for markets
  features?: string[]; // Amenities, facilities
  vendors?: Vendor[]; // For farmers markets/food festivals
  events?: Event[]; // For food festivals
  sections?: Section[]; // For convenience stores/supermarkets
  highlights?: HighlightItem[]; // Featured products/events
  isVerified: boolean;
  lastUpdated: string;
  // Adding featuredItems to MarketCustomData for consistency with RestaurantCustomData
  // This allows MarketDetails to display featured items if applicable.
  featuredItems?: FeaturedItem[];
  promotions?: Promotion[]; // NEW: For specific promotional offers
}

// New interface for dedicated promotions
export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl?: string; // Optional image for the promotion itself
  discount?: string;
  validUntil?: string;
}

export interface IngredientInfo {
  id: string; // From ingredients.id
  name: string; // From ingredients.name
  category: string; // From ingredients.category
  isOrganic: boolean; // From ingredients.is_organic
  isLocal: boolean; // From ingredients.is_local
  supplier?: string; // From place_ingredients.source or a new supplier table
  availability: "always" | "seasonal" | "limited" | "unknown"; // Derived from place_ingredients.is_available and ingredients.is_seasonal
  lastRestocked?: string; // From place_ingredients.last_restocked
  description?: string; // From ingredients.common_names or a dedicated description field
  // NEW: Enhanced nutritional information
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    vitamins?: Record<string, number>;
    minerals?: Record<string, number>;
  };
}

export interface DeliveryOption {
  type: "pickup" | "delivery" | "dine-in";
  isAvailable: boolean;
  estimatedTime?: string;
  fee?: number;
  radius?: number;
}

export interface LoyaltyProgram {
  name: string;
  type: "points" | "visits" | "spending";
  description: string;
  isActive: boolean;
}

export interface CustomBusinessHours {
  day: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  specialNotes?: string;
  hours?: string; // For simplified display, e.g., "8:00 AM - 10:00 PM"
}

export interface MenuItem {
  id: string; // From menu_items.id
  name: string; // From menu_items.name
  price: string; // Formatted price from menu_items.price
  description?: string; // From menu_items.description
  image: string; // From menu_items.image_url
  imageUrl?: string; // Ensure this is present for compatibility
  dietaryTags?: string[]; // From menu_items.dietary_tags
  rating?: number; // From menu_items.rating
  category?: string; // From menu_items.category
  ingredients?: string[]; // Could be a list of ingredient names in the item
  nutritionInfo?: NutritionInfo; // From menu_items directly or calculated
  isAvailable: boolean; // From menu_items.is_available
  spice_level?: number; // From menu_items.spice_level
  seasonalAvailability?: string; // From menu_items.seasonal_availability
  popularityScore?: number; // From menu_items.popularity_score
  // Frontend specific:
  thumbsUp?: number; 
  thumbsDown?: number;
  // NEW: Enhanced nutritional data from external APIs
  externalNutritionData?: {
    source: 'usda' | 'fatsecret' | 'local';
    lastUpdated: string;
    confidence: number;
  };
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  vitamins?: Record<string, number>; // From ingredients.vitamins
  minerals?: Record<string, number>; // From ingredients.minerals
}

export interface FeaturedItem {
  id: string; // From menu_items.id or a separate table
  name: string;
  price: string;
  description?: string;
  image: string;
  imageUrl?: string; // Ensure this is present for compatibility
  dietaryTags?: string[];
  rating?: number;
  category?: string;
  isSpecialOffer: boolean;
  validUntil?: string;
}

// For MarketCustomData specific nested types
export interface Vendor {
  id: string;
  name: string;
  type: string;
  description: string;
  popular: string[];
  images: string[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
}

export interface Section {
  name: string;
  description: string;
  popular: string[];
}

export interface HighlightItem {
  id: string;
  name: string;
  type: "new" | "popular" | "seasonal";
  description: string;
  image?: string;
  vendor?: string;
}
