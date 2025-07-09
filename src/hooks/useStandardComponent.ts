// ============= STANDARD COMPONENT HOOKS =============

import { useState, useCallback, useEffect, useRef } from 'react';
import { StandardComponentProps, AsyncState, ComponentEvent } from '@/types';

/**
 * Standard component state management hook
 */
export function useStandardComponent<T = any>(initialValue: T | null = null) {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialValue,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: Error | string | null) => {
    setState(prev => ({ 
      ...prev, 
      error: typeof error === 'string' ? new Error(error) : error,
      loading: false 
    }));
  }, []);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ 
      ...prev, 
      data, 
      loading: false, 
      error: null,
      lastUpdated: new Date()
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialValue,
      loading: false,
      error: null,
      lastUpdated: null,
    });
  }, [initialValue]);

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    setLoading,
    setError,
    setData,
    reset,
    execute,
  };
}

/**
 * Component event handling hook
 */
export function useComponentEvents<T = any>() {
  const [events, setEvents] = useState<ComponentEvent<T>[]>([]);
  const listenersRef = useRef<Map<string, ((event: ComponentEvent<T>) => void)[]>>(new Map());

  const emit = useCallback((type: string, payload: T, source?: string) => {
    const event: ComponentEvent<T> = {
      type,
      payload,
      timestamp: new Date(),
      source,
    };

    setEvents(prev => [...prev.slice(-99), event]); // Keep last 100 events

    const listeners = listenersRef.current.get(type) || [];
    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error(`Error in event listener for ${type}:`, error);
      }
    });
  }, []);

  const on = useCallback((type: string, listener: (event: ComponentEvent<T>) => void) => {
    const listeners = listenersRef.current.get(type) || [];
    listeners.push(listener);
    listenersRef.current.set(type, listeners);

    // Return cleanup function
    return () => {
      const currentListeners = listenersRef.current.get(type) || [];
      const index = currentListeners.indexOf(listener);
      if (index > -1) {
        currentListeners.splice(index, 1);
        listenersRef.current.set(type, currentListeners);
      }
    };
  }, []);

  const off = useCallback((type: string, listener?: (event: ComponentEvent<T>) => void) => {
    if (!listener) {
      listenersRef.current.delete(type);
      return;
    }

    const listeners = listenersRef.current.get(type) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
      listenersRef.current.set(type, listeners);
    }
  }, []);

  const clear = useCallback(() => {
    setEvents([]);
    listenersRef.current.clear();
  }, []);

  return {
    events,
    emit,
    on,
    off,
    clear,
  };
}

/**
 * Component performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());
  const propsRef = useRef<Record<string, any>>({});

  useEffect(() => {
    renderCountRef.current += 1;
    const now = Date.now();
    const renderTime = now - lastRenderTimeRef.current;
    lastRenderTimeRef.current = now;

    // Log slow renders (>16ms for 60fps)
    if (renderTime > 16 && renderCountRef.current > 1) {
      console.warn(
        `Slow render detected in ${componentName}: ${renderTime}ms (render #${renderCountRef.current})`
      );
    }

    // Log frequent re-renders
    if (renderCountRef.current > 10) {
      const timeSinceMount = now - (lastRenderTimeRef.current - renderTime * renderCountRef.current);
      if (timeSinceMount < 1000) { // More than 10 renders in 1 second
        console.warn(
          `Frequent re-renders detected in ${componentName}: ${renderCountRef.current} renders in ${timeSinceMount}ms`
        );
      }
    }
  });

  const trackProps = useCallback((props: Record<string, any>) => {
    // Compare with previous props to detect unnecessary re-renders
    const prevProps = propsRef.current;
    const changedProps = Object.keys(props).filter(
      key => props[key] !== prevProps[key]
    );

    if (changedProps.length === 0 && Object.keys(prevProps).length > 0) {
      console.warn(`${componentName} re-rendered without prop changes`);
    }

    propsRef.current = props;
  }, [componentName]);

  return {
    renderCount: renderCountRef.current,
    trackProps,
  };
}

/**
 * Component lifecycle hook
 */
export function useComponentLifecycle(
  componentName: string,
  onMount?: () => void,
  onUnmount?: () => void
) {
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      console.debug(`${componentName} mounted`);
      onMount?.();
    }

    return () => {
      console.debug(`${componentName} unmounting`);
      onUnmount?.();
    };
  }, [componentName, onMount, onUnmount]);

  return {
    isMounted: isMountedRef.current,
  };
}

/**
 * Component validation hook
 */
export function useComponentValidation<T>(
  value: T,
  rules: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: T) => string | null;
  } = {}
) {
  const [errors, setErrors] = useState<string[]>([]);

  const validate = useCallback(() => {
    const newErrors: string[] = [];

    if (rules.required && (value === null || value === undefined || value === '')) {
      newErrors.push('This field is required');
    }

    if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
      newErrors.push(`Minimum value is ${rules.min}`);
    }

    if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
      newErrors.push(`Maximum value is ${rules.max}`);
    }

    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      newErrors.push('Invalid format');
    }

    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        newErrors.push(customError);
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [value, rules]);

  useEffect(() => {
    validate();
  }, [validate]);

  return {
    errors,
    isValid: errors.length === 0,
    validate,
  };
}