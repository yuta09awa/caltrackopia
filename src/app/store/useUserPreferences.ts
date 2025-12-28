import { useAppStore } from './index';
import { useMemo } from 'react';

/**
 * Feature-specific hook for user preferences
 * Provides memoized selectors and encapsulates preferences logic
 */
export function useUserPreferences() {
  const store = useAppStore();

  // Memoized selectors
  const userPreferences = useAppStore((state) => state.userPreferences);

  // Individual preference selectors
  const theme = useMemo(() => userPreferences.theme, [userPreferences.theme]);
  const language = useMemo(() => userPreferences.language, [userPreferences.language]);
  const notifications = useMemo(() => userPreferences.notifications, [userPreferences.notifications]);
  const location = useMemo(() => userPreferences.location, [userPreferences.location]);

  // Computed values
  const hasLocation = useMemo(
    () => location.latitude !== null && location.longitude !== null,
    [location.latitude, location.longitude]
  );

  const isDarkMode = useMemo(
    () => theme === 'dark',
    [theme]
  );

  const isLightMode = useMemo(
    () => theme === 'light',
    [theme]
  );

  const isSystemTheme = useMemo(
    () => theme === 'system',
    [theme]
  );

  // Helper functions
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    store.setUserPreferences({ theme: newTheme });
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    store.setUserPreferences({ theme });
  };

  const toggleNotifications = () => {
    store.setUserPreferences({ notifications: !notifications });
  };

  const setLanguage = (language: string) => {
    store.setUserPreferences({ language });
  };

  const clearLocation = () => {
    store.setUserLocation(null as any, null as any);
  };

  return {
    // State
    userPreferences,
    theme,
    language,
    notifications,
    location,

    // Actions
    setUserPreferences: store.setUserPreferences,
    setUserLocation: store.setUserLocation,
    toggleTheme,
    setTheme,
    toggleNotifications,
    setLanguage,
    clearLocation,

    // Computed values
    hasLocation,
    isDarkMode,
    isLightMode,
    isSystemTheme,
  };
}

/**
 * Selector hook for just theme preference from store
 * Note: For theme context, use useTheme from @/providers/ThemeProvider instead
 */
export function useThemePreference() {
  return useAppStore((state) => state.userPreferences.theme);
}

/**
 * Selector hook for user location
 */
export function useUserLocation() {
  return useAppStore((state) => state.userPreferences.location);
}

/**
 * Selector hook for notification preferences
 */
export function useNotificationPreferences() {
  return useAppStore((state) => state.userPreferences.notifications);
}
