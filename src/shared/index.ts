/**
 * Shared module exports
 * Public API for shared utilities, components, and services
 */

// API - Export specific items to avoid conflicts
export { apiClient } from './api/client';
export { API_ENDPOINTS } from './api/endpoints';
export type { ApiEndpoints } from './api/endpoints';
export { 
  authTokenInterceptor,
  tokenRefreshInterceptor,
  loggingRequestInterceptor,
  loggingResponseInterceptor,
  errorHandlerInterceptor
} from './api/interceptors';
export type {
  ApiRequestConfig,
  ApiResponse,
  ApiError,
  PaginationParams,
  PaginatedResponse,
  SearchParams,
  RequestInterceptor,
  ResponseInterceptor,
  InterceptorCleanup
} from './api/types';

// Hooks
export * from './hooks';

// Utils
export * from './lib';
