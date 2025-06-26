
import { ReactNode, Suspense } from 'react';
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
  RouteLoadingFallback 
} from '@/components/routing/LazyRoutes';
import ShoppingPage from '@/pages/ShoppingPage';
import { AppRoute } from './types';

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
      <LazyWrapper>
        <LazyProfilePage />
      </LazyWrapper>
    ),
    title: 'My Profile',
    navLabel: 'Profile',
    icon: <UserRound className="w-4 h-4" />,
    showInNav: true,
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
