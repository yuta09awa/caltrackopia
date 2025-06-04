
export interface UserPreferences {
  darkMode: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  dietaryRestrictions: string[];
  nutritionGoals: string[];
  privacy: {
    shareLocation: boolean;
    publicProfile: boolean;
  };
  favoriteLocations: string[];
}

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  profile: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatar?: string;
    phone?: string;
    dateOfBirth?: string;
  };
  preferences: UserPreferences;
  metadata: {
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    onboardingCompleted: boolean;
  };
}
