import { ReactNode, Suspense, lazy } from 'react';
import { Flame, Map, Home, UserRound } from 'lucide-react';
import { 
  LazyMapPage, 
  LazyNutritionPage, 
  LazyLocationDetailPage,
  LazyMarketDetailPage,
  LazyAuthPage,
  LazyProfilePage,
  LazyNotFound,
  LazyHomePage,
  LazyRestaurantDashboard,
  RouteLoadingFallback 
} from '@/shared/routing/LazyRoutes';
import ShoppingPage from '@/pages/ShoppingPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppRoute } from './types';

const LazyUnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));

// Wrapper component for lazy routes with suspense
const LazyWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<RouteLoadingFallback />}>
    {children}
  </Suspense>
);

export const routes: AppRoute[] = [
  {
    path: '/',
    element: (
      <LazyWrapper>
        <LazyHomePage />
      </LazyWrapper>
    ),
    title: 'Home',
    navLabel: 'Home',
    icon: <Home className="w-4 h-4" />,
    showInNav: true,
  },
  {
    path: '/map',
    element: (
      <LazyWrapper>
        <LazyMapPage />
      </LazyWrapper>
    ),
    title: 'Map',
    navLabel: 'Map',
    icon: <Map className="w-4 h-4" />,
    showInNav: true,
  },
  {
    path: '/nutrition',
    element: (
      <LazyWrapper>
        <LazyNutritionPage />
      </LazyWrapper>
    ),
    title: 'Nutrition',
    navLabel: 'Nutrition',
    icon: <Flame className="w-4 h-4" />,
    showInNav: true,
  },
  {
    path: '/shopping',
    element: <ShoppingPage />,
    title: 'Shopping Cart',
  },
  {
    path: '/location/:id',
    element: (
      <LazyWrapper>
        <LazyLocationDetailPage />
      </LazyWrapper>
    ),
    title: 'Location Details',
  },
  {
    path: '/markets/:id',
    element: (
      <LazyWrapper>
        <LazyMarketDetailPage />
      </LazyWrapper>
    ),
    title: 'Market Details',
  },
  {
    path: '/auth',
    element: (
      <LazyWrapper>
        <LazyAuthPage />
      </LazyWrapper>
    ),
    title: 'Login / Register',
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute requireAuth={true}>
        <LazyWrapper>
          <LazyProfilePage />
        </LazyWrapper>
      </ProtectedRoute>
    ),
    title: 'My Profile',
    navLabel: 'Profile',
    icon: <UserRound className="w-4 h-4" />,
    showInNav: true,
  },
  {
    path: '/restaurant-dashboard',
    element: (
      <ProtectedRoute requireAuth={true} requiredRole="restaurant_owner">
        <LazyWrapper>
          <LazyRestaurantDashboard />
        </LazyWrapper>
      </ProtectedRoute>
    ),
    title: 'Restaurant Dashboard',
  },
  {
    path: '/unauthorized',
    element: (
      <LazyWrapper>
        <LazyUnauthorizedPage />
      </LazyWrapper>
    ),
    title: 'Access Denied',
  },
  {
    path: '*',
    element: (
      <LazyWrapper>
        <LazyNotFound />
      </LazyWrapper>
    ),
    title: 'Page Not Found',
  },
];

export default routes;
