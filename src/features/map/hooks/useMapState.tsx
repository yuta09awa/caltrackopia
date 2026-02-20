
// Type-only re-exports for backward compatibility
// Consumers should migrate to importing from '@/features/map/types' directly
export type { LatLng, MarkerData } from '../types';

export interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  markers: { id: string; position: { lat: number; lng: number } }[];
  selectedLocationId: string | null;
  hoveredLocationId: string | null;
}
