// ============= SHARED MODULE CONSOLIDATED EXPORTS =============
// Central export point for all shared utilities and infrastructure

// API Client & Endpoints
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

// Shared Hooks
export * from './hooks';

// Shared Types
export * from './types';

// Utilities (from @/lib)
export * from './lib';

// Routing Components
export * from './routing/LazyComponents';
export * from './routing/LazyRoutes';
