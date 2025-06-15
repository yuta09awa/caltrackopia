
import React, { createContext, useContext, ReactNode } from 'react';
import { Ingredient } from '@/models/NutritionalInfo';
import { Location } from '@/features/locations/types';
import { MapState, LatLng } from '@/store/slices/mapSlice';

// Simplified context interfaces
export interface MapContextState {
  // Map state
  mapState: MapState;
  mapRef: React.RefObject<google.maps.Map | null>;
  
  // Search state
  selectedIngredient: Ingredient | null;
  currentSearchQuery: string;
  displayedSearchQuery: string;
  
  // UI state
  showInfoCard: boolean;
  selectedLocation: Location | null;
  infoCardPosition: { x: number; y: number };
  
  // Data
  userLocation: LatLng | null;
  locations: Location[];
}

export interface MapContextActions {
  // Map actions
  updateCenter: (center: LatLng) => void;
  updateZoom: (zoom: number) => void;
  updateMarkers: (markers: any[]) => void;
  selectLocation: (id: string | null) => void;
  clearMarkers: () => void;
  
  // Search actions
  handleSelectIngredient: (ingredient: Ingredient) => Promise<void>;
  handleSearchReset: () => void;
  
  // UI actions
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  handleLocationSelect: (locationId: string) => void;
  handleMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  handleInfoCardClose: () => void;
  handleViewDetails: (locationId: string) => void;
  handleMapLoaded: (map: google.maps.Map) => void;
  handleMapIdle: (center: LatLng, zoom: number) => void;
}

export type MapContextValue = MapContextState & MapContextActions;

const MapContext = createContext<MapContextValue | null>(null);

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};

interface MapProviderProps {
  children: ReactNode;
  value: MapContextValue;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children, value }) => {
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
