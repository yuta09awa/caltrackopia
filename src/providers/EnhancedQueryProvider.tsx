
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface QueryCacheConfig {
  places: { staleTime: number; cacheTime: number };
  nutrition: { staleTime: number; cacheTime: number };
  user: { staleTime: number; cacheTime: number };
  realtime: { staleTime: number; cacheTime: number };
}

const CACHE_CONFIG: QueryCacheConfig = {
  places: {
    staleTime: 1000 * 60 * 15, // 15 minutes - places don't change often
    cacheTime: 1000 * 60 * 60 * 24 // 24 hours
  },
  nutrition: {
    staleTime: 1000 * 60 * 60 * 2, // 2 hours - nutrition data is fairly static
    cacheTime: 1000 * 60 * 60 * 24 * 7 // 7 days
  },
  user: {
    staleTime: 1000 * 60 * 5, // 5 minutes - user data changes more frequently
    cacheTime: 1000 * 60 * 30 // 30 minutes
  },
  realtime: {
    staleTime: 1000 * 30, // 30 seconds - for real-time features
    cacheTime: 1000 * 60 * 5 // 5 minutes
  }
};

// Create optimized query client with intelligent defaults
const createOptimizedQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE_CONFIG.places.staleTime,
        cacheTime: CACHE_CONFIG.places.cacheTime,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: false, // Don't retry mutations by default
      }
    }
  });
};

// Enhanced query key factory for consistent caching
export const queryKeys = {
  places: {
    all: ['places'] as const,
    search: (query: string, location?: { lat: number; lng: number }) => 
      ['places', 'search', query, location] as const,
    nearby: (location: { lat: number; lng: number }, radius: number) => 
      ['places', 'nearby', location, radius] as const,
    details: (placeId: string) => ['places', 'details', placeId] as const,
  },
  nutrition: {
    all: ['nutrition'] as const,
    search: (query: string) => ['nutrition', 'search', query] as const,
    details: (foodId: string) => ['nutrition', 'details', foodId] as const,
    analysis: (ingredients: string[]) => ['nutrition', 'analysis', ingredients] as const,
  },
  user: {
    all: ['user'] as const,
    profile: ['user', 'profile'] as const,
    preferences: ['user', 'preferences'] as const,
    history: ['user', 'history'] as const,
  }
};

// Custom hooks for different data types with optimized caching
export const createQueryOptions = {
  places: (key: any[], queryFn: () => Promise<any>) => ({
    queryKey: key,
    queryFn,
    staleTime: CACHE_CONFIG.places.staleTime,
    cacheTime: CACHE_CONFIG.places.cacheTime,
  }),
  nutrition: (key: any[], queryFn: () => Promise<any>) => ({
    queryKey: key,
    queryFn,
    staleTime: CACHE_CONFIG.nutrition.staleTime,
    cacheTime: CACHE_CONFIG.nutrition.cacheTime,
  }),
  user: (key: any[], queryFn: () => Promise<any>) => ({
    queryKey: key,
    queryFn,
    staleTime: CACHE_CONFIG.user.staleTime,
    cacheTime: CACHE_CONFIG.user.cacheTime,
  }),
  realtime: (key: any[], queryFn: () => Promise<any>) => ({
    queryKey: key,
    queryFn,
    staleTime: CACHE_CONFIG.realtime.staleTime,
    cacheTime: CACHE_CONFIG.realtime.cacheTime,
  }),
};

interface EnhancedQueryProviderProps {
  children: React.ReactNode;
}

const queryClient = createOptimizedQueryClient();

const EnhancedQueryProvider: React.FC<EnhancedQueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default EnhancedQueryProvider;
