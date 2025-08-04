import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LocationDetectionResult {
  detectedCity: string;
  detectedRegion: string;
  defaultCenter: { lat: number; lng: number };
  detectionMethod: 'cloudflare' | 'ip-api' | 'fallback';
}

export const useLocationDetection = () => {
  const [detectedLocation, setDetectedLocation] = useState<LocationDetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('detect-location');
        
        if (error) {
          console.error('Location detection error:', error);
          setError(error.message);
          // Set default fallback
          setDetectedLocation({
            detectedCity: 'New York',
            detectedRegion: 'NY',
            defaultCenter: { lat: 40.7128, lng: -74.0060 },
            detectionMethod: 'fallback'
          });
        } else {
          setDetectedLocation(data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to detect location:', err);
        setError('Failed to detect location');
        // Set default fallback
        setDetectedLocation({
          detectedCity: 'New York',
          detectedRegion: 'NY',
          defaultCenter: { lat: 40.7128, lng: -74.0060 },
          detectionMethod: 'fallback'
        });
      } finally {
        setIsDetecting(false);
      }
    };

    detectLocation();
  }, []);

  return {
    detectedLocation,
    isDetecting,
    error
  };
};