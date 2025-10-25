import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from './routeConfig';
import { AppRoute } from './types';
import { PageErrorBoundary } from '@/features/errors/components/GlobalErrorBoundary';

// Helper function to recursively generate routes
const generateRoutes = (routes: AppRoute[]): React.ReactNode => {
  return routes.map((route) => {
    // Create a clean props object without any undefined values
    const routeProps: Record<string, any> = {
      key: route.path,
      path: route.path,
      element: route.element ? <PageErrorBoundary>{route.element}</PageErrorBoundary> : undefined,
    };

    // Only add the index prop if it's explicitly true
    if (route.index === true) {
      routeProps.index = true;
    }

    return (
      <Route {...routeProps}>
        {route.children && generateRoutes(route.children)}
      </Route>
    );
  });
};

const AppRoutes: React.FC = () => {
  return <Routes>{generateRoutes(routes)}</Routes>;
};

export default AppRoutes;
