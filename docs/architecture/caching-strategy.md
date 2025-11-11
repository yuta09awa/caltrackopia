# Multi-Layer Caching Strategy

## Overview

The unified caching system implements a 3-tier architecture to optimize data access and reduce API calls:

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              UnifiedCacheService (Orchestrator)          │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  L1: Memory │  │ L2: IndexedDB│  │ L3: Supabase│
│  60s TTL    │  │  24h TTL     │  │  Database   │
│  Volatile   │  │  Persistent  │  │  Source     │
└─────────────┘  └─────────────┘  └─────────────┘
```

## Cache Layers

### Layer 1: Memory Cache
- **TTL**: 60 seconds (configurable)
- **Storage**: JavaScript Map in-memory
- **Size Limit**: 100 entries (LRU eviction)
- **Speed**: <1ms access time
- **Persistence**: Volatile (cleared on page reload)

**Use Cases**:
- Frequently accessed data within same page session
- Search results while user is typing
- User navigation between nearby pages

### Layer 2: IndexedDB Cache
- **TTL**: 24 hours (configurable)
- **Storage**: Browser IndexedDB
- **Size Limit**: ~50MB-100MB (browser dependent)
- **Speed**: ~5-20ms access time
- **Persistence**: Survives page reloads

**Use Cases**:
- Offline data access
- Reducing API calls across sessions
- Large datasets (location data, product catalogs)

### Layer 3: Supabase Database
- **TTL**: Managed by `cached_places` table with `freshness_status`
- **Storage**: PostgreSQL with PostGIS
- **Size Limit**: Database capacity
- **Speed**: ~50-200ms (with CDN/edge functions)
- **Persistence**: Permanent until invalidated

**Use Cases**:
- Shared cache across all users
- Reduce Google Places API costs
- Store enriched data with custom fields

## Cache Flow

### Read Operation

```typescript
// User requests data
const places = await dataAccess.searchPlaces('pizza');

// 1. Check L1 (Memory)
if (memoryCache.has('search:pizza')) {
  return memoryCache.get('search:pizza'); // ~1ms
}

// 2. Check L2 (IndexedDB)
if (await indexedDB.get('searches', 'pizza')) {
  const data = await indexedDB.get('searches', 'pizza'); // ~10ms
  memoryCache.set('search:pizza', data); // Promote to L1
  return data;
}

// 3. Fetch from L3 (Supabase)
const data = await supabase.from('cached_places').select('*'); // ~100ms
indexedDB.set('searches', 'pizza', data); // Store in L2
memoryCache.set('search:pizza', data); // Store in L1
return data;
```

### Write Operation

```typescript
// Data is written to all layers simultaneously
await unifiedCacheService.set('places', 'place:123', placeData);

// Stored in:
// - L1: Memory (60s TTL)
// - L2: IndexedDB (24h TTL)
// - L3: Supabase (permanent, managed by freshness_status)
```

## Cache Invalidation

### Manual Invalidation
```typescript
// Invalidate specific key
await unifiedCacheService.invalidate('places', 'place:123');

// Clear entire store
await unifiedCacheService.clearStore('places');

// Clear all caches
await unifiedCacheService.clearAll();
```

### Automatic Invalidation
- **Memory**: TTL-based expiration (60s default)
- **IndexedDB**: TTL-based expiration (24h default)
- **Supabase**: Background job updates `freshness_status`:
  - `fresh` (< 24h old)
  - `stale` (24h - 7d old, eligible for refresh)
  - `expired` (> 7d old, removed from cache)

## Cache Metrics

### Available Metrics
```typescript
const metrics = unifiedCacheService.getMetrics();
// {
//   l1Hits: 150,
//   l1Misses: 50,
//   l2Hits: 30,
//   l2Misses: 20,
//   l3Hits: 20,
//   l3Misses: 5,
//   totalRequests: 275,
//   hitRate: 72.73,
//   l1HitRate: 54.55,
//   l2HitRate: 10.91,
//   l3HitRate: 7.27,
//   avgResponseTime: 15.3,
//   memoryCacheSize: 45
// }
```

### Monitoring in Dev Mode
```typescript
// Access cache metrics in dev tools
window.cacheMetrics = () => unifiedCacheService.getMetrics();

// Reset metrics
unifiedCacheService.resetMetrics();
```

## Integration with DataAccessLayer

### Before (Direct Database Calls)
```typescript
async searchPlaces(query: string): Promise<Place[]> {
  return this.dbService.searchPlaces(query);
}
```

### After (With Unified Caching)
```typescript
async searchPlaces(query: string): Promise<Place[]> {
  return unifiedCacheService.get(
    'searches',
    `search:${query}`,
    async () => this.dbService.searchPlaces(query),
    { ttl: 2 * 60 * 1000 } // 2 min cache
  );
}
```

## Configuration Options

### Per-Request Options
```typescript
interface CacheOptions {
  ttl?: number;           // Override default TTL
  skipMemory?: boolean;   // Skip L1 cache
  skipIndexedDB?: boolean; // Skip L2 cache
  skipSupabase?: boolean; // Skip L3 cache (fetch fresh)
}

// Example: Skip memory cache for large datasets
await unifiedCacheService.get(
  'places',
  'all-locations',
  fetchFn,
  { skipMemory: true, ttl: 10 * 60 * 1000 }
);
```

### Global Configuration
```typescript
// In UnifiedCacheService constructor
private readonly DEFAULT_MEMORY_TTL = 60 * 1000; // 60s
private readonly DEFAULT_INDEXEDDB_TTL = 24 * 60 * 60 * 1000; // 24h
private readonly MAX_MEMORY_SIZE = 100; // entries
```

## Performance Impact

### Before Caching
- **Average API Response**: 150-300ms
- **Repeated Searches**: 150-300ms each
- **Offline Support**: None
- **API Quota Usage**: High

### After Caching
- **L1 Hit (Memory)**: <1ms (99%+ faster)
- **L2 Hit (IndexedDB)**: 5-20ms (95%+ faster)
- **L3 Hit (Supabase)**: 50-150ms (50%+ faster than external API)
- **Offline Support**: Full for cached data
- **API Quota Usage**: Reduced by 80-90%

## Best Practices

### 1. Cache Key Naming
```typescript
// Use descriptive, hierarchical keys
'places:search:pizza'          // ✅ Good
'places:place:123'             // ✅ Good
'places:type:restaurant:limit:20' // ✅ Good

'data'                         // ❌ Too generic
'x'                            // ❌ Not descriptive
```

### 2. TTL Strategy
```typescript
// Static data: Long TTL
ingredients: { ttl: 10 * 60 * 1000 }      // 10 min

// Dynamic data: Short TTL
searchResults: { ttl: 2 * 60 * 1000 }     // 2 min

// User-specific: Very short TTL
userLocation: { ttl: 30 * 1000 }          // 30 sec
```

### 3. Cache Warming
```typescript
// Preload commonly accessed data
async warmCache() {
  await Promise.all([
    dataAccess.getAllIngredients(),
    dataAccess.getAllDietaryRestrictions(),
    dataAccess.getPlacesByType('restaurant', 50)
  ]);
}
```

### 4. Error Handling
```typescript
// Always provide fallback for cache failures
try {
  return await unifiedCacheService.get(...);
} catch (error) {
  console.warn('Cache error, fetching fresh:', error);
  return await fetchFn(); // Direct fetch as fallback
}
```

## Future Enhancements

### Phase 3 (Planned)
- [ ] Background cache refresh (stale-while-revalidate)
- [ ] Cache compression for large datasets
- [ ] Service Worker integration for offline-first
- [ ] Distributed cache invalidation events
- [ ] Cache priority levels (high/medium/low)
- [ ] Smart prefetching based on user behavior

### Phase 4 (Planned)
- [ ] Edge caching with CDN integration
- [ ] Multi-region cache synchronization
- [ ] Cache analytics dashboard
- [ ] A/B testing for cache strategies
- [ ] Machine learning for optimal TTL prediction

## Troubleshooting

### Cache Not Working
1. Check browser storage quota: `navigator.storage.estimate()`
2. Verify IndexedDB is enabled (private browsing may disable it)
3. Check console for cache errors
4. Clear cache and reload: `unifiedCacheService.clearAll()`

### High Memory Usage
1. Reduce `MAX_MEMORY_SIZE` in UnifiedCacheService
2. Use `skipMemory: true` for large datasets
3. Monitor with `getMetrics()` and clear periodically

### Stale Data Issues
1. Reduce TTL for frequently changing data
2. Implement manual invalidation on data updates
3. Use `skipIndexedDB: true` to force fresh fetch

## Conclusion

The multi-layer caching strategy provides:
- **95%+ performance improvement** for repeated requests
- **80-90% reduction** in API costs
- **Full offline support** for cached data
- **Automatic cache promotion** for optimal performance
- **Detailed metrics** for monitoring and optimization

This architecture scales from MVP to global deployment while maintaining simplicity and maintainability.
