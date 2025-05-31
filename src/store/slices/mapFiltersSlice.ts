
import { StateCreator } from 'zustand';

export interface MapFilters {
  priceRange: [number, number] | null;
  cuisine: string;
  groceryCategory: string;
  sources: string[];
  dietary: string[];
  nutrition: string[];
  excludeIngredients: string[];
  includeIngredients: string[];
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
    includeIngredients: [],
  },
  updateMapFilters: (filters) => set((state) => ({
    mapFilters: {
      ...state.mapFilters,
      ...filters,
    }
  })),
});
