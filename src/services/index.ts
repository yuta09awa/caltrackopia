
// Export the service factory and types
export { createDataService, dataService } from './serviceFactory';
export type { IDataService } from './serviceFactory';

// Export individual services for direct use when needed
export { DatabaseService } from './databaseService';
export { MockDataService, mockDataService } from './mockDataService';

// Export all interfaces
export type {
  EnhancedPlace,
  Ingredient,
  MenuItem,
  DietaryRestriction,
  PlaceIngredient
} from './databaseService';

// Export error classes
export {
  DatabaseError,
  NetworkError,
  ApiError,
  ValidationError,
  isDatabaseError,
  isNetworkError,
  isApiError,
  isValidationError,
  getUserFriendlyErrorMessage
} from './errors/DatabaseError';
