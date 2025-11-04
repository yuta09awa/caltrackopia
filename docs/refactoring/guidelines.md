# Refactoring Guidelines

## Overview

This document consolidates refactoring guidelines and best practices used throughout the project's evolution.

## Core Principles

### 1. Feature-First Architecture
- Organize code by feature/domain, not by technical layer
- Keep related code together (components, hooks, types, services)
- Each feature should be as self-contained as possible

### 2. Standardization
- Use consistent patterns across the codebase
- Create reusable abstractions for common patterns
- Prefer composition over duplication

### 3. Progressive Enhancement
- Start with working code, refactor incrementally
- Maintain functionality during refactoring
- Test after each refactoring step

## Refactoring Patterns

### Hook Consolidation
**Before:**
```typescript
// Multiple hooks with overlapping responsibilities
const { data } = useMapState();
const { search } = useMapSearch();
const { markers } = useMapMarkers();
```

**After:**
```typescript
// Single consolidated hook
const { data, search, markers } = useConsolidatedMap();
```

### Service Layer Standardization
**Before:**
```typescript
// Inconsistent service implementations
class ServiceA {
  async getData() { /* custom implementation */ }
}
```

**After:**
```typescript
// Standardized base class
class ServiceA extends StandardServiceBase {
  // Inherits error handling, caching, quota management
}
```

### Component Decomposition
**Before:**
```typescript
// Large monolithic component (500+ lines)
function LocationCard() {
  // All logic in one component
}
```

**After:**
```typescript
// Decomposed into smaller, focused components
function LocationCard() {
  return (
    <LocationCardRoot>
      <LocationCardHeader />
      <LocationCardBody />
      <LocationCardActions />
    </LocationCardRoot>
  );
}
```

## Migration Checklist

When refactoring a module:

- [ ] Identify the scope and dependencies
- [ ] Create new structure alongside old code
- [ ] Migrate functionality incrementally
- [ ] Update imports and exports
- [ ] Add deprecation warnings to old code
- [ ] Test thoroughly
- [ ] Update documentation
- [ ] Remove old code after verification

## Anti-Patterns to Avoid

1. **God Objects**: Classes or functions that do too much
2. **Premature Optimization**: Optimize based on real performance data
3. **Over-Engineering**: Keep solutions simple and focused
4. **Tight Coupling**: Minimize dependencies between modules
5. **Inconsistent Naming**: Use clear, descriptive names consistently

## Documentation Requirements

- Update README when adding major features
- Document breaking changes in CHANGELOG
- Add inline comments for complex logic
- Keep architecture docs up-to-date

## Phase-Specific Learnings

### Phase 4: Component & Hook Refactoring
- Consolidate related hooks into unified interfaces
- Extract common patterns into reusable abstractions
- Split large components into focused sub-components

### Phase 7: Codebase Reorganization
- Move from technical layers to feature-first structure
- Eliminate circular dependencies
- Create clear boundaries between modules

### Phase 8: Production Hardening
- Add comprehensive error handling
- Implement logging and monitoring
- Enhance security and accessibility

For detailed phase documentation, see the `docs/phases/` directory.
