# System Architecture Overview

Last Updated: 2025-01-09 - Added Provider Abstraction Layer

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn-ui
- **State Management**: Zustand
- **Routing**: React Router v6
- **API Layer**: TanStack Query, Axios
- **Maps**: Google Maps API via @react-google-maps/api
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)

## Core Architecture Patterns

### Feature-First Structure
```
src/
├── features/         # Feature modules (auth, cart, map, etc.)
├── shared/          # Shared utilities and components
├── app/             # App-level providers and routing
├── components/      # UI components
├── hooks/           # Shared hooks
└── services/        # Service layer
```

### State Management
- **Zustand slices** for global state
- **TanStack Query** for server state
- **Local state** for component-specific state

### Service Layer
- Unified service architecture with `ServiceBase`
- Standardized error handling
- Quota-aware API services
- Enhanced caching strategies

## Key Features

1. **Authentication & Authorization**: Role-based access control (RBAC)
2. **Shopping Cart**: Multi-location cart with conflict resolution
3. **Interactive Maps**: Google Maps integration with location search
4. **Nutrition Tracking**: Integration with nutrition APIs
5. **Offline Support**: PWA with offline-first capabilities
6. **Security**: RLS policies, input validation, XSS protection

## Provider Abstraction Layer

### Overview
The Provider Abstraction Layer decouples NutriMap from specific map/location API vendors (Google Maps, Mapbox, etc.), enabling cost optimization, vendor independence, and regional optimization.

### Architecture
```
Application Code → LocationProviderFactory → ILocationProvider → [GoogleMapsProvider | MapboxProvider]
```

### Provider Interface
All providers implement `ILocationProvider` with methods: `initialize()`, `searchPlacesByText()`, `searchNearbyPlaces()`, `getPlaceDetails()`.

### Swapping Providers
Set `VITE_MAP_PROVIDER=google-maps` or `VITE_MAP_PROVIDER=mapbox` in `.env`, then restart dev server.

### Current Providers
1. **Google Maps** (Default) - ✅ Fully implemented
2. **Mapbox** (Alternative) - 🚧 Skeleton only

### Benefits
- ✅ Zero code changes to swap providers
- ✅ Normalized API responses
- ✅ Easy to add new providers
- ✅ Testable with mock providers

See [Map Provider Swap Guide](../guides/map-provider-swap.md) for details.

## Performance Optimizations

- Code splitting and lazy loading
- Virtual scrolling for large lists
- Optimized map marker rendering
- **Multi-layer caching with IndexedDB** (Phase 1: 70% API call reduction)
  - Layer 1: Memory cache (30 min TTL)
  - Layer 2: IndexedDB persistent cache (24 hour TTL)
  - Layer 3: Supabase cached_places (7 day TTL)
  - Layer 4: Google Maps API fallback
- **Feature flags for safe rollouts** (Phase 2: Zero-downtime deployments)
  - User-specific rollouts (beta testers, internal team)
  - Regional rollouts (launch by geography)
  - Percentage-based gradual rollouts (10% → 50% → 100%)
  - A/B testing support
- Browser caching strategies
- Offline-first capabilities with service workers

See `docs/features/multi-layer-caching.md` and `docs/features/feature-flags.md` for details.

For detailed phase documentation, see the `docs/phases/` directory.
