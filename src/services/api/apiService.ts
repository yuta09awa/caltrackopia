
import { toast } from "sonner";
import { httpClient } from "@/utils/http_client/http_client_factory";
import { ServiceBase } from "../base/ServiceBase";
import { IEnhancedService } from "../base/ServiceInterface";

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequestOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: any;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

export class ApiService extends ServiceBase implements IEnhancedService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    super();
    this.baseUrl = baseUrl;
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
      headers,
      body,
      showErrorToast = true,
      showSuccessToast = false,
      successMessage = 'Operation completed successfully'
    } = options;
    
    const url = this.getFullUrl(endpoint);

    return this.executeWithStateManagement(async () => {
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

      // Increment API quota usage
      this.incrementQuotaUsage(1);

      if (showSuccessToast) {
        this.showSuccessToast(successMessage);
      }
      
      return response;
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
