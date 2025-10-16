
import { lazy } from 'react';

// Core map components - lazy loaded for better code splitting
export const LazyMapContainer = lazy(() => import('@/features/map/components/MapContainer'));
export const LazyLocationList = lazy(() => import('@/features/locations/components/LocationList'));
export const LazyMapInfoCard = lazy(() => import('@/features/map/components/MapInfoCard'));

// Feature-specific lazy components
export const LazyNutritionTracker = lazy(() => import('@/features/nutrition/components/NutritionTracker'));
export const LazyCartSheet = lazy(() => import('@/features/cart/components/CartSheet'));
export const LazyFilterSheet = lazy(() => import('@/features/map/components/FilterSheet'));

// Profile components
export const LazyProfileInfo = lazy(() => import('@/features/profile/components/ProfileInfo'));
export const LazyOrderHistory = lazy(() => import('@/features/profile/components/OrderHistory'));
export const LazyPaymentMethods = lazy(() => import('@/features/profile/components/PaymentMethods'));

// Market detail components
export const LazyMarketDetailTabs = lazy(() => import('@/features/markets/components/MarketDetailTabs'));
export const LazyVendorList = lazy(() => import('@/features/markets/components/VendorList'));
export const LazyEventList = lazy(() => import('@/features/markets/components/EventList'));

// Common loading component for lazy components
export const LazyComponentFallback: React.FC<{ height?: string }> = ({ height = 'h-32' }) => (
  <div className={`flex items-center justify-center ${height}`}>
    <div className="flex flex-col items-center space-y-2">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);
