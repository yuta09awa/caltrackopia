# NutriMap Architecture Summary

**Last Updated**: 2025-01-29  
**Status**: Production-Ready MVP with Technical Debt

---

## Executive Overview

NutriMap is a health-focused food discovery platform built on a **feature-first architecture** with a sophisticated **3-tier caching strategy**, **domain-driven design**, and **provider abstraction**. The application supports 1000+ concurrent users with <2s load times through aggressive caching and edge function optimization.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui + Framer Motion
- **State**: Zustand (global) + TanStack Query (server)
- **Backend**: Supabase (PostgreSQL) + Edge Functions
- **Maps**: Google Maps API (abstracted, swappable to Mapbox)
- **Caching**: 3-tier (Memory → IndexedDB → Supabase)
- **Workers**: Cloudflare Workers (CDC sync to Turso SQLite)

---

## Architecture Layers

### 1. Presentation Layer (Frontend)
```
src/
├── app/                    # App-level providers, routing, store
├── components/             # UI components (layout, common, domain)
├── features/               # Feature modules (auth, cart, map, locations)
├── screens/                # Screen-level compositions (MapScreen)
├── pages/                  # Route-level pages
└── shared/                 # Cross-cutting utilities
```

**Key Patterns**:
- **Feature-First**: Each feature is self-contained with hooks, components, services, types
- **Compound Components**: Location cards, filters use composition pattern
- **Lazy Loading**: Routes and heavy components are code-split

### 2. Domain Layer (Business Logic)
```
src/domains/
├── core/                   # Cart domain (CQRS)
├── location/               # Location domain events
└── health/                 # Health/nutrition domain
```

**CQRS Pattern**: Commands (write), Queries (read), Events (pub/sub via EventBus)

### 3. Service Layer (Data Access)
```
src/services/
├── core/                   # ServiceBase, StandardServiceBase
├── data/                   # DataAccessLayer (✅ RECOMMENDED)
├── cache/                  # UnifiedCacheService (3-tier)
├── providers/              # LocationProviderFactory (Google/Mapbox)
├── storage/                # IndexedDBService, MapCacheService
├── api/                    # ApiService
└── [legacy services]       # ❌ TO BE REFACTORED
```

**Service Architecture**:
- `ServiceBase`: Base class with state management, error handling
- `DataAccessLayer`: **Single source of truth** for all data operations
- `UnifiedCacheService`: 3-tier caching (Memory → IndexedDB → Supabase)
- `LocationProviderFactory`: Abstraction for map providers (Google/Mapbox)

### 4. State Management
```
src/app/store/
├── index.ts                # Unified Zustand store
├── authSlice.ts            # Auth state
├── cartSlice.ts            # Cart state (with CQRS)
├── mapFiltersSlice.ts      # Map filters (session-only)
└── userPreferencesSlice.ts # User preferences
```

**Persistence Strategy**:
- ✅ Persisted: auth, cart, user preferences
- ❌ Not Persisted: map filters (session-only)

### 5. Backend Layer
```
supabase/
├── functions/              # Edge functions (API keys, cache manager)
└── migrations/             # Database schema

workers/
├── src/                    # Cloudflare Workers (CDC sync)
└── migrations/             # Turso schema
```

**Backend Architecture**:
- **Supabase**: Primary database, auth, storage, edge functions
- **Turso (Workers)**: Read-replica for low-latency search
- **CDC Webhooks**: Real-time sync Supabase → Turso

---

## Data Flow Architecture

### Read Path (3-Tier Caching)
```
User Request
    ↓
Component (useQuery)
    ↓
DataAccessLayer.searchPlaces()
    ↓
UnifiedCacheService.get()
    ↓
┌─────────────────────────────┐
│ L1: Memory Cache (60s TTL)  │ ← Fastest, volatile
└─────────────────────────────┘
    ↓ (miss)
┌─────────────────────────────┐
│ L2: IndexedDB (24h TTL)     │ ← Persistent, browser
└─────────────────────────────┘
    ↓ (miss)
┌─────────────────────────────┐
│ L3: Supabase cached_places  │ ← Database cache
└─────────────────────────────┘
    ↓ (miss)
┌─────────────────────────────┐
│ L4: Google Maps API         │ ← External API
└─────────────────────────────┘
```

**Performance Metrics** (from Phase 1 Multi-Layer Caching):
- 70% API call reduction
- <100ms L1/L2 response time
- ~500ms L3 response time
- 2-3s L4 response time

### Write Path (Cart Domain)
```
User Action (Add to Cart)
    ↓
CartSlice.addItem()
    ↓
CQRS Command (addItemCommand)
    ↓
Domain Logic + Validation
    ↓
State Update (Zustand)
    ↓
Event Published (eventBus)
    ↓
Subscribers (analytics, persistence)
```

---

## Key Architectural Patterns

### 1. Feature-First Organization ✅
**Status**: Well-implemented

Each feature is self-contained:
```
features/locations/
├── api/                    # locationsApi.ts
├── components/             # LocationCard, LocationList, etc.
├── hooks/                  # useLocations.ts
├── types/                  # index.ts
├── utils/                  # locationUtils.ts, validationUtils.ts
└── index.ts                # Public API
```

### 2. CQRS + Event Sourcing (Partial) 🟡
**Status**: Only implemented in Cart domain

**Current**: Cart domain uses CQRS pattern with EventBus  
**Missing**: Location, Health, Auth domains don't use CQRS

### 3. Provider Abstraction ✅
**Status**: Implemented but underutilized

```typescript
// Swap providers via env var
VITE_MAP_PROVIDER=google-maps  // or mapbox
```

**Current Providers**:
- ✅ Google Maps (fully implemented)
- 🚧 Mapbox (skeleton only)

### 4. Multi-Layer Caching ✅
**Status**: Production-ready, high performance

See `docs/features/multi-layer-caching.md` for full documentation.

### 5. Standardized Service Layer 🟡
**Status**: In migration, dual patterns

**Recommended** (New):
```typescript
import { dataAccess } from '@/services';
const places = await dataAccess.searchPlaces('pizza');
```

**Legacy** (Old):
```typescript
import { databaseService } from '@/services/databaseService';
const places = await databaseService.searchPlaces('pizza');
```

---

## Current State Analysis

### ✅ Strengths

1. **3-Tier Caching**: Best-in-class performance optimization
2. **Provider Abstraction**: Vendor independence for maps
3. **Feature-First**: Clean separation of concerns
4. **Type Safety**: Comprehensive TypeScript coverage
5. **Edge Functions**: Secure API key management, server-side logic
6. **PWA Support**: Offline-first capabilities
7. **RBAC**: Role-based access control with RLS policies

### 🟡 Areas of Concern

1. **Service Layer Duplication**: 20+ legacy services still in use
2. **Hook Consolidation**: Map hooks scattered across multiple files
3. **State Management**: Mix of Zustand, local state, TanStack Query
4. **Domain Coverage**: CQRS only in Cart domain
5. **Testing**: Minimal test coverage (<10%)
6. **Documentation**: Inconsistent inline documentation

### ❌ Technical Debt

1. **Legacy Services**: `databaseService`, `locationService`, `nutritionService` should be replaced with `DataAccessLayer`
2. **Map Hooks**: 15+ map-related hooks need consolidation (see `useConsolidatedMap`)
3. **Mock Data**: Hardcoded test data in production code (`TEST_MARKERS` in `useMapState.tsx`)
4. **Type Mismatches**: `Location` vs `EnhancedPlace` vs `MarkerData` redundancy
5. **Error Boundaries**: Only implemented in Cart and Locations features
6. **Analytics**: Event tracking inconsistent across features

---

## Refactoring Priorities

### 🔴 High Priority (2-3 weeks)

#### 1. Complete Service Layer Migration
**Problem**: 20+ legacy services cause confusion, duplicated logic

**Solution**:
```typescript
// Before (DEPRECATED)
import { databaseService } from '@/services/databaseService';
import { locationService } from '@/services/locationService';
import { nutritionService } from '@/services/nutritionService';

// After (RECOMMENDED)
import { dataAccess } from '@/services';
const places = await dataAccess.searchPlaces('pizza');
const ingredients = await dataAccess.searchIngredients('tomato');
```

**Files to Refactor**:
- `src/services/databaseService.ts` → Deprecate
- `src/services/locationService.ts` → Deprecate
- `src/services/nutritionService.ts` → Deprecate
- `src/services/enhancedDatabaseService.ts` → Deprecate
- Update 50+ import statements across codebase

**Estimated Impact**: 
- ✅ -30% code duplication
- ✅ -40% cognitive load
- ✅ Consistent error handling

#### 2. Map Hook Consolidation
**Problem**: 15+ map hooks scattered, inconsistent patterns

**Current State**:
```typescript
// Scattered across multiple files
useMapState()       // src/features/map/hooks/useMapState.tsx
useMapCore()        // src/features/map/hooks/useMapCore.ts
useMapMarkers()     // src/features/map/hooks/useMapMarkers.ts
useMapUI()          // src/features/map/hooks/useMapUI.ts
useMapSearch()      // src/features/map/hooks/useMapSearch.ts
useUserLocation()   // src/features/map/hooks/useUserLocation.tsx
// ... 10+ more
```

**Solution**: Use `useConsolidatedMap` (already exists!)
```typescript
// Single unified hook
const {
  mapState,
  markers,
  selectedLocationId,
  performSearch,
  selectLocation,
  handleMarkerClick,
  // ... all map functionality
} = useConsolidatedMap({
  enableSearch: true,
  enableUserLocation: true,
  enableInfoCard: true,
});
```

**Files to Refactor**:
- ✅ `useMapScreen.ts` (already uses `useConsolidatedMap`)
- ❌ `src/pages/MapPage.tsx` (still uses old hooks)
- ❌ Map-related components using old hooks

**Estimated Impact**:
- ✅ -60% map hook files
- ✅ Consistent behavior across map features
- ✅ Easier to test

#### 3. Type System Unification
**Problem**: 3 overlapping types for locations

```typescript
// Current mess
interface Location { ... }           // src/models/Location.ts
interface EnhancedPlace { ... }      // src/services/databaseService.ts
interface MarkerData { ... }         // src/features/map/types/index.ts
```

**Solution**: Single canonical type
```typescript
// src/shared/types/location.ts
export interface Location {
  id: string;
  place_id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  // ... unified fields
}

// Adapter functions for external APIs
export function toLocation(googlePlace: GooglePlace): Location { ... }
export function toMarkerData(location: Location): MarkerData { ... }
```

**Files to Refactor**:
- Create `src/shared/types/location.ts`
- Update 100+ files with type imports
- Add type guards and adapters

**Estimated Impact**:
- ✅ Type safety across boundaries
- ✅ Reduced mapping logic
- ✅ Better IDE autocomplete

### 🟡 Medium Priority (4-6 weeks)

#### 4. Expand CQRS Pattern to All Domains
**Current**: Only Cart domain uses CQRS

**Target Domains**:
```
src/domains/
├── location/               # Add CQRS commands/queries
├── health/                 # Add CQRS commands/queries
├── auth/                   # Add CQRS commands/queries
└── search/                 # New domain with CQRS
```

**Example**: Location Domain
```typescript
// Commands
export const selectLocationCommand = (locationId: string) => { ... };
export const searchLocationsCommand = (query: string) => { ... };

// Queries
export const getSelectedLocationQuery = () => { ... };
export const getLocationsByTypeQuery = (type: LocationType) => { ... };

// Events
export const locationSelectedEvent = (locationId: string) => { ... };
export const locationSearchedEvent = (query: string) => { ... };
```

#### 5. Component Library Standardization
**Problem**: Inconsistent component patterns

**Solution**: Compound component pattern everywhere
```typescript
// Before
<LocationCard location={location} />

// After (Compound Components)
<LocationCard.Root>
  <LocationCard.Header />
  <LocationCard.Image />
  <LocationCard.Body />
  <LocationCard.Actions />
</LocationCard.Root>
```

**Already Implemented**:
- ✅ `LocationCard` (see `src/features/locations/components/LocationCard/`)

**To Migrate**:
- ❌ `RestaurantDetails`
- ❌ `MarketDetails`
- ❌ Filter components

#### 6. Error Boundary Coverage
**Current**: Only Cart and Locations have error boundaries

**Target**: All features + routes
```typescript
// Wrap every feature module
<ErrorBoundary fallback={<FeatureErrorFallback />}>
  <LocationsFeature />
</ErrorBoundary>
```

### 🟢 Low Priority (7+ weeks)

#### 7. Testing Infrastructure
**Current**: <10% test coverage

**Target**: 70% coverage for critical paths
- Unit tests: Hooks, utils, services
- Integration tests: API calls, caching
- E2E tests: User flows (search, cart, checkout)

#### 8. Performance Monitoring
**Add**: Real-time performance tracking
```typescript
// Track critical metrics
usePerformanceMonitor({
  trackPageLoad: true,
  trackAPILatency: true,
  trackCacheHitRate: true,
});
```

#### 9. Analytics Standardization
**Current**: Inconsistent event tracking

**Solution**: Unified analytics service
```typescript
import { analytics } from '@/services';
analytics.track('location_viewed', { locationId, source });
```

---

## Migration Roadmap

### Phase 1: Service Layer Cleanup (Week 1-2)
1. Mark legacy services as deprecated with JSDoc warnings
2. Update `src/services/index.ts` to export only recommended services
3. Create migration guide in `docs/migrations/service-layer-migration.md`
4. Update 10 high-traffic files to use `DataAccessLayer`

### Phase 2: Map Hook Consolidation (Week 2-3)
1. Audit all usages of old map hooks
2. Migrate `MapPage.tsx` to use `useConsolidatedMap`
3. Deprecate old map hooks with console warnings
4. Update documentation

### Phase 3: Type System Unification (Week 3-4)
1. Create `src/shared/types/location.ts` with canonical `Location` type
2. Add adapter functions for external APIs
3. Update 20 files per day with new types
4. Remove deprecated types

### Phase 4: Domain Expansion (Week 5-6)
1. Implement CQRS in Location domain
2. Implement CQRS in Health domain
3. Implement CQRS in Auth domain
4. Update all state management to use domain events

---

## Code Smells & Anti-Patterns

### 🚨 Active Anti-Patterns

1. **God Objects**: `useMapScreen` does too much (150 LOC)
2. **Magic Numbers**: Hardcoded cache TTLs, pagination limits
3. **Prop Drilling**: Map props passed through 4+ levels
4. **Mock Data in Production**: `TEST_MARKERS` in `useMapState.tsx`
5. **Inconsistent Naming**: `location` vs `place` vs `marker`

### 🟡 Code Smells

1. **Large Files**: `DataAccessLayer.ts` (437 LOC) should be split
2. **Deep Nesting**: Some components have 6+ levels of nesting
3. **Missing Abstractions**: Direct Supabase calls in some components
4. **Callback Hell**: Some map interaction handlers have 3+ nested callbacks
5. **Type Assertions**: `as any` used in 20+ places

---

## Best Practices Checklist

### ✅ Currently Following
- [x] Feature-first architecture
- [x] TypeScript strict mode
- [x] ESLint + Prettier
- [x] Code splitting
- [x] Lazy loading
- [x] Environment variables
- [x] RLS policies
- [x] Edge functions for sensitive operations

### ❌ Not Following (Recommendations)
- [ ] Comprehensive testing (unit, integration, E2E)
- [ ] Performance budgets
- [ ] Bundle size monitoring
- [ ] A/B testing infrastructure
- [ ] Feature flags for gradual rollouts
- [ ] Observability (logging, tracing, monitoring)
- [ ] CI/CD pipeline with automated checks

---

## Performance Optimization Opportunities

### Backend
1. **Database Indexes**: Add indexes on `cached_places.primary_type`, `cached_places.rating`
2. **Query Optimization**: Use `select('id, name, ...')` instead of `select('*')`
3. **Edge Function Caching**: Add HTTP cache headers to edge functions
4. **Connection Pooling**: Use PgBouncer for connection management

### Frontend
1. **Virtual Scrolling**: Use `react-window` for long lists (already implemented in `VirtualizedLocationList`)
2. **Image Optimization**: Add `loading="lazy"` to all images
3. **Code Splitting**: Split large features into smaller chunks
4. **Tree Shaking**: Remove unused exports from `src/services/index.ts`
5. **Bundle Analysis**: Use `vite-bundle-visualizer` to identify large dependencies

### Caching
1. **Cache Warming**: Pre-fetch popular searches on app load
2. **Stale-While-Revalidate**: Serve stale cache while fetching fresh data
3. **Background Sync**: Sync cache in service worker during idle time

---

## Security Considerations

### ✅ Current Security Measures
- RLS policies on all Supabase tables
- API keys stored in edge functions (not exposed to client)
- Input validation with Zod schemas
- XSS protection via React's automatic escaping
- HTTPS enforcement
- Rate limiting on edge functions

### 🔴 Security Gaps
1. **No CSRF Protection**: Add CSRF tokens to forms
2. **No Content Security Policy**: Add CSP headers
3. **No Subresource Integrity**: Add SRI for CDN resources
4. **Audit Logs**: Only basic audit logging implemented
5. **IP Rate Limiting**: No IP-based rate limiting (only user-based)

---

## Conclusion

NutriMap has a **solid foundation** with best-in-class caching, provider abstraction, and feature-first architecture. The primary technical debt is in **service layer duplication** and **hook consolidation**, which can be addressed in 3-4 weeks.

**Top 3 Refactoring Priorities**:
1. 🔴 Complete service layer migration to `DataAccessLayer`
2. 🔴 Consolidate map hooks to `useConsolidatedMap`
3. 🔴 Unify type system (`Location`, `EnhancedPlace`, `MarkerData`)

**Next Steps**:
1. Review this document with team
2. Prioritize refactoring work
3. Create Jira tickets for each refactoring task
4. Execute Phase 1 of migration roadmap

---

## Appendix

### Related Documentation
- [System Overview](./system-overview.md)
- [Domain Architecture](./domain-architecture.md)
- [Caching Strategy](./caching-strategy.md)
- [Refactoring Guidelines](../refactoring/guidelines.md)
- [Multi-Layer Caching](../features/multi-layer-caching.md)
- [Feature Flags](../features/feature-flags.md)

### Key Metrics
- **Total Files**: 300+
- **Lines of Code**: ~50,000
- **Dependencies**: 60+
- **Bundle Size**: 800KB (gzipped)
- **Lighthouse Score**: 85/100

### Contact
For questions about this architecture, see:
- `docs/phases/` for detailed phase documentation
- `docs/guides/` for implementation guides
- Lovable Discord community
