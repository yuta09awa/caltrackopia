import { useCallback, useMemo } from 'react';
import { useAuth } from '@/features/auth/store/useAuth';
import { useUserRoles } from './useUserRoles';
import { AppRole } from '@/types/roles';

type Permission = string;
type PermissionCheck = (action: Permission, resource?: string) => boolean;

interface PermissionMatrix {
  [key: string]: Permission[];
}

export function usePermissions() {
  const { user } = useAuth();
  const { hasRole, isAdmin } = useUserRoles();

  // Define permission matrix for each role
  const permissions: PermissionMatrix = useMemo(() => ({
    customer: [
      'view:menu',
      'view:location',
      'view:market',
      'create:order',
      'view:own-orders',
      'edit:own-profile',
      'view:own-profile',
      'manage:own-cart',
    ],
    restaurant_owner: [
      'view:menu',
      'edit:own-menu',
      'view:location',
      'view:own-restaurant',
      'edit:own-restaurant',
      'view:own-orders',
      'manage:own-orders',
      'edit:own-profile',
      'view:own-profile',
    ],
    moderator: [
      'view:all-content',
      'moderate:content',
      'view:reports',
      'manage:reports',
      'view:users',
    ],
    admin: ['*'], // Full access
  }), []);

  const can: PermissionCheck = useCallback(
    (action: Permission, resource?: string) => {
      if (!user) return false;

      // Admins have full access
      if (isAdmin()) return true;

      // Check each role the user has
      const userRoles = (Object.keys(permissions) as AppRole[]).filter((role) =>
        hasRole(role)
      );

      return userRoles.some((role) => {
        const rolePermissions = permissions[role];
        return rolePermissions.includes('*') || rolePermissions.includes(action);
      });
    },
    [user, hasRole, isAdmin, permissions]
  );

  const cannot: PermissionCheck = useCallback(
    (action: Permission, resource?: string) => !can(action, resource),
    [can]
  );

  return { can, cannot };
}
