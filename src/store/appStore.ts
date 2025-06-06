
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  UserPreferencesSlice, 
  createUserPreferencesSlice 
} from './slices/userPreferencesSlice';
import { 
  MapFiltersSlice, 
  createMapFiltersSlice 
} from './slices/mapFiltersSlice';
import { 
  AuthSlice, 
  createAuthSlice 
} from './slices/authSlice';
import {
  CartSlice,
  createCartSlice
} from './slices/cartSlice';

// Combine all slices
export type AppState = 
  AuthSlice & 
  UserPreferencesSlice & 
  MapFiltersSlice &
  CartSlice;

// Create the combined store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createUserPreferencesSlice(...a),
      ...createMapFiltersSlice(...a),
      ...createCartSlice(...a),
    }),
    {
      name: 'caltrackopia-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persist cart items
        items: state.items,
        activeLocationId: state.activeLocationId,
        conflictMode: state.conflictMode,
        total: state.total,
        itemCount: state.itemCount,
        groupedByLocation: state.groupedByLocation,
        // Persist user authentication and preferences
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        userPreferences: state.userPreferences,
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return persistedState;
        }
        return persistedState;
      }
    }
  )
);
