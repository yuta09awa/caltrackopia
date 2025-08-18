import { environment } from '@/config/environment';

export interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  timestamp: Date;
  userAgent: string;
  userId?: string;
  context?: Record<string, any>;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  
  private constructor() {
    this.setupGlobalErrorHandlers();
  }
  
  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }
  
  private setupGlobalErrorHandlers() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        type: 'javascript',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: 'promise_rejection'
      });
    });
    
    // Handle React Error Boundary errors
    window.addEventListener('react-error', (event: any) => {
      this.handleError(event.detail.error, {
        type: 'react',
        componentStack: event.detail.componentStack
      });
    });
  }
  
  handleError(error: Error | string, context?: Record<string, any>) {
    const errorReport: ErrorReport = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      url: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      context
    };
    
    // Log to console in development
    if (environment.isDevelopment) {
      console.error('Error captured:', errorReport);
    }
    
    // Send to error reporting service in production
    if (environment.isProduction && environment.enableErrorReporting) {
      this.sendErrorReport(errorReport);
    }
    
    return errorReport;
  }
  
  private async sendErrorReport(errorReport: ErrorReport) {
    try {
      // In a real app, this would send to a service like Sentry, LogRocket, etc.
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport)
      });
    } catch (e) {
      console.error('Failed to send error report:', e);
    }
  }
  
  logUserAction(action: string, context?: Record<string, any>) {
    if (environment.enableAnalytics) {
      console.log('User Action:', action, context);
      // In a real app, send to analytics service
    }
  }
  
  logPerformanceMetric(metric: string, value: number, context?: Record<string, any>) {
    if (environment.enableAnalytics) {
      console.log('Performance Metric:', metric, value, context);
      // In a real app, send to performance monitoring service
    }
  }
}

export const errorHandler = ErrorHandler.getInstance();