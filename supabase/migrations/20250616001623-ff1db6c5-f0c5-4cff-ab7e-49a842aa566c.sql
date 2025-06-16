
-- Create the increment_api_quota stored procedure
CREATE OR REPLACE FUNCTION increment_api_quota(
  p_service_name TEXT,
  p_amount INTEGER DEFAULT 1
) RETURNS void AS $$
BEGIN
  -- Insert or update the quota tracking record
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_api_quota(TEXT, INTEGER) TO authenticated;
