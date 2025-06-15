
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import AuthInitializer from './components/auth/AuthInitializer';
import './App.css';

function App() {
  return (
    <AppProviders>
      <Router>
        <AuthInitializer>
          <AppRoutes />
          <Toaster />
        </AuthInitializer>
      </Router>
    </AppProviders>
  );
}

export default App;
