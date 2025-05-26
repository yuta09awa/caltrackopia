
export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
}

export interface IngredientNutrition {
  id: string;
  name: string;
  servingSize: string;
  nutritionalInfo: NutritionalInfo;
  dietaryFlags: string[];
  allergens: string[];
}

export interface DietaryRestriction {
  id: string;
  name: string;
  description: string;
  excludedIngredients: string[];
}
