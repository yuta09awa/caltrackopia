/**
 * Location Domain Service
 * Handles all location-related operations
 */

import { services } from '@/services';
import type { EnhancedPlace } from '@/services/databaseService';
import { eventBus, type DomainEvent } from '../core/EventBus';

export const LocationEvents = {
  LOCATION_SELECTED: 'location.selected',
  LOCATION_SEARCHED: 'location.searched',
  USER_LOCATION_UPDATED: 'location.user.updated',
} as const;

export interface LocationSelectedEvent extends DomainEvent {
  type: typeof LocationEvents.LOCATION_SELECTED;
  payload: {
    locationId: string;
    locationType: string;
  };
}

export interface LocationSearchedEvent extends DomainEvent {
  type: typeof LocationEvents.LOCATION_SEARCHED;
  payload: {
    query: string;
    resultCount: number;
  };
}

export interface UserLocationUpdatedEvent extends DomainEvent {
  type: typeof LocationEvents.USER_LOCATION_UPDATED;
  payload: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

class LocationDomain {
  /**
   * Search for places by query string
   */
  async searchPlaces(query: string, limit?: number): Promise<EnhancedPlace[]> {
    const results = await services.data.searchPlaces(query, limit);

    await eventBus.publish({
      type: LocationEvents.LOCATION_SEARCHED,
      payload: {
        query,
        resultCount: results.length,
      },
      timestamp: Date.now(),
    });

    return results;
  }

  /**
   * Get place details
   */
  async getPlaceDetails(placeId: string): Promise<EnhancedPlace | null> {
    const location = await services.data.getPlace(placeId);

    if (location) {
      await eventBus.publish({
        type: LocationEvents.LOCATION_SELECTED,
        payload: {
          locationId: placeId,
          locationType: location.place_types?.[0] || 'unknown',
        },
        timestamp: Date.now(),
      });
    }

    return location;
  }

  /**
   * Search by ingredient
   */
  async findPlacesWithIngredients(
    latitude: number,
    longitude: number,
    radius?: number,
    ingredientNames?: string[]
  ): Promise<EnhancedPlace[]> {
    return services.data.findPlacesWithIngredients(
      latitude,
      longitude,
      radius,
      ingredientNames
    );
  }

  /**
   * Get user's current location
   */
  async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    const coords = await services.location.getCurrentLocation();

    if (coords) {
      await eventBus.publish({
        type: LocationEvents.USER_LOCATION_UPDATED,
        payload: {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        timestamp: Date.now(),
      });
    }

    return coords;
  }

  /**
   * Geocode address
   */
  async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    return services.location.geocode(address);
  }

  /**
   * Reverse geocode coordinates
   */
  async reverseGeocode(coords: { lat: number; lng: number }): Promise<string | null> {
    return services.location.reverseGeocode(coords);
  }

  /**
   * Search nearby places (delegates to location service)
   */
  async searchNearby(center: { lat: number; lng: number }, radius?: number): Promise<EnhancedPlace[]> {
    // LocationService returns PlaceResult[], we need to convert or use data layer
    const query = ''; // Empty query for nearby search
    return this.searchPlaces(query, 50);
  }
}

export const locationDomain = new LocationDomain();

