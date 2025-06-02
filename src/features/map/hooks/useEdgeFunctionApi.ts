
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EdgeFunctionError {
  message: string;
  code?: string;
  details?: any;
}

export const useEdgeFunctionApi = () => {
  const callEdgeFunction = useCallback(async (
    functionName: string,
    payload: any,
    options?: {
      retries?: number;
      timeout?: number;
    }
  ): Promise<any> => {
    const { retries = 2, timeout = 30000 } = options || {};
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`Calling edge function ${functionName}, attempt ${attempt + 1}`, payload);
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), timeout);
        });
        
        // Create the function call promise
        const functionPromise = supabase.functions.invoke(functionName, {
          body: payload
        });
        
        // Race between timeout and function call
        const { data, error } = await Promise.race([functionPromise, timeoutPromise]) as any;
        
        if (error) {
          throw new Error(`Edge function error: ${error.message}`);
        }
        
        console.log(`Edge function ${functionName} success:`, data);
        return data;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.warn(`Edge function ${functionName} attempt ${attempt + 1} failed:`, lastError);
        
        // Don't retry on timeout errors
        if (error instanceof Error && error.message === 'Timeout') {
          throw new Error(`Edge function ${functionName} timed out after ${timeout}ms`);
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < retries) {
          const delayMs = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    throw lastError || new Error(`Edge function ${functionName} failed after ${retries + 1} attempts`);
  }, []);

  const callPlacesCacheManager = useCallback(async (action: string, params: any) => {
    return callEdgeFunction('places-cache-manager', {
      action,
      ...params
    });
  }, [callEdgeFunction]);

  const populateArea = useCallback(async (areaId?: string) => {
    return callPlacesCacheManager('populate_area', { area_id: areaId });
  }, [callPlacesCacheManager]);

  const getCacheStats = useCallback(async () => {
    return callPlacesCacheManager('get_cache_stats', {});
  }, [callPlacesCacheManager]);

  return {
    callEdgeFunction,
    callPlacesCacheManager,
    populateArea,
    getCacheStats
  };
};
