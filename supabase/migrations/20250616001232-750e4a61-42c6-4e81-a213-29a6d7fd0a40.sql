
-- Phase 1: Data Standardization & Infrastructure Migration (Corrected)
-- Create standardized allergen lookup table
CREATE TABLE IF NOT EXISTS allergen_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  common_aliases TEXT[],
  severity_level TEXT CHECK (severity_level IN ('low', 'medium', 'high', 'severe')),
  i18n_key TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create standardized dietary tag lookup table
CREATE TABLE IF NOT EXISTS dietary_tag_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  icon_name TEXT,
  i18n_key TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create master ingredients table
CREATE TABLE IF NOT EXISTS master_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  common_names TEXT[],
  category TEXT NOT NULL,
  description TEXT,
  nutritional_data JSONB,
  allergen_ids UUID[],
  is_organic_available BOOLEAN DEFAULT false,
  is_seasonal BOOLEAN DEFAULT false,
  peak_season_months INTEGER[],
  external_api_ids JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add TTL and quota tracking to cached_places (only if columns don't exist)
ALTER TABLE cached_places ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE cached_places ADD COLUMN IF NOT EXISTS refresh_interval_hours INTEGER DEFAULT 24;
ALTER TABLE cached_places ADD COLUMN IF NOT EXISTS refresh_priority INTEGER DEFAULT 1;
ALTER TABLE cached_places ADD COLUMN IF NOT EXISTS google_api_calls_used INTEGER DEFAULT 0;
ALTER TABLE cached_places ADD COLUMN IF NOT EXISTS last_api_call_at TIMESTAMP WITH TIME ZONE;

-- Create API quota tracking table
CREATE TABLE IF NOT EXISTS api_quota_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  quota_period TEXT NOT NULL,
  quota_limit INTEGER NOT NULL,
  quota_used INTEGER DEFAULT 0,
  quota_reset_at TIMESTAMP WITH TIME ZONE NOT NULL,
  burst_limit INTEGER,
  rate_limit_window_seconds INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(service_name, quota_period, quota_reset_at)
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action_type TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_cached_places_expires_at ON cached_places(expires_at);
CREATE INDEX IF NOT EXISTS idx_cached_places_last_api_call ON cached_places(last_api_call_at);
CREATE INDEX IF NOT EXISTS idx_cached_places_refresh_priority ON cached_places(refresh_priority DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON audit_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_allergen_types_name ON allergen_types(name);
CREATE INDEX IF NOT EXISTS idx_dietary_tag_types_category ON dietary_tag_types(category);
CREATE INDEX IF NOT EXISTS idx_master_ingredients_category ON master_ingredients(category);
CREATE INDEX IF NOT EXISTS idx_api_quota_tracking_service ON api_quota_tracking(service_name, quota_period);

-- Enable RLS on new tables
ALTER TABLE allergen_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_tag_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_quota_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for lookup tables (public read access)
CREATE POLICY "Public read access for allergen types" ON allergen_types FOR SELECT USING (true);
CREATE POLICY "Public read access for dietary tag types" ON dietary_tag_types FOR SELECT USING (true);
CREATE POLICY "Public read access for master ingredients" ON master_ingredients FOR SELECT USING (true);

-- RLS policies for API quota tracking (admin only)
CREATE POLICY "Admin access for api quota tracking" ON api_quota_tracking FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE user_type = 'admin')
);

-- RLS policies for audit logs
CREATE POLICY "Users can read own audit logs" ON audit_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin can read all audit logs" ON audit_logs FOR SELECT USING (
  auth.uid() IN (SELECT id FROM profiles WHERE user_type = 'admin')
);

-- Insert initial data
INSERT INTO allergen_types (name, description, common_aliases, severity_level, i18n_key) VALUES
('Gluten', 'Protein found in wheat, barley, rye', ARRAY['wheat', 'gluten-containing grains'], 'medium', 'allergen.gluten'),
('Dairy', 'Milk and milk products', ARRAY['milk', 'lactose', 'casein'], 'medium', 'allergen.dairy'),
('Nuts', 'Tree nuts including almonds, walnuts, etc.', ARRAY['tree nuts', 'almonds', 'walnuts'], 'high', 'allergen.nuts'),
('Peanuts', 'Peanuts and peanut products', ARRAY['groundnuts'], 'high', 'allergen.peanuts'),
('Shellfish', 'Crustaceans and mollusks', ARRAY['shrimp', 'crab', 'lobster'], 'severe', 'allergen.shellfish'),
('Fish', 'Finned fish', ARRAY['seafood'], 'high', 'allergen.fish'),
('Eggs', 'Chicken eggs and egg products', ARRAY['egg whites', 'egg yolks'], 'medium', 'allergen.eggs'),
('Soy', 'Soybeans and soy products', ARRAY['soya', 'edamame'], 'medium', 'allergen.soy'),
('Sesame', 'Sesame seeds and products', ARRAY['tahini'], 'medium', 'allergen.sesame')
ON CONFLICT (name) DO NOTHING;

INSERT INTO dietary_tag_types (name, description, category, icon_name, i18n_key) VALUES
('Vegetarian', 'No meat or fish', 'diet', 'leaf', 'dietary.vegetarian'),
('Vegan', 'No animal products', 'diet', 'sprout', 'dietary.vegan'),
('Gluten-Free', 'No gluten-containing ingredients', 'health', 'wheat-off', 'dietary.gluten_free'),
('Dairy-Free', 'No dairy products', 'health', 'milk-off', 'dietary.dairy_free'),
('Keto', 'Low carb, high fat diet', 'diet', 'zap', 'dietary.keto'),
('Paleo', 'Stone age diet principles', 'diet', 'mountain', 'dietary.paleo'),
('Halal', 'Islamic dietary guidelines', 'lifestyle', 'moon', 'dietary.halal'),
('Kosher', 'Jewish dietary guidelines', 'lifestyle', 'star', 'dietary.kosher'),
('Low-Sodium', 'Reduced sodium content', 'health', 'heart', 'dietary.low_sodium'),
('Sugar-Free', 'No added sugars', 'health', 'candy-off', 'dietary.sugar_free'),
('Organic', 'Certified organic ingredients', 'lifestyle', 'eco', 'dietary.organic'),
('Local', 'Locally sourced ingredients', 'lifestyle', 'map-pin', 'dietary.local')
ON CONFLICT (name) DO NOTHING;

INSERT INTO master_ingredients (name, common_names, category, description, is_organic_available, is_seasonal, peak_season_months) VALUES
('Tomato', ARRAY['tomatoes', 'cherry tomatoes'], 'vegetables', 'Fresh tomatoes', true, true, ARRAY[6,7,8,9]),
('Chicken Breast', ARRAY['chicken', 'poultry'], 'protein', 'Boneless chicken breast', true, false, NULL),
('Rice', ARRAY['white rice', 'brown rice'], 'grains', 'Rice grains', true, false, NULL),
('Lettuce', ARRAY['iceberg lettuce', 'romaine'], 'vegetables', 'Fresh lettuce', true, true, ARRAY[4,5,6,7,8,9,10]),
('Onion', ARRAY['onions', 'yellow onion'], 'vegetables', 'Fresh onions', true, false, NULL),
('Garlic', ARRAY['garlic cloves'], 'vegetables', 'Fresh garlic', true, false, NULL),
('Olive Oil', ARRAY['extra virgin olive oil'], 'oils', 'Olive oil', true, false, NULL),
('Salt', ARRAY['table salt', 'sea salt'], 'seasonings', 'Sodium chloride', false, false, NULL),
('Black Pepper', ARRAY['pepper', 'ground pepper'], 'seasonings', 'Ground black pepper', true, false, NULL),
('Basil', ARRAY['fresh basil', 'sweet basil'], 'herbs', 'Fresh basil leaves', true, true, ARRAY[6,7,8,9])
ON CONFLICT (name) DO NOTHING;

INSERT INTO api_quota_tracking (service_name, quota_period, quota_limit, burst_limit, quota_reset_at) VALUES
('google_places', 'daily', 1000, 100, DATE_TRUNC('day', NOW() + INTERVAL '1 day')),
('google_maps', 'daily', 10000, 1000, DATE_TRUNC('day', NOW() + INTERVAL '1 day')),
('usda_api', 'daily', 3600, 60, DATE_TRUNC('day', NOW() + INTERVAL '1 day')),
('fatsecret_api', 'daily', 10000, 500, DATE_TRUNC('day', NOW() + INTERVAL '1 day'))
ON CONFLICT (service_name, quota_period, quota_reset_at) DO NOTHING;
