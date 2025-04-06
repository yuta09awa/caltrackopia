
import { toast } from "sonner";
import { httpClient } from "./http_client/http_client_factory";

type ApiOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

export async function apiRequest<T>(
  endpoint: string, 
  options: ApiOptions = {}
): Promise<T> {
  try {
    const method = options.method || 'GET';
    
    switch (method) {
      case 'GET':
        return await httpClient.get<T>(endpoint, options.headers);
      case 'POST':
        return await httpClient.post<T>(endpoint, options.body, options.headers);
      case 'PUT':
        return await httpClient.put<T>(endpoint, options.body, options.headers);
      case 'DELETE':
        return await httpClient.delete<T>(endpoint, options.headers);
      default:
        return await httpClient.request<T>(endpoint, {
          method,
          headers: options.headers,
          body: options.body
        });
    }
  } catch (error) {
    console.error('API request failed:', error);
    toast.error('Failed to fetch data. Please try again.');
    throw error;
  }
}

/**
 * Format a date in a human-readable format
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};
