-- Fix function search paths for security compliance
-- Update functions to have immutable search_path

-- Function 1: Handle new user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name');
  RETURN NEW;
END;
$$;

-- Function 2: Update updated_at column function  
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Function 3: Audit logging trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert audit log for any changes
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

-- Function 4: Profile completion check
CREATE OR REPLACE FUNCTION public.check_profile_completion(user_id uuid)
RETURNS boolean
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

-- Function 5: Rate limiting function for API calls
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  identifier text,
  max_requests integer DEFAULT 100,
  window_seconds integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer := 0;
  window_start timestamp with time zone;
BEGIN
  window_start := now() - (window_seconds || ' seconds')::interval;
  
  -- Count requests in the current window
  SELECT COUNT(*)
  INTO current_count
  FROM public.audit_logs
  WHERE created_at > window_start
    AND user_agent = identifier;
  
  RETURN current_count < max_requests;
END;
$$;

-- Function 6: Secure profile update with validation
CREATE OR REPLACE FUNCTION public.secure_profile_update(
  profile_id uuid,
  update_data jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate user can only update their own profile
  IF profile_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied: Cannot update other user profiles';
  END IF;
  
  -- Update the profile with validated data
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