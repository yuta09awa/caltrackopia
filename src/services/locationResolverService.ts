
import { Location } from "@/models/Location";
import { locationService } from "./locationService";
import { databaseService } from "./databaseService";
import { mockLocations } from "@/features/locations/data/mockLocations";

export class LocationResolverService {
  
  /**
   * Check if a string is a valid UUID format
   */
  private isValidUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  /**
   * Resolve a location ID to a base Location object
   */
  async resolveLocation(locationId: string): Promise<{ location: Location | null; dbPlace: any | null }> {
    console.log(`[LocationResolverService] Resolving location ID: ${locationId}`);
    
    try {
      let baseLocation: Location | null = null;
      let dbPlace: any = null;

      // Check if this is a mock location ID first (non-UUID format)
      if (!this.isValidUUID(locationId)) {
        console.log(`[LocationResolverService] Non-UUID ID detected, checking mock data: ${locationId}`);
        const mockLocation = mockLocations.find(loc => loc.id === locationId);
        
        if (mockLocation) {
          console.log(`[LocationResolverService] Found mock data for ID: ${locationId}`);
          baseLocation = JSON.parse(JSON.stringify(mockLocation)) as Location;
        } else {
          console.log(`[LocationResolverService] Mock location not found for ID: ${locationId}`);
        }
      } else {
        // Try to fetch by database UUID (for valid UUIDs)
        console.log(`[LocationResolverService] UUID format detected, trying database lookup: ${locationId}`);
        try {
          dbPlace = await databaseService.getCachedPlaceById(locationId);
          
          if (dbPlace) {
            console.log(`[LocationResolverService] Found DB entry by UUID: ${locationId}`);
            baseLocation = locationService.mapCachedPlaceToLocation(dbPlace);
          } else {
            // Try to fetch by Google place_id (fallback for legacy data)
            console.log(`[LocationResolverService] Trying database lookup by place_id: ${locationId}`);
            dbPlace = await databaseService.getPlaceById(locationId);
            
            if (dbPlace) {
              console.log(`[LocationResolverService] Found DB entry by place_id: ${locationId}`);
              baseLocation = locationService.mapCachedPlaceToLocation(dbPlace);
            } else {
              console.error(`[LocationResolverService] Location not found in database: ${locationId}`);
            }
          }
        } catch (dbError) {
          console.error(`[LocationResolverService] Database error for UUID ${locationId}:`, dbError);
        }
      }

      return { location: baseLocation, dbPlace };
    } catch (error) {
      console.error(`[LocationResolverService] Error resolving location for ID ${locationId}:`, error);
      return { location: null, dbPlace: null };
    }
  }
}

// Export singleton instance
export const locationResolverService = new LocationResolverService();
