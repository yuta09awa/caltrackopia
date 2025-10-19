// ============= UNIFIED TYPE SYSTEM =============

// Auth & Roles
export type { AppRole, UserRole, RoleCheckResult } from './roles';

// Standard Props (Phase 4)
export type {
  StandardComponentProps,
  LoadingProps,
  AsyncState
} from './standardProps';

// Import for use in interfaces below
import { StandardComponentProps } from './standardProps';

// Legacy base component props (deprecated - use StandardComponentProps)
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormComponentProps<T = any> {
  value?: T;
  onChange?: (value: T) => void;
  onSubmit?: (value: T) => void | Promise<void>;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: T) => string | null;
  };
  loading?: boolean;
  error?: Error | string | null;
  disabled?: boolean;
  className?: string;
  testId?: string;
}

export interface ListComponentProps<T = any> extends StandardComponentProps {
  items: T[];
  keyExtractor?: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  onItemClick?: (item: T, index: number) => void;
}

export interface SearchComponentProps extends StandardComponentProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  minQueryLength?: number;
}

export interface FilterComponentProps<T = any> extends StandardComponentProps {
  filters: T;
  onFiltersChange: (filters: T) => void;
  onClear?: () => void;
  onApply?: (filters: T) => void;
}

export interface ModalComponentProps extends StandardComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// API and Service Types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface ServiceConfig {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
}

// Location and Geography Types
export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeoBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// User and Authentication Types
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  preferences?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
}

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event types
export interface ComponentEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
  source?: string;
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  retry?: () => void;
}

// Performance monitoring types
export interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  props: Record<string, any>;
  timestamp: Date;
}

// Theme and styling types
export interface ThemeConfig {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, string>;
  breakpoints: Record<string, string>;
}