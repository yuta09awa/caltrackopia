/**
 * Mapbox Provider Implementation (Skeleton)
 * 
 * Future implementation for Mapbox as an alternative to Google Maps.
 * This serves as a template for adding alternative providers.
 */

import {
  ILocationProvider,
  PlaceResult,
  TextSearchOptions,
  NearbySearchOptions,
  PlaceDetailsOptions,
  ProviderConfig
} from './ILocationProvider';

export class MapboxProvider implements ILocationProvider {
  readonly name = 'mapbox';
  private ready = false;

  constructor(private config: ProviderConfig = {}) {}

  async initialize(): Promise<boolean> {
    // TODO: Initialize Mapbox API
    console.log('[MapboxProvider] Initialization not yet implemented');
    return false;
  }

  isReady(): boolean {
    return this.ready;
  }

  async searchPlacesByText(options: TextSearchOptions): Promise<PlaceResult[]> {
    // TODO: Implement Mapbox Geocoding API text search
    console.warn('[MapboxProvider] Text search not yet implemented');
    return [];
  }

  async searchNearbyPlaces(options: NearbySearchOptions): Promise<PlaceResult[]> {
    // TODO: Implement Mapbox nearby search
    console.warn('[MapboxProvider] Nearby search not yet implemented');
    return [];
  }

  async getPlaceDetails(options: PlaceDetailsOptions): Promise<PlaceResult | null> {
    // TODO: Implement Mapbox place details
    console.warn('[MapboxProvider] Place details not yet implemented');
    return null;
  }

  cleanup(): void {
    this.ready = false;
  }
}
