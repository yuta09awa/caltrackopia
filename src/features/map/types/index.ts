
import { LatLng } from '@react-google-maps/api';

export interface MarkerData {
  position: LatLng;
  locationId: string;
  type: string;
}

// Re-export AdvancedMarker from @react-google-maps/api
export { AdvancedMarker } from '@react-google-maps/api';
