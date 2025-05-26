
export interface Location {
  id: string;
  name: string;
  type: "Restaurant" | "Grocery";
  subType?: "Supermarket" | "Health Food Store" | "Farmers Market" | "Convenience Store" | "Food Festival" | "Public Market";
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
}

export type LocationType = 'all' | 'restaurant' | 'grocery' | 'farmers-market' | 'convenience-store' | 'food-festival';
export type SortOption = 'default' | 'rating-high' | 'rating-low' | 'distance-near' | 'distance-far' | 'open-first';
