
export class DatabaseError extends Error {
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, code: string = 'DATABASE_ERROR', details?: any) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.details = details;
  }
}

export class NetworkError extends Error {
  public readonly statusCode?: number;
  public readonly response?: any;

  constructor(message: string, statusCode?: number, response?: any) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class ApiError extends Error {
  public readonly endpoint: string;
  public readonly statusCode?: number;

  constructor(message: string, endpoint: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.endpoint = endpoint;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends Error {
  public readonly field?: string;
  public readonly value?: any;

  constructor(message: string, field?: string, value?: any) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

// Utility function to check if error is a specific type
export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

// Helper to create user-friendly error messages
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (isDatabaseError(error)) {
    return 'There was a problem accessing the database. Please try again later.';
  }
  
  if (isNetworkError(error)) {
    return 'Network connection failed. Please check your internet connection and try again.';
  }
  
  if (isApiError(error)) {
    return 'There was a problem with the server. Please try again later.';
  }
  
  if (isValidationError(error)) {
    return `Invalid data: ${error.message}`;
  }
  
  return 'An unexpected error occurred. Please try again later.';
}
