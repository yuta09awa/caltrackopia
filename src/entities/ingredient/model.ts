export interface Ingredient {
  id: string;
  name: string;
  category?: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
  };
}

export const createIngredient = (data: Partial<Ingredient> & Pick<Ingredient, 'id' | 'name'>): Ingredient => ({
  id: data.id,
  name: data.name,
  category: data.category,
  nutritionalInfo: data.nutritionalInfo,
});
