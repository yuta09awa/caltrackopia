
export interface MapFilters {
  cuisine: string | null;
  category: string | null;
  nutrition: string[];
  dietary: string[];
  sources: string[];
  includeIngredients: string[];
  excludeIngredients: string[];
}

export interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  markers: MarkerData[];
}

export interface MarkerData {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  isSelected?: boolean;
}
