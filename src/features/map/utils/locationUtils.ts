import { MarkerData } from '../types';
import { Location } from '@/models/Location';

/**
 * Converts an array of Location objects to MarkerData for map display
 * Filters out locations without valid coordinates
 */
export const convertLocationsToMarkers = (locations: Location[]): MarkerData[] => {
  return locations
    .filter(location => location.coordinates && 
      typeof location.coordinates.lat === 'number' && 
      typeof location.coordinates.lng === 'number')
    .map(location => ({
      id: location.id,
      position: {
        lat: location.coordinates!.lat,
        lng: location.coordinates!.lng
      }
    }));
};