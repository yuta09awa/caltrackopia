
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ApiKeyState {
  apiKey: string | null;
  loading: boolean;
  error: string | null;
}

export const useApiKeyState = (): ApiKeyState => {
  const [state, setState] = useState<ApiKeyState>({
    apiKey: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchApiKey = async () => {
      try {
        console.log('Fetching Google Maps API key...');
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('API key fetch timeout')), 10000); // 10s timeout
        });
        
        const fetchPromise = supabase.functions.invoke('get-google-maps-api-key');
        
        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
        
        if (!isMounted) return;

        if (error) {
          throw error;
        }

        if (data?.apiKey) {
          console.log('Successfully retrieved Google Maps API key');
          setState({
            apiKey: data.apiKey,
            loading: false,
            error: null
          });
        } else {
          throw new Error('No API key returned from server');
        }
      } catch (error: any) {
        console.error('Error fetching API key:', error);
        
        if (!isMounted) return;

        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying API key fetch (${retryCount}/${maxRetries})...`);
          setTimeout(fetchApiKey, 2000 * retryCount); // Exponential backoff
        } else {
          setState({
            apiKey: null,
            loading: false,
            error: error.message || 'Failed to load Google Maps API key'
          });
        }
      }
    };

    fetchApiKey();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
};
