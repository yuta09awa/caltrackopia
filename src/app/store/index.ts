import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { createAuthSlice, type AuthSlice } from '@/features/auth/store/authSlice';
import { createCartSlice, type CartSlice } from '@/features/cart/store/cartSlice';
import { createMapFiltersSlice, type MapFiltersSlice } from '@/features/map/store/mapFiltersSlice';
import { createUserPreferencesSlice, type UserPreferencesSlice } from './userPreferencesSlice';

export type AppStore = AuthSlice & CartSlice & MapFiltersSlice & UserPreferencesSlice;

export const useAppStore = create<AppStore>()(
  devtools(
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
          // Auth - persist user and authentication status
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          
          // Cart - persist items and totals (exclude loading/error states)
          items: state.items,
          total: state.total,
          itemCount: state.itemCount,
          activeLocationId: state.activeLocationId,
          conflictMode: state.conflictMode,
          
          // User preferences - persist everything
          userPreferences: state.userPreferences,
          
          // Map filters - NOT persisted (session-only)
        }),
      }
    ),
    {
      name: 'Caltrackopia Store',
      enabled: import.meta.env.DEV,
    }
  )
);
