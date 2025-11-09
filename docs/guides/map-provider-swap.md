# Map Provider Swap Guide

This guide explains how to swap between different map providers (Google Maps, Mapbox, etc.) in NutriMap without changing application code.

## Architecture Overview

NutriMap uses the **Provider Pattern** to abstract location search functionality. The `ILocationProvider` interface defines a standard contract that all providers must implement, allowing seamless provider swapping.

```
┌─────────────────┐
│  Application    │
│    Code         │
└────────┬────────┘
         │
         │ uses
         ▼
┌─────────────────────────┐
│ LocationProviderFactory │ ◄── VITE_MAP_PROVIDER env var
└────────┬────────────────┘
         │
         │ creates
         ▼
┌─────────────────────────┐
│  ILocationProvider      │ (interface)
└────────┬────────────────┘
         │
         │ implemented by
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────┐
│ Google  │ │ Mapbox   │
│ Maps    │ │ Provider │
└─────────┘ └──────────┘
```

## Current Providers

### 1. Google Maps Provider (Default)
- **Status**: ✅ Fully Implemented
- **API**: Google Places API
- **Features**: Text search, nearby search, place details
- **Cost**: Pay-per-request pricing
- **Setup**: Requires Google Maps API key (already configured)

### 2. Mapbox Provider
- **Status**: 🚧 Skeleton Only
- **API**: Mapbox Geocoding API + Search API
- **Features**: Not yet implemented
- **Cost**: Different pricing model than Google
- **Setup**: Requires Mapbox access token

## How to Swap Providers

### Step 1: Set Environment Variable

Add or update the `VITE_MAP_PROVIDER` variable in your `.env` file:

```bash
# Use Google Maps (default)
VITE_MAP_PROVIDER=google-maps

# OR use Mapbox
VITE_MAP_PROVIDER=mapbox
```

### Step 2: Restart Development Server

```bash
npm run dev
```

The application will automatically use the configured provider on startup.

### Step 3: Verify Provider Switch

Check the browser console for provider initialization logs:

```
[LocationProviderFactory] Using Google Maps provider (default)
[GoogleMapsProvider] API loaded successfully
```

or

```
[LocationProviderFactory] Using Mapbox provider
[MapboxProvider] Initialization not yet implemented
```

## Implementing a New Provider

To add a new map provider (e.g., Mapbox, HERE Maps, TomTom):

### 1. Create Provider Class

```typescript
// src/services/providers/MapboxProvider.ts
import {
  ILocationProvider,
  PlaceResult,
  TextSearchOptions,
  NearbySearchOptions,
  PlaceDetailsOptions,
  ProviderConfig
} from './ILocationProvider';

export class MapboxProvider implements ILocationProvider {
  readonly name = 'mapbox';
  private ready = false;
  private accessToken: string;

  constructor(private config: ProviderConfig = {}) {
    this.accessToken = config.apiKey || '';
  }

  async initialize(): Promise<boolean> {
    // Initialize Mapbox SDK
    if (!this.accessToken) {
      console.error('[MapboxProvider] Missing access token');
      return false;
    }

    try {
      // Load Mapbox GL JS if needed
      this.ready = true;
      return true;
    } catch (error) {
      console.error('[MapboxProvider] Initialization failed:', error);
      return false;
    }
  }

  isReady(): boolean {
    return this.ready;
  }

  async searchPlacesByText(options: TextSearchOptions): Promise<PlaceResult[]> {
    // Implement using Mapbox Geocoding API
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(options.query)}.json?` +
      `proximity=${options.center.lng},${options.center.lat}&` +
      `access_token=${this.accessToken}`
    );

    const data = await response.json();
    
    // Convert Mapbox features to PlaceResult format
    return data.features.map((feature: any) => ({
      place_id: feature.id,
      name: feature.text,
      formatted_address: feature.place_name,
      geometry: {
        location: {
          lng: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1]
        }
      },
      types: feature.place_type
    }));
  }

  async searchNearbyPlaces(options: NearbySearchOptions): Promise<PlaceResult[]> {
    // Implement nearby search logic
    return [];
  }

  async getPlaceDetails(options: PlaceDetailsOptions): Promise<PlaceResult | null> {
    // Implement place details retrieval
    return null;
  }

  cleanup(): void {
    this.ready = false;
  }
}
```

### 2. Register in Factory

```typescript
// src/services/providers/LocationProviderFactory.ts
import { MapboxProvider } from './MapboxProvider';

export class LocationProviderFactory {
  static createProvider(config?: ProviderConfig): ILocationProvider {
    const providerType = getConfiguredProvider();
    
    switch (providerType) {
      case 'mapbox':
        return new MapboxProvider(config); // Add this case
      
      case 'google-maps':
      default:
        return new GoogleMapsProvider(config);
    }
  }
}
```

### 3. Update Type Definition

```typescript
// src/services/providers/LocationProviderFactory.ts
export type ProviderType = 'google-maps' | 'mapbox' | 'your-provider';
```

## Provider Comparison

| Feature | Google Maps | Mapbox | Notes |
|---------|------------|--------|-------|
| Text Search | ✅ | 🚧 | Google: Full. Mapbox: Not implemented |
| Nearby Search | ✅ | 🚧 | Google: Full. Mapbox: Not implemented |
| Place Details | ✅ | 🚧 | Google: Full. Mapbox: Not implemented |
| Cost (1M requests) | ~$200 | ~$50 | Approximate, check current pricing |
| Rate Limits | 100K/day free | 100K/month free | Free tier limits |
| Global Coverage | Excellent | Good | Google has more POI data |
| Customization | Limited | Excellent | Mapbox allows custom map styles |

## Testing Provider Swaps

### Manual Testing
1. Switch `VITE_MAP_PROVIDER` to target provider
2. Restart dev server
3. Test core flows:
   - Search for restaurants
   - Click on markers
   - View place details
   - Apply filters

### Automated Testing
```typescript
// Example test
import { LocationProviderFactory } from '@/services/providers';

describe('Provider Abstraction', () => {
  it('should create Google Maps provider by default', () => {
    const provider = LocationProviderFactory.getProvider();
    expect(provider.name).toBe('google-maps');
  });

  it('should support provider swapping', () => {
    LocationProviderFactory.reset();
    // Change env var programmatically
    const provider = LocationProviderFactory.createProvider();
    // Verify correct provider instantiated
  });
});
```

## Rollback Strategy

If a new provider causes issues:

### Quick Rollback
```bash
# .env
VITE_MAP_PROVIDER=google-maps  # Revert to default
```

### Feature Flag Rollback
```sql
-- Disable provider swap feature
UPDATE feature_flags 
SET enabled = false 
WHERE flag_name = 'alternative-map-provider';
```

## Cost Optimization Tips

### Google Maps
- Use caching aggressively (already implemented)
- Enable Places API quota limits in Google Cloud Console
- Use session tokens for autocomplete (if implemented)

### Mapbox
- Cache geocoding results
- Use vector tiles instead of raster
- Implement request debouncing

## Future Enhancements

1. **Multi-Provider Fallback**: Use Mapbox if Google quota exceeded
2. **A/B Testing**: Compare provider performance with feature flags
3. **Hybrid Approach**: Use Google for POI, Mapbox for map tiles
4. **Provider Analytics**: Track success rate, latency per provider

## References

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/)
- [Provider Pattern (Gang of Four)](https://refactoring.guru/design-patterns/abstract-factory)

## Support

For provider-related issues, check:
1. Browser console logs (provider initialization)
2. Network tab (API requests)
3. Feature flag status (`alternative-map-provider`)
4. API key validity in Supabase Edge Function Secrets
