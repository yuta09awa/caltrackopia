
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useApiKeyLoader = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      setLoading(true);
      console.log('Fetching Google Maps API key...');

      const TIMEOUT_MS = 5000;
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API key fetch timeout')), TIMEOUT_MS);
      });

      try {
        const fetchPromise = supabase.functions.invoke('get-google-maps-api-key');
        const { data, error: invokeError } = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (invokeError) {
          throw invokeError;
        }

        if (data && data.apiKey) {
          console.log('Successfully retrieved API key');
          setApiKey(data.apiKey);
          setError(null);
        } else {
          throw new Error('Google Maps API key not found in response');
        }
      } catch (e: any) {
        console.error('API key fetch failed:', e);
        setError(`Failed to load API key: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  return { apiKey, error, loading };
};
