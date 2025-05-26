export type LocationType = 'all' | 'Restaurant' | 'Grocery';
export type SortOption = 'default' | 'rating' | 'distance';

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
  coordinates?: { lat: number; lng: number }; // Added coordinates for mapping
}
