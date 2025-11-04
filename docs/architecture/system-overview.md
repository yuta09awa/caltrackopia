# System Architecture Overview

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

## Performance Optimizations

- Code splitting and lazy loading
- Virtual scrolling for large lists
- Optimized map marker rendering
- Enhanced browser caching
- IndexedDB for offline storage

For detailed phase documentation, see the `docs/phases/` directory.
