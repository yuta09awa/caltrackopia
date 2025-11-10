import { ServiceBase } from '../base/ServiceBase';
import { ILocationProvider, LatLng, PlaceResult } from '../providers/ILocationProvider';
import { LocationProviderFactory } from '../providers/LocationProviderFactory';

/**
 * Unified Location Service
 * 
 * Single service for all location-related operations including:
 * - Getting current user location
 * - Geocoding (address -> coordinates)
 * - Reverse geocoding (coordinates -> address)
 * - Location provider management
 * 
 * Consolidates: locationService, hybridLocationService, locationResolverService
 * 
 * @example
 * ```typescript
 * import { location } from '@/services';
 * 
 * // Get user's current location
 * const userLocation = await location.getCurrentLocation();
 * 
 * // Geocode an address
 * const coords = await location.geocode('123 Main St, NYC');
 * 
 * // Reverse geocode coordinates
 * const address = await location.reverseGeocode({ lat: 40.7589, lng: -73.9851 });
 * ```
 */
export class LocationService extends ServiceBase {
  private provider: ILocationProvider | null = null;
  private cachedLocation: LatLng | null = null;
  private locationCacheTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    super();
  }

  getName(): string {
    return 'LocationService';
  }

  getVersion(): string {
    return '1.0.0';
  }

  /**
   * Initialize the location provider
   */
  private async initializeProvider(): Promise<void> {
    if (!this.provider || !this.provider.isReady()) {
      this.provider = LocationProviderFactory.createProvider();
      await this.provider.initialize();
    }
  }

  /**
   * Get the user's current location
   * Uses browser geolocation API with caching
   */
  async getCurrentLocation(options?: {
    forceRefresh?: boolean;
    highAccuracy?: boolean;
    timeout?: number;
  }): Promise<LatLng> {
    return this.executeWithStateManagement(async () => {
      const now = Date.now();
      
      // Return cached location if available and not expired
      if (!options?.forceRefresh && this.cachedLocation && (now - this.locationCacheTime) < this.CACHE_DURATION) {
        return this.cachedLocation;
      }

      // Get fresh location from browser
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported by browser'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: options?.highAccuracy ?? true,
            timeout: options?.timeout ?? 10000,
            maximumAge: 0
          }
        );
      });

      const location: LatLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Cache the location
      this.cachedLocation = location;
      this.locationCacheTime = now;

      return location;
    }, 'Getting current location');
  }

  /**
   * Geocode an address to coordinates
   * Converts a human-readable address into lat/lng coordinates
   */
  async geocode(address: string): Promise<LatLng | null> {
    return this.executeWithStateManagement(async () => {
      await this.initializeProvider();
      
      if (!this.provider) {
        throw new Error('Location provider not initialized');
      }

      // Use text search to find the address
      const results = await this.provider.searchPlacesByText({
        query: address,
        center: await this.getCurrentLocation(), // Use current location as context
        radius: 50000 // 50km radius
      });

      if (results.length === 0) {
        return null;
      }

      // Return the first result's location
      return results[0].geometry.location;
    }, 'Geocoding address');
  }

  /**
   * Reverse geocode coordinates to address
   * Converts lat/lng coordinates into a human-readable address
   */
  async reverseGeocode(latLng: LatLng): Promise<string | null> {
    return this.executeWithStateManagement(async () => {
      await this.initializeProvider();
      
      if (!this.provider) {
        throw new Error('Location provider not initialized');
      }

      // Use nearby search to find places at this location
      const results = await this.provider.searchNearbyPlaces({
        center: latLng,
        radius: 50 // Very small radius for specific location
      });

      if (results.length === 0) {
        return null;
      }

      // Return the formatted address of the closest result
      return results[0].formatted_address || null;
    }, 'Reverse geocoding coordinates');
  }

  /**
   * Get places near a location
   */
  async searchNearby(options: {
    center: LatLng;
    radius?: number;
    type?: string;
  }): Promise<PlaceResult[]> {
    return this.executeWithStateManagement(async () => {
      await this.initializeProvider();
      
      if (!this.provider) {
        throw new Error('Location provider not initialized');
      }

      return this.provider.searchNearbyPlaces({
        center: options.center,
        radius: options.radius,
        type: options.type
      });
    }, 'Searching nearby places');
  }

  /**
   * Search for places by text query
   */
  async searchByText(options: {
    query: string;
    center?: LatLng;
    radius?: number;
    type?: string;
  }): Promise<PlaceResult[]> {
    return this.executeWithStateManagement(async () => {
      await this.initializeProvider();
      
      if (!this.provider) {
        throw new Error('Location provider not initialized');
      }

      const center = options.center || await this.getCurrentLocation();

      return this.provider.searchPlacesByText({
        query: options.query,
        center,
        radius: options.radius,
        type: options.type
      });
    }, 'Searching places by text');
  }

  /**
   * Get details for a specific place
   */
  async getPlaceDetails(placeId: string, fields?: string[]): Promise<PlaceResult | null> {
    return this.executeWithStateManagement(async () => {
      await this.initializeProvider();
      
      if (!this.provider) {
        throw new Error('Location provider not initialized');
      }

      return this.provider.getPlaceDetails({ placeId, fields });
    }, 'Getting place details');
  }

  /**
   * Calculate distance between two points (in meters)
   */
  calculateDistance(point1: LatLng, point2: LatLng): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.lat * Math.PI) / 180;
    const φ2 = (point2.lat * Math.PI) / 180;
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Clear cached location
   */
  clearCache(): void {
    this.cachedLocation = null;
    this.locationCacheTime = 0;
  }
}

// Export singleton instance
export const location = new LocationService();
