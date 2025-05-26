
import { Location } from "../types";
import { toast } from "sonner";

/**
 * Validates if a coordinate is a valid number
 */
export function isValidCoordinate(coordinate: number | null | undefined): coordinate is number {
  return typeof coordinate === 'number' && !isNaN(coordinate) && isFinite(coordinate);
}

/**
 * Validates if coordinates object is valid
 */
export function isValidCoordinates(coordinates: { lat: number; lng: number } | null | undefined): coordinates is { lat: number; lng: number } {
  if (!coordinates) return false;
  return isValidCoordinate(coordinates.lat) && isValidCoordinate(coordinates.lng);
}

/**
 * Provides default coordinates (San Francisco) when coordinates are invalid
 */
export function getDefaultCoordinates(): { lat: number; lng: number } {
  return { lat: 37.7749, lng: -122.4194 }; // San Francisco default
}

/**
 * Sanitizes location coordinates, providing defaults for invalid ones
 */
export function sanitizeLocationCoordinates(location: Location): Location {
  if (!isValidCoordinates(location.coordinates)) {
    console.warn(`Invalid coordinates for location ${location.name} (${location.id}). Using default coordinates.`);
    
    // Show toast notification for invalid coordinates in development
    if (process.env.NODE_ENV === 'development') {
      toast.warning(`Invalid coordinates detected for ${location.name}`, {
        description: "Using default coordinates instead"
      });
    }
    
    return {
      ...location,
      coordinates: getDefaultCoordinates()
    };
  }
  
  return location;
}

/**
 * Validates and sanitizes an array of locations
 */
export function validateAndSanitizeLocations(locations: Location[]): Location[] {
  const validLocations: Location[] = [];
  let invalidCount = 0;
  
  locations.forEach(location => {
    try {
      // Basic location validation
      if (!location.id || !location.name || !location.type) {
        console.warn(`Invalid location data: missing required fields`, location);
        invalidCount++;
        return;
      }
      
      // Sanitize coordinates
      const sanitizedLocation = sanitizeLocationCoordinates(location);
      validLocations.push(sanitizedLocation);
      
    } catch (error) {
      console.error(`Error processing location ${location?.id || 'unknown'}:`, error);
      invalidCount++;
    }
  });
  
  // Notify about invalid locations in development
  if (invalidCount > 0 && process.env.NODE_ENV === 'development') {
    toast.error(`${invalidCount} invalid location(s) filtered out`, {
      description: "Check console for details"
    });
  }
  
  return validLocations;
}

/**
 * Validates spoofed location coordinates
 */
export function validateSpoofedLocation(location: { lat: number; lng: number } | null): { lat: number; lng: number } | null {
  if (!location) return null;
  
  if (!isValidCoordinates(location)) {
    console.warn('Invalid spoofed location coordinates, falling back to default');
    toast.warning('Invalid location coordinates', {
      description: "Using default location instead"
    });
    return getDefaultCoordinates();
  }
  
  return location;
}

/**
 * Calculates distance between two coordinates with validation
 */
export function calculateValidatedDistance(
  lat1: number | undefined, 
  lng1: number | undefined, 
  lat2: number | undefined, 
  lng2: number | undefined
): number {
  // Validate all coordinates
  if (!isValidCoordinate(lat1) || !isValidCoordinate(lng1) || 
      !isValidCoordinate(lat2) || !isValidCoordinate(lng2)) {
    console.warn('Invalid coordinates for distance calculation');
    return 0; // Return 0 distance for invalid coordinates
  }
  
  // Haversine formula for calculating distance
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
