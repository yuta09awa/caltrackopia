-- Create ingredients table for searchable ingredient data
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  common_names TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  calories_per_100g NUMERIC,
  protein_per_100g NUMERIC,
  carbs_per_100g NUMERIC,
  fat_per_100g NUMERIC,
  fiber_per_100g NUMERIC,
  sugar_per_100g NUMERIC,
  sodium_per_100g NUMERIC,
  vitamins JSONB DEFAULT '{}',
  minerals JSONB DEFAULT '{}',
  is_organic BOOLEAN DEFAULT false,
  is_local BOOLEAN DEFAULT false,
  is_seasonal BOOLEAN DEFAULT false,
  allergens TEXT[] DEFAULT '{}',
  dietary_restrictions TEXT[] DEFAULT '{}',
  peak_season_start INTEGER,
  peak_season_end INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to ingredients" 
ON ingredients FOR SELECT 
TO public 
USING (true);

-- Create search indexes
CREATE INDEX idx_ingredients_name ON ingredients USING gin(to_tsvector('english', name));
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_name_ilike ON ingredients(name);

-- Seed sample ingredient data
INSERT INTO ingredients (name, common_names, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_organic, allergens, dietary_restrictions) VALUES
('Wheat Flour', ARRAY['All-Purpose Flour', 'Plain Flour'], 'Grains', 364, 10.3, 76.3, 1.0, false, ARRAY['gluten'], ARRAY['vegetarian', 'vegan']),
('Gluten-Free Flour Blend', ARRAY['GF Flour', 'Alternative Flour'], 'Grains', 350, 6.0, 78.0, 2.0, false, ARRAY[]::TEXT[], ARRAY['gluten_free', 'vegetarian', 'vegan']),
('Rice', ARRAY['White Rice', 'Long Grain Rice'], 'Grains', 130, 2.7, 28.2, 0.3, false, ARRAY[]::TEXT[], ARRAY['gluten_free', 'vegetarian', 'vegan']),
('Organic Kale', ARRAY['Kale', 'Curly Kale'], 'Vegetables', 35, 2.9, 4.4, 0.7, true, ARRAY[]::TEXT[], ARRAY['gluten_free', 'vegetarian', 'vegan']),
('Quinoa', ARRAY['Quinoa Grain'], 'Grains', 368, 14.1, 64.2, 6.1, true, ARRAY[]::TEXT[], ARRAY['gluten_free', 'vegetarian', 'vegan']),
('Bread', ARRAY['Wheat Bread', 'Loaf'], 'Bakery', 265, 9.0, 49.0, 3.2, false, ARRAY['gluten', 'wheat'], ARRAY['vegetarian']),
('Oats', ARRAY['Rolled Oats', 'Oatmeal'], 'Grains', 389, 16.9, 66.3, 6.9, false, ARRAY['gluten'], ARRAY['vegetarian', 'vegan']),
('Chickpeas', ARRAY['Garbanzo Beans'], 'Legumes', 164, 8.9, 27.4, 2.6, false, ARRAY[]::TEXT[], ARRAY['gluten_free', 'vegetarian', 'vegan']),
('Almond Flour', ARRAY['Ground Almonds'], 'Nuts', 576, 21.0, 22.0, 50.0, false, ARRAY['tree_nuts'], ARRAY['gluten_free', 'vegetarian', 'vegan']),
('Salmon', ARRAY['Atlantic Salmon', 'Wild Salmon'], 'Seafood', 208, 20.4, 0, 13.4, false, ARRAY['fish'], ARRAY['gluten_free']),
('Gluten Free Pasta', ARRAY['GF Pasta', 'Rice Pasta'], 'Pasta', 355, 7.0, 78.0, 1.5, false, ARRAY[]::TEXT[], ARRAY['gluten_free', 'vegetarian', 'vegan']),
('Soy Sauce', ARRAY['Shoyu'], 'Condiments', 53, 8.1, 4.9, 0.1, false, ARRAY['gluten', 'soy'], ARRAY['vegetarian', 'vegan']),
('Tamari', ARRAY['Gluten Free Soy Sauce'], 'Condiments', 60, 10.5, 5.6, 0.1, false, ARRAY['soy'], ARRAY['gluten_free', 'vegetarian', 'vegan']),
('Eggs', ARRAY['Chicken Eggs'], 'Dairy & Eggs', 155, 12.6, 1.1, 10.6, false, ARRAY['eggs'], ARRAY['gluten_free', 'vegetarian']),
('Milk', ARRAY['Cow Milk', 'Dairy Milk'], 'Dairy & Eggs', 42, 3.4, 5.0, 1.0, false, ARRAY['dairy'], ARRAY['gluten_free', 'vegetarian']),
('Almond Milk', ARRAY['Unsweetened Almond Milk'], 'Dairy Alternatives', 17, 0.6, 0.6, 1.5, false, ARRAY['tree_nuts'], ARRAY['gluten_free', 'vegetarian', 'vegan', 'dairy_free']),
('Peanut Butter', ARRAY['Ground Peanuts'], 'Spreads', 588, 25.1, 20.0, 50.4, false, ARRAY['peanuts'], ARRAY['gluten_free', 'vegetarian', 'vegan']),
('Tofu', ARRAY['Bean Curd', 'Soybean Curd'], 'Proteins', 76, 8.1, 1.9, 4.8, false, ARRAY['soy'], ARRAY['gluten_free', 'vegetarian', 'vegan']),
('Chicken Breast', ARRAY['Boneless Chicken'], 'Proteins', 165, 31.0, 0, 3.6, false, ARRAY[]::TEXT[], ARRAY['gluten_free']),
('Spinach', ARRAY['Baby Spinach'], 'Vegetables', 23, 2.9, 3.6, 0.4, false, ARRAY[]::TEXT[], ARRAY['gluten_free', 'vegetarian', 'vegan']);