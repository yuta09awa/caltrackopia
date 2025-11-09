/**
 * Google Maps Provider Implementation
 * 
 * Encapsulates all Google Maps API logic in a provider class
 * that implements the ILocationProvider interface.
 */

import {
  ILocationProvider,
  LatLng,
  PlaceResult,
  TextSearchOptions,
  NearbySearchOptions,
  PlaceDetailsOptions,
  ProviderConfig
} from './ILocationProvider';

export class GoogleMapsProvider implements ILocationProvider {
  readonly name = 'google-maps';
  private ready = false;
  private map: google.maps.Map | null = null;
  private initializationPromise: Promise<boolean> | null = null;

  constructor(private config: ProviderConfig = {}) {}

  /**
   * Initialize Google Maps API
   */
  async initialize(): Promise<boolean> {
    // Return cached promise if already initializing
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._initializeInternal();
    return this.initializationPromise;
  }

  private async _initializeInternal(): Promise<boolean> {
    // Check if Google Maps API is already loaded
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      this.ready = true;
      return true;
    }

    // Wait for API to load (max 5 seconds)
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50;

      const checkInterval = setInterval(() => {
        attempts++;
        
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
          clearInterval(checkInterval);
          this.ready = true;
          console.log('[GoogleMapsProvider] API loaded successfully');
          resolve(true);
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.error('[GoogleMapsProvider] API failed to load');
          resolve(false);
        }
      }, 100);
    });
  }

  /**
   * Check if provider is ready
   */
  isReady(): boolean {
    return this.ready;
  }

  /**
   * Set the map instance (required for Google Places API)
   */
  setMap(map: google.maps.Map): void {
    this.map = map;
  }

  /**
   * Search places by text query
   */
  async searchPlacesByText(options: TextSearchOptions): Promise<PlaceResult[]> {
    if (!this.ready) {
      await this.initialize();
    }

    if (!this.map) {
      console.warn('[GoogleMapsProvider] No map instance available');
      return [];
    }

    const service = new google.maps.places.PlacesService(this.map);
    
    return new Promise<PlaceResult[]>((resolve) => {
      const request: google.maps.places.TextSearchRequest = {
        query: options.query,
        location: new google.maps.LatLng(options.center.lat, options.center.lng),
        radius: options.radius || 20000,
        type: options.type as any
      };

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const placeResults = this._convertToPlaceResults(results);
          console.log(`[GoogleMapsProvider] Text search found ${placeResults.length} places`);
          resolve(placeResults);
        } else {
          console.log(`[GoogleMapsProvider] Text search failed:`, status);
          resolve([]);
        }
      });
    });
  }

  /**
   * Search nearby places
   */
  async searchNearbyPlaces(options: NearbySearchOptions): Promise<PlaceResult[]> {
    if (!this.ready) {
      await this.initialize();
    }

    if (!this.map) {
      console.warn('[GoogleMapsProvider] No map instance available');
      return [];
    }

    const service = new google.maps.places.PlacesService(this.map);
    
    return new Promise<PlaceResult[]>((resolve) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(options.center.lat, options.center.lng),
        radius: options.radius || 2000,
        type: options.type as any
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const placeResults = this._convertToPlaceResults(results);
          console.log(`[GoogleMapsProvider] Nearby search found ${placeResults.length} places`);
          resolve(placeResults);
        } else {
          console.log(`[GoogleMapsProvider] Nearby search failed:`, status);
          resolve([]);
        }
      });
    });
  }

  /**
   * Get place details
   */
  async getPlaceDetails(options: PlaceDetailsOptions): Promise<PlaceResult | null> {
    if (!this.ready) {
      await this.initialize();
    }

    if (!this.map) {
      console.warn('[GoogleMapsProvider] No map instance available');
      return null;
    }

    const service = new google.maps.places.PlacesService(this.map);
    
    return new Promise<PlaceResult | null>((resolve) => {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: options.placeId,
        fields: options.fields || [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'rating',
          'photos',
          'price_level',
          'types',
          'opening_hours'
        ]
      };

      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const placeResult = this._convertToPlaceResult(place);
          resolve(placeResult);
        } else {
          console.error(`[GoogleMapsProvider] Place details failed:`, status);
          resolve(null);
        }
      });
    });
  }

  /**
   * Convert Google Places results to standard PlaceResult format
   */
  private _convertToPlaceResults(results: google.maps.places.PlaceResult[]): PlaceResult[] {
    return results
      .filter(place => place.geometry?.location && place.place_id)
      .map(place => this._convertToPlaceResult(place));
  }

  /**
   * Convert single Google Place result to standard PlaceResult format
   */
  private _convertToPlaceResult(place: google.maps.places.PlaceResult): PlaceResult {
    return {
      place_id: place.place_id!,
      name: place.name,
      formatted_address: place.formatted_address,
      geometry: {
        location: {
          lat: place.geometry!.location!.lat(),
          lng: place.geometry!.location!.lng()
        }
      },
      types: place.types,
      rating: place.rating,
      price_level: place.price_level,
      photos: place.photos,
      opening_hours: place.opening_hours
    };
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.map = null;
    this.ready = false;
    this.initializationPromise = null;
  }
}
