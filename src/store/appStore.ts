
import { create } from 'zustand';

interface AppState {
  isAuthenticated: boolean;
  userPreferences: {
    darkMode: boolean;
  };
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  userPreferences: {
    darkMode: false,
  },
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  toggleDarkMode: () => 
    set((state) => ({
      userPreferences: {
        ...state.userPreferences,
        darkMode: !state.userPreferences.darkMode
      }
    })),
}));
