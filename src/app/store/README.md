# Caltrackopia State Management

This directory contains the centralized Zustand store for the application.

## Architecture

The store uses a modular slice pattern where each feature has its own slice:

- **Auth Slice** (`@/features/auth/store/authSlice.ts`) - User authentication and profile
- **Cart Slice** (`@/features/cart/store/cartSlice.ts`) - Shopping cart state
- **Map Filters Slice** (`@/features/map/store/mapFiltersSlice.ts`) - Map search filters
- **User Preferences Slice** (`./userPreferencesSlice.ts`) - Theme, language, notifications

## Usage

### Using the Main Store (Legacy)

```typescript
import { useAppStore } from '@/app/store';

function MyComponent() {
  const user = useAppStore((state) => state.user);
  const addItem = useAppStore((state) => state.addItem);
  // ...
}
```

### Using Feature-Specific Hooks (Recommended)

Feature-specific hooks provide better encapsulation and performance:

```typescript
import { useAuth } from '@/features/auth/store/useAuth';
import { useCart } from '@/features/cart/store/useCart';
import { useMapFilters } from '@/features/map/store/useMapFilters';
import { useUserPreferences } from '@/app/store/useUserPreferences';

function MyComponent() {
  // Auth
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Cart with computed values
  const { items, total, isEmpty, addItem } = useCart();
  
  // Map filters with helpers
  const { hasActiveFilters, clearAllFilters } = useMapFilters();
  
  // User preferences
  const { theme, toggleTheme, isDarkMode } = useUserPreferences();
}
```

### Benefits of Feature Hooks

1. **Better Performance** - Memoized selectors prevent unnecessary re-renders
2. **Encapsulation** - Features control their public API
3. **Computed Values** - Get derived state automatically
4. **Type Safety** - Full TypeScript support
5. **Easier Testing** - Mock specific features, not the entire store

## Persistence

The store automatically persists to localStorage:

- **Auth**: `user`, `isAuthenticated`
- **Cart**: `items`, `total`, `itemCount`, `activeLocationId`, `conflictMode`
- **User Preferences**: All preferences (theme, language, location)
- **Map Filters**: NOT persisted (session-only)

## Development Tools

### Redux DevTools

The store integrates with Redux DevTools for debugging:
- Time-travel debugging
- Action inspection
- State snapshots
- Performance monitoring

### Custom Utilities

```typescript
import { logStateChange, monitorPerformance } from '@/app/store/middleware';

// Log state changes
logStateChange('addToCart', oldState, newState);

// Monitor async action performance
await monitorPerformance('fetchUser', async () => {
  return await api.getUser();
});
```

## Testing

Use the test utilities for store testing:

```typescript
import { createMockStore, waitForStoreUpdate } from '@/app/store/test-utils';

test('cart operations', async () => {
  const store = createMockStore({
    items: [],
    total: 0,
  });
  
  store.getState().addItem(mockItem);
  
  await waitForStoreUpdate(
    store,
    (state) => state.items.length > 0
  );
  
  expect(store.getState().total).toBeGreaterThan(0);
});
```

## Creating New Slices

Use the slice factory for consistency:

```typescript
import { createSliceFactory } from './createSlice';

interface MySliceState {
  data: string[];
  isLoading: boolean;
  error: string | null;
}

interface MySliceActions {
  setData: (data: string[]) => void;
  fetchData: () => Promise<void>;
}

export const createMySlice = createSliceFactory<MySliceState, MySliceActions>(
  {
    data: [],
    isLoading: false,
    error: null,
  },
  (set, get) => ({
    setData: (data) => set({ data }),
    fetchData: async () => {
      set({ isLoading: true });
      try {
        const data = await api.getData();
        set({ data, isLoading: false });
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },
  })
);
```

## Migration Guide

To migrate components from `useAppStore` to feature hooks:

### Before
```typescript
function CartButton() {
  const items = useAppStore((state) => state.items);
  const total = useAppStore((state) => state.total);
  const addItem = useAppStore((state) => state.addItem);
  const isEmpty = items.length === 0;
  
  // ...
}
```

### After
```typescript
function CartButton() {
  const { items, total, isEmpty, addItem } = useCart();
  
  // isEmpty is computed automatically!
  // ...
}
```

### Benefits
- Less boilerplate (4 lines → 1 line)
- Computed values included (`isEmpty`)
- Better performance (memoized selectors)
- Easier to refactor (encapsulated API)
