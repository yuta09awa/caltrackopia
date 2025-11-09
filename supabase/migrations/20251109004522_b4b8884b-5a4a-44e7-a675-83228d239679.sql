-- Create feature_flags table
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flag_name TEXT NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  user_ids UUID[] DEFAULT '{}',
  regions TEXT[] DEFAULT '{}',
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  created_by UUID REFERENCES public.profiles(id)
);

-- Create index on flag_name for fast lookups
CREATE INDEX IF NOT EXISTS idx_feature_flags_flag_name ON public.feature_flags(flag_name);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read feature flags
CREATE POLICY "Anyone can read feature flags"
ON public.feature_flags
FOR SELECT
USING (true);

-- RLS Policy: Only admins can insert feature flags
CREATE POLICY "Admins can insert feature flags"
ON public.feature_flags
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- RLS Policy: Only admins can update feature flags
CREATE POLICY "Admins can update feature flags"
ON public.feature_flags
FOR UPDATE
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- RLS Policy: Only admins can delete feature flags
CREATE POLICY "Admins can delete feature flags"
ON public.feature_flags
FOR DELETE
USING (is_admin(auth.uid()));

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial feature flags for AI calorie tracking
INSERT INTO public.feature_flags (flag_name, enabled, description, rollout_percentage)
VALUES 
  ('ai-calorie-tracking', false, 'AI-powered calorie tracking and nutrition analysis', 0),
  ('ai-meal-suggestions', false, 'AI-generated meal and ingredient suggestions', 0),
  ('enhanced-search', false, 'Enhanced map search with AI-powered recommendations', 0),
  ('cache-metrics-dashboard', true, 'Display cache performance metrics in dev mode', 100)
ON CONFLICT (flag_name) DO NOTHING;