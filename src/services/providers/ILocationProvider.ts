/**
 * Location Provider Interface
 * 
 * Defines the contract for location search providers (Google Maps, Mapbox, etc.)
 * This abstraction allows swapping providers without changing application code.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface PlaceResult {
  place_id: string;
  name?: string;
  formatted_address?: string;
  geometry: {
    location: LatLng;
  };
  types?: string[];
  rating?: number;
  price_level?: number;
  photos?: Array<{
    getUrl: (options?: { maxWidth?: number; maxHeight?: number }) => string;
  }>;
  opening_hours?: {
    open_now?: boolean;
  };
}

export interface TextSearchOptions {
  query: string;
  center: LatLng;
  radius?: number;
  type?: string;
}

export interface NearbySearchOptions {
  center: LatLng;
  radius?: number;
  type?: string;
}

export interface PlaceDetailsOptions {
  placeId: string;
  fields?: string[];
}

/**
 * Core interface that all location providers must implement
 */
export interface ILocationProvider {
  /**
   * Provider name for identification and logging
   */
  readonly name: string;

  /**
   * Initialize the provider (load API, setup connections, etc.)
   */
  initialize(): Promise<boolean>;

  /**
   * Check if the provider is ready to use
   */
  isReady(): boolean;

  /**
   * Search for places by text query
   */
  searchPlacesByText(options: TextSearchOptions): Promise<PlaceResult[]>;

  /**
   * Search for nearby places
   */
  searchNearbyPlaces(options: NearbySearchOptions): Promise<PlaceResult[]>;

  /**
   * Get detailed information about a specific place
   */
  getPlaceDetails(options: PlaceDetailsOptions): Promise<PlaceResult | null>;

  /**
   * Clean up resources (optional)
   */
  cleanup?(): void;
}

/**
 * Provider configuration interface
 */
export interface ProviderConfig {
  apiKey?: string;
  options?: Record<string, any>;
}
