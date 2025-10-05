export type AppRole = 'customer' | 'restaurant_owner' | 'moderator' | 'admin';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  approved: boolean;
  granted_at: string;
  granted_by: string | null;
  approved_at: string | null;
  approved_by: string | null;
}

export interface RoleCheckResult {
  hasRole: boolean;
  isApproved: boolean;
  isPending: boolean;
}
