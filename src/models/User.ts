
export interface UserPreferences {
  darkMode: boolean;
  notifications: boolean;
  location: {
    lat: number;
    lng: number;
  } | null;
  dietaryRestrictions: string[];
  favoriteLocations: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}
