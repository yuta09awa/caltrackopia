
import { StateCreator } from 'zustand';
import { User } from '@/entities/user';

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAuthLoading: (isLoading: boolean) => void;
  setAuthError: (error: string | null) => void;
  getUserType: () => 'customer' | 'restaurant_owner' | 'admin' | null;
  isRestaurantOwner: () => boolean;
  isCustomer: () => boolean;
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [],
  [],
  AuthSlice
> = (set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setAuthLoading: (isLoading) => set({ isLoading }),
  setAuthError: (error) => set({ error }),
  getUserType: () => {
    const { user } = get();
    return user?.userType || null;
  },
  isRestaurantOwner: () => {
    const { user } = get();
    return user?.userType === 'restaurant_owner';
  },
  isCustomer: () => {
    const { user } = get();
    return user?.userType === 'customer';
  },
});

// Memoized selectors
export const selectUser = (state: AuthSlice) => state.user;
export const selectIsAuthenticated = (state: AuthSlice) => state.isAuthenticated;
export const selectAuthLoading = (state: AuthSlice) => state.isLoading;
export const selectAuthError = (state: AuthSlice) => state.error;
export const selectUserType = (state: AuthSlice) => state.getUserType();
export const selectIsRestaurantOwner = (state: AuthSlice) => state.isRestaurantOwner();
export const selectIsCustomer = (state: AuthSlice) => state.isCustomer();
