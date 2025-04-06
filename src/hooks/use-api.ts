
import { useState, useCallback } from 'react';
import { apiRequest } from '@/utils/api';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
}

export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const execute = useCallback(async <R = T>(
    endpoint: string,
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: any;
    } = {},
    apiOptions: UseApiOptions<R> = {}
  ): Promise<R | undefined> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiRequest<R>(endpoint, options);
      
      if (apiOptions.successMessage) {
        toast.success(apiOptions.successMessage);
      }
      
      if (apiOptions.onSuccess) {
        apiOptions.onSuccess(data);
      }
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      if (apiOptions.onError) {
        apiOptions.onError(error);
      }
      
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const invalidateQueries = useCallback((queryKey: string[]) => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient]);

  return {
    loading,
    error,
    execute,
    invalidateQueries,
  };
}
