
export type LocationType = 'all' | 'restaurant' | 'grocery' | 'farmers-market' | 'convenience-store' | 'food-festival';
export type SortOption = 'default' | 'rating-high' | 'rating-low' | 'distance-near' | 'distance-far' | 'open-first';

export interface Location {
  id: string;
  name: string;
  type: string;
  subType?: string; // Added for more specific categorization
  rating: number;
  distance: string;
  address: string;
  openNow: boolean;
  price: string;
  dietaryOptions: string[];
  cuisine: string;
  images: string[];
  seasonality?: string; // For seasonal markets/festivals
  vendorCount?: number; // For markets with multiple vendors
  schedule?: string; // For periodic markets/festivals
}
