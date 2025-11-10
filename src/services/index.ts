// ============= UNIFIED SERVICE ARCHITECTURE =============

// Base Service Architecture
export { ServiceBase } from './base/ServiceBase';
export { StandardServiceBase, StandardHttpService } from './core/StandardServiceBase';
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

// ============= NEW UNIFIED SERVICES (Recommended) =============

// Data Access Layer - Single source for all data operations
export { DataAccessLayer, dataAccess } from './data/DataAccessLayer';

// Location Service - Single source for location operations
export { LocationService, location } from './location/LocationService';

// ============= UNIFIED SERVICE REGISTRY =============
/**
 * Centralized service registry - Use this as the primary way to access services
 * 
 * @example
 * ```typescript
 * import { services } from '@/services';
 * 
 * // Data operations
 * const places = await services.data.searchPlaces('pizza');
 * 
 * // Location operations
 * const userLocation = await services.location.getCurrentLocation();
 * 
 * // Service health check
 * const health = services.manager.getServiceHealth();
 * ```
 */
import { dataAccess } from './data/DataAccessLayer';
import { location } from './location/LocationService';
import { apiService } from './api/apiService';
import { serviceManager } from './core/UnifiedServiceManager';

// Register all services with the manager
serviceManager.registerService('data', dataAccess);
serviceManager.registerService('location', location);
serviceManager.registerService('api', apiService);

export const services = {
  data: dataAccess,
  location,
  api: apiService,
  manager: serviceManager,
  // More services will be added here as we consolidate
} as const;

// Primary API Service (now enhanced with interceptors)
export { ApiService, apiService } from './api/apiService';
export type { ApiMethod, ApiRequestOptions } from './api/apiService';

// Re-export centralized API client
export { apiClient } from '@/shared/api/client';
export { API_ENDPOINTS } from '@/shared/api/endpoints';

// ============= LEGACY SERVICES (Deprecated) =============
/**
 * @deprecated These services are being consolidated into the unified architecture above.
 * Please migrate to use the new `services` object or individual service imports.
 * See docs/migrations/service-layer-migration.md for migration guide.
 */

// Data Services - Primary interfaces
/**
 * @deprecated Use `dataAccess` or `services.data` instead
 * @see DataAccessLayer
 */
export { createDataService, dataService } from './serviceFactory';
export type { IDataService } from './serviceFactory';

// Authentication Service
export { AuthService } from '@/features/auth/services/authService';

// Profile Services
export { 
  profileService
} from '@/features/profile/services';
export type { ProfileUpdateData } from '@/features/profile/services';

// Database Services
/**
 * @deprecated Use `dataAccess` or `services.data` instead
 * @see DataAccessLayer
 */
export { DatabaseService } from './databaseService';
/**
 * @deprecated Mock data is now handled internally by DataAccessLayer
 * @see DataAccessLayer
 */
export { MockDataService, mockDataService } from './mockDataService';

// Location Services
/**
 * @deprecated Use `location` or `services.location` instead
 * @see LocationService
 */
export { locationService } from './locationService';
/**
 * @deprecated Use `location` or `services.location` instead
 * @see LocationService
 */
export { hybridLocationService } from './hybridLocationService';
/**
 * @deprecated Use `location` or `services.location` instead
 * @see LocationService
 */
export { locationResolverService } from './locationResolverService';

// Nutrition Services
export { nutritionService } from './nutritionService';
export { enhancedNutritionService } from './enhancedNutritionService';

// Caching Services
export { browserCachingService } from './browserCachingService';
export { enhancedCachingService } from './enhancedCachingService';

// Data Processing Services
/**
 * @deprecated Use `dataAccess` or `services.data` instead
 * @see DataAccessLayer
 */
export { standardizedDataService } from './standardizedDataService';
/**
 * @deprecated Use `dataAccess` or `services.data` instead
 * @see DataAccessLayer
 */
export { customDataService } from './customDataService';
/**
 * @deprecated Use `dataAccess` or `services.data` instead - enhanced features are now built-in
 * @see DataAccessLayer
 */
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

// Phase 8: Production Services
export { LoggingService, logger } from './logging/LoggingService';
export type { LogLevel, LogEntry } from './logging/LoggingService';

export { SecurityService, security } from './security/SecurityService';

export { PWAService, pwa } from './pwa/PWAService';

export { AccessibilityService, accessibility, useAccessibility } from './accessibility/AccessibilityService';

// Type Exports
export type {
  EnhancedPlace,
  Ingredient,
  MenuItem,
  DietaryRestriction,
  PlaceIngredient
} from './databaseService';