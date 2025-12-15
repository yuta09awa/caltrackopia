import type { Tables } from '@/integrations/supabase/types';

export type MenuItem = Tables<'menu_items'>;

export interface MenuItemFormData {
  name: string;
  description?: string | null;
  category?: string | null;
  price?: number | null;
  image_url?: string | null;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fat?: number | null;
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;
  cholesterol?: number | null;
  allergens?: string[];
  dietary_tags?: string[];
  is_available?: boolean;
}

export type Restaurant = Tables<'restaurants'>;

export interface MenuStats {
  totalItems: number;
  availableItems: number;
  verifiedItems: number;
  averageConfidence: number;
}
