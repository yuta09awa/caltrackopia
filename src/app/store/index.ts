import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAuthSlice, type AuthSlice } from '@/features/auth/store/authSlice';
import { createCartSlice, type CartSlice } from '@/features/cart/store/cartSlice';
import { createMapFiltersSlice, type MapFiltersSlice } from '@/features/map/store/mapFiltersSlice';
import { createUserPreferencesSlice, type UserPreferencesSlice } from './userPreferencesSlice';

export type AppStore = AuthSlice & CartSlice & MapFiltersSlice & UserPreferencesSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createCartSlice(...args),
      ...createMapFiltersSlice(...args),
      ...createUserPreferencesSlice(...args),
    }),
    {
      name: 'caltrackopia-storage',
      partialize: (state) => ({
        // Only persist necessary data
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        items: state.items,
        total: state.total,
        userPreferences: state.userPreferences,
      }),
    }
  )
);
