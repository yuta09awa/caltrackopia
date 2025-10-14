
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

// Memoized selectors
export const selectMapFilters = (state: MapFiltersSlice) => state.mapFilters;
export const selectPriceRange = (state: MapFiltersSlice) => state.mapFilters.priceRange;
export const selectCuisine = (state: MapFiltersSlice) => state.mapFilters.cuisine;
export const selectGroceryCategory = (state: MapFiltersSlice) => state.mapFilters.groceryCategory;
export const selectSources = (state: MapFiltersSlice) => state.mapFilters.sources;
export const selectDietary = (state: MapFiltersSlice) => state.mapFilters.dietary;
export const selectNutrition = (state: MapFiltersSlice) => state.mapFilters.nutrition;
export const selectExcludeIngredients = (state: MapFiltersSlice) => state.mapFilters.excludeIngredients;
export const selectIncludeIngredients = (state: MapFiltersSlice) => state.mapFilters.includeIngredients;
export const selectHasActiveFilters = (state: MapFiltersSlice) => {
  const { mapFilters } = state;
  return (
    mapFilters.priceRange !== null ||
    mapFilters.cuisine !== 'all' ||
    mapFilters.groceryCategory !== 'all' ||
    mapFilters.sources.length > 0 ||
    mapFilters.dietary.length > 0 ||
    mapFilters.nutrition.length > 0 ||
    mapFilters.excludeIngredients.length > 0 ||
    mapFilters.includeIngredients.length > 0
  );
};
