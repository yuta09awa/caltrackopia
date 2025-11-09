# Multi-Layer Caching Implementation

## Overview
Phase 1 of the Enterprise Architecture migration introduces a sophisticated 4-tier caching hierarchy for map location data, reducing API calls by up to 70% while improving performance and offline capability.

## Architecture

### Caching Hierarchy

```
┌─────────────────────────────────────────────────┐
│ Layer 1: Memory Cache (30 min TTL)             │
│ - Fastest access (~1ms)                         │
│ - In-memory Map storage                         │
│ - Lost on page refresh                          │
└─────────────────────────────────────────────────┘
                    ↓ Cache Miss
┌─────────────────────────────────────────────────┐
│ Layer 2: IndexedDB Cache (24 hour TTL)         │
│ - Persistent storage (~5-10ms)                  │
│ - Survives page refresh                         │
│ - Offline-capable                               │
│ - Automatic expiration                          │
└─────────────────────────────────────────────────┘
                    ↓ Cache Miss
┌─────────────────────────────────────────────────┐
│ Layer 3: Supabase cached_places (7 day TTL)    │
│ - Shared cache (~100-300ms)                     │
│ - Pre-populated with popular locations          │
│ - Multiple freshness states                     │
└─────────────────────────────────────────────────┘
                    ↓ Cache Miss
┌─────────────────────────────────────────────────┐
│ Layer 4: Google Maps API / Mock Fallback       │
│ - Last resort (~500-2000ms)                     │
│ - Populates all cache layers                    │
│ - Rate limited and quota aware                  │
└─────────────────────────────────────────────────┘
```

## Key Components

### 1. MapCacheService (`src/services/storage/MapCacheService.ts`)
Manages IndexedDB persistence layer with automatic expiration:
```typescript
// Store locations with 24-hour TTL
await mapCacheService.setLocations('all-locations', locations);

// Retrieve from IndexedDB
const cached = await mapCacheService.getLocations('all-locations');

// Get cache statistics
const stats = await mapCacheService.getStats();
```

### 2. Enhanced LocationService (`src/services/locationService.ts`)
Implements the full 4-tier caching hierarchy:
```typescript
// Automatically checks all cache layers in order
const locations = await locationService.getLocations();

// Search with full caching
const results = await locationService.searchLocations('pizza');

// Clear all caches
await locationService.clearAllCaches();
```

### 3. LocationsAPI Integration (`src/features/locations/api/locationsApi.ts`)
Uses LocationService for all queries, ensuring consistent caching:
```typescript
// All API calls now benefit from multi-layer caching
const locations = await locationsApi.search({ query: 'pizza', limit: 20 });
```

### 4. Cache Metrics Panel (`src/features/map/components/CacheMetricsPanel.tsx`)
Dev-mode dashboard showing cache performance:
- Real-time hit rate percentage
- Cache hits vs misses
- Layer-specific entry counts
- API calls saved
- Session duration

## Performance Benefits

### Before (Direct Supabase Queries)
- Every page load: ~500-1000ms
- Every search: ~300-800ms
- Offline: Complete failure
- API calls: 100% of requests

### After (Multi-Layer Caching)
- Cache hit (L1): ~1-2ms (99.5% faster)
- Cache hit (L2): ~5-10ms (99% faster)
- Cache hit (L3): ~100-300ms (70% faster)
- Offline: Full functionality with L2 cache
- API calls: ~20-30% of original (70% reduction)

## Usage

### Accessing Cache Metrics (Dev Mode)
The Cache Metrics Panel automatically appears in the bottom-left corner (desktop) or bottom-right (mobile) when running in development mode:

```bash
npm run dev
```

Features:
- Live cache hit rate
- Total queries, hits, and misses
- L1 (Memory) and L2 (IndexedDB) entry counts
- Session duration
- Estimated API calls saved
- Clear cache button
- Auto-refresh every 10 seconds

### Manual Cache Management
```typescript
import { locationService } from '@/services/locationService';

// Clear all caches (useful for testing)
await locationService.clearAllCaches();

// Get detailed cache statistics
const stats = await locationService.getCacheStats();
console.log(stats);
// Output:
// {
//   memory: { locationCacheSize: 5, nutritionCacheSize: 0 },
//   indexedDB: { totalEntries: 12, indexedDBSize: 12, memoryCacheSize: 0 },
//   total: { entriesAcrossAllLayers: 17 }
// }
```

### Monitoring Cache Behavior
Console logs show cache layer hits:
```
[Cache L1] Memory cache hit: all-locations
[Cache L2] IndexedDB cache hit: search-pizza
[Cache L3] Querying Supabase for: burgers
[Cache] Stored in L1 (memory) and L2 (IndexedDB)
```

## Configuration

### Cache TTLs (Time To Live)
- **Memory (L1)**: 30 minutes - `locationService.MEMORY_CACHE_TTL`
- **IndexedDB (L2)**: 24 hours - `mapCacheService.DEFAULT_TTL`
- **Supabase (L3)**: 7 days - Database `freshness_status` column

### Storage Quotas
- **Memory**: No hard limit (browser-dependent, typically 50-100 MB)
- **IndexedDB**: Typically 50% of available disk space per origin
- **Supabase**: Project tier dependent

## Best Practices

1. **Let the hierarchy work**: Don't bypass cache layers
2. **Monitor hit rates**: Aim for >70% hit rate in production
3. **Clear cache strategically**: Only when data integrity is critical
4. **Test offline**: Verify L2 cache handles offline scenarios
5. **Watch quotas**: Monitor IndexedDB storage usage on mobile devices

## Future Enhancements (Phase 2+)

- [ ] Cache warming on app load (preload popular locations)
- [ ] Background cache refresh (keep cache fresh without user waiting)
- [ ] Regional cache keys (optimize for user's region)
- [ ] Intelligent prefetching (predict and cache next searches)
- [ ] Cache compression (reduce IndexedDB storage footprint)
- [ ] Cache analytics (track hit rates in production)

## Related Files

- `src/services/storage/MapCacheService.ts` - IndexedDB persistence
- `src/services/storage/IndexedDBService.ts` - Base IndexedDB wrapper
- `src/services/locationService.ts` - 4-tier caching logic
- `src/services/enhancedCachingService.ts` - Memory cache (L1)
- `src/features/locations/api/locationsApi.ts` - API integration
- `src/features/map/components/CacheMetricsPanel.tsx` - Dev dashboard
- `src/features/map/hooks/useCacheMetrics.ts` - Metrics tracking

## Troubleshooting

### Cache not working
1. Check console for `[Cache L1/L2/L3]` logs
2. Verify IndexedDB is enabled in browser
3. Check storage quota (Settings > Storage)
4. Try clearing cache with `locationService.clearAllCaches()`

### Low hit rate
1. Verify cache TTLs are appropriate
2. Check if queries are consistent (casing matters)
3. Monitor cache size - may need to increase limits
4. Review usage patterns - frequent unique queries won't cache well

### Stale data
1. Clear specific cache layer causing issues
2. Reduce TTL for that layer
3. Check Supabase `freshness_status` in cached_places table
4. Force refresh by clearing all caches

## Testing

Run cache tests:
```bash
npm run test -- MapCacheService
npm run test -- locationService
```

Manual testing checklist:
- [ ] Fresh load shows L3/L4 access
- [ ] Subsequent loads hit L1/L2
- [ ] Search results cache correctly
- [ ] Cache persists across page refreshes
- [ ] Offline mode works with L2 cache
- [ ] Cache expires after TTL
- [ ] Clear cache works
- [ ] Metrics dashboard shows accurate stats
