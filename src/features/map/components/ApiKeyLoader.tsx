
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

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log('Fetching Google Maps API key from Edge Function...');
        
        const { data, error } = await supabase.functions.invoke('get-google-maps-api-key');

        if (error) {
          console.error('Error calling Edge Function:', error);
          setError('Failed to load Google Maps API key');
          setLoading(false);
          return;
        }

        if (data && data.apiKey) {
          console.log('Successfully retrieved API key');
          setApiKey(data.apiKey);
        } else {
          console.error('No API key in response:', data);
          setError('Google Maps API key not found in response');
        }
      } catch (e: any) {
        console.error('Exception when fetching API key:', e);
        setError(`Failed to load API key: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  return { apiKey, error, loading };
};
