
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpClient, RequestOptions } from './http_client';
import { toast } from 'sonner';

export class AxiosHttpClient extends HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL?: string, config?: AxiosRequestConfig) {
    super();
    this.axiosInstance = axios.create({ baseURL, ...config });
  }

  async request<T>(url: string, options: RequestOptions): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        url,
        method: options.method,
        headers: options.headers,
        data: options.body,
      });
      return response.data;
    } catch (error: any) {
      console.error('API request failed:', error);
      toast.error('Failed to fetch data. Please try again.');
      throw new Error(`HTTP error! Status: ${error.response?.status || error.message}`);
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
