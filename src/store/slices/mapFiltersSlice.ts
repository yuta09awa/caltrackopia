
import { StateCreator } from 'zustand';

export interface MapFilters {
  priceRange: string | null;
  cuisine: string;
  groceryCategory: string;
  sources: string[];
  dietary: string[];
  nutrition: string[];
  excludeIngredients: string[];
  includeIngredients: string[]; // New field for explicit ingredient inclusion
}

export interface MapFiltersSlice {
  mapFilters: MapFilters;
  updateMapFilters: (filters: Partial<MapFilters>) => void;
}

export const createMapFiltersSlice: StateCreator<
  MapFiltersSlice, 
  [], 
  [],
  MapFiltersSlice
> = (set) => ({
  mapFilters: {
    priceRange: null,
    cuisine: 'all',
    groceryCategory: 'all',
    sources: [],
    dietary: [],
    nutrition: [],
    excludeIngredients: [],
    includeIngredients: [], // Initialize new field
  },
  updateMapFilters: (filters) => set((state) => ({
    mapFilters: {
      ...state.mapFilters,
      ...filters,
    }
  })),
});
