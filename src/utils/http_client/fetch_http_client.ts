
import { HttpClient, RequestOptions } from './http_client';
import { toast } from 'sonner';

export class FetchHttpClient extends HttpClient {
  async request<T>(url: string, options: RequestOptions): Promise<T> {
    const fetchOptions: RequestInit = {
      method: options.method,
      headers: options.headers,
      ...(options.body ? { body: JSON.stringify(options.body) } : {})
    };
    
    try {
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error('API request failed:', error);
      toast.error('Failed to fetch data. Please try again.');
      throw error;
    }
  }

  async get<T>(url: string, headers?: { [key: string]: string }): Promise<T> {
    return this.request<T>(url, { method: 'GET', headers });
  }

  async post<T>(url: string, body: any, headers?: { [key: string]: string }): Promise<T> {
    return this.request<T>(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json', ...headers }, 
      body 
    });
  }

  async put<T>(url: string, body: any, headers?: { [key: string]: string }): Promise<T> {
    return this.request<T>(url, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json', ...headers }, 
      body 
    });
  }

  async delete<T>(url: string, headers?: { [key: string]: string }): Promise<T> {
    return this.request<T>(url, { method: 'DELETE', headers });
  }
}
