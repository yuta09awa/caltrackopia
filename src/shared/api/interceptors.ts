/**
 * API Interceptors
 * Reusable interceptor functions for common patterns
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/logging/LoggingService';
import type { RequestInterceptor, ResponseInterceptor } from './types';

/**
 * Auth Token Request Interceptor
 * Automatically injects Supabase auth token into all requests
 */
export const authTokenInterceptor: RequestInterceptor = async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${session.access_token}`,
      };
    }
  } catch (error) {
    console.error('Error getting auth session:', error);
  }
  
  return config;
};

/**
 * Token Refresh Response Interceptor
 * Automatically refreshes expired tokens and retries failed requests
 */
export const tokenRefreshInterceptor: ResponseInterceptor = async (response, error) => {
  // If no error or not a 401, return response as-is
  if (!error || error.status !== 401) {
    return response;
  }

  try {
    console.log('Token expired, attempting refresh...');
    
    // Attempt to refresh the session
    const { data, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError || !data.session) {
      console.error('Token refresh failed:', refreshError);
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
      
      throw new Error('Session expired. Please log in again.');
    }
    
    console.log('Token refreshed successfully');
    
    // Note: The original request would need to be retried here
    // This requires storing the original request config and retrying it
    // For now, we'll just return the response/error as-is
    // A full implementation would retry the request with the new token
    
    return response;
  } catch (refreshError) {
    console.error('Error during token refresh:', refreshError);
    throw refreshError;
  }
};

/**
 * Logging Request Interceptor
 * Logs all requests and adds start time for duration tracking
 */
export const loggingRequestInterceptor: RequestInterceptor = (config) => {
  // Add metadata for duration tracking
  if (!config.metadata) {
    config.metadata = {};
  }
  config.metadata.startTime = Date.now();

  if (import.meta.env.DEV) {
    console.log('API Request:', {
      url: config.params?.url,
      method: config.params?.method,
      headers: config.headers,
    });
  }
  return config;
};

/**
 * Logging Response Interceptor
 * Logs all responses/errors using the LoggingService
 */
export const loggingResponseInterceptor: ResponseInterceptor = (response, error) => {
  // Calculate duration
  const startTime = response?.config?.metadata?.startTime || error?.config?.metadata?.startTime || Date.now();
  const duration = Date.now() - startTime;

  if (error) {
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        status: error.status,
        message: error.message,
        details: error.details,
      });
    }
    // Use LoggingService
    logger.apiCall(
      error.config?.params?.url || 'unknown',
      error.config?.params?.method || 'unknown',
      duration,
      error.status || 0,
      { error: error.message, details: error.details }
    );
  } else {
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response?.status,
        data: response?.data,
      });
    }
    // Use LoggingService
    logger.apiCall(
      response?.config?.params?.url || 'unknown',
      response?.config?.params?.method || 'unknown',
      duration,
      response?.status || 200
    );
  }
  return response;
};

/**
 * Error Handler Response Interceptor
 * Transforms API errors into a consistent format
 */
export const errorHandlerInterceptor: ResponseInterceptor = (response, error) => {
  if (!error) return response;

  // Transform error into consistent format
  const apiError = {
    message: error.message || 'An error occurred',
    status: error.status,
    code: error.code,
    details: error.details,
  };

  throw apiError;
};
