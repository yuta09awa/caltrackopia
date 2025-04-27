
import { toast } from "sonner";
import { httpClient } from "@/utils/http_client/http_client_factory";

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequestOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: any;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
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
      headers,
      body,
      showErrorToast = true,
      showSuccessToast = false,
      successMessage = 'Operation completed successfully'
    } = options;
    
    const url = this.getFullUrl(endpoint);

    try {
      let response: T;
      
      switch (method) {
        case 'GET':
          response = await httpClient.get<T>(url, headers);
          break;
        case 'POST':
          response = await httpClient.post<T>(url, body, headers);
          break;
        case 'PUT':
          response = await httpClient.put<T>(url, body, headers);
          break;
        case 'DELETE':
          response = await httpClient.delete<T>(url, headers);
          break;
        default:
          response = await httpClient.request<T>(url, {
            method,
            headers,
            body
          });
      }

      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      return response;
    } catch (error) {
      console.error(`API ${method} request to ${endpoint} failed:`, error);
      
      if (showErrorToast) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        toast.error(`Request failed: ${errorMessage}`);
      }
      
      throw error;
    }
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
