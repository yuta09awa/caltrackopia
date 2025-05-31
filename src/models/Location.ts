
export interface Location {
  id: string;
  name: string;
  type: "Restaurant" | "Grocery";
  subType?: "Supermarket" | "Health Food Store" | "Farmers Market" | "Convenience Store" | "Food Festival" | "Public Market" | "Department Store" | "Pharmacy" | "Gourmet Market";
  rating: number;
  distance: string;
  address: string;
  phone?: string;
  website?: string;
  openNow: boolean;
  hours?: Array<{ day: string; hours: string }>;
  price: "$" | "$$" | "$$$" | "$$$$";
  dietaryOptions: string[];
  cuisine: string;
  description?: string;
  images: string[];
  seasonality?: string;
  vendorCount?: number;
  schedule?: string;
  coordinates?: { lat: number; lng: number };
  
  // Hybrid approach fields
  googlePlaceId?: string; // Reference to Google Places
  customData?: RestaurantCustomData | MarketCustomData; // Support both types of custom data
}

// Enhanced MarketCustomData interface with featuredItems added
export interface MarketCustomData {
  id: string;
  description: string;
  hours: Array<{ day: string; isOpen: boolean; openTime?: string; closeTime?: string; specialNotes?: string; hours?: string }>;
  features: string[];
  vendors: Array<{ id: string; name: string; type: string; description: string; popular: string[]; images: string[] }>;
  events: Array<{ id: string; name: string; date: string; time: string; description: string }>;
  sections: Array<{ name: string; description: string; popular: string[] }>;
  highlights: Array<{ id: string; name: string; type: string; description: string; vendor?: string }>;
  featuredItems?: FeaturedItem[]; // Added for consistency with RestaurantCustomData
  isVerified: boolean;
  lastUpdated: string;
}

export interface RestaurantCustomData {
  id: string;
  businessOwnerId?: string;
  menuItems: MenuItem[];
  featuredItems: FeaturedItem[];
  ingredients: IngredientInfo[];
  specialFeatures: string[];
  deliveryOptions: DeliveryOption[];
  loyaltyProgram?: LoyaltyProgram;
  businessHours?: CustomBusinessHours[];
  isVerified: boolean;
  lastUpdated: string;
}

export interface IngredientInfo {
  id: string;
  name: string;
  category: string;
  isOrganic: boolean;
  isLocal: boolean;
  supplier?: string;
  availability: "always" | "seasonal" | "limited";
  lastRestocked?: string;
}

export interface DeliveryOption {
  type: "pickup" | "delivery" | "dine-in";
  isAvailable: boolean;
  estimatedTime?: string;
  fee?: number;
  radius?: number; // for delivery
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
  hours?: string; // For simplified display compatibility
}

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  dietaryTags?: string[];
  rating?: number;
  category?: string;
  ingredients?: string[];
  nutritionInfo?: NutritionInfo;
  isAvailable: boolean;
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
}

export interface FeaturedItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  dietaryTags?: string[];
  rating?: number;
  category?: string;
  isSpecialOffer: boolean;
  validUntil?: string;
}

// Market-specific types consolidated from features/markets/types.ts
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
  vendor?: string;
}

export type LocationType = 'all' | 'restaurant' | 'grocery' | 'farmers-market' | 'convenience-store' | 'food-festival';
export type SortOption = 'default' | 'rating-high' | 'rating-low' | 'distance-near' | 'distance-far' | 'open-first';
