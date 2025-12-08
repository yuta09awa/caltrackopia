-- ============================================
-- NUTRISCAN PHASE 1: Database Schema
-- Tables: menu_items, nutrition_corrections, correction_votes
-- ============================================

-- 1. Create menu_items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price DECIMAL(10,2),
  
  -- Nutritional data (matching NutritionalInfo interface)
  calories INTEGER,
  protein DECIMAL(6,2),
  carbohydrates DECIMAL(6,2),
  fat DECIMAL(6,2),
  fiber DECIMAL(6,2),
  sugar DECIMAL(6,2),
  sodium DECIMAL(6,2),
  cholesterol DECIMAL(6,2),
  vitamins JSONB DEFAULT '{}',
  minerals JSONB DEFAULT '{}',
  
  -- Ingredients detected by AI
  ingredients JSONB DEFAULT '[]',
  allergens TEXT[] DEFAULT '{}',
  dietary_tags TEXT[] DEFAULT '{}',
  
  -- Data provenance (critical for trust/transparency)
  data_source TEXT CHECK (data_source IN ('usda', 'ai_vision', 'restaurant_verified', 'community_corrected')),
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  usda_match_ids TEXT[] DEFAULT '{}',
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  last_ai_analysis_at TIMESTAMPTZ,
  
  -- Image reference
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create nutrition_corrections table
CREATE TABLE public.nutrition_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  submitted_by UUID REFERENCES auth.users(id) NOT NULL,
  
  field_name TEXT NOT NULL,
  original_value JSONB,
  corrected_value JSONB NOT NULL,
  reason TEXT,
  evidence_url TEXT,
  
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'applied')),
  
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  applied_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Create correction_votes table (prevent duplicate voting)
CREATE TABLE public.correction_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  correction_id UUID REFERENCES public.nutrition_corrections(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(correction_id, user_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_menu_items_restaurant ON public.menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON public.menu_items(category);
CREATE INDEX idx_menu_items_data_source ON public.menu_items(data_source);
CREATE INDEX idx_menu_items_confidence ON public.menu_items(confidence_score);
CREATE INDEX idx_menu_items_available ON public.menu_items(is_available) WHERE is_available = true;

CREATE INDEX idx_nutrition_corrections_menu_item ON public.nutrition_corrections(menu_item_id);
CREATE INDEX idx_nutrition_corrections_status ON public.nutrition_corrections(status);
CREATE INDEX idx_nutrition_corrections_submitted_by ON public.nutrition_corrections(submitted_by);

CREATE INDEX idx_correction_votes_correction ON public.correction_votes(correction_id);
CREATE INDEX idx_correction_votes_user ON public.correction_votes(user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at for menu_items
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.correction_votes ENABLE ROW LEVEL SECURITY;

-- menu_items policies
CREATE POLICY "Public can read available menu items"
  ON public.menu_items FOR SELECT
  USING (is_available = true);

CREATE POLICY "Restaurant owners can manage their menu items"
  ON public.menu_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = menu_items.restaurant_id
      AND r.owner_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = menu_items.restaurant_id
      AND r.owner_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

-- nutrition_corrections policies
CREATE POLICY "Public can read corrections"
  ON public.nutrition_corrections FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can submit corrections"
  ON public.nutrition_corrections FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update own pending corrections"
  ON public.nutrition_corrections FOR UPDATE
  USING (auth.uid() = submitted_by AND status = 'pending')
  WITH CHECK (auth.uid() = submitted_by AND status = 'pending');

CREATE POLICY "Admins can manage all corrections"
  ON public.nutrition_corrections FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- correction_votes policies
CREATE POLICY "Public can read votes"
  ON public.correction_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.correction_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change own vote"
  ON public.correction_votes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own vote"
  ON public.correction_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Update vote counts on correction
-- ============================================

CREATE OR REPLACE FUNCTION public.update_correction_vote_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE public.nutrition_corrections SET upvotes = upvotes + 1 WHERE id = NEW.correction_id;
    ELSE
      UPDATE public.nutrition_corrections SET downvotes = downvotes + 1 WHERE id = NEW.correction_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'up' THEN
      UPDATE public.nutrition_corrections SET upvotes = upvotes - 1 WHERE id = OLD.correction_id;
    ELSE
      UPDATE public.nutrition_corrections SET downvotes = downvotes - 1 WHERE id = OLD.correction_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' AND OLD.vote_type != NEW.vote_type THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE public.nutrition_corrections SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.correction_id;
    ELSE
      UPDATE public.nutrition_corrections SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.correction_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_correction_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON public.correction_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_correction_vote_counts();