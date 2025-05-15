
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface AppProvidersProps {
  children: React.ReactNode;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
