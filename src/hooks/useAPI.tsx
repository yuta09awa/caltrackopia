
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useQueryClient, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { apiService, ApiMethod, ApiRequestOptions } from '@/services/api/apiService';

interface UseApiOptions<TData = unknown, TError = Error, TVariables = unknown> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
}

type ApiExecuteVariables = {
  endpoint: string;
  options?: ApiRequestOptions;
};

export function useApi<TData = unknown, TError = Error, TVariables = ApiExecuteVariables>(
  options: UseApiOptions<TData, TError, ApiExecuteVariables> = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TError | null>(null);
  const queryClient = useQueryClient();
  
  // Setup mutation using React Query
  const mutation = useMutation<TData, TError, ApiExecuteVariables>({
    mutationFn: async ({ endpoint, options }) => {
      return await apiService.request<TData>(endpoint, options);
    },
    onSuccess: (data) => {
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (err) => {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
    },
    onSettled: (data, err, variables) => {
      if (options.onSettled) {
        options.onSettled(data, err, variables);
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
    loading,
    error,
    execute,
    invalidateQueries,
    ...mutation
  };
}
