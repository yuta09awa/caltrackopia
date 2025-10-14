// Profile feature public API

// API module
export * from './api';

// Components
export { default as ProfileInfo } from './components/ProfileInfo';
export { default as OrderHistory } from './components/OrderHistory';
export { default as PaymentMethods } from './components/PaymentMethods';
export { default as DietaryPreferences } from './components/DietaryPreferences';
export { default as NutritionGoals } from './components/NutritionGoals';

// Hooks
export { useProfileForm } from './components/hooks/useProfileForm';

// Services
export { profileService } from './services';
export type { ProfileUpdateData } from './services';
