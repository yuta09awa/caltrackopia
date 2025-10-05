export type LocationType = "Restaurant" | "Grocery" | "FarmersMarket" | "all";

export type SortOption = "distance" | "rating" | "price" | "name";

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
