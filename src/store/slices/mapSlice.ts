
import { StateCreator } from 'zustand';
import { Ingredient } from '@/models/NutritionalInfo';
import { Location } from '@/features/locations/types';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerData {
  position: LatLng;
  locationId: string;
  type: string;
}

export interface MapState {
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
  selectedLocationId: string | null;
  hoveredLocationId: string | null;
}

export interface MapSlice {
  // Map state
  mapState: MapState;
  userLocation: LatLng | null;
  
  // Search state
  selectedIngredient: Ingredient | null;
  currentSearchQuery: string;
  displayedSearchQuery: string;
  
  // UI state
  showInfoCard: boolean;
  selectedLocation: Location | null;
  infoCardPosition: { x: number; y: number };
  
  // Actions
  updateCenter: (center: LatLng) => void;
  updateZoom: (zoom: number) => void;
  updateMarkers: (markers: MarkerData[]) => void;
  selectLocation: (id: string | null) => void;
  setUserLocation: (location: LatLng | null) => void;
  setSelectedIngredient: (ingredient: Ingredient | null) => void;
  setSearchQuery: (query: string) => void;
  setDisplayedSearchQuery: (query: string) => void;
  setShowInfoCard: (show: boolean) => void;
  setSelectedLocationData: (location: Location | null) => void;
  setInfoCardPosition: (position: { x: number; y: number }) => void;
  clearMarkers: () => void;
  resetMapState: () => void;
}

const initialMapState: MapState = {
  center: { lat: 40.7589, lng: -73.9851 }, // NYC coordinates
  zoom: 12,
  markers: [],
  selectedLocationId: null,
  hoveredLocationId: null
};

export const createMapSlice: StateCreator<
  MapSlice,
  [],
  [],
  MapSlice
> = (set, get) => ({
  // Initial state
  mapState: initialMapState,
  userLocation: null,
  selectedIngredient: null,
  currentSearchQuery: '',
  displayedSearchQuery: '',
  showInfoCard: false,
  selectedLocation: null,
  infoCardPosition: { x: 0, y: 0 },

  // Actions
  updateCenter: (center) => set((state) => ({
    mapState: { ...state.mapState, center }
  })),

  updateZoom: (zoom) => set((state) => ({
    mapState: { ...state.mapState, zoom }
  })),

  updateMarkers: (markers) => set((state) => ({
    mapState: { ...state.mapState, markers }
  })),

  selectLocation: (id) => set((state) => ({
    mapState: { ...state.mapState, selectedLocationId: id }
  })),

  setUserLocation: (userLocation) => set({ userLocation }),

  setSelectedIngredient: (selectedIngredient) => set({ selectedIngredient }),

  setSearchQuery: (currentSearchQuery) => set({ currentSearchQuery }),

  setDisplayedSearchQuery: (displayedSearchQuery) => set({ displayedSearchQuery }),

  setShowInfoCard: (showInfoCard) => set({ showInfoCard }),

  setSelectedLocationData: (selectedLocation) => set({ selectedLocation }),

  setInfoCardPosition: (infoCardPosition) => set({ infoCardPosition }),

  clearMarkers: () => set((state) => ({
    mapState: { ...state.mapState, markers: [] }
  })),

  resetMapState: () => set({
    mapState: initialMapState,
    selectedIngredient: null,
    currentSearchQuery: '',
    displayedSearchQuery: '',
    showInfoCard: false,
    selectedLocation: null,
    infoCardPosition: { x: 0, y: 0 }
  })
});
