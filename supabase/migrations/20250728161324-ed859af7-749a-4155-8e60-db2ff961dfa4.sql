-- PHASE 1: Fix Critical Privilege Escalation
-- Prevent users from modifying their own user_type after account creation

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND user_type = 'admin'
  );
$$;

-- Create function to safely change user roles (admin only)
CREATE OR REPLACE FUNCTION public.change_user_role(target_user_id uuid, new_role user_type)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_admin_id uuid;
BEGIN
  -- Get current user ID
  current_admin_id := auth.uid();
  
  -- Check if current user is admin
  IF NOT public.is_admin(current_admin_id) THEN
    RAISE EXCEPTION 'Access denied: Only admins can change user roles';
  END IF;
  
  -- Prevent demoting the last admin
  IF new_role != 'admin' THEN
    IF (SELECT COUNT(*) FROM public.profiles WHERE user_type = 'admin' AND id != target_user_id) < 1 THEN
      RAISE EXCEPTION 'Cannot demote the last admin user';
    END IF;
  END IF;
  
  -- Update the user role
  UPDATE public.profiles 
  SET user_type = new_role, updated_at = now()
  WHERE id = target_user_id;
  
  -- Log the change
  INSERT INTO public.audit_logs (
    user_id, 
    action_type, 
    table_name, 
    record_id, 
    old_values, 
    new_values
  ) VALUES (
    current_admin_id,
    'ROLE_CHANGE',
    'profiles',
    target_user_id,
    jsonb_build_object('changed_by', current_admin_id),
    jsonb_build_object('new_role', new_role, 'target_user', target_user_id)
  );
  
  RETURN true;
END;
$$;

-- Create trigger to prevent direct user_type updates
CREATE OR REPLACE FUNCTION public.prevent_user_type_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow updates during INSERT (initial profile creation)
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;
  
  -- Allow admin users to update any profile
  IF public.is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;
  
  -- Prevent regular users from changing user_type
  IF OLD.user_type IS DISTINCT FROM NEW.user_type THEN
    RAISE EXCEPTION 'Access denied: Cannot modify user_type. Use admin functions instead.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply the trigger to profiles table
DROP TRIGGER IF EXISTS prevent_user_type_update_trigger ON public.profiles;
CREATE TRIGGER prevent_user_type_update_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_user_type_update();

-- PHASE 2: Secure Database Functions
-- Fix search path vulnerabilities in existing functions

-- Fix the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
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

-- Add RLS policy to prevent spatial_ref_sys modifications
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spatial_ref_sys_read_only" ON public.spatial_ref_sys
  FOR ALL USING (false);

CREATE POLICY "spatial_ref_sys_public_read" ON public.spatial_ref_sys
  FOR SELECT USING (true);

-- PHASE 6: Enhanced Audit Logging
-- Create comprehensive audit logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  event_details jsonb DEFAULT '{}'::jsonb,
  severity text DEFAULT 'info'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action_type,
    table_name,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    event_type,
    'security_events',
    jsonb_build_object(
      'severity', severity,
      'details', event_details,
      'timestamp', now()
    ),
    inet_client_addr(),
    current_setting('request.headers', true)::jsonb->>'user-agent'
  );
END;
$$;

-- Create function to detect suspicious login patterns
CREATE OR REPLACE FUNCTION public.check_login_security(user_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_attempts integer;
  result jsonb;
BEGIN
  -- Count recent failed attempts (last 15 minutes)
  SELECT COUNT(*) INTO recent_attempts
  FROM public.audit_logs
  WHERE action_type = 'LOGIN_FAILED'
    AND new_values->>'email' = user_email
    AND created_at > now() - interval '15 minutes';
  
  -- Check if account should be temporarily locked
  IF recent_attempts >= 5 THEN
    result := jsonb_build_object(
      'locked', true,
      'attempts', recent_attempts,
      'unlock_at', now() + interval '15 minutes'
    );
    
    -- Log security event
    PERFORM public.log_security_event(
      'ACCOUNT_TEMPORARILY_LOCKED',
      jsonb_build_object('email', user_email, 'attempts', recent_attempts),
      'warning'
    );
  ELSE
    result := jsonb_build_object(
      'locked', false,
      'attempts', recent_attempts
    );
  END IF;
  
  RETURN result;
END;
$$;