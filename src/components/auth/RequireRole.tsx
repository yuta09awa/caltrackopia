import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRoles } from '@/hooks/useUserRoles';
import { AppRole } from '@/types/roles';
import { Loader2 } from 'lucide-react';

interface RequireRoleProps {
  role: AppRole | AppRole[];
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function RequireRole({ 
  role, 
  children, 
  fallback,
  redirectTo = '/'
}: RequireRoleProps) {
  const { hasRole, hasAnyRole, loading } = useUserRoles();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading) return;

    const roles = Array.isArray(role) ? role : [role];
    const isAuthorized = hasAnyRole(roles);
    
    setAuthorized(isAuthorized);
    setChecked(true);
  }, [role, hasRole, hasAnyRole, loading]);

  if (loading || !checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authorized) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
