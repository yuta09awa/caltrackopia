import { ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface CanProps {
  do: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Permission-based rendering component
 * 
 * @example
 * <Can do="edit:menu">
 *   <Button>Edit Menu</Button>
 * </Can>
 * 
 * @example
 * <Can do="view:admin-panel" fallback={<p>Access Denied</p>}>
 *   <AdminPanel />
 * </Can>
 */
export function Can({ do: action, children, fallback = null }: CanProps) {
  const { can } = usePermissions();

  if (!can(action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
