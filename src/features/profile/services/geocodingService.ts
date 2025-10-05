
import { supabase } from '@/integrations/supabase/client';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
}

export class GeocodingService {
  private googleMapsApiKey: string | null = null;

  async initializeGoogleMaps() {
    if (!this.googleMapsApiKey) {
      try {
        const { data } = await supabase.functions.invoke('get-google-maps-api-key');
        this.googleMapsApiKey = data?.apiKey;
      } catch (error) {
        console.warn('Failed to get Google Maps API key for geocoding');
      }
    }
  }

  async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    await this.initializeGoogleMaps();
    
    if (!this.googleMapsApiKey || !address.trim()) {
      return null;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.googleMapsApiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        return {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          formatted_address: result.formatted_address
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    
    return null;
  }
}

export const geocodingService = new GeocodingService();
