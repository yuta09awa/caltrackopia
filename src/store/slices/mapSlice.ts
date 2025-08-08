import { StateCreator } from 'zustand';
import { LatLng, MarkerData } from '@/features/map/types';

export interface MapState {
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId: string | null;
  hoveredLocationId: string | null;
}

export interface MapSlice {
  mapState: MapState;
  updateCenter: (center: LatLng) => void;
  updateZoom: (zoom: number) => void;
  updateMarkers: (markers: MarkerData[]) => void;
  selectLocation: (locationId: string | null) => void;
  hoverLocation: (locationId: string | null) => void;
  clearMarkers: () => void;
}

// Keep identical initial markers as previous implementation
const TEST_MARKERS: MarkerData[] = [
  {
    position: { lat: 40.7589, lng: -73.9851 }, // Times Square area
    locationId: 'loc-1'
  },
  {
    position: { lat: 40.7505, lng: -73.9934 }, // Herald Square area
    locationId: 'loc-2'
  }
];

const DEFAULT_CENTER: LatLng = { lat: 40.7589, lng: -73.9851 }; // NYC
const DEFAULT_ZOOM = 12;

export const createMapSlice: StateCreator<
  MapSlice,
  [],
  [],
  MapSlice
> = (set) => ({
  mapState: {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    markers: TEST_MARKERS,
    selectedLocationId: null,
    hoveredLocationId: null,
  },

  updateCenter: (center) => set((state) => ({
    mapState: { ...state.mapState, center }
  })),

  updateZoom: (zoom) => set((state) => ({
    mapState: { ...state.mapState, zoom }
  })),

  updateMarkers: (markers) => set((state) => ({
    mapState: { ...state.mapState, markers }
  })),

  selectLocation: (locationId) => set((state) => ({
    mapState: { ...state.mapState, selectedLocationId: locationId }
  })),

  hoverLocation: (locationId) => set((state) => ({
    mapState: { ...state.mapState, hoveredLocationId: locationId }
  })),

  clearMarkers: () => set((state) => ({
    mapState: { ...state.mapState, markers: [] }
  })),
});
