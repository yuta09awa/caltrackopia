# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed
- `useMapApi` - Last deprecated hook removed! Functionality moved to `usePlacesApiService`
- `useMapCamera` - Hook was unused and has been deleted
- `useLocationSelection` - Hook was unused and has been deleted  
- `useMapInteractions` - Hook was unused and has been deleted
- `useMarkerInteractions` - Hook was unused and has been deleted
- `useNavigationActions` - Hook was unused and has been deleted
- Duplicate cart hooks in favor of feature-specific versions

### Changed
- **Legacy Hook Migration Complete!** 🎉 All deprecated map hooks successfully migrated or removed
- `usePlacesApi` now uses `usePlacesApiService` directly instead of deprecated `useMapApi`
- `usePlacesApiService` expanded to include `getPlaceDetails` functionality
- Cleaned up project structure and consolidated documentation
- Moved phase documentation to `docs/phases/` directory
- Consolidated refactoring guidelines into `docs/refactoring/`
- Removed duplicate cart hook files from `src/hooks/`
- Updated hook exports to use feature-first organization
- Migrated `UnifiedMapView` away from deprecated `useMapRendering` hook
- Migrated `SimpleMapView` away from deprecated `useSimpleMapState` hook
- Updated migration documentation to reflect completed Phase 2 and Phase 3 cleanup

---

## Phase 8 - Production Readiness (October 25, 2025)

### Added
- Comprehensive logging service
- Security hardening across the application
- PWA service with offline capabilities
- Accessibility service and enhancements
- Performance monitoring tools
- Comprehensive error boundaries

### Changed
- Enhanced error handling throughout the application
- Improved security policies and input validation
- Better offline-first data synchronization

---

## Phase 7 - Codebase Refactoring (October 2025)

### Changed
- Reorganized codebase to feature-first architecture
- Consolidated hooks into unified interfaces
- Improved code organization and maintainability
- Reduced technical debt

---

## Phase 6 - Offline Support (October 2025)

### Added
- PWA functionality with service workers
- Offline-first data synchronization
- IndexedDB for local storage
- Background sync capabilities
- Offline queue management

---

## Phase 5 - Security Implementation (October 2025)

### Added
- Row Level Security (RLS) policies
- Input validation and sanitization
- XSS protection
- CSRF protection
- Security audit tools

### Changed
- Enhanced authentication flows
- Improved data access controls

---

## Phase 4 - Component & Hook Refactoring (September-October 2025)

### Added
- Unified API layer with TanStack Query
- Consolidated hooks for common patterns
- Standardized component architecture
- Enhanced caching strategies

### Changed
- Migrated from ad-hoc patterns to standardized approaches
- Decomposed large components into smaller, focused ones
- Improved hook reusability

---

## Phase 3 - API Architecture (September 2025)

### Added
- Centralized API client
- Standardized error handling
- Request/response interceptors
- API quota management

### Changed
- Unified API request patterns
- Improved error reporting

---

## Phase 2 - State Management (August 2025)

### Added
- Zustand for global state management
- Slice-based architecture
- Enhanced cart state management

### Changed
- Migrated from React Context to Zustand
- Improved state persistence

---

## Initial Release

### Added
- Core application structure with React + TypeScript + Vite
- Google Maps integration
- Shopping cart functionality
- Location search and filtering
- User authentication with Supabase
- Basic nutrition tracking
- Responsive UI with Tailwind CSS and shadcn-ui

---

## Contributing

When adding entries to this changelog:
1. Add entries under `[Unreleased]` section
2. Use categories: Added, Changed, Deprecated, Removed, Fixed, Security
3. Link to relevant issues or pull requests when applicable
4. Keep descriptions clear and concise
