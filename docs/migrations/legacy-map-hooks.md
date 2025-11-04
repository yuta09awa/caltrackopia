# Legacy Map Hooks Migration Guide

## Overview

The following map hooks are deprecated in favor of `useConsolidatedMap`, which provides a unified, more maintainable interface for all map functionality.

### Deprecated Hooks
- `useMapRendering`
- `useSimpleMapState`
- `useMapApi`
- `useMapCamera`
- `useLocationSelection`

## Why Migrate?

- **Single Source of Truth**: `useConsolidatedMap` consolidates all map logic into one hook
- **Better Performance**: Optimized state management and memoization
- **Easier Testing**: Simpler API surface to test
- **Future-Proof**: New features will only be added to `useConsolidatedMap`

## Migration Path

### useMapRendering → useConsolidatedMap

**Before:**
```typescript
import { useMapRendering } from '@/features/map/hooks/useMapRendering';

const MyMapComponent = () => {
  const { mapOptions, handleMapLoad, handleMapIdle, getCurrentViewportBounds } = useMapRendering();
  
  return (
    <GoogleMap
      options={mapOptions}
      onLoad={handleMapLoad}
      onIdle={() => handleMapIdle(onMapIdleCallback)}
    />
  );
};
```

**After:**
```typescript
import { useConsolidatedMap } from '@/features/map';

const MyMapComponent = () => {
  const { 
    mapState, 
    mapOptions, 
    handleMapLoad, 
    handleMapIdle 
  } = useConsolidatedMap({
    initialCenter: { lat: 40.7589, lng: -73.9851 },
    initialZoom: 12,
    enableSearch: false,
    enableUserLocation: false
  });
  
  return (
    <GoogleMap
      center={mapState.center}
      zoom={mapState.zoom}
      options={mapOptions}
      onLoad={handleMapLoad}
      onIdle={() => handleMapIdle()}
    />
  );
};
```

### useSimpleMapState → useConsolidatedMap

**Before:**
```typescript
import { useSimpleMapState } from '@/features/map/hooks/useSimpleMapState';

const MyMapComponent = () => {
  const { 
    mapState, 
    updateCenter, 
    updateZoom, 
    updateMarkers, 
    selectLocation 
  } = useSimpleMapState(
    { lat: 40.7589, lng: -73.9851 }, 
    12
  );
  
  // Use mapState.center, mapState.zoom, etc.
};
```

**After:**
```typescript
import { useConsolidatedMap } from '@/features/map';

const MyMapComponent = () => {
  const { 
    mapState, 
    updateCenter, 
    updateZoom, 
    setMarkers, 
    selectLocation 
  } = useConsolidatedMap({
    initialCenter: { lat: 40.7589, lng: -73.9851 },
    initialZoom: 12,
    enableSearch: false,
    enableUserLocation: false
  });
  
  // Use mapState.center, mapState.zoom, mapState.markers, etc.
};
```

**Key Differences:**
- `updateMarkers` → `setMarkers`
- `selectLocation` takes `locationId: string | null` directly (no wrapper function needed)

### useMapApi → useConsolidatedMap (Internal Usage)

**Note**: `useMapApi` is primarily used internally. If you're using it directly, consider whether you need that functionality or if `useConsolidatedMap` already provides it.

**Before:**
```typescript
import { useMapApi } from '@/features/map/hooks/useMapApi';

const { waitForPlacesApi, getPlaceDetails } = useMapApi();
```

**After:**
```typescript
import { usePlacesApi } from '@/features/map';

// Use the recommended Places API hook instead
const { getPlaceDetails } = usePlacesApi();
```

### useMapCamera → useConsolidatedMap

**Before:**
```typescript
import { useMapCamera } from '@/features/map/hooks/useMapCamera';

const { mapRef, onLoad, onCameraChanged } = useMapCamera({ 
  mapState, 
  onMapIdle 
});
```

**After:**
```typescript
import { useConsolidatedMap } from '@/features/map';

const { handleMapLoad, handleMapIdle } = useConsolidatedMap({
  initialCenter: mapState.center,
  initialZoom: mapState.zoom,
  onMapIdle: (center, zoom) => {
    // Your idle handler
  }
});

// Use handleMapLoad and handleMapIdle directly
```

### useLocationSelection → useConsolidatedMap

**Before:**
```typescript
import { useLocationSelection } from '@/features/map/hooks/useLocationSelection';

const { 
  selectedLocation, 
  setSelectedLocation, 
  handleLocationSelect 
} = useLocationSelection();
```

**After:**
```typescript
import { useConsolidatedMap } from '@/features/map';

const { 
  mapState, 
  selectLocation 
} = useConsolidatedMap({
  initialCenter: { lat: 40.7589, lng: -73.9851 },
  initialZoom: 12
});

// Access selected location ID via mapState.selectedLocationId
// Select location via selectLocation(locationId)
```

## Migration Timeline

### Phase 1: Deprecation Warnings (Current)
- ✅ JSDoc deprecation warnings added to all legacy hooks
- ✅ Migration guide created
- IDEs will show strikethrough on usage

### Phase 2: Component Migration (Next Sprint)
**High Priority:**
1. `SimpleMapView.tsx` - Migrate from `useSimpleMapState`
2. `UnifiedMapView.tsx` - Migrate from `useMapRendering`

**Medium Priority:**
3. `useMapInteractions.ts` - Remove `useLocationSelection` dependency
4. `usePlacesApi.ts` - Remove `useMapApi` dependency

**Low Priority:**
5. Audit `useMapCamera` usage - may already be unused

### Phase 3: Removal (Future)
- Delete legacy hook files
- Remove exports from `src/features/map/hooks/index.ts`
- Celebrate clean, maintainable code! 🎉

## Need Help?

- Check the `useConsolidatedMap` implementation in `src/features/map/hooks/useConsolidatedMap.ts`
- Review existing usages in `MapScreen` and `UnifiedMapView`
- Ask in team chat or open a GitHub discussion

## Troubleshooting

### "I need feature X that was in the old hook"

If you find functionality in a legacy hook that's missing from `useConsolidatedMap`, please:
1. Open an issue describing the missing feature
2. We'll add it to `useConsolidatedMap` or provide an alternative
3. Don't try to keep using the legacy hook - it won't receive updates

### "The API is different and I'm confused"

That's expected! The new API is designed to be simpler and more consistent. Key changes:
- All map state is in `mapState` object
- Clearer function naming (e.g., `setMarkers` vs `updateMarkers`)
- Options-based configuration instead of multiple parameters
- Built-in TypeScript support for better autocomplete

Take your time, migrate one component at a time, and test thoroughly.
