/**
 * Shared API Types
 * Common types used across all API modules
 */

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  signal?: AbortSignal;
  metadata?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config?: ApiRequestConfig;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  config?: ApiRequestConfig;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SearchParams extends PaginationParams {
  query: string;
  filters?: Record<string, any>;
}

// Request Interceptor Type
export type RequestInterceptor = (
  config: ApiRequestConfig
) => Promise<ApiRequestConfig> | ApiRequestConfig;

// Response Interceptor Type
export type ResponseInterceptor = (
  response: any,
  error?: ApiError
) => Promise<any> | any;

// Cleanup function returned by interceptor registration
export type InterceptorCleanup = () => void;
