import { logger } from '@/services/logging/LoggingService';

/**
 * Testing utilities for development and QA
 */

// Mock data generators
export const mockData = {
  user: () => ({
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    email: `test${Math.floor(Math.random() * 1000)}@example.com`,
    firstName: ['John', 'Jane', 'Alex', 'Sarah', 'Mike'][Math.floor(Math.random() * 5)],
    lastName: ['Doe', 'Smith', 'Johnson', 'Brown', 'Davis'][Math.floor(Math.random() * 5)],
    createdAt: new Date().toISOString(),
  }),

  restaurant: () => ({
    id: `restaurant-${Math.random().toString(36).substr(2, 9)}`,
    name: `Restaurant ${Math.floor(Math.random() * 1000)}`,
    cuisine: ['Italian', 'Chinese', 'Mexican', 'Indian', 'American'][Math.floor(Math.random() * 5)],
    rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
    priceLevel: Math.floor(Math.random() * 4) + 1, // 1-4
    location: {
      lat: 40.7589 + (Math.random() - 0.5) * 0.1,
      lng: -73.9851 + (Math.random() - 0.5) * 0.1,
    },
    isOpen: Math.random() > 0.3,
    address: `${Math.floor(Math.random() * 999) + 1} Main St, New York, NY`,
  }),

  place: () => ({
    id: `place-${Math.random().toString(36).substr(2, 9)}`,
    name: `Market ${Math.floor(Math.random() * 100)}`,
    type: ['grocery_store', 'supermarket', 'farmer_market'][Math.floor(Math.random() * 3)],
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    location: {
      lat: 40.7589 + (Math.random() - 0.5) * 0.1,
      lng: -73.9851 + (Math.random() - 0.5) * 0.1,
    },
    openNow: Math.random() > 0.2,
  }),

  apiResponse: <T>(data: T, delay: number = 0) => {
    return new Promise<{ data: T; status: number }>((resolve) => {
      setTimeout(() => {
        resolve({
          data,
          status: 200,
        });
      }, delay);
    });
  },

  apiError: (message: string = 'API Error', status: number = 500, delay: number = 0) => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(message));
      }, delay);
    });
  },
};

// Performance testing utilities
export const performance = {
  /**
   * Measure function execution time
   */
  measure: async <T>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    const start = window.performance.now();
    
    try {
      const result = await fn();
      const duration = window.performance.now() - start;
      
      logger.performance(`Test: ${name}`, duration);
      
      return result;
    } catch (error) {
      const duration = window.performance.now() - start;
      logger.error(`Test failed: ${name}`, error as Error, { duration });
      throw error;
    }
  },

  /**
   * Stress test a function with multiple iterations
   */
  stress: async <T>(
    name: string,
    fn: () => Promise<T> | T,
    iterations: number = 100
  ): Promise<{ results: T[]; avgDuration: number; errors: number }> => {
    const results: T[] = [];
    const durations: number[] = [];
    let errors = 0;

    logger.info(`Starting stress test: ${name} (${iterations} iterations)`);

    for (let i = 0; i < iterations; i++) {
      const start = window.performance.now();
      
      try {
        const result = await fn();
        results.push(result);
        durations.push(window.performance.now() - start);
      } catch (error) {
        errors++;
        logger.error(`Stress test iteration ${i + 1} failed`, error as Error);
      }
    }

    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;

    logger.info(`Stress test completed: ${name}`, {
      iterations,
      successfulIterations: results.length,
      errors,
      avgDuration: `${avgDuration.toFixed(2)}ms`,
      minDuration: `${Math.min(...durations).toFixed(2)}ms`,
      maxDuration: `${Math.max(...durations).toFixed(2)}ms`,
    });

    return { results, avgDuration, errors };
  },
};

// Visual regression testing helpers
export const visual = {
  /**
   * Capture element screenshot for visual comparison
   */
  capture: async (element: HTMLElement, name: string): Promise<string | null> => {
    if (!('html2canvas' in window)) {
      logger.warn('html2canvas not available for visual testing');
      return null;
    }

    try {
      // This would require html2canvas library in a real implementation
      logger.info(`Visual capture: ${name}`, {
        elementTag: element.tagName,
        elementClasses: element.className,
      });
      
      // Placeholder for actual screenshot capture
      return `screenshot-${name}-${Date.now()}`;
    } catch (error) {
      logger.error('Visual capture failed', error as Error);
      return null;
    }
  },

  /**
   * Compare with baseline
   */
  compare: (current: string, baseline: string, threshold: number = 0.1): boolean => {
    // Placeholder for actual image comparison
    logger.info('Visual comparison', { current, baseline, threshold });
    return Math.random() > threshold; // Mock comparison result
  },
};

// Accessibility testing utilities
export const a11y = {
  /**
   * Check for common accessibility issues
   */
  audit: (element: HTMLElement = document.body): Array<{ type: string; message: string; element: HTMLElement }> => {
    const issues: Array<{ type: string; message: string; element: HTMLElement }> = [];

    // Check for missing alt attributes on images
    const images = element.querySelectorAll('img:not([alt])') as NodeListOf<HTMLImageElement>;
    images.forEach((img) => {
      issues.push({
        type: 'missing-alt',
        message: 'Image missing alt attribute',
        element: img,
      });
    });

    // Check for missing labels on inputs
    const inputs = element.querySelectorAll('input:not([aria-label]):not([aria-labelledby])') as NodeListOf<HTMLInputElement>;
    inputs.forEach((input) => {
      const label = element.querySelector(`label[for="${input.id}"]`);
      if (!label && input.type !== 'hidden') {
        issues.push({
          type: 'missing-label',
          message: 'Input missing label or aria-label',
          element: input,
        });
      }
    });

    // Check for insufficient color contrast (simplified)
    const elements = element.querySelectorAll('*') as NodeListOf<HTMLElement>;
    elements.forEach((el) => {
      const styles = window.getComputedStyle(el);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        // Simplified contrast check - in real implementation use proper algorithm
        if (color === backgroundColor) {
          issues.push({
            type: 'low-contrast',
            message: 'Potentially low color contrast',
            element: el,
          });
        }
      }
    });

    // Check for keyboard navigation
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    focusableElements.forEach((el) => {
      if (el.tabIndex < 0 && el.tabIndex !== -1) {
        issues.push({
          type: 'invalid-tabindex',
          message: 'Invalid tabindex value',
          element: el,
        });
      }
    });

    logger.info('Accessibility audit completed', {
      totalIssues: issues.length,
      issueTypes: [...new Set(issues.map(i => i.type))],
    });

    return issues;
  },

  /**
   * Test keyboard navigation
   */
  testKeyboardNavigation: (container: HTMLElement): Promise<boolean> => {
    return new Promise((resolve) => {
      const focusableElements = container.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      let currentIndex = 0;
      const totalElements = focusableElements.length;

      if (totalElements === 0) {
        logger.warn('No focusable elements found for keyboard navigation test');
        resolve(false);
        return;
      }

      const testNextElement = () => {
        if (currentIndex >= totalElements) {
          logger.info('Keyboard navigation test completed successfully');
          resolve(true);
          return;
        }

        const element = focusableElements[currentIndex];
        element.focus();

        // Check if element actually received focus
        setTimeout(() => {
          if (document.activeElement === element) {
            currentIndex++;
            testNextElement();
          } else {
            logger.warn('Element failed to receive focus', {
              element: element.tagName,
              classList: element.className,
            });
            resolve(false);
          }
        }, 100);
      };

      testNextElement();
    });
  },
};

// Integration testing utilities
export const integration = {
  /**
   * Test API endpoints
   */
  testEndpoint: async (url: string, options: RequestInit = {}): Promise<{
    success: boolean;
    status: number;
    duration: number;
    data?: any;
    error?: string;
  }> => {
    const start = window.performance.now();
    
    try {
      const response = await fetch(url, options);
      const duration = window.performance.now() - start;
      
      let data;
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }

      const result = {
        success: response.ok,
        status: response.status,
        duration,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data,
      };

      logger.apiCall(url, options.method || 'GET', duration, response.status);
      
      return result;
    } catch (error) {
      const duration = window.performance.now() - start;
      
      logger.error('API test failed', error as Error, { url, method: options.method || 'GET' });
      
      return {
        success: false,
        status: 0,
        duration,
        error: (error as Error).message,
      };
    }
  },

  /**
   * Test multiple endpoints in sequence
   */
  testEndpoints: async (tests: Array<{ name: string; url: string; options?: RequestInit }>): Promise<Array<{
    name: string;
    success: boolean;
    duration: number;
    status: number;
  }>> => {
    const results = [];

    for (const test of tests) {
      logger.info(`Testing endpoint: ${test.name}`);
      const result = await integration.testEndpoint(test.url, test.options);
      
      results.push({
        name: test.name,
        success: result.success,
        duration: result.duration,
        status: result.status,
      });
    }

    const successCount = results.filter(r => r.success).length;
    logger.info('Endpoint testing completed', {
      total: results.length,
      successful: successCount,
      failed: results.length - successCount,
    });

    return results;
  },
};

// Test data cleanup
export const cleanup = {
  /**
   * Clear test data from localStorage
   */
  localStorage: () => {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('test-') || key.includes('mock') || key.includes('debug')
    );
    
    keys.forEach(key => localStorage.removeItem(key));
    logger.info(`Cleaned up ${keys.length} test items from localStorage`);
  },

  /**
   * Reset component state for testing
   */
  componentState: (selector: string) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      // Reset form inputs
      if (el instanceof HTMLFormElement) {
        el.reset();
      }
      
      // Remove test classes
      el.classList.forEach(className => {
        if (className.startsWith('test-') || className.includes('mock')) {
          el.classList.remove(className);
        }
      });
    });
    
    logger.info(`Reset state for ${elements.length} elements matching "${selector}"`);
  },

  /**
   * Clear all test data
   */
  all: () => {
    cleanup.localStorage();
    cleanup.componentState('[class*="test"], [class*="mock"]');
    
    // Clear any test cookies
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name.startsWith('test-') || name.includes('mock')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
    
    logger.info('Completed full test data cleanup');
  },
};

// Development helpers
export const dev = {
  /**
   * Log component props for debugging
   */
  logProps: (componentName: string, props: any) => {
    logger.debug(`${componentName} props`, props);
  },

  /**
   * Simulate slow network conditions
   */
  simulateSlowNetwork: (delay: number = 2000) => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      await new Promise(resolve => setTimeout(resolve, delay));
      return originalFetch(...args);
    };

    logger.info(`Simulating slow network (${delay}ms delay)`);
    
    // Return cleanup function
    return () => {
      window.fetch = originalFetch;
      logger.info('Network simulation restored');
    };
  },

  /**
   * Mock API responses
   */
  mockApi: (pattern: RegExp, response: any, status: number = 200) => {
    const originalFetch = window.fetch;
    
    window.fetch = async (url, options) => {
      if (typeof url === 'string' && pattern.test(url)) {
        logger.info(`Mocked API call: ${url}`);
        
        return new Response(JSON.stringify(response), {
          status,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return originalFetch(url, options);
    };

    logger.info(`API mock active for pattern: ${pattern}`);
    
    // Return cleanup function
    return () => {
      window.fetch = originalFetch;
      logger.info('API mock removed');
    };
  },
};