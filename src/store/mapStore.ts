
import { create } from 'zustand';

// Define our own LatLng interface since @react-google-maps/api doesn't export it directly
export interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerData {
  position: LatLng;
  locationId: string;
  type: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  open_now?: boolean;
  photo_url?: string;
}

export interface MapFilters {
  priceRange: string | null;
  cuisine: string;
  category: string;
  openNow: boolean;
  dietary: string[];
  nutrition: string[];
  sources: string[];
}

interface MapState {
  // Map core state
  center: LatLng;
  zoom: number;
  markers: MarkerData[];
  selectedPlace: Place | null;
  hoveredLocationId: string | null;
  
  // API and loading state
  apiKey: string | null;
  isLoaded: boolean;
  loadError: string | null;
  isSearching: boolean;
  
  // Search and filters
  searchQuery: string;
  filters: MapFilters;
  searchResults: Place[];
  
  // UI state
  showInfoCard: boolean;
  infoCardPosition: { x: number; y: number };
  
  // Actions
  setCenter: (center: LatLng) => void;
  setZoom: (zoom: number) => void;
  setMarkers: (markers: MarkerData[]) => void;
  setSelectedPlace: (place: Place | null) => void;
  setHoveredLocationId: (id: string | null) => void;
  setApiKey: (key: string | null) => void;
  setIsLoaded: (loaded: boolean) => void;
  setLoadError: (error: string | null) => void;
  setIsSearching: (searching: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<MapFilters>) => void;
  setSearchResults: (results: Place[]) => void;
  setShowInfoCard: (show: boolean) => void;
  setInfoCardPosition: (position: { x: number; y: number }) => void;
  
  // Complex actions
  handleMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  handleMapClick: () => void;
  resetSearch: () => void;
}

const defaultFilters: MapFilters = {
  priceRange: null,
  cuisine: 'all',
  category: 'all',
  openNow: false,
  dietary: [],
  nutrition: [],
  sources: [],
};

export const useMapStore = create<MapState>((set, get) => ({
  // Initial state
  center: { lat: 37.7749, lng: -122.4194 }, // San Francisco default
  zoom: 12,
  markers: [],
  selectedPlace: null,
  hoveredLocationId: null,
  
  apiKey: null,
  isLoaded: false,
  loadError: null,
  isSearching: false,
  
  searchQuery: '',
  filters: defaultFilters,
  searchResults: [],
  
  showInfoCard: false,
  infoCardPosition: { x: 0, y: 0 },
  
  // Basic setters
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setMarkers: (markers) => set({ markers }),
  setSelectedPlace: (place) => set({ 
    selectedPlace: place,
    showInfoCard: !!place 
  }),
  setHoveredLocationId: (id) => set({ hoveredLocationId: id }),
  setApiKey: (key) => set({ apiKey: key }),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  setLoadError: (error) => set({ loadError: error }),
  setIsSearching: (searching) => set({ isSearching: searching }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  setSearchResults: (results) => set({ searchResults: results }),
  setShowInfoCard: (show) => set({ showInfoCard: show }),
  setInfoCardPosition: (position) => set({ infoCardPosition: position }),
  
  // Complex actions
  handleMarkerClick: (locationId, position) => {
    console.log('🎯 Marker clicked:', locationId, position);
    const state = get();
    const place = state.searchResults.find(p => p.id === locationId);
    if (place) {
      console.log('✅ Found place for marker:', place.name);
      set({
        selectedPlace: place,
        showInfoCard: true,
        infoCardPosition: position
      });
    } else {
      console.warn('⚠️ No place found for locationId:', locationId);
    }
  },
  
  handleMapClick: () => {
    console.log('🗺️ Map clicked - clearing selection');
    set({
      selectedPlace: null,
      showInfoCard: false
    });
  },
  
  resetSearch: () => {
    console.log('🔄 Resetting search');
    set({
      searchQuery: '',
      searchResults: [],
      markers: [],
      selectedPlace: null,
      showInfoCard: false,
      filters: defaultFilters
    });
  }
}));
