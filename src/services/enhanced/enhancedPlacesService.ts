
import { apiRoutingService } from '../routing/apiRoutingService';
import { multiLevelCacheService } from '../caching/multiLevelCacheService';
import { databaseService } from '../databaseService';
import { MarkerData } from '@/features/map/types';
import { mapPlaceTypeToMarkerType } from '@/features/map/utils/placeTypeMapper';

export interface PlaceSearchRequest {
  query?: string;
  center: { lat: number; lng: number };
  radius: number;
  type?: string;
  limit?: number;
}

export interface PlaceSearchResponse {
  places: MarkerData[];
  source: string;
  cached: boolean;
  responseTime: number;
}

export class EnhancedPlacesService {
  async searchPlaces(request: PlaceSearchRequest): Promise<PlaceSearchResponse> {
    const cacheKey = this.generateCacheKey(request);
    const startTime = performance.now();

    // Try cache first
    const cachedResult = await multiLevelCacheService.get<PlaceSearchResponse>(cacheKey);
    if (cachedResult) {
      return {
        ...cachedResult,
        cached: true,
        responseTime: performance.now() - startTime
      };
    }

    // Route request through the smart routing system
    const result = await apiRoutingService.routeRequest<PlaceSearchResponse>(
      'places',
      async (sourceId) => {
        switch (sourceId) {
          case 'supabase-cache':
            return await this.searchFromDatabase(request);
          case 'google-places':
            return await this.searchFromGooglePlaces(request);
          default:
            throw new Error(`Unsupported source: ${sourceId}`);
        }
      },
      async () => {
        // Fallback to mock data
        return {
          places: [],
          source: 'fallback',
          cached: false,
          responseTime: 0
        };
      }
    );

    // Cache the result
    await multiLevelCacheService.set(cacheKey, result, {
      ttl: 30 * 60 * 1000 // 30 minutes
    });

    return {
      ...result,
      cached: false,
      responseTime: performance.now() - startTime
    };
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    const cacheKey = `place_details_${placeId}`;
    
    // Try cache first
    const cachedResult = await multiLevelCacheService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Route request for place details
    const result = await apiRoutingService.routeRequest(
      'places',
      async (sourceId) => {
        switch (sourceId) {
          case 'supabase-cache':
            return await databaseService.getPlaceById(placeId);
          case 'google-places':
            return await this.getPlaceDetailsFromGoogle(placeId);
          default:
            throw new Error(`Unsupported source: ${sourceId}`);
        }
      }
    );

    // Cache the result
    await multiLevelCacheService.set(cacheKey, result, {
      ttl: 60 * 60 * 1000 // 1 hour
    });

    return result;
  }

  private async searchFromDatabase(request: PlaceSearchRequest): Promise<PlaceSearchResponse> {
    try {
      let places;
      
      if (request.query) {
        places = await databaseService.searchPlaces(request.query, request.limit || 20);
      } else {
        // For location-based searches, we'd need a spatial query
        // For now, return general results
        places = await databaseService.searchPlaces('', request.limit || 20);
      }

      const markers: MarkerData[] = places.map(place => ({
        position: { lat: Number(place.latitude), lng: Number(place.longitude) },
        locationId: place.place_id,
        type: mapPlaceTypeToMarkerType(place.primary_type)
      }));

      return {
        places: markers,
        source: 'supabase-cache',
        cached: false,
        responseTime: 0
      };
    } catch (error) {
      console.error('Database search failed:', error);
      throw error;
    }
  }

  private async searchFromGooglePlaces(request: PlaceSearchRequest): Promise<PlaceSearchResponse> {
    // This would integrate with Google Places API
    // For now, we'll return a placeholder
    return {
      places: [],
      source: 'google-places',
      cached: false,
      responseTime: 0
    };
  }

  private async getPlaceDetailsFromGoogle(placeId: string): Promise<any> {
    // This would integrate with Google Places API
    // For now, we'll return a placeholder
    return null;
  }

  private generateCacheKey(request: PlaceSearchRequest): string {
    const parts = [
      'places_search',
      request.query || 'nearby',
      `${request.center.lat.toFixed(4)}_${request.center.lng.toFixed(4)}`,
      request.radius.toString(),
      request.type || 'all',
      (request.limit || 20).toString()
    ];
    return parts.join('_');
  }

  async invalidateCache(pattern?: string): Promise<void> {
    if (pattern) {
      await multiLevelCacheService.invalidatePattern(pattern);
    } else {
      await multiLevelCacheService.invalidatePattern('places_');
    }
  }

  getServiceStats() {
    return {
      routing: apiRoutingService.getSourceStatus(),
      cache: multiLevelCacheService.getCacheStats()
    };
  }
}

export const enhancedPlacesService = new EnhancedPlacesService();
