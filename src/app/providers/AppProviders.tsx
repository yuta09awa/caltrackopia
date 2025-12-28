import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { GlobalErrorBoundary } from '@/features/errors/components/GlobalErrorBoundary';
import AuthInitializer from '@/features/auth/components/AuthInitializer';
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

// Component to initialize offline features - deferred to avoid early store access
const OfflineInitializer: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Dynamically import to avoid early Zustand access
    const init = async () => {
      const { useCartPersistence } = await import('@/features/cart/hooks/useCartPersistence');
      // Hook will be called in the component that imports it
    };
    init();
  }, [mounted]);

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
            </AuthInitializer>
            <Toaster position="top-center" />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

