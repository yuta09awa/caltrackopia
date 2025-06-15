
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ApiKeyLoaderProps {
  onApiKeyLoaded: (apiKey: string) => void;
  onError: (error: string) => void;
}

export const useApiKeyLoader = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second
  const TIMEOUT_MS = 5000; // 5 seconds, reduced from 10

  useEffect(() => {
    const fetchApiKeyWithRetry = async () => {
      try {
        console.log(`Fetching Google Maps API key (attempt ${retryCount + 1}/${MAX_RETRIES + 1})...`);
        
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('API key fetch timeout')), TIMEOUT_MS);
        });

        // Race between fetch and timeout
        const fetchPromise = supabase.functions.invoke('get-google-maps-api-key');
        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (error) {
          throw error;
        }

        if (data && data.apiKey) {
          console.log('Successfully retrieved API key');
          setApiKey(data.apiKey);
          setError(null);
        } else {
          throw new Error('Google Maps API key not found in response');
        }
      } catch (e: any) {
        console.error(`API key fetch attempt ${retryCount + 1} failed:`, e);
        
        if (retryCount < MAX_RETRIES) {
          // Retry with exponential backoff
          const delay = RETRY_DELAY * Math.pow(2, retryCount);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, delay);
          return;
        }
        
        // All retries exhausted
        setError(`Failed to load API key after ${MAX_RETRIES + 1} attempts: ${e.message}`);
      } finally {
        if (retryCount >= MAX_RETRIES || apiKey || error) {
          setLoading(false);
        }
      }
    };

    fetchApiKeyWithRetry();
  }, [retryCount]);

  // Reset retry count when component unmounts
  useEffect(() => {
    return () => {
      setRetryCount(0);
    };
  }, []);

  return { apiKey, error, loading, retryCount };
};
