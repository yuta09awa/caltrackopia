-- Seed master_ingredients with USDA nutritional data (per 100g)
-- Top 50 common ingredients for hybrid AI matching

INSERT INTO public.master_ingredients (name, common_names, category, nutritional_data, external_api_ids, is_organic_available, is_seasonal)
VALUES
  -- Proteins
  ('Chicken Breast', ARRAY['chicken', 'grilled chicken', 'chicken breast', 'poultry'], 'protein', 
   '{"calories": 165, "protein": 31, "carbohydrates": 0, "fat": 3.6, "fiber": 0, "sugar": 0, "sodium": 74}',
   '{"usda_fdc_id": "171077"}', true, false),
  
  ('Beef Ground', ARRAY['beef', 'ground beef', 'hamburger', 'minced beef'], 'protein',
   '{"calories": 250, "protein": 26, "carbohydrates": 0, "fat": 17, "fiber": 0, "sugar": 0, "sodium": 75}',
   '{"usda_fdc_id": "174032"}', true, false),
  
  ('Salmon', ARRAY['salmon fillet', 'atlantic salmon', 'grilled salmon', 'fish'], 'protein',
   '{"calories": 208, "protein": 20, "carbohydrates": 0, "fat": 13, "fiber": 0, "sugar": 0, "sodium": 59}',
   '{"usda_fdc_id": "175167"}', true, true),
  
  ('Egg', ARRAY['eggs', 'whole egg', 'fried egg', 'scrambled egg', 'boiled egg'], 'protein',
   '{"calories": 155, "protein": 13, "carbohydrates": 1.1, "fat": 11, "fiber": 0, "sugar": 1.1, "sodium": 124}',
   '{"usda_fdc_id": "171287"}', true, false),
  
  ('Tofu', ARRAY['bean curd', 'firm tofu', 'silken tofu', 'soybean curd'], 'protein',
   '{"calories": 76, "protein": 8, "carbohydrates": 1.9, "fat": 4.8, "fiber": 0.3, "sugar": 0.6, "sodium": 7}',
   '{"usda_fdc_id": "174291"}', true, false),
  
  ('Shrimp', ARRAY['prawns', 'grilled shrimp', 'cooked shrimp'], 'protein',
   '{"calories": 99, "protein": 24, "carbohydrates": 0.2, "fat": 0.3, "fiber": 0, "sugar": 0, "sodium": 111}',
   '{"usda_fdc_id": "175180"}', false, true),
  
  ('Pork Chop', ARRAY['pork', 'pork loin', 'grilled pork'], 'protein',
   '{"calories": 231, "protein": 25, "carbohydrates": 0, "fat": 14, "fiber": 0, "sugar": 0, "sodium": 62}',
   '{"usda_fdc_id": "168203"}', true, false),
  
  ('Turkey Breast', ARRAY['turkey', 'roast turkey', 'sliced turkey'], 'protein',
   '{"calories": 135, "protein": 30, "carbohydrates": 0, "fat": 0.7, "fiber": 0, "sugar": 0, "sodium": 46}',
   '{"usda_fdc_id": "171506"}', true, false),

  -- Grains & Carbs
  ('White Rice', ARRAY['rice', 'steamed rice', 'cooked rice', 'jasmine rice', 'basmati rice'], 'grain',
   '{"calories": 130, "protein": 2.7, "carbohydrates": 28, "fat": 0.3, "fiber": 0.4, "sugar": 0, "sodium": 1}',
   '{"usda_fdc_id": "169756"}', true, false),
  
  ('Brown Rice', ARRAY['whole grain rice', 'cooked brown rice'], 'grain',
   '{"calories": 112, "protein": 2.6, "carbohydrates": 24, "fat": 0.9, "fiber": 1.8, "sugar": 0.4, "sodium": 1}',
   '{"usda_fdc_id": "169704"}', true, false),
  
  ('Pasta', ARRAY['spaghetti', 'noodles', 'penne', 'fettuccine', 'cooked pasta'], 'grain',
   '{"calories": 131, "protein": 5, "carbohydrates": 25, "fat": 1.1, "fiber": 1.8, "sugar": 0.6, "sodium": 1}',
   '{"usda_fdc_id": "168919"}', true, false),
  
  ('Bread', ARRAY['white bread', 'toast', 'bread slice', 'sandwich bread'], 'grain',
   '{"calories": 265, "protein": 9, "carbohydrates": 49, "fat": 3.2, "fiber": 2.7, "sugar": 5, "sodium": 491}',
   '{"usda_fdc_id": "172686"}', true, false),
  
  ('Quinoa', ARRAY['cooked quinoa', 'grain bowl base'], 'grain',
   '{"calories": 120, "protein": 4.4, "carbohydrates": 21, "fat": 1.9, "fiber": 2.8, "sugar": 0.9, "sodium": 7}',
   '{"usda_fdc_id": "168917"}', true, false),
  
  ('Potato', ARRAY['potatoes', 'baked potato', 'mashed potato', 'boiled potato'], 'vegetable',
   '{"calories": 77, "protein": 2, "carbohydrates": 17, "fat": 0.1, "fiber": 2.2, "sugar": 0.8, "sodium": 6}',
   '{"usda_fdc_id": "170026"}', true, true),
  
  ('Sweet Potato', ARRAY['yam', 'baked sweet potato', 'mashed sweet potato'], 'vegetable',
   '{"calories": 86, "protein": 1.6, "carbohydrates": 20, "fat": 0.1, "fiber": 3, "sugar": 4.2, "sodium": 55}',
   '{"usda_fdc_id": "168482"}', true, true),

  -- Vegetables
  ('Broccoli', ARRAY['steamed broccoli', 'broccoli florets', 'cooked broccoli'], 'vegetable',
   '{"calories": 34, "protein": 2.8, "carbohydrates": 7, "fat": 0.4, "fiber": 2.6, "sugar": 1.7, "sodium": 33}',
   '{"usda_fdc_id": "170379"}', true, true),
  
  ('Spinach', ARRAY['baby spinach', 'cooked spinach', 'sauteed spinach', 'leafy greens'], 'vegetable',
   '{"calories": 23, "protein": 2.9, "carbohydrates": 3.6, "fat": 0.4, "fiber": 2.2, "sugar": 0.4, "sodium": 79}',
   '{"usda_fdc_id": "168462"}', true, true),
  
  ('Carrot', ARRAY['carrots', 'baby carrots', 'cooked carrots', 'sliced carrots'], 'vegetable',
   '{"calories": 41, "protein": 0.9, "carbohydrates": 10, "fat": 0.2, "fiber": 2.8, "sugar": 4.7, "sodium": 69}',
   '{"usda_fdc_id": "170393"}', true, true),
  
  ('Tomato', ARRAY['tomatoes', 'cherry tomato', 'sliced tomato', 'diced tomato'], 'vegetable',
   '{"calories": 18, "protein": 0.9, "carbohydrates": 3.9, "fat": 0.2, "fiber": 1.2, "sugar": 2.6, "sodium": 5}',
   '{"usda_fdc_id": "170457"}', true, true),
  
  ('Lettuce', ARRAY['romaine', 'iceberg lettuce', 'mixed greens', 'salad greens'], 'vegetable',
   '{"calories": 15, "protein": 1.4, "carbohydrates": 2.9, "fat": 0.2, "fiber": 1.3, "sugar": 1.3, "sodium": 28}',
   '{"usda_fdc_id": "169247"}', true, true),
  
  ('Onion', ARRAY['onions', 'diced onion', 'cooked onion', 'sauteed onion'], 'vegetable',
   '{"calories": 40, "protein": 1.1, "carbohydrates": 9.3, "fat": 0.1, "fiber": 1.7, "sugar": 4.2, "sodium": 4}',
   '{"usda_fdc_id": "170000"}', true, false),
  
  ('Bell Pepper', ARRAY['peppers', 'red pepper', 'green pepper', 'capsicum'], 'vegetable',
   '{"calories": 31, "protein": 1, "carbohydrates": 6, "fat": 0.3, "fiber": 2.1, "sugar": 4.2, "sodium": 4}',
   '{"usda_fdc_id": "170427"}', true, true),
  
  ('Cucumber', ARRAY['cucumbers', 'sliced cucumber', 'pickles'], 'vegetable',
   '{"calories": 15, "protein": 0.7, "carbohydrates": 3.6, "fat": 0.1, "fiber": 0.5, "sugar": 1.7, "sodium": 2}',
   '{"usda_fdc_id": "168409"}', true, true),
  
  ('Mushroom', ARRAY['mushrooms', 'white mushroom', 'cremini', 'button mushroom'], 'vegetable',
   '{"calories": 22, "protein": 3.1, "carbohydrates": 3.3, "fat": 0.3, "fiber": 1, "sugar": 2, "sodium": 5}',
   '{"usda_fdc_id": "169251"}', true, false),
  
  ('Avocado', ARRAY['avocados', 'guacamole base', 'sliced avocado'], 'fruit',
   '{"calories": 160, "protein": 2, "carbohydrates": 9, "fat": 15, "fiber": 7, "sugar": 0.7, "sodium": 7}',
   '{"usda_fdc_id": "171705"}', true, true),

  -- Fruits
  ('Apple', ARRAY['apples', 'sliced apple', 'red apple', 'green apple'], 'fruit',
   '{"calories": 52, "protein": 0.3, "carbohydrates": 14, "fat": 0.2, "fiber": 2.4, "sugar": 10, "sodium": 1}',
   '{"usda_fdc_id": "171688"}', true, true),
  
  ('Banana', ARRAY['bananas', 'sliced banana'], 'fruit',
   '{"calories": 89, "protein": 1.1, "carbohydrates": 23, "fat": 0.3, "fiber": 2.6, "sugar": 12, "sodium": 1}',
   '{"usda_fdc_id": "173944"}', true, false),
  
  ('Orange', ARRAY['oranges', 'citrus', 'mandarin'], 'fruit',
   '{"calories": 47, "protein": 0.9, "carbohydrates": 12, "fat": 0.1, "fiber": 2.4, "sugar": 9.4, "sodium": 0}',
   '{"usda_fdc_id": "169097"}', true, true),
  
  ('Strawberry', ARRAY['strawberries', 'berries', 'fresh berries'], 'fruit',
   '{"calories": 32, "protein": 0.7, "carbohydrates": 7.7, "fat": 0.3, "fiber": 2, "sugar": 4.9, "sodium": 1}',
   '{"usda_fdc_id": "167762"}', true, true),
  
  ('Blueberry', ARRAY['blueberries', 'fresh blueberries'], 'fruit',
   '{"calories": 57, "protein": 0.7, "carbohydrates": 14, "fat": 0.3, "fiber": 2.4, "sugar": 10, "sodium": 1}',
   '{"usda_fdc_id": "171711"}', true, true),

  -- Dairy
  ('Milk', ARRAY['whole milk', 'skim milk', '2% milk', 'dairy milk'], 'dairy',
   '{"calories": 61, "protein": 3.2, "carbohydrates": 4.8, "fat": 3.3, "fiber": 0, "sugar": 5, "sodium": 43}',
   '{"usda_fdc_id": "171265"}', true, false),
  
  ('Cheese', ARRAY['cheddar', 'shredded cheese', 'sliced cheese', 'mozzarella'], 'dairy',
   '{"calories": 403, "protein": 25, "carbohydrates": 1.3, "fat": 33, "fiber": 0, "sugar": 0.5, "sodium": 621}',
   '{"usda_fdc_id": "173414"}', true, false),
  
  ('Greek Yogurt', ARRAY['yogurt', 'plain yogurt', 'strained yogurt'], 'dairy',
   '{"calories": 59, "protein": 10, "carbohydrates": 3.6, "fat": 0.7, "fiber": 0, "sugar": 3.2, "sodium": 36}',
   '{"usda_fdc_id": "170903"}', true, false),
  
  ('Butter', ARRAY['melted butter', 'unsalted butter', 'salted butter'], 'dairy',
   '{"calories": 717, "protein": 0.9, "carbohydrates": 0.1, "fat": 81, "fiber": 0, "sugar": 0.1, "sodium": 11}',
   '{"usda_fdc_id": "173430"}', true, false),

  -- Legumes & Nuts
  ('Black Beans', ARRAY['beans', 'cooked beans', 'canned beans'], 'legume',
   '{"calories": 132, "protein": 8.9, "carbohydrates": 24, "fat": 0.5, "fiber": 8.7, "sugar": 0.3, "sodium": 1}',
   '{"usda_fdc_id": "173735"}', true, false),
  
  ('Chickpeas', ARRAY['garbanzo beans', 'hummus base', 'cooked chickpeas'], 'legume',
   '{"calories": 164, "protein": 8.9, "carbohydrates": 27, "fat": 2.6, "fiber": 7.6, "sugar": 4.8, "sodium": 7}',
   '{"usda_fdc_id": "173757"}', true, false),
  
  ('Lentils', ARRAY['cooked lentils', 'red lentils', 'green lentils'], 'legume',
   '{"calories": 116, "protein": 9, "carbohydrates": 20, "fat": 0.4, "fiber": 7.9, "sugar": 1.8, "sodium": 2}',
   '{"usda_fdc_id": "172421"}', true, false),
  
  ('Almonds', ARRAY['almond', 'sliced almonds', 'almond butter'], 'nut',
   '{"calories": 579, "protein": 21, "carbohydrates": 22, "fat": 50, "fiber": 12, "sugar": 4.4, "sodium": 1}',
   '{"usda_fdc_id": "170567"}', true, false),
  
  ('Peanuts', ARRAY['peanut', 'peanut butter', 'roasted peanuts'], 'nut',
   '{"calories": 567, "protein": 26, "carbohydrates": 16, "fat": 49, "fiber": 8.5, "sugar": 4, "sodium": 18}',
   '{"usda_fdc_id": "172430"}', true, false),
  
  ('Walnuts', ARRAY['walnut', 'walnut pieces', 'chopped walnuts'], 'nut',
   '{"calories": 654, "protein": 15, "carbohydrates": 14, "fat": 65, "fiber": 6.7, "sugar": 2.6, "sodium": 2}',
   '{"usda_fdc_id": "170187"}', true, false),

  -- Oils & Fats
  ('Olive Oil', ARRAY['extra virgin olive oil', 'cooking oil', 'EVOO'], 'oil',
   '{"calories": 884, "protein": 0, "carbohydrates": 0, "fat": 100, "fiber": 0, "sugar": 0, "sodium": 2}',
   '{"usda_fdc_id": "171413"}', true, false),
  
  ('Coconut Oil', ARRAY['cooking oil', 'virgin coconut oil'], 'oil',
   '{"calories": 862, "protein": 0, "carbohydrates": 0, "fat": 100, "fiber": 0, "sugar": 0, "sodium": 0}',
   '{"usda_fdc_id": "171414"}', true, false),

  -- Common additions
  ('Garlic', ARRAY['minced garlic', 'garlic cloves', 'roasted garlic'], 'vegetable',
   '{"calories": 149, "protein": 6.4, "carbohydrates": 33, "fat": 0.5, "fiber": 2.1, "sugar": 1, "sodium": 17}',
   '{"usda_fdc_id": "169230"}', true, false),
  
  ('Ginger', ARRAY['fresh ginger', 'minced ginger', 'ginger root'], 'spice',
   '{"calories": 80, "protein": 1.8, "carbohydrates": 18, "fat": 0.8, "fiber": 2, "sugar": 1.7, "sodium": 13}',
   '{"usda_fdc_id": "169231"}', true, false),
  
  ('Soy Sauce', ARRAY['tamari', 'shoyu', 'soya sauce'], 'condiment',
   '{"calories": 53, "protein": 8.1, "carbohydrates": 4.9, "fat": 0.1, "fiber": 0.8, "sugar": 0.4, "sodium": 5637}',
   '{"usda_fdc_id": "174284"}', false, false),
  
  ('Honey', ARRAY['raw honey', 'drizzled honey'], 'sweetener',
   '{"calories": 304, "protein": 0.3, "carbohydrates": 82, "fat": 0, "fiber": 0.2, "sugar": 82, "sodium": 4}',
   '{"usda_fdc_id": "169640"}', true, false),
  
  ('Sugar', ARRAY['white sugar', 'granulated sugar', 'table sugar'], 'sweetener',
   '{"calories": 387, "protein": 0, "carbohydrates": 100, "fat": 0, "fiber": 0, "sugar": 100, "sodium": 1}',
   '{"usda_fdc_id": "169655"}', false, false)

ON CONFLICT (name) DO UPDATE SET
  common_names = EXCLUDED.common_names,
  nutritional_data = EXCLUDED.nutritional_data,
  external_api_ids = EXCLUDED.external_api_ids,
  updated_at = now();