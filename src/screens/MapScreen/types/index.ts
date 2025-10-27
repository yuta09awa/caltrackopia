
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

export interface HeaderProps {
  displayedSearchQuery: string;
  onSelectIngredient: (ingredient: Ingredient) => Promise<void>;
  onSearchReset: () => void;
}

export interface ContentProps {
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
}

export interface ListProps {
  listRef: React.RefObject<HTMLDivElement>;
  selectedLocationId: string | null;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export interface MapScreenProps {
  headerProps: HeaderProps;
  contentProps: ContentProps;
  listProps: ListProps;
}

export interface MapScreenLayoutProps {
  displayedSearchQuery: string;
  navHeight: number;
  mapState: MapState;
  infoCardVisible: boolean;
  infoCardPosition: { x: number; y: number } | null;
  selectedLocation: Location | null;
  selectedLocationId: string | null;
  displayLocations: Location[];
  listRef: React.RefObject<HTMLDivElement>;
  onSelectIngredient: (ingredient: Ingredient) => void;
  onSearchReset: () => void;
  onLocationSelect: (locationId: string | null) => void;
  onMarkerClick: (locationId: string, position: { x: number; y: number }) => void;
  onMapLoaded: (map: google.maps.Map) => void;
  onMapIdle: (center: { lat: number; lng: number }, zoom: number) => void;
  onInfoCardClose: () => void;
  onViewDetails: (locationId: string) => void;
  onScroll: () => void;
}
