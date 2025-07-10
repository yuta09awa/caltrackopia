/**
 * Centralized logging service with structured output
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

export class LoggingService {
  private static instance: LoggingService;
  private sessionId: string;
  private isDevelopment: boolean;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
  }

  private output(entry: LogEntry): void {
    const formattedMessage = `[${entry.level.toUpperCase()}] ${entry.timestamp} - ${entry.message}`;
    
    if (this.isDevelopment) {
      // Enhanced console output for development
      const style = this.getConsoleStyle(entry.level);
      console.log(`%c${formattedMessage}`, style, entry.context || '');
      if (entry.error) {
        console.error(entry.error);
      }
    } else {
      // Structured logging for production
      console.log(JSON.stringify(entry));
    }

    // Send to external logging service in production
    if (!this.isDevelopment && entry.level !== 'debug') {
      this.sendToExternalService(entry);
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles = {
      debug: 'color: #888;',
      info: 'color: #2196F3;',
      warn: 'color: #FF9800; font-weight: bold;',
      error: 'color: #F44336; font-weight: bold;',
      fatal: 'color: #F44336; font-weight: bold; background: #ffebee;'
    };
    return styles[level];
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    try {
      // In a real app, this would send to your logging service
      // Example: Sentry, LogRocket, or custom endpoint
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Fallback: log to console if external service fails
      console.error('Failed to send log to external service:', error);
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry('debug', message, context);
    this.output(entry);
  }

  info(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry('info', message, context);
    this.output(entry);
  }

  warn(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry('warn', message, context);
    this.output(entry);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    const entry = this.createLogEntry('error', message, context, error);
    this.output(entry);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    const entry = this.createLogEntry('fatal', message, context, error);
    this.output(entry);
  }

  // Performance logging
  performance(operation: string, duration: number, context?: Record<string, any>): void {
    this.info(`Performance: ${operation}`, {
      ...context,
      duration,
      type: 'performance'
    });
  }

  // User action logging
  userAction(action: string, context?: Record<string, any>): void {
    this.info(`User Action: ${action}`, {
      ...context,
      type: 'user_action'
    });
  }

  // API call logging
  apiCall(endpoint: string, method: string, duration: number, status: number, context?: Record<string, any>): void {
    const level = status >= 400 ? 'error' : 'info';
    this[level](`API Call: ${method} ${endpoint}`, {
      ...context,
      endpoint,
      method,
      status,
      duration,
      type: 'api_call'
    });
  }
}

// Export singleton instance
export const logger = LoggingService.getInstance();