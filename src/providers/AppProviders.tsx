
import { ThemeProvider } from './ThemeProvider';
import EnhancedQueryProvider from './EnhancedQueryProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <EnhancedQueryProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </EnhancedQueryProvider>
  );
};

export default AppProviders;
