
import { create } from 'zustand';

interface UserPreferences {
  darkMode: boolean;
}

interface MapFilters {
  priceRange: string | null;
  cuisine: string;
  dietaryPreferences: string[];
  excludeIngredients: string[];
}

interface AppState {
  isAuthenticated: boolean;
  userPreferences: UserPreferences;
  mapFilters: MapFilters;
  
  // Actions
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  toggleDarkMode: () => void;
  updateMapFilters: (filters: Partial<MapFilters>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  userPreferences: {
    darkMode: false,
  },
  mapFilters: {
    priceRange: null,
    cuisine: 'all',
    dietaryPreferences: [],
    excludeIngredients: [],
  },
  
  // Actions
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  toggleDarkMode: () => 
    set((state) => ({
      userPreferences: {
        ...state.userPreferences,
        darkMode: !state.userPreferences.darkMode
      }
    })),
  updateMapFilters: (filters) =>
    set((state) => ({
      mapFilters: {
        ...state.mapFilters,
        ...filters,
      }
    })),
}));
