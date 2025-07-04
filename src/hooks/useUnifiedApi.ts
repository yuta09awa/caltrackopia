import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useQueryClient, useMutation, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { apiService, ApiRequestOptions } from '@/services/api/apiService';

// Base async state interface
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Unified API hook options
export interface UseApiOptions<TData = unknown, TError = Error> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: (data: TData | undefined, error: TError | null) => void;
  successMessage?: string;
  errorMessage?: string;
}

// Query hook options
export interface UseApiQueryOptions<TData = unknown, TError = Error> 
  extends UseApiOptions<TData, TError> {
  queryKey: string[];
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * Unified API hook for mutations (POST, PUT, DELETE operations)
 * Combines the best features from both use-api.ts and useAPI.tsx
 */
export function useApiMutation<TData = unknown, TError = Error>(
  options: UseApiOptions<TData, TError> = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TError | null>(null);
  const queryClient = useQueryClient();
  
  const mutation = useMutation<TData, TError, { endpoint: string; options?: ApiRequestOptions }>({
    mutationFn: async ({ endpoint, options: apiOptions }) => {
      return await apiService.request<TData>(endpoint, {
        showErrorToast: false, // We'll handle toasts in the hook
        showSuccessToast: false,
        ...apiOptions
      });
    },
    onSuccess: (data) => {
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (err) => {
      setError(err);
      if (options.errorMessage) {
        toast.error(options.errorMessage);
      } else if (!options.onError) {
        // Only show default error if no custom error handler
        toast.error('Operation failed. Please try again.');
      }
      if (options.onError) {
        options.onError(err);
      }
    },
    onSettled: (data, err) => {
      if (options.onSettled) {
        options.onSettled(data, err);
      }
    }
  });

  const execute = useCallback(async (
    endpoint: string,
    apiOptions: ApiRequestOptions = {}
  ): Promise<TData | undefined> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mutation.mutateAsync({
        endpoint,
        options: apiOptions
      });
      return result;
    } catch (err) {
      // Error is already handled by the mutation's onError
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [mutation]);
   
  const invalidateQueries = useCallback((queryKey: string[]) => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient]);

  return {
    loading: loading || mutation.isPending,
    error: error || mutation.error,
    execute,
    invalidateQueries,
    reset: mutation.reset,
    isIdle: mutation.isIdle,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}

/**
 * Unified API hook for queries (GET operations)
 * Provides automatic caching and background updates
 */
export function useApiQuery<TData = unknown, TError = Error>(
  endpoint: string,
  apiOptions: ApiRequestOptions = {},
  queryOptions: Partial<UseApiQueryOptions<TData, TError>> = {}
) {
  const {
    queryKey,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    ...restOptions
  } = queryOptions;

  const finalQueryKey = queryKey || [endpoint, JSON.stringify(apiOptions)];

  return useQuery<TData, TError>({
    queryKey: finalQueryKey,
    queryFn: async () => {
      const result = await apiService.request<TData>(endpoint, {
        showErrorToast: false,
        showSuccessToast: false,
        ...apiOptions
      });
      
      if (successMessage) {
        toast.success(successMessage);
      }
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    },
    enabled,
    staleTime,
    cacheTime,
    onError: (err) => {
      if (errorMessage) {
        toast.error(errorMessage);
      } else if (!onError) {
        toast.error('Failed to fetch data. Please try again.');
      }
      if (onError) {
        onError(err);
      }
    },
    ...restOptions
  } as UseQueryOptions<TData, TError>);
}

/**
 * Hook for async state management without React Query
 * Useful for simple operations that don't need caching
 */
export function useAsyncState<T>(
  initialData: T | null = null
): AsyncState<T> & {
  setData: (data: T | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
} {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    setData,
    setLoading,
    setError,
    reset
  };
}

// Convenience hook that provides both mutation and query capabilities
export function useApi<TData = unknown, TError = Error>(
  options: UseApiOptions<TData, TError> = {}
) {
  const mutation = useApiMutation<TData, TError>(options);
  
  return {
    ...mutation,
    query: (endpoint: string, apiOptions?: ApiRequestOptions, queryOptions?: Partial<UseApiQueryOptions<TData, TError>>) =>
      useApiQuery<TData, TError>(endpoint, apiOptions, queryOptions)
  };
}