-- Fix remaining security warnings for database functions

-- Fix check_rate_limit (first version)
CREATE OR REPLACE FUNCTION public.check_rate_limit(identifier text, max_requests integer DEFAULT 100, window_seconds integer DEFAULT 60)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer := 0;
  window_start timestamp with time zone;
BEGIN
  window_start := now() - (window_seconds || ' seconds')::interval;
  
  SELECT COUNT(*)
  INTO current_count
  FROM public.audit_logs
  WHERE created_at > window_start
    AND user_agent = identifier;
  
  RETURN current_count < max_requests;
END;
$$;

-- Fix check_rate_limit (second version)
CREATE OR REPLACE FUNCTION public.check_rate_limit(user_id uuid, action_type text, max_attempts integer DEFAULT 5, window_minutes integer DEFAULT 15)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_count integer;
BEGIN
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

-- Fix cleanup_old_audit_logs
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;
  
  DELETE FROM public.audit_logs
  WHERE created_at < (now() - interval '1 year');
END;
$$;

-- Fix expire_stale_cache
CREATE OR REPLACE FUNCTION public.expire_stale_cache()
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.cached_places
  SET freshness_status = 'expired'
  WHERE freshness_status = 'stale'
    AND last_updated_at < NOW() - INTERVAL '30 days';
    
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Fix find_places_within_radius
CREATE OR REPLACE FUNCTION public.find_places_within_radius(search_lat numeric, search_lng numeric, radius_meters integer DEFAULT 5000, place_type_filter place_type DEFAULT NULL, limit_count integer DEFAULT 20)
RETURNS TABLE(place_id text, name text, formatted_address text, latitude numeric, longitude numeric, primary_type place_type, rating numeric, price_level integer, is_open_now boolean, distance_meters numeric)
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.place_id,
    cp.name,
    cp.formatted_address,
    cp.latitude,
    cp.longitude,
    cp.primary_type,
    cp.rating,
    cp.price_level,
    cp.is_open_now,
    ST_Distance(cp.location, ST_GeogFromText('POINT(' || search_lng || ' ' || search_lat || ')'))::NUMERIC as distance_meters
  FROM public.cached_places cp
  WHERE 
    ST_DWithin(
      cp.location,
      ST_GeogFromText('POINT(' || search_lng || ' ' || search_lat || ')'),
      radius_meters
    )
    AND (place_type_filter IS NULL OR cp.primary_type = place_type_filter)
    AND cp.freshness_status IN ('fresh', 'stale')
  ORDER BY distance_meters
  LIMIT limit_count;
END;
$$;

-- Fix increment_api_quota
CREATE OR REPLACE FUNCTION public.increment_api_quota(p_service_name text, p_amount integer DEFAULT 1)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO api_quota_tracking (
    service_name,
    quota_period,
    quota_limit,
    quota_used,
    quota_reset_at,
    burst_limit,
    rate_limit_window_seconds
  ) VALUES (
    p_service_name,
    'daily',
    CASE 
      WHEN p_service_name = 'google_places' THEN 1000
      WHEN p_service_name = 'google_maps' THEN 10000
      WHEN p_service_name = 'usda_api' THEN 3600
      WHEN p_service_name = 'fatsecret_api' THEN 10000
      ELSE 1000
    END,
    p_amount,
    DATE_TRUNC('day', NOW() + INTERVAL '1 day'),
    CASE 
      WHEN p_service_name = 'google_places' THEN 100
      WHEN p_service_name = 'google_maps' THEN 1000
      WHEN p_service_name = 'usda_api' THEN 60
      WHEN p_service_name = 'fatsecret_api' THEN 500
      ELSE 100
    END,
    60
  )
  ON CONFLICT (service_name, quota_period, quota_reset_at)
  DO UPDATE SET
    quota_used = api_quota_tracking.quota_used + p_amount,
    updated_at = NOW();
END;
$$;

-- Fix update_cache_stats
CREATE OR REPLACE FUNCTION public.update_cache_stats(hits integer DEFAULT 0, misses integer DEFAULT 0, saved integer DEFAULT 0)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.cache_statistics (date, cache_hits, cache_misses, api_calls_saved, total_places_cached)
  VALUES (
    CURRENT_DATE,
    hits,
    misses,
    saved,
    (SELECT COUNT(*) FROM public.cached_places)
  )
  ON CONFLICT (date)
  DO UPDATE SET
    cache_hits = cache_statistics.cache_hits + hits,
    cache_misses = cache_statistics.cache_misses + misses,
    api_calls_saved = cache_statistics.api_calls_saved + saved,
    total_places_cached = (SELECT COUNT(*) FROM public.cached_places);
END;
$$;