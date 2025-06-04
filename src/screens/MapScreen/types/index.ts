
import { Ingredient } from '@/models/NutritionalInfo';
import { Location } from '@/features/locations/types';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';

export interface MapScreenCallbacks {
  onSelectIngredient: (ingredient: Ingredient) => Promise<void>;
  onSearchReset: () => void;
  onLocationSelect: (locationId: string) => void;
  onMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  onInfoCardClose: () => void;
  onViewDetails: (locationId: string) => void;
  onMapLoaded: (map: google.maps.Map) => Promise<void>;
  onMapIdle: (center: LatLng, zoom: number) => void;
}

export interface MapScreenState {
  displayedSearchQuery: string;
  mapHeight: string;
  selectedIngredient: Ingredient | null;
  currentSearchQuery: string;
  mapState: MapState;
  showInfoCard: boolean;
  selectedLocation: Location | null;
  infoCardPosition: { x: number; y: number };
  listRef: React.RefObject<HTMLDivElement>;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export interface MapScreenProps {
  headerProps: {
    displayedSearchQuery: string;
    onSelectIngredient: (ingredient: Ingredient) => Promise<void>;
    onSearchReset: () => void;
  };
  contentProps: {
    mapHeight: string;
    selectedIngredient: Ingredient | null;
    currentSearchQuery: string;
    mapState: MapState;
    showInfoCard: boolean;
    selectedLocation: Location | null;
    infoCardPosition: { x: number; y: number };
    onLocationSelect: (locationId: string) => void;
    onMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
    onMapLoaded: (map: google.maps.Map) => Promise<void>;
    onMapIdle: (center: LatLng, zoom: number) => void;
    onInfoCardClose: () => void;
    onViewDetails: (locationId: string) => void;
  };
  listProps: {
    listRef: React.RefObject<HTMLDivElement>;
    selectedLocationId: string | null;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  };
}
