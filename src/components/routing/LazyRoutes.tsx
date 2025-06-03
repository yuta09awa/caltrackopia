
import { lazy } from 'react';

// Lazy load all route components for code splitting
export const LazyMapPage = lazy(() => import('@/pages/MapPage'));
export const LazyNutritionPage = lazy(() => import('@/pages/NutritionPage'));
export const LazyShoppingPage = lazy(() => import('@/pages/ShoppingPage'));
export const LazyLocationDetailPage = lazy(() => import('@/pages/LocationDetailPage'));
export const LazyMarketDetailPage = lazy(() => import('@/pages/MarketDetailPage'));
export const LazyAuthPage = lazy(() => import('@/pages/AuthPage'));
export const LazyProfilePage = lazy(() => import('@/pages/ProfilePage'));
export const LazyNotFound = lazy(() => import('@/pages/NotFound'));
export const LazyHomePage = lazy(() => import('@/pages/Index'));

// Loading fallback component
export const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);
