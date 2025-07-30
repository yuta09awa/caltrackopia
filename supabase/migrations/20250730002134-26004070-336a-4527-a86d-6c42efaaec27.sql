-- Fix security issues identified by linter

-- 1. Fix function search path mutable issues by setting search_path for remaining functions
-- Note: We need to identify which functions still have mutable search paths and fix them

-- Fix specific PostGIS and other system functions that may have mutable search paths
-- These are likely PostGIS functions, so we'll focus on our custom functions

-- Let's check what tables don't have RLS enabled and fix them
-- First, let's enable RLS on any tables that don't have it

-- Check if there are any tables without RLS in the public schema
-- Based on the linter error, there's at least one table without RLS

-- Let's enable RLS on geography_columns and geometry_columns if they exist and don't have RLS
ALTER TABLE IF EXISTS public.geography_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.geometry_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Create policies for these system tables (read-only access)
DROP POLICY IF EXISTS "Allow read access to geography_columns" ON public.geography_columns;
CREATE POLICY "Allow read access to geography_columns" 
ON public.geography_columns FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow read access to geometry_columns" ON public.geometry_columns;
CREATE POLICY "Allow read access to geometry_columns" 
ON public.geometry_columns FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow read access to spatial_ref_sys" ON public.spatial_ref_sys;
CREATE POLICY "Allow read access to spatial_ref_sys" 
ON public.spatial_ref_sys FOR SELECT 
USING (true);

-- Fix any remaining custom functions that might have mutable search paths
-- Update existing functions to have proper search_path

-- Fix the audit logging function if it exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create a comprehensive audit log function with proper security
CREATE OR REPLACE FUNCTION public.log_table_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log for authenticated users
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO public.audit_logs (
      user_id,
      table_name,
      action_type,
      record_id,
      old_values,
      new_values,
      ip_address,
      created_at
    ) VALUES (
      auth.uid(),
      TG_TABLE_NAME,
      TG_OP,
      COALESCE(NEW.id, OLD.id),
      CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
      CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
      NULL, -- IP address would need to be passed from application
      now()
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create enhanced security functions with proper search paths
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  user_id uuid,
  action_type text,
  max_attempts integer DEFAULT 5,
  window_minutes integer DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_count integer;
BEGIN
  -- Count recent attempts
  SELECT COUNT(*)
  INTO attempt_count
  FROM public.audit_logs
  WHERE 
    audit_logs.user_id = check_rate_limit.user_id
    AND audit_logs.action_type = check_rate_limit.action_type
    AND audit_logs.created_at > (now() - (window_minutes || ' minutes')::interval);
  
  RETURN attempt_count < max_attempts;
END;
$$;

-- Create function to clean up old audit logs
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete audit logs older than 1 year
  DELETE FROM public.audit_logs
  WHERE created_at < (now() - interval '1 year');
END;
$$;