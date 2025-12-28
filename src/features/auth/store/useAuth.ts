import { useAppStore } from '@/app/store';
import { useMemo, useState, useEffect } from 'react';

/**
 * Feature-specific hook for auth state
 * Provides memoized selectors and encapsulates auth logic
 */
export function useAuth() {
  // Add a mounted check to ensure we only access the store after hydration
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const store = useAppStore();

  // Memoized selectors for better performance
  const user = useAppStore((state) => state.user);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isLoading = useAppStore((state) => state.isLoading);
  const error = useAppStore((state) => state.error);

  // Computed values
  const userType = useMemo(() => store.getUserType(), [user]);
  const isRestaurantOwner = useMemo(() => store.isRestaurantOwner(), [user]);
  const isCustomer = useMemo(() => store.isCustomer(), [user]);

  // Derived state
  const hasProfile = useMemo(() => {
    if (!user) return false;
    return !!(user.profile.firstName && user.profile.lastName);
  }, [user]);

  const isProfileComplete = useMemo(() => {
    if (!user) return false;
    const { profile, preferences } = user;
    return !!(
      profile.firstName &&
      profile.lastName &&
      profile.phone &&
      preferences.dietaryRestrictions.length > 0
    );
  }, [user]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    setUser: store.setUser,
    setIsAuthenticated: store.setIsAuthenticated,
    setAuthLoading: store.setAuthLoading,
    setAuthError: store.setAuthError,

    // Computed values
    userType,
    isRestaurantOwner,
    isCustomer,
    hasProfile,
    isProfileComplete,
  };
}

/**
 * Selector hook for just user data
 */
export function useUser() {
  return useAppStore((state) => state.user);
}

/**
 * Selector hook for authentication status
 */
export function useAuthStatus() {
  return useAppStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  }));
}

/**
 * Selector hook for user type checks
 */
export function useUserRole() {
  const store = useAppStore();
  return useMemo(
    () => ({
      userType: store.getUserType(),
      isRestaurantOwner: store.isRestaurantOwner(),
      isCustomer: store.isCustomer(),
    }),
    [store.user]
  );
}
