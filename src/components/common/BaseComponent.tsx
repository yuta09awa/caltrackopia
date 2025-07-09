// ============= BASE COMPONENT SYSTEM =============

import React from 'react';
import { cn } from '@/lib/utils';
import { StandardComponentProps, LoadingProps } from '@/types';

/**
 * Base component wrapper that provides standard functionality
 */
export interface BaseComponentWrapperProps extends StandardComponentProps {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
}

export const BaseComponent = React.forwardRef<HTMLDivElement, BaseComponentWrapperProps>(
  ({ 
    className, 
    children, 
    loading, 
    error, 
    disabled, 
    testId, 
    variant = 'default',
  }, ref) => {
    
    const baseClasses = cn(
      'relative',
      {
        'opacity-50 pointer-events-none': disabled || loading,
        'border-destructive': !!error,
      },
      variant === 'primary' && 'text-primary',
      variant === 'secondary' && 'text-secondary',
      variant === 'ghost' && 'text-muted-foreground',
      className
    );

    return (
      <div
        ref={ref}
        className={baseClasses}
        data-testid={testId}
        aria-disabled={disabled}
        aria-busy={loading}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          </div>
        )}
        {error && (
          <div className="text-sm text-destructive mb-2">
            {typeof error === 'string' ? error : error.message}
          </div>
        )}
        {children}
      </div>
    );
  }
);

BaseComponent.displayName = 'BaseComponent';

/**
 * Higher-order component for standard component behavior
 */
export function withStandardProps<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithStandardProps = React.forwardRef<any, P & StandardComponentProps>(
    (props, ref) => {
      const { loading, error, disabled, testId, className, ...componentProps } = props;
      
      return (
        <BaseComponent
          loading={loading}
          error={error}
          disabled={disabled}
          testId={testId}
          className={className}
        >
          <WrappedComponent ref={ref} {...(componentProps as P)} />
        </BaseComponent>
      );
    }
  );
  
  WithStandardProps.displayName = `withStandardProps(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithStandardProps;
}

/**
 * Loading wrapper component
 */
export interface LoadingWrapperProps extends LoadingProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  error,
  children,
  fallback,
  size = 'md',
  overlay = false
}) => {
  if (error) {
    return (
      <div className="flex items-center justify-center p-4 text-destructive">
        <span className="text-sm">{typeof error === 'string' ? error : error.message}</span>
      </div>
    );
  }

  if (loading) {
    if (fallback) return <>{fallback}</>;
    
    const spinnerSize = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8'
    }[size];

    const spinner = (
      <div className="flex items-center justify-center p-4">
        <div className={cn('animate-spin rounded-full border-b-2 border-primary', spinnerSize)} />
      </div>
    );

    if (overlay) {
      return (
        <div className="relative">
          {children}
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            {spinner}
          </div>
        </div>
      );
    }

    return spinner;
  }

  return <>{children}</>;
};

/**
 * Error boundary wrapper
 */
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.reset} />;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 text-destructive">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm mt-2 text-muted-foreground">{this.state.error.message}</p>
          </div>
          <button
            onClick={this.reset}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}