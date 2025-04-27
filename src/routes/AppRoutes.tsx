
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from './routeConfig';
import { AppRoute } from './types';

// Helper function to recursively generate routes
const generateRoutes = (routes: AppRoute[]): React.ReactNode => {
  return routes.map((route) => (
    <Route 
      key={route.path}
      path={route.path}
      element={route.element}
      index={route.index}
    >
      {route.children && generateRoutes(route.children)}
    </Route>
  ));
};

const AppRoutes: React.FC = () => {
  return <Routes>{generateRoutes(routes)}</Routes>;
};

export default AppRoutes;
