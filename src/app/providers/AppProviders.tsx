import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { GlobalErrorBoundary } from '@/features/errors/components/GlobalErrorBoundary';
import AuthInitializer from '@/features/auth/components/AuthInitializer';
import { useCartPersistence } from '@/features/cart/hooks/useCartPersistence';
import { OfflineIndicator } from '@/components/layout/OfflineIndicator';

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

// Component to initialize offline features
const OfflineInitializer: React.FC = () => {
  useCartPersistence();
  return null;
};

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="light" storageKey="caltrackopia-theme">
            <AuthInitializer>
              <OfflineInitializer />
              {children}
              <OfflineIndicator />
              <Toaster position="top-center" />
            </AuthInitializer>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};
