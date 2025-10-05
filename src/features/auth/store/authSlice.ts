
import { StateCreator } from 'zustand';
import { User } from '@/models/User';

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
