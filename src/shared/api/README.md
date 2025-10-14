# API Architecture Documentation

## Overview

CalTrackoPia uses a centralized API architecture with feature-based API modules. This document explains how to use the API system and how to add new functionality.

## Directory Structure

```
src/
├── shared/api/
│   ├── client.ts          # Centralized API client
│   ├── endpoints.ts       # All API endpoint definitions
│   ├── types.ts           # Shared API types
│   ├── interceptors.ts    # Reusable interceptor functions
│   └── index.ts           # Public exports
├── features/
│   └── {feature}/
│       └── api/
│           ├── {feature}Api.ts  # Feature-specific API calls
│           └── index.ts         # Feature API exports
```

## Using the API System

### 1. Using Feature API Modules

Each feature has its own API module that encapsulates all API calls for that feature.

```typescript
import { locationsApi } from '@/features/locations/api';

// Search for locations
const locations = await locationsApi.search({
  query: 'pizza',
  limit: 20
});

// Get a specific location
const location = await locationsApi.getById('123');
```

### 2. Available Feature APIs

- **Auth API** (`@/features/auth/api`)
  - Login, signup, logout
  - Session management

- **Profile API** (`@/features/profile/api`)
  - Get/update profile
  - Avatar upload

- **Locations API** (`@/features/locations/api`)
  - Search locations
  - Get nearby locations
  - Get by ID

- **Cart API** (`@/features/cart/api`)
  - Add/remove items
  - Update quantities
  - Clear cart

- **Map API** (`@/features/map/api`)
  - Google Maps API key
  - Place search

- **Nutrition API** (`@/features/nutrition/api`)
  - Search nutrition data
  - Get nutrition goals

## Adding New API Endpoints

### Step 1: Define the Endpoint

Add your endpoint to `src/shared/api/endpoints.ts`:

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  
  myFeature: {
    list: '/my-feature',
    getById: (id: string) => `/my-feature/${id}`,
    create: '/my-feature',
  },
};
```

### Step 2: Create Feature API Module

Create `src/features/myFeature/api/myFeatureApi.ts`:

```typescript
import { supabase } from '@/integrations/supabase/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const myFeatureApi = {
  list: async () => {
    const { data, error } = await supabase
      .from('my_table')
      .select('*');
    
    if (error) throw error;
    return data;
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('my_table')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
};
```

### Step 3: Export from Feature Index

Update `src/features/myFeature/index.ts`:

```typescript
export * from './api/myFeatureApi';
```

### Step 4: Use in Components/Hooks

```typescript
import { myFeatureApi } from '@/features/myFeature';

const MyComponent = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    myFeatureApi.list().then(setData);
  }, []);
  
  return <div>{/* ... */}</div>;
};
```

## Interceptors

Interceptors allow you to modify requests/responses globally.

### Built-in Interceptors

- **authTokenInterceptor** - Automatically adds auth token to requests
- **tokenRefreshInterceptor** - Refreshes expired tokens
- **loggingRequestInterceptor** - Logs requests in dev mode
- **loggingResponseInterceptor** - Logs responses in dev mode
- **errorHandlerInterceptor** - Transforms errors to consistent format

### Setting Up Interceptors

Interceptors are set up in `src/features/auth/services/authService.ts`:

```typescript
import { apiClient } from '@/shared/api/client';
import { authTokenInterceptor, tokenRefreshInterceptor } from '@/shared/api/interceptors';

// Setup during app initialization
apiClient.useRequestInterceptor(authTokenInterceptor);
apiClient.useResponseInterceptor(tokenRefreshInterceptor);
```

### Creating Custom Interceptors

```typescript
import type { RequestInterceptor } from '@/shared/api/types';

export const myCustomInterceptor: RequestInterceptor = async (config) => {
  // Modify the request config
  config.headers = {
    ...config.headers,
    'X-Custom-Header': 'value',
  };
  
  return config;
};

// Register it
apiClient.useRequestInterceptor(myCustomInterceptor);
```

## Error Handling

All API errors are transformed into a consistent format:

```typescript
interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}
```

Example:

```typescript
try {
  const data = await myFeatureApi.list();
} catch (error) {
  console.error(error.message);
  console.error(error.status);
  console.error(error.details);
}
```

## Testing API Calls

### Mocking API Modules

```typescript
import { vi } from 'vitest';
import * as locationsApi from '@/features/locations/api';

// Mock the entire module
vi.mock('@/features/locations/api', () => ({
  locationsApi: {
    search: vi.fn(),
    getById: vi.fn(),
  },
}));

// Set up mock return values
locationsApi.search.mockResolvedValue([{ id: '1', name: 'Test' }]);
```

## Best Practices

1. **Always use feature API modules** - Don't make direct API calls in components
2. **Define endpoints centrally** - Add all endpoints to `API_ENDPOINTS`
3. **Handle errors gracefully** - Always wrap API calls in try/catch
4. **Use TypeScript types** - Define types for requests and responses
5. **Keep API modules thin** - Business logic belongs in services/hooks
6. **Test API calls** - Mock API modules in unit tests

## Migration from Old Patterns

If you find code that directly uses `apiService` or makes raw HTTP calls:

**Before:**
```typescript
const response = await apiService.get('/locations');
```

**After:**
```typescript
const locations = await locationsApi.search();
```

## Performance Considerations

- API calls are not cached by default
- Use React Query for automatic caching and refetching
- Consider implementing request deduplication for high-traffic endpoints
- Use pagination for large datasets

## Security

- Auth tokens are automatically injected via interceptors
- Tokens are refreshed automatically on 401 errors
- Never store sensitive data in localStorage
- Always validate responses before using them

## Support

For questions or issues with the API system, contact the architecture team or refer to the main project documentation.
