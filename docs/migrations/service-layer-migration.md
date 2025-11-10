# Service Layer Migration Guide

## Overview

The service layer has been refactored to eliminate redundancy and establish clear patterns. This guide helps you migrate from the old service patterns to the new unified architecture.

## What Changed?

### Before: Service Chaos
- 20+ singleton services with unclear responsibilities
- Multiple services doing similar things (e.g., `enhancedDatabaseService`, `customDataService`, `standardizedDataService`)
- Confusing naming (services with "Enhanced" prefix)
- No centralized service management

### After: Unified Architecture
- **5-7 core services**, all registered with `UnifiedServiceManager`
- Single entry point via `services` object
- Clear service boundaries and responsibilities
- Consistent error handling and state management

---

## New Service Architecture

### 1. DataAccessLayer - Single Source for All Data

**Purpose**: Unified interface for ALL data operations (replaces multiple database services)

**Import**:
```typescript
import { dataAccess } from '@/services';
// OR
import { services } from '@/services';
const data = services.data;
```

**Usage**:
```typescript
// ❌ OLD - Multiple services, confusing
import { databaseService } from '@/services/databaseService';
import { customDataService } from '@/services/customDataService';
import { standardizedDataService } from '@/services/standardizedDataService';

const places = await databaseService.searchPlaces('pizza');
const customData = await customDataService.getCustomRestaurantData(placeId);
const allergens = await standardizedDataService.getAllergenTypes();

// ✅ NEW - Single unified interface
import { dataAccess } from '@/services';

const places = await dataAccess.searchPlaces('pizza');
const ingredients = await dataAccess.searchIngredients('tomato');
const menuItems = await dataAccess.getMenuItemsByPlace(placeId);
const dietaryRestrictions = await dataAccess.getAllDietaryRestrictions();
```

**What It Replaces**:
- ❌ `databaseService` → ✅ `dataAccess`
- ❌ `enhancedDatabaseService` → ✅ `dataAccess`
- ❌ `customDataService` → ✅ `dataAccess`
- ❌ `standardizedDataService` → ✅ `dataAccess`
- ❌ `mockDataService` → ✅ `dataAccess` (handled internally)

---

### 2. LocationService - Single Service for Location Operations

**Purpose**: All location-related operations (current location, geocoding, reverse geocoding)

**Import**:
```typescript
import { location } from '@/services';
// OR
import { services } from '@/services';
const location = services.location;
```

**Usage**:
```typescript
// ❌ OLD - Multiple location services
import { locationService } from '@/services/locationService';
import { hybridLocationService } from '@/services/hybridLocationService';
import { locationResolverService } from '@/services/locationResolverService';

const currentLocation = await hybridLocationService.getCurrentLocation();
const geocoded = await locationResolverService.resolveAddress(address);

// ✅ NEW - Single unified location service
import { location } from '@/services';

const currentLocation = await location.getCurrentLocation();
const coords = await location.geocode(address);
const address = await location.reverseGeocode({ lat: 40.7589, lng: -73.9851 });
const nearby = await location.searchNearby({ center, radius: 5000 });
```

**What It Replaces**:
- ❌ `locationService` → ✅ `location`
- ❌ `hybridLocationService` → ✅ `location`
- ❌ `locationResolverService` → ✅ `location`

---

### 3. Using the Unified `services` Object

**Best Practice**: Import from the unified `services` export

```typescript
// ✅ RECOMMENDED - Single import for all services
import { services } from '@/services';

// Access any service
const places = await services.data.searchPlaces('pizza');
const userLocation = await services.location.getCurrentLocation();
const user = await services.auth.getCurrentUser();

// Check service health
const health = services.manager.getServiceHealth();
const quotaStatus = services.manager.checkQuotaStatus();
```

---

## Migration Steps

### Step 1: Update Imports

**Find and Replace** across your codebase:

```typescript
// OLD imports
import { databaseService } from '@/services/databaseService';
import { customDataService } from '@/services/customDataService';
import { standardizedDataService } from '@/services/standardizedDataService';
import { locationService } from '@/services/locationService';
import { hybridLocationService } from '@/services/hybridLocationService';

// NEW imports (choose one style)
// Option A: Individual service imports
import { dataAccess, location } from '@/services';

// Option B: Unified services object (recommended)
import { services } from '@/services';
```

### Step 2: Update Method Calls

**Data Operations**:
```typescript
// OLD
const places = await databaseService.searchPlaces(query);
const ingredients = await databaseService.getAllIngredients();

// NEW
const places = await dataAccess.searchPlaces(query);
const ingredients = await dataAccess.getAllIngredients();
```

**Location Operations**:
```typescript
// OLD
const location = await hybridLocationService.getCurrentLocation();

// NEW
const userLocation = await location.getCurrentLocation();
```

### Step 3: Handle Fallback Patterns

The new services handle fallbacks automatically:

```typescript
// OLD - Manual fallback logic
try {
  const ingredients = await databaseService.getAllIngredients();
} catch (error) {
  if (error.code === 'TABLE_NOT_AVAILABLE') {
    const ingredients = await mockDataService.getAllIngredients();
  }
}

// NEW - Automatic fallback built-in
const ingredients = await dataAccess.getAllIngredients();
// Automatically falls back to mock data if table unavailable
```

### Step 4: Remove Deprecated Service Imports

After migrating, remove old service imports:

```typescript
// ❌ DELETE THESE IMPORTS
import { enhancedDatabaseService } from '@/services/enhancedDatabaseService';
import { customDataService } from '@/services/customDataService';
import { standardizedDataService } from '@/services/standardizedDataService';
import { hybridLocationService } from '@/services/hybridLocationService';
import { locationResolverService } from '@/services/locationResolverService';

// ✅ USE THESE INSTEAD
import { dataAccess, location } from '@/services';
// OR
import { services } from '@/services';
```

---

## Service Comparison Table

| Old Service(s) | New Service | Purpose |
|---------------|-------------|---------|
| `databaseService`, `enhancedDatabaseService`, `customDataService`, `standardizedDataService` | `dataAccess` | All data operations (places, ingredients, menu items, etc.) |
| `locationService`, `hybridLocationService`, `locationResolverService` | `location` | Location operations (current location, geocoding, search) |
| `apiService`, `apiClient` | `services.api` | HTTP requests (unchanged, but registered with manager) |
| Multiple cache services | `services.cache` | *(Coming in next phase)* |

---

## Common Patterns

### Pattern 1: Searching for Data

```typescript
// OLD
import { databaseService } from '@/services/databaseService';
const results = await databaseService.searchPlaces('pizza', 20);

// NEW
import { dataAccess } from '@/services';
const results = await dataAccess.searchPlaces('pizza', 20);
```

### Pattern 2: Getting User Location

```typescript
// OLD
import { hybridLocationService } from '@/services/hybridLocationService';
const loc = await hybridLocationService.getCurrentLocation({ highAccuracy: true });

// NEW
import { location } from '@/services';
const loc = await location.getCurrentLocation({ highAccuracy: true });
```

### Pattern 3: Coordinated Multi-Service Operations

```typescript
// OLD - Manual coordination
const userLocation = await hybridLocationService.getCurrentLocation();
const places = await databaseService.findPlacesWithIngredients(
  userLocation.lat,
  userLocation.lng,
  5000
);

// NEW - Using service manager for coordination
import { services } from '@/services';

const results = await services.manager.executeCoordinated([
  {
    serviceName: 'location',
    operation: () => services.location.getCurrentLocation(),
    required: true
  },
  {
    serviceName: 'data',
    operation: async () => {
      const loc = await services.location.getCurrentLocation();
      return services.data.findPlacesWithIngredients(loc.lat, loc.lng, 5000);
    },
    fallback: () => services.data.searchPlaces('restaurants', 20)
  }
]);
```

---

## Testing

### Before Migration (check for these patterns):
```bash
# Search for old service imports
grep -r "import.*databaseService" src/
grep -r "import.*enhancedDatabaseService" src/
grep -r "import.*customDataService" src/
grep -r "import.*standardizedDataService" src/
grep -r "import.*hybridLocationService" src/
grep -r "import.*locationResolverService" src/
```

### After Migration (verify new patterns):
```bash
# Verify new imports are used
grep -r "import.*dataAccess" src/
grep -r "import.*services.*from '@/services'" src/
```

---

## Rollout Plan

1. **Phase 1** ✅ (Current): 
   - New services created (`DataAccessLayer`, `LocationService`)
   - Deprecation warnings added to old services
   - Migration guide published

2. **Phase 2** (Week 2):
   - Update 5-10 key files to use new pattern
   - Run tests to ensure functionality is preserved
   - Document any issues

3. **Phase 3** (Week 3):
   - Update remaining files
   - Remove old service files
   - Clean up imports

4. **Phase 4** (Week 4):
   - Final testing
   - Performance benchmarking
   - Update documentation

---

## Need Help?

- **Questions**: Refer to this guide or the service source code comments
- **Issues**: Old services have deprecation warnings with links to this guide
- **Examples**: See `src/services/data/DataAccessLayer.ts` for complete API

---

## Checklist

Use this checklist for each file you migrate:

- [ ] Replace old service imports with new ones
- [ ] Update method calls to use new API
- [ ] Remove manual fallback logic (now automatic)
- [ ] Test the updated code
- [ ] Remove old service imports
- [ ] Update any TypeScript types if needed
- [ ] Run linter to catch any issues
