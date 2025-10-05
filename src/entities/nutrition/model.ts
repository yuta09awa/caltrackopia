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

// Enhanced Ingredient interface
export interface Ingredient {
  id: string;
  name: string;
  commonNames?: string[];
  category: string;
  description?: string;
  
  // Nutritional information per 100g
  nutritionPer100g: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    vitamins?: Record<string, number>;
    minerals?: Record<string, number>;
  };

  // Sourcing and seasonal information
  isOrganic?: boolean;
  isLocal?: boolean;
  isSeasonal?: boolean;
  peakSeasonStart?: number; // Month (1-12)
  peakSeasonEnd?: number;   // Month (1-12)

  // Dietary information
  allergens: string[];
  dietaryRestrictions: string[];

  // Location availability
  locations?: Array<{
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    distance?: number;
    price?: string;
  }>;
}

export interface IngredientNutrition {
  id: string;
  name: string;
  servingSize: string;
  nutritionalInfo: NutritionalInfo;
  dietaryFlags: string[];
  allergens: string[];
  category: string;
  isOrganic: boolean;
  isLocal: boolean;
  isInSeason: boolean;
}

export interface DietaryRestriction {
  id: string;
  name: string;
  description: string;
  excludedIngredients: string[];
  excludedAllergens: string[];
}

export const createNutritionalInfo = (
  data: Partial<NutritionalInfo> & Pick<NutritionalInfo, 'calories' | 'protein' | 'carbohydrates' | 'fat'>
): NutritionalInfo => ({
  calories: data.calories,
  protein: data.protein,
  carbohydrates: data.carbohydrates,
  fat: data.fat,
  fiber: data.fiber,
  sugar: data.sugar,
  sodium: data.sodium,
  cholesterol: data.cholesterol,
  vitamins: data.vitamins,
  minerals: data.minerals,
});
