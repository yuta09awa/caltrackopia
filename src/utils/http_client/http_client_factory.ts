
import { HttpClient } from './http_client';
import { FetchHttpClient } from './fetch_http_client';
import { AxiosHttpClient } from './axios_http_client';

// Default to fetch - this would typically come from environment variables
const HTTP_CLIENT_TYPE = 'fetch'; 

export class HttpClientFactory {
  static createHttpClient(baseURL?: string): HttpClient {
    switch (HTTP_CLIENT_TYPE) {
      case 'axios':
        return new AxiosHttpClient(baseURL);
      case 'fetch':
      default:
        return new FetchHttpClient();
    }
  }
}

// Create a singleton instance for use throughout the app
export const httpClient = HttpClientFactory.createHttpClient();
