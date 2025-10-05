// Profile feature public API
export { default as ProfileInfo } from './components/ProfileInfo';
export { default as OrderHistory } from './components/OrderHistory';
export { default as PaymentMethods } from './components/PaymentMethods';
export { default as DietaryPreferences } from './components/DietaryPreferences';
export { default as NutritionGoals } from './components/NutritionGoals';

export { useProfileForm } from './components/hooks/useProfileForm';
export { profileService } from './services';
export type { ProfileUpdateData } from './services';
