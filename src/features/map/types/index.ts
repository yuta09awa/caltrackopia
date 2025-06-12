
// Define our own LatLng interface since @react-google-maps/api doesn't export it directly
export interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerData {
  position: LatLng;
  locationId: string;
  type: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  open_now?: boolean;
  photo_url?: string;
}

export interface MapFilters {
  priceRange: string | null;
  cuisine: string;
  category: string;
  openNow: boolean;
  dietary: string[];
  nutrition: string[];
  sources: string[];
}
