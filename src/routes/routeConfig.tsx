
import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';

import { Flame, Map, Home, Utensils, ChefHat, Store, Info } from 'lucide-react';
import IndexPage from '@/pages/Index';
import MapPage from '@/pages/MapPage';
import NotFound from '@/pages/NotFound';
import NutritionPage from '@/pages/NutritionPage';
import LocationDetailPage from '@/pages/LocationDetailPage';

export interface AppRoute extends RouteObject {
  title?: string;
  navLabel?: string;
  icon?: ReactNode;
  showInNav?: boolean;
  protected?: boolean;
}

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
