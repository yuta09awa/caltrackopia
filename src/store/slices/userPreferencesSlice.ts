
import { StateCreator } from 'zustand';

export interface UserPreferences {
  darkMode: boolean;
}

export interface UserPreferencesSlice {
  userPreferences: UserPreferences;
  toggleDarkMode: () => void;
}

export const createUserPreferencesSlice: StateCreator<
  UserPreferencesSlice,
  [],
  [],
  UserPreferencesSlice
> = (set) => ({
  userPreferences: {
    darkMode: false,
  },
  toggleDarkMode: () => set((state) => ({
    userPreferences: {
      ...state.userPreferences,
      darkMode: !state.userPreferences.darkMode,
    },
  })),
});
