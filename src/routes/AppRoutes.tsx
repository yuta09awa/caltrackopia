
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '../pages/Index';
import MapPage from '../pages/MapPage';
import NutritionPage from '../pages/NutritionPage';
import NotFound from '../pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/nutrition" element={<NutritionPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
