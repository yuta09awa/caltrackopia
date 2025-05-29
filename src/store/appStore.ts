
import { create } from 'zustand';
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

// Create the combined store
export const useAppStore = create<AppState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createUserPreferencesSlice(...a),
  ...createMapFiltersSlice(...a),
  ...createCartSlice(...a),
}));
