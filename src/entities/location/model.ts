export type LocationType = "Restaurant" | "Grocery" | "FarmersMarket" | "all";

export type SortOption = "distance" | "rating" | "price" | "name";

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  imageUrl?: string;
  dietaryTags?: string[];
  rating?: number;
  category?: string;
  ingredients?: string[];
  isAvailable: boolean;
  spice_level?: number;
  seasonalAvailability?: string;
  popularityScore?: number;
  thumbsUp?: number;
  thumbsDown?: number;
}

export interface FeaturedItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  imageUrl?: string;
  dietaryTags?: string[];
  rating?: number;
  category?: string;
  isSpecialOffer: boolean;
  validUntil?: string;
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  rating?: number;
  priceLevel?: number;
  imageUrl?: string;
  cuisine?: string;
  category?: string;
  description?: string;
  hours?: string;
  phone?: string;
  website?: string;
  isOpen?: boolean;
  isPopular?: boolean;
}

export const createLocation = (data: Partial<Location> & Pick<Location, 'id' | 'name' | 'type' | 'address' | 'latitude' | 'longitude'>): Location => ({
  id: data.id,
  name: data.name,
  type: data.type,
  address: data.address,
  latitude: data.latitude,
  longitude: data.longitude,
  distance: data.distance,
  rating: data.rating,
  priceLevel: data.priceLevel,
  imageUrl: data.imageUrl,
  cuisine: data.cuisine,
  category: data.category,
  description: data.description,
  hours: data.hours,
  phone: data.phone,
  website: data.website,
  isOpen: data.isOpen,
  isPopular: data.isPopular,
});
