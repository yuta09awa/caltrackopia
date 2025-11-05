# Legacy Map Hooks Migration Guide

## Overview

The following map hooks are deprecated in favor of `useConsolidatedMap`, which provides a unified, more maintainable interface for all map functionality.

### Deprecated Hooks
- ~~`useMapRendering`~~ ✅ Migrated from `UnifiedMapView.tsx`
- ~~`useSimpleMapState`~~ ✅ Migrated from `SimpleMapView.tsx`
- `useMapApi` ⚠️ Still in use by `usePlacesApi.ts`
- ~~`useMapCamera`~~ ✅ Removed (unused)
- ~~`useLocationSelection`~~ ✅ Removed (unused)
- ~~`useMapInteractions`~~ ✅ Removed (unused)

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

### useMapCamera (Removed - Unused)

This hook was not being used anywhere in the codebase and has been removed.

### useLocationSelection (Removed - Unused)

This hook was not being used anywhere in the codebase and has been removed.

### useMapInteractions (Removed - Unused)

This hook and its related helpers (`useMarkerInteractions`, `useNavigationActions`) were not being used anywhere in the codebase and have been removed.

## Migration Timeline

### Phase 1: Deprecation Warnings ✅ COMPLETE
- ✅ JSDoc deprecation warnings added to all legacy hooks
- ✅ Migration guide created
- ✅ `UnifiedMapView.tsx` migrated away from `useMapRendering`
- ✅ `SimpleMapView.tsx` migrated away from `useSimpleMapState`
- ✅ `useMapInteractions.ts` deleted (unused)
- ✅ `useMarkerInteractions.ts` deleted (unused)
- ✅ `useNavigationActions.ts` deleted (unused)
- ✅ `useLocationSelection.ts` deleted (unused)
- ✅ `useMapCamera.ts` deleted (unused)

### Phase 2: Final Cleanup 🚧 IN PROGRESS
**Remaining Task:**
- `usePlacesApi.ts` - Migrate away from `useMapApi` dependency

**After Migration:**
- Delete `useMapApi.ts`
- Remove legacy hook export from `src/features/map/hooks/index.ts`

### Phase 3: Complete 🎯
Once `useMapApi` is migrated:
- All legacy hooks removed ✅
- Clean, consolidated map architecture ✅
- Celebrate! 🎉

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
