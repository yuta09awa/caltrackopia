import { StateCreator } from 'zustand';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
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
