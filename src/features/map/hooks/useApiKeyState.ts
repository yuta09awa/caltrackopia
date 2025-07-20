
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useApiKeyState = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log('Fetching Google Maps API key...');
        
        const { data, error } = await supabase.functions.invoke('get-google-maps-api-key');

        if (error) {
          throw error;
        }

        if (data?.apiKey) {
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
