import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, AuthState, AuthActions } from '@/hooks/useAuth';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AuthContextType extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthWrapper');
  }
  return context;
};

interface AuthWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  fallback,
  errorFallback
}) => {
  const auth = useAuth();

  // Show loading state while initializing
  if (auth.loading || !auth.initialized) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="space-y-4 w-full max-w-md mx-auto p-6">
            <LoadingSkeleton className="h-8 w-3/4 mx-auto" />
            <LoadingSkeleton className="h-4 w-1/2 mx-auto" />
            <LoadingSkeleton className="h-10 w-full" />
          </div>
        </div>
      )
    );
  }

  // Show error state if something went wrong during initialization
  if (!auth.initialized && !auth.loading) {
    return (
      errorFallback || (
        <div className="flex items-center justify-center min-h-screen">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unable to initialize authentication. Please refresh the page.
            </AlertDescription>
          </Alert>
        </div>
      )
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};