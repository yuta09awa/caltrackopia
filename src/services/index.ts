// ============= UNIFIED SERVICE ARCHITECTURE =============

// Base Service Architecture
export { ServiceBase } from './base/ServiceBase';
export type { 
  ServiceState, 
  ApiQuotaInfo 
} from './base/ServiceBase';
export type { 
  IService, 
  IEnhancedService, 
  ICachingService, 
  IQuotaAwareService 
} from './base/ServiceInterface';

// Unified Service Management
export { UnifiedServiceManager, serviceManager } from './core/UnifiedServiceManager';

// Primary API Service
export { ApiService, apiService } from './api/apiService';
export type { ApiMethod, ApiRequestOptions } from './api/apiService';

// Data Services - Primary interfaces
export { createDataService, dataService } from './serviceFactory';
export type { IDataService } from './serviceFactory';

// Authentication Service
export { AuthService } from './authService';

// Profile Services
export { 
  profileService
} from './profile';
export type { ProfileUpdateData } from './profile';

// Database Services
export { DatabaseService } from './databaseService';
export { MockDataService, mockDataService } from './mockDataService';

// Location Services
export { locationService } from './locationService';
export { hybridLocationService } from './hybridLocationService';
export { locationResolverService } from './locationResolverService';

// Nutrition Services
export { nutritionService } from './nutritionService';
export { enhancedNutritionService } from './enhancedNutritionService';

// Caching Services
export { browserCachingService } from './browserCachingService';
export { enhancedCachingService } from './enhancedCachingService';

// Data Processing Services
export { standardizedDataService } from './standardizedDataService';
export { customDataService } from './customDataService';
export { enhancedDatabaseService } from './enhancedDatabaseService';

// Error Classes
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

// Type Exports
export type {
  EnhancedPlace,
  Ingredient,
  MenuItem,
  DietaryRestriction,
  PlaceIngredient
} from './databaseService';