import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LocationDetectionResult {
  detectedCity: string;
  detectedRegion: string;
  defaultCenter: { lat: number; lng: number };
  detectionMethod: 'cloudflare' | 'ip-api' | 'fallback';
}

const REGION_DEFAULTS: Record<string, { center: { lat: number; lng: number }; city: string }> = {
  'US-NY': { center: { lat: 40.7128, lng: -74.0060 }, city: 'New York' },
  'US-CA': { center: { lat: 37.7749, lng: -122.4194 }, city: 'San Francisco' },
  'US-IL': { center: { lat: 41.8781, lng: -87.6298 }, city: 'Chicago' },
  'US-WA': { center: { lat: 47.6062, lng: -122.3321 }, city: 'Seattle' },
  'US-TX': { center: { lat: 29.7604, lng: -95.3698 }, city: 'Houston' },
  'default': { center: { lat: 40.7128, lng: -74.0060 }, city: 'New York' }
};

async function detectLocationFromIP(ip: string): Promise<LocationDetectionResult> {
  try {
    // Try IP geolocation API as fallback
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=regionCode,city,lat,lon`);
    if (response.ok) {
      const data = await response.json();
      const regionKey = `US-${data.regionCode}`;
      const region = REGION_DEFAULTS[regionKey] || REGION_DEFAULTS.default;
      
      return {
        detectedCity: data.city || region.city,
        detectedRegion: data.regionCode || 'NY',
        defaultCenter: data.lat && data.lon ? { lat: data.lat, lng: data.lon } : region.center,
        detectionMethod: 'ip-api'
      };
    }
  } catch (error) {
    console.warn('IP geolocation failed:', error);
  }

  // Fallback to default
  const defaultRegion = REGION_DEFAULTS.default;
  return {
    detectedCity: defaultRegion.city,
    detectedRegion: 'NY',
    defaultCenter: defaultRegion.center,
    detectionMethod: 'fallback'
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from various headers
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    
    const clientIp = cfConnectingIp || forwarded?.split(',')[0] || realIp || '127.0.0.1';

    // Try Cloudflare headers first (most accurate for cloud-based detection)
    const cfCountry = req.headers.get('cf-ipcountry');
    const cfRegion = req.headers.get('cf-region');
    const cfCity = req.headers.get('cf-ipcity');

    let result: LocationDetectionResult;

    if (cfCountry === 'US' && cfRegion) {
      // Use Cloudflare data if available
      const regionKey = `US-${cfRegion}`;
      const region = REGION_DEFAULTS[regionKey] || REGION_DEFAULTS.default;
      
      result = {
        detectedCity: cfCity || region.city,
        detectedRegion: cfRegion,
        defaultCenter: region.center,
        detectionMethod: 'cloudflare'
      };
    } else {
      // Fallback to IP geolocation
      result = await detectLocationFromIP(clientIp);
    }

    console.log('Location detection result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Location detection error:', error);
    
    const fallback = REGION_DEFAULTS.default;
    return new Response(JSON.stringify({
      detectedCity: fallback.city,
      detectedRegion: 'NY',
      defaultCenter: fallback.center,
      detectionMethod: 'fallback'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});