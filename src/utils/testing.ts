// ============= TESTING UTILITIES =============

import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

/**
 * Test providers wrapper
 */
interface TestProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
  initialEntries?: string[];
}

const TestProviders: React.FC<TestProvidersProps> = ({
  children,
  queryClient,
  initialEntries = ['/'],
}) => {
  const testQueryClient = queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

/**
 * Enhanced render function with providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  initialEntries?: string[];
  wrapper?: React.ComponentType<any>;
}

export function customRender(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { queryClient, initialEntries, wrapper, ...renderOptions } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const content = (
      <TestProviders queryClient={queryClient} initialEntries={initialEntries}>
        {children}
      </TestProviders>
    );

    if (wrapper) {
      const CustomWrapper = wrapper;
      return <CustomWrapper>{content}</CustomWrapper>;
    }

    return content;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Component testing utilities
 */
export class ComponentTestUtils {
  /**
   * Create mock props for a component
   */
  static createMockProps<T extends object>(
    baseProps: Partial<T> = {},
    overrides: Partial<T> = {}
  ): T {
    const defaultProps = {
      className: 'test-class',
      testId: 'test-component',
      loading: false,
      error: null,
      disabled: false,
      ...baseProps,
    };

    return { ...defaultProps, ...overrides } as T;
  }

  /**
   * Create mock async state
   */
  static createMockAsyncState<T>(
    data: T | null = null,
    loading: boolean = false,
    error: Error | null = null
  ) {
    return {
      data,
      loading,
      error,
      lastUpdated: error ? null : new Date(),
    };
  }

  /**
   * Create mock service
   */
  static createMockService<T extends object>(methods: Partial<T> = {}): T {
    return {
      getName: () => 'MockService',
      getVersion: () => '1.0.0',
      loading: false,
      error: null,
      lastUpdated: null,
      ...methods,
    } as T;
  }

  /**
   * Create mock API response
   */
  static createMockApiResponse<T>(
    data: T,
    success: boolean = true,
    message?: string
  ) {
    return {
      data,
      success,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        service: 'MockService',
        version: '1.0.0',
      },
    };
  }

  /**
   * Create mock error
   */
  static createMockError(message: string = 'Test error', code: string = 'TEST_ERROR') {
    return {
      code,
      message,
      details: {
        service: 'MockService',
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date(),
    };
  }
}

/**
 * Hook testing utilities
 */
export class HookTestUtils {
  /**
   * Create mock hook return value
   */
  static createMockHookReturn<T extends object>(values: Partial<T> = {}): T {
    const defaultValues = {
      loading: false,
      error: null,
      data: null,
      execute: jest.fn(),
      reset: jest.fn(),
      ...values,
    };

    return defaultValues as T;
  }

  /**
   * Create mock API hook
   */
  static createMockApiHook<T>(
    data: T | null = null,
    loading: boolean = false,
    error: Error | null = null
  ) {
    return {
      data,
      loading,
      error,
      execute: jest.fn(),
      mutate: jest.fn(),
      reset: jest.fn(),
      invalidate: jest.fn(),
    };
  }

  /**
   * Create mock form hook
   */
  static createMockFormHook<T extends object>(values: Partial<T> = {}) {
    return {
      formState: {
        errors: {},
        isSubmitting: false,
        isValid: true,
        isDirty: false,
      },
      register: jest.fn(),
      handleSubmit: jest.fn(),
      setValue: jest.fn(),
      getValues: jest.fn(() => values),
      reset: jest.fn(),
      watch: jest.fn(),
      trigger: jest.fn(),
    };
  }
}

/**
 * Service testing utilities
 */
export class ServiceTestUtils {
  /**
   * Create mock HTTP client
   */
  static createMockHttpClient() {
    return {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      request: jest.fn(),
    };
  }

  /**
   * Create mock cache
   */
  static createMockCache() {
    const cache = new Map();
    
    return {
      get: jest.fn((key: string) => cache.get(key)),
      set: jest.fn((key: string, value: any) => cache.set(key, value)),
      has: jest.fn((key: string) => cache.has(key)),
      delete: jest.fn((key: string) => cache.delete(key)),
      clear: jest.fn(() => cache.clear()),
      size: () => cache.size,
    };
  }

  /**
   * Create mock database
   */
  static createMockDatabase() {
    return {
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn(),
      })),
      rpc: jest.fn(),
      auth: {
        getUser: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
      },
    };
  }
}

/**
 * Performance testing utilities
 */
export class PerformanceTestUtils {
  /**
   * Measure component render time
   */
  static async measureRenderTime<T>(
    renderFn: () => Promise<T> | T,
    iterations: number = 10
  ): Promise<{ average: number; min: number; max: number; results: number[] }> {
    const results: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await renderFn();
      const end = performance.now();
      results.push(end - start);
    }

    const average = results.reduce((sum, time) => sum + time, 0) / results.length;
    const min = Math.min(...results);
    const max = Math.max(...results);

    return { average, min, max, results };
  }

  /**
   * Assert performance threshold
   */
  static assertPerformance(
    actualTime: number,
    expectedMaxTime: number,
    message?: string
  ) {
    if (actualTime > expectedMaxTime) {
      throw new Error(
        message || 
        `Performance assertion failed: expected ${actualTime}ms to be less than ${expectedMaxTime}ms`
      );
    }
  }

  /**
   * Create performance benchmark
   */
  static benchmark(name: string, fn: () => void | Promise<void>) {
    return async () => {
      console.time(name);
      await fn();
      console.timeEnd(name);
    };
  }
}

// Re-export testing library utilities
export * from '@testing-library/react';
export * from '@testing-library/jest-dom';
export { customRender as render };

// Export common test utilities as default
export default {
  ComponentTestUtils,
  HookTestUtils,
  ServiceTestUtils,
  PerformanceTestUtils,
};