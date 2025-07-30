-- Fix security issues for custom functions only
-- We cannot modify PostGIS system tables, so we'll focus on our custom functions

-- Fix any remaining custom functions that might have mutable search paths
-- Update our existing functions to have proper search_path

-- Fix the update timestamp function if it exists
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
      created_at
    ) VALUES (
      auth.uid(),
      TG_TABLE_NAME,
      TG_OP,
      COALESCE(NEW.id, OLD.id),
      CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
      CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
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
  -- Count recent attempts for this user and action type
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

-- Create function to clean up old audit logs with proper security
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to run cleanup
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;
  
  -- Delete audit logs older than 1 year
  DELETE FROM public.audit_logs
  WHERE created_at < (now() - interval '1 year');
END;
$$;

-- Create enhanced login security function
CREATE OR REPLACE FUNCTION public.log_login_attempt(
  email text,
  success boolean,
  user_agent text DEFAULT NULL,
  ip_address inet DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log login attempts for security monitoring
  INSERT INTO public.audit_logs (
    user_id,
    table_name,
    action_type,
    old_values,
    new_values,
    user_agent,
    ip_address,
    created_at
  ) VALUES (
    CASE WHEN success THEN auth.uid() ELSE NULL END,
    'auth_attempts',
    CASE WHEN success THEN 'LOGIN_SUCCESS' ELSE 'LOGIN_FAILED' END,
    NULL,
    jsonb_build_object(
      'email', email,
      'success', success,
      'timestamp', now()
    ),
    user_agent,
    ip_address,
    now()
  );
END;
$$;