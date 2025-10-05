import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/integrations/supabase/client';
import { AppRole, UserRole, RoleCheckResult } from '@/types/roles';

export function useUserRoles() {
  const { user } = useAppStore();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (!error && data) {
        setRoles(data);
      }
      setLoading(false);
    };

    fetchRoles();

    // Subscribe to role changes
    const subscription = supabase
      .channel('user_roles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchRoles();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const checkRole = useCallback(
    (role: AppRole): RoleCheckResult => {
      const userRole = roles.find((r) => r.role === role);
      
      if (!userRole) {
        return { hasRole: false, isApproved: false, isPending: false };
      }

      // customer, moderator, admin don't need approval
      const needsApproval = role === 'restaurant_owner';
      const isApproved = !needsApproval || userRole.approved;

      return {
        hasRole: true,
        isApproved,
        isPending: needsApproval && !userRole.approved,
      };
    },
    [roles]
  );

  const hasRole = useCallback(
    (role: AppRole): boolean => {
      return checkRole(role).isApproved;
    },
    [checkRole]
  );

  const isAdmin = useCallback(() => hasRole('admin'), [hasRole]);
  const isRestaurantOwner = useCallback(() => hasRole('restaurant_owner'), [hasRole]);
  const isModerator = useCallback(() => hasRole('moderator'), [hasRole]);
  const isCustomer = useCallback(() => hasRole('customer'), [hasRole]);

  const hasAnyRole = useCallback(
    (roleList: AppRole[]): boolean => {
      return roleList.some((role) => hasRole(role));
    },
    [hasRole]
  );

  return {
    roles,
    loading,
    checkRole,
    hasRole,
    isAdmin,
    isRestaurantOwner,
    isModerator,
    isCustomer,
    hasAnyRole,
  };
}
