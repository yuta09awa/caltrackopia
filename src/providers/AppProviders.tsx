
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { BrowserRouter } from 'react-router-dom';

interface AppProvidersProps {
  children: React.ReactNode;
}

// Create a client
const queryClient = new QueryClient();

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
