
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from "@/components/ui/toaster";

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
