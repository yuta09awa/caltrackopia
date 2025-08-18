import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthWrapper';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requiresAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  redirectTo = '/auth',
  requiresAuth = true
}) => {
  const { user, loading, initialized } = useAuthContext();
  const location = useLocation();

  // Show loading while auth is initializing
  if (loading || !initialized) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="space-y-4 w-full max-w-md mx-auto p-6">
            <LoadingSkeleton className="h-8 w-3/4 mx-auto" />
            <LoadingSkeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      )
    );
  }

  // If auth is required but user is not authenticated
  if (requiresAuth && !user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // If auth is not required but user is authenticated (e.g., auth page)
  if (!requiresAuth && user) {
    const returnTo = location.state?.from || '/';
    return <Navigate to={returnTo} replace />;
  }

  return <>{children}</>;
};