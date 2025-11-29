import { StateCreator } from 'zustand';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  locale: string;
  currency: string;
  measurementUnit: 'metric' | 'imperial';
  region: string | null;
  notifications: boolean;
  location: {
    latitude: number | null;
    longitude: number | null;
  };
}

export interface UserPreferencesSlice {
  userPreferences: UserPreferences;
  setUserPreferences: (preferences: Partial<UserPreferences>) => void;
  setUserLocation: (latitude: number, longitude: number) => void;
}

const initialPreferences: UserPreferences = {
  theme: 'light',
  language: 'en',
  locale: 'en',
  currency: 'USD',
  measurementUnit: 'metric',
  region: null,
  notifications: true,
  location: {
    latitude: null,
    longitude: null,
  },
};

export const createUserPreferencesSlice: StateCreator<
  UserPreferencesSlice,
  [],
  [],
  UserPreferencesSlice
> = (set) => ({
  userPreferences: initialPreferences,
  
  setUserPreferences: (preferences) =>
    set((state) => ({
      userPreferences: {
        ...state.userPreferences,
        ...preferences,
      },
    })),
  
  setUserLocation: (latitude, longitude) =>
    set((state) => ({
      userPreferences: {
        ...state.userPreferences,
        location: { latitude, longitude },
      },
    })),
});

// Memoized selectors
export const selectUserPreferences = (state: UserPreferencesSlice) => state.userPreferences;
export const selectTheme = (state: UserPreferencesSlice) => state.userPreferences.theme;
export const selectLanguage = (state: UserPreferencesSlice) => state.userPreferences.language;
export const selectLocale = (state: UserPreferencesSlice) => state.userPreferences.locale;
export const selectCurrency = (state: UserPreferencesSlice) => state.userPreferences.currency;
export const selectMeasurementUnit = (state: UserPreferencesSlice) => state.userPreferences.measurementUnit;
export const selectRegion = (state: UserPreferencesSlice) => state.userPreferences.region;
export const selectNotifications = (state: UserPreferencesSlice) => state.userPreferences.notifications;
export const selectUserLocation = (state: UserPreferencesSlice) => state.userPreferences.location;
export const selectHasUserLocation = (state: UserPreferencesSlice) => 
  state.userPreferences.location.latitude !== null && 
  state.userPreferences.location.longitude !== null;
