
import { ReactNode } from 'react';
import { Flame, Map, Home } from 'lucide-react';
import IndexPage from '@/pages/Index';
import MapPage from '@/pages/MapPage';
import NotFound from '@/pages/NotFound';
import NutritionPage from '@/pages/NutritionPage';
import LocationDetailPage from '@/pages/LocationDetailPage';
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
    path: '/locations/:id',
    element: <LocationDetailPage />,
    title: 'Location Details',
  },
  {
    path: '*',
    element: <NotFound />,
    title: 'Page Not Found',
  },
];

export default routes;
