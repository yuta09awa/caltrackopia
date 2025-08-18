
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import AuthInitializer from './components/auth/AuthInitializer';
import { HealthCheck } from '@/components/common/HealthCheck';
import { environment, validateEnvironment } from '@/config/environment';
import { errorHandler } from '@/utils/errorHandler';
import './App.css';

// Validate environment on app startup
try {
  validateEnvironment();
} catch (error) {
  errorHandler.handleError(error as Error, { context: 'app_initialization' });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <Router>
          <AuthInitializer>
            <AppRoutes />
            <Toaster />
            <HealthCheck />
          </AuthInitializer>
        </Router>
      </AppProviders>
    </QueryClientProvider>
  );
}

export default App;
