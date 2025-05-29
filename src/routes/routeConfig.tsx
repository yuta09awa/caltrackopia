
import { ReactNode } from 'react';
import { Flame, Map, Home, UserRound } from 'lucide-react';
import IndexPage from '@/pages/Index';
import MapPage from '@/pages/MapPage';
import NotFound from '@/pages/NotFound';
import NutritionPage from '@/pages/NutritionPage';
import LocationDetailPage from '@/pages/LocationDetailPage';
import MarketDetailPage from '@/pages/MarketDetailPage';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import ShoppingPage from '@/pages/ShoppingPage';
import { AppRoute } from './types';

export const routes: AppRoute[] = [
  {
    path: '/',
    element: <IndexPage />,
    title: 'Home',
    navLabel: 'Home',
    icon: <Home className="w-4 h-4" />,
    showInNav: true,
  },
  {
    path: '/map',
    element: <MapPage />,
    title: 'Map',
    navLabel: 'Map',
    icon: <Map className="w-4 h-4" />,
    showInNav: true,
  },
  {
    path: '/nutrition',
    element: <NutritionPage />,
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
    element: <LocationDetailPage />,
    title: 'Location Details',
  },
  {
    path: '/markets/:id',
    element: <MarketDetailPage />,
    title: 'Market Details',
  },
  {
    path: '/auth',
    element: <AuthPage />,
    title: 'Login / Register',
  },
  {
    path: '/profile',
    element: <ProfilePage />,
    title: 'My Profile',
    navLabel: 'Profile',
    icon: <UserRound className="w-4 h-4" />,
    showInNav: true,
  },
  {
    path: '*',
    element: <NotFound />,
    title: 'Page Not Found',
  },
];

export default routes;
