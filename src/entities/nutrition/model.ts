export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize?: string;
}

export interface DietaryRestriction {
  id: string;
  name: string;
  description?: string;
}

export const createNutritionalInfo = (data: Partial<NutritionalInfo> & Pick<NutritionalInfo, 'calories' | 'protein' | 'carbs' | 'fat'>): NutritionalInfo => ({
  calories: data.calories,
  protein: data.protein,
  carbs: data.carbs,
  fat: data.fat,
  fiber: data.fiber,
  sugar: data.sugar,
  sodium: data.sodium,
  servingSize: data.servingSize,
});
