import React from 'react';
import { AppProviders } from './app/providers/AppProviders';
import AppRoutes from './app/routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
