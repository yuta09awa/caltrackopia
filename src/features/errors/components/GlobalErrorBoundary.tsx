import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { logger } from '@/services/logging/LoggingService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'app' | 'page' | 'component';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { level = 'component' } = this.props;
    
    this.setState({ errorInfo });

    // Log error with context
    logger.error(`Error Boundary (${level}): ${error.message}`, error, {
      errorInfo,
      level,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });

    // Report to error tracking service
    this.reportError(error, errorInfo);
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    // In production, this would send to error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
    logger.fatal('Unhandled React Error', error, {
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }

  private handleRetry = (): void => {
    const { retryCount } = this.state;
    
    if (retryCount < this.maxRetries) {
      logger.info('Error boundary retry attempt', { 
        retryCount: retryCount + 1,
        maxRetries: this.maxRetries 
      });
      
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: retryCount + 1
      });
    }
  };

  private handleGoHome = (): void => {
    logger.userAction('Error boundary - go home');
    window.location.href = '/';
  };

  private handleReload = (): void => {
    logger.userAction('Error boundary - reload page');
    window.location.reload();
  };

  private renderErrorDetails(): ReactNode {
    const { error, errorInfo } = this.state;
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment || !error) return null;

    return (
      <Alert className="mt-4">
        <Bug className="h-4 w-4" />
        <AlertDescription className="font-mono text-xs">
          <details>
            <summary className="cursor-pointer font-medium">Error Details (Development)</summary>
            <div className="mt-2 space-y-2">
              <div>
                <strong>Error:</strong> {error.message}
              </div>
              <div>
                <strong>Stack:</strong>
                <pre className="mt-1 whitespace-pre-wrap text-xs">
                  {error.stack}
                </pre>
              </div>
              {errorInfo && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className="mt-1 whitespace-pre-wrap text-xs">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        </AlertDescription>
      </Alert>
    );
  }

  render() {
    const { hasError, retryCount } = this.state;
    const { children, fallback, level = 'component' } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Different UI based on error boundary level
      const canRetry = retryCount < this.maxRetries;
      const isAppLevel = level === 'app';

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">
                {isAppLevel ? 'Application Error' : 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center">
                {isAppLevel 
                  ? 'The application encountered an unexpected error. Please try refreshing the page.'
                  : 'This section encountered an error. You can try again or return to the home page.'
                }
              </p>

              <div className="flex flex-col gap-2">
                {canRetry && (
                  <Button onClick={this.handleRetry} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again {retryCount > 0 && `(${retryCount}/${this.maxRetries})`}
                  </Button>
                )}

                {isAppLevel ? (
                  <Button onClick={this.handleReload} variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                ) : (
                  <Button onClick={this.handleGoHome} variant="outline" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                )}
              </div>

              {!canRetry && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Multiple retry attempts failed. Please refresh the page or contact support if the problem persists.
                  </AlertDescription>
                </Alert>
              )}

              {this.renderErrorDetails()}
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}

// Convenience components for different levels
export const AppErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <GlobalErrorBoundary level="app">{children}</GlobalErrorBoundary>
);

export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <GlobalErrorBoundary level="page">{children}</GlobalErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <GlobalErrorBoundary level="component" fallback={fallback}>
    {children}
  </GlobalErrorBoundary>
);