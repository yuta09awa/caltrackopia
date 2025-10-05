export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserProfile extends User {
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  bio?: string;
  dietaryPreferences?: string[];
  allergies?: string[];
  nutritionGoals?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export const createUser = (data: Partial<User>): User => ({
  id: data.id || '',
  email: data.email || '',
  name: data.name,
  avatar: data.avatar,
  role: data.role,
  createdAt: data.createdAt || new Date(),
  updatedAt: data.updatedAt,
});
