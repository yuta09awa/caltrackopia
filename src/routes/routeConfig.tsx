
import React from 'react';
import { AppRoute } from './types';
import Index from '../pages/Index';
import MapPage from '../pages/MapPage';
import NutritionPage from '../pages/NutritionPage';
import NotFound from '../pages/NotFound';
import LocationDetailPage from '../pages/LocationDetailPage';

// Define all application routes
export const routes: AppRoute[] = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/map',
    element: <MapPage />,
  },
  {
    path: '/nutrition',
    element: <NutritionPage />,
  },
  {
    path: '/location/:id',
    element: <LocationDetailPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
];
