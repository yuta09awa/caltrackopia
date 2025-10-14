
import { toast } from "sonner";
import { httpClient } from "@/utils/http_client/http_client_factory";
import { ServiceBase } from "../base/ServiceBase";
import { IEnhancedService } from "../base/ServiceInterface";
import type { 
  RequestInterceptor, 
  ResponseInterceptor, 
  InterceptorCleanup,
  ApiRequestConfig 
} from "@/shared/api/types";

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequestOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: any;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  params?: Record<string, any>;
}

export class ApiService extends ServiceBase implements IEnhancedService {
  private baseUrl: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(baseUrl: string = '') {
    super();
    this.baseUrl = baseUrl;
  }

  /**
   * Register a request interceptor
   * Returns a cleanup function to remove the interceptor
   */
  useRequestInterceptor(interceptor: RequestInterceptor): InterceptorCleanup {
    this.requestInterceptors.push(interceptor);
    
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.requestInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Register a response interceptor
   * Returns a cleanup function to remove the interceptor
   */
  useResponseInterceptor(interceptor: ResponseInterceptor): InterceptorCleanup {
    this.responseInterceptors.push(interceptor);
    
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.responseInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Apply all request interceptors
   */
  private async applyRequestInterceptors(config: ApiRequestConfig): Promise<ApiRequestConfig> {
    let modifiedConfig = config;
    
    for (const interceptor of this.requestInterceptors) {
      try {
        modifiedConfig = await interceptor(modifiedConfig);
      } catch (error) {
        console.error('Request interceptor error:', error);
      }
    }
    
    return modifiedConfig;
  }

  /**
   * Apply all response interceptors
   */
  private async applyResponseInterceptors(response: any, error?: any): Promise<any> {
    let modifiedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      try {
        modifiedResponse = await interceptor(modifiedResponse, error);
      } catch (interceptorError) {
        console.error('Response interceptor error:', interceptorError);
        throw interceptorError;
      }
    }
    
    return modifiedResponse;
  }

  getName(): string {
    return 'ApiService';
  }

  getVersion(): string {
    return '2.0.0';
  }

  /**
   * Base method for making API requests
   */
  async request<T>(
    endpoint: string, 
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      showErrorToast = true,
      showSuccessToast = false,
      successMessage = 'Operation completed successfully',
      params
    } = options;
    
    const url = this.getFullUrl(endpoint);

    return this.executeWithStateManagement(async () => {
      try {
        // Apply request interceptors
        const interceptedConfig = await this.applyRequestInterceptors({
          headers,
          params,
        });

        let response: T;
        
        switch (method) {
          case 'GET':
            response = await httpClient.get<T>(url, interceptedConfig.headers);
            break;
          case 'POST':
            response = await httpClient.post<T>(url, body, interceptedConfig.headers);
            break;
          case 'PUT':
            response = await httpClient.put<T>(url, body, interceptedConfig.headers);
            break;
          case 'DELETE':
            response = await httpClient.delete<T>(url, interceptedConfig.headers);
            break;
          default:
            response = await httpClient.request<T>(url, {
              method,
              headers: interceptedConfig.headers,
              body
            });
        }

        // Apply response interceptors (success case)
        const interceptedResponse = await this.applyResponseInterceptors(response);

        // Increment API quota usage
        this.incrementQuotaUsage(1);

        if (showSuccessToast) {
          this.showSuccessToast(successMessage);
        }
        
        return interceptedResponse;
      } catch (error: any) {
        // Apply response interceptors (error case)
        try {
          await this.applyResponseInterceptors(null, {
            message: error.message || 'Request failed',
            status: error.status,
            code: error.code,
            details: error,
          });
        } catch (interceptorError) {
          // If interceptor throws, use that error
          throw interceptorError;
        }
        
        // Re-throw original error if interceptors didn't handle it
        throw error;
      }
    }, `API ${method} request to ${endpoint}`);
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET'
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE'
    });
  }

  /**
   * Get the full URL for the request
   */
  private getFullUrl(endpoint: string): string {
    // Remove trailing slash from baseUrl
    const base = this.baseUrl.endsWith('/') 
      ? this.baseUrl.slice(0, -1) 
      : this.baseUrl;
    
    // Remove leading slash from endpoint
    const path = endpoint.startsWith('/') 
      ? endpoint.slice(1) 
      : endpoint;
    
    return `${base}/${path}`;
  }
}

// Export a singleton instance for general use
export const apiService = new ApiService();
