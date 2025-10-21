import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/store/useAuth';
import { useUserRoles } from '@/features/auth/hooks/useUserRoles';
import { AppRole } from '@/types/roles';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: AppRole | AppRole[];
  redirectTo?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole,
  redirectTo,
  fallback,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const { hasAnyRole, loading: rolesLoading } = useUserRoles();
  const location = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!rolesLoading) {
      setChecked(true);
    }
  }, [rolesLoading]);

  // Show loading state while checking auth and roles
  if (!checked || rolesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo || '/auth'} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRequiredRole = hasAnyRole(roles);

    if (!hasRequiredRole) {
      if (fallback) {
        return <>{fallback}</>;
      }
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
