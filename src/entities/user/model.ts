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

export type UserType = 'customer' | 'restaurant_owner' | 'admin';

export interface Restaurant {
  id: string;
  ownerId: string;
  businessName: string;
  businessLicense?: string;
  businessEmail?: string;
  businessPhone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cuisineType: string[];
  operatingHours?: Record<string, any>;
  description?: string;
  website?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  userType: UserType;
  profile: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatar?: string;
    phone?: string;
    dateOfBirth?: string;
  };
  preferences: UserPreferences;
  restaurant?: Restaurant;
  metadata: {
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    onboardingCompleted: boolean;
  };
}

export const createUser = (data: Partial<User>): User => ({
  id: data.id || '',
  email: data.email || '',
  emailVerified: data.emailVerified ?? false,
  userType: data.userType || 'customer',
  profile: data.profile || {},
  preferences: data.preferences || {
    darkMode: false,
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    location: null,
    dietaryRestrictions: [],
    nutritionGoals: [],
    privacy: {
      shareLocation: false,
      publicProfile: false,
    },
    favoriteLocations: [],
  },
  restaurant: data.restaurant,
  metadata: data.metadata || {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: undefined,
    onboardingCompleted: false,
  },
});
