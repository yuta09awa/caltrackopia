-- Fix security warnings: Add SET search_path to existing functions

-- Fix audit_trigger_function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    table_name,
    action_type,
    record_id,
    old_values,
    new_values,
    user_id,
    created_at
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid(),
    timezone('utc'::text, now())
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix check_profile_completion
CREATE OR REPLACE FUNCTION public.check_profile_completion(user_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_complete boolean := false;
BEGIN
  SELECT 
    CASE 
      WHEN first_name IS NOT NULL AND first_name != '' AND
           last_name IS NOT NULL AND last_name != '' AND
           array_length(dietary_restrictions, 1) > 0 AND
           array_length(nutrition_goals, 1) > 0
      THEN true 
      ELSE false 
    END
  INTO profile_complete
  FROM public.profiles 
  WHERE id = user_id;
  
  RETURN COALESCE(profile_complete, false);
END;
$$;

-- Fix log_login_attempt
CREATE OR REPLACE FUNCTION public.log_login_attempt(email text, success boolean, user_agent text DEFAULT NULL, ip_address inet DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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

-- Fix secure_profile_update
CREATE OR REPLACE FUNCTION public.secure_profile_update(profile_id uuid, update_data jsonb)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF profile_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied: Cannot update other user profiles';
  END IF;
  
  UPDATE public.profiles
  SET 
    first_name = COALESCE(update_data->>'first_name', first_name),
    last_name = COALESCE(update_data->>'last_name', last_name),
    display_name = update_data->>'display_name',
    phone = update_data->>'phone',
    date_of_birth = CASE 
      WHEN update_data->>'date_of_birth' IS NOT NULL 
      THEN (update_data->>'date_of_birth')::date 
      ELSE date_of_birth 
    END,
    location_address = update_data->>'location_address',
    updated_at = timezone('utc'::text, now())
  WHERE id = profile_id;
  
  RETURN true;
END;
$$;