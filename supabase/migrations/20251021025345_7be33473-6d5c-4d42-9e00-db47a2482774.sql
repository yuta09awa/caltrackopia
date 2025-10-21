-- Fix RLS policies to address security scan findings

-- ============================================
-- PROFILES TABLE: Restrict admin access to necessary operations only
-- ============================================

-- Drop overly broad admin view policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate with explicit admin check and remove OR condition
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Users can always view their own profile
  (auth.uid() = id) 
  OR 
  -- Admins can view all profiles only when they have the admin role
  (public.is_admin(auth.uid()))
);

-- ============================================
-- RESTAURANTS TABLE: Add explicit public read prevention
-- ============================================

-- Ensure restaurants table has RLS enabled
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Add explicit policy to prevent public read access
DROP POLICY IF EXISTS "Public cannot read restaurants" ON public.restaurants;
CREATE POLICY "Public cannot read restaurants" ON public.restaurants
FOR SELECT
TO authenticated
USING (
  (owner_id = auth.uid()) 
  OR 
  public.is_admin(auth.uid())
);

-- ============================================
-- AUDIT_LOGS TABLE: Strengthen access control
-- ============================================

-- Drop existing policies to recreate with stronger checks
DROP POLICY IF EXISTS "Users can read own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admin can read all audit logs" ON public.audit_logs;

-- Users can ONLY read their own audit logs
CREATE POLICY "Users can read own audit logs" ON public.audit_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can read all audit logs
CREATE POLICY "Admins can read all audit logs" ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- ============================================
-- USER_ROLES TABLE: Prevent role enumeration
-- ============================================

-- Drop and recreate policies with explicit restrictions
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Users can ONLY view their own roles, not query others
CREATE POLICY "Users can view own roles only" ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins retain full management access (already exists)
-- "Admins can manage all roles" policy remains unchanged

-- ============================================
-- CACHED_PLACES: Ensure read-only public access
-- ============================================

-- Remove any update/delete policies for public access
DROP POLICY IF EXISTS "Allow public read access to cached places" ON public.cached_places;
DROP POLICY IF EXISTS "Allow read access to cached places" ON public.cached_places;

-- Single clear policy for public read-only access
CREATE POLICY "Public read-only access to cached places" ON public.cached_places
FOR SELECT
TO anon, authenticated
USING (true);

-- Grant execute on security definer functions to authenticated users
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;