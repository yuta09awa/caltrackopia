
export interface RequestOptions {
  method: string;
  headers?: { [key: string]: string };
  body?: any;
}

export abstract class HttpClient {
  abstract request<T>(url: string, options: RequestOptions): Promise<T>;
  abstract get<T>(url: string, headers?: { [key: string]: string }): Promise<T>;
  abstract post<T>(url: string, body: any, headers?: { [key: string]: string }): Promise<T>;
  abstract put<T>(url: string, body: any, headers?: { [key: string]: string }): Promise<T>;
  abstract delete<T>(url: string, headers?: { [key: string]: string }): Promise<T>;
}
