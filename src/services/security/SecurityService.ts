import { logger } from '@/services/logging/LoggingService';

/**
 * Security service for input validation and sanitization
 */
export class SecurityService {
  private static instance: SecurityService;

  private constructor() {}

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  /**
   * Sanitize HTML input to prevent XSS attacks
   */
  sanitizeHtml(input: string): string {
    if (!input) return '';

    // Basic HTML sanitization - remove script tags and dangerous attributes
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '');
  }

  /**
   * Validate and sanitize user input
   */
  validateInput(input: string, type: 'text' | 'email' | 'url' | 'phone' | 'number'): {
    isValid: boolean;
    sanitized: string;
    errors: string[];
  } {
    const errors: string[] = [];
    let sanitized = this.sanitizeHtml(input.trim());

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized)) {
          errors.push('Invalid email format');
        }
        break;

      case 'url':
        try {
          new URL(sanitized);
        } catch {
          errors.push('Invalid URL format');
        }
        break;

      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = sanitized.replace(/\D/g, '');
        if (!phoneRegex.test(cleanPhone)) {
          errors.push('Invalid phone number format');
        }
        sanitized = cleanPhone;
        break;

      case 'number':
        if (isNaN(Number(sanitized))) {
          errors.push('Must be a valid number');
        }
        break;

      case 'text':
        // Basic text validation
        if (sanitized.length > 1000) {
          errors.push('Text too long (max 1000 characters)');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    };
  }

  /**
   * Check for suspicious patterns that might indicate attacks
   */
  detectSuspiciousActivity(input: string, context?: string): boolean {
    const suspiciousPatterns = [
      /union\s+select/i,
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload\s*=/i,
      /onerror\s*=/i,
    ];

    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(input));

    if (isSuspicious) {
      logger.warn('Suspicious input detected', {
        input: input.substring(0, 100), // Log first 100 chars only
        context,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    }

    return isSuspicious;
  }

  /**
   * Generate secure random string for tokens/IDs
   */
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    return Array.from(array, byte => chars[byte % chars.length]).join('');
  }

  /**
   * Validate file uploads
   */
  validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    } = options;

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size exceeds limit (${Math.round(maxSize / 1024 / 1024)}MB)`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      errors.push(`File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Rate limiting for API calls
   */
  private rateLimits = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(key: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const limit = this.rateLimits.get(key);

    if (!limit || now > limit.resetTime) {
      // Reset or create new limit
      this.rateLimits.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (limit.count >= maxRequests) {
      logger.warn('Rate limit exceeded', {
        key,
        count: limit.count,
        maxRequests,
        resetTime: limit.resetTime
      });
      return false;
    }

    limit.count++;
    return true;
  }

  /**
   * Secure local storage wrapper
   */
  secureStorage = {
    set: (key: string, value: any): void => {
      try {
        // In production, you might want to encrypt the value
        const serialized = JSON.stringify(value);
        localStorage.setItem(`secure_${key}`, serialized);
      } catch (error) {
        logger.error('Failed to store secure data', error as Error, { key });
      }
    },

    get: <T>(key: string): T | null => {
      try {
        const item = localStorage.getItem(`secure_${key}`);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        logger.error('Failed to retrieve secure data', error as Error, { key });
        return null;
      }
    },

    remove: (key: string): void => {
      localStorage.removeItem(`secure_${key}`);
    },

    clear: (): void => {
      Object.keys(localStorage)
        .filter(key => key.startsWith('secure_'))
        .forEach(key => localStorage.removeItem(key));
    }
  };
}

// Export singleton instance
export const security = SecurityService.getInstance();