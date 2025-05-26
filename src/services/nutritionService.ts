
import { NutritionalInfo, IngredientNutrition } from "@/models/NutritionalInfo";
import { apiService } from "./api/apiService";

export class NutritionService {
  /**
   * Get nutritional information for an ingredient
   */
  async getIngredientNutrition(ingredientId: string): Promise<IngredientNutrition | null> {
    try {
      return await apiService.get<IngredientNutrition>(`/nutrition/ingredients/${ingredientId}`);
    } catch (error) {
      console.error('Error fetching ingredient nutrition:', error);
      return null;
    }
  }

  /**
   * Search ingredients by nutritional criteria
   */
  async searchByNutrition(criteria: {
    maxCalories?: number;
    minProtein?: number;
    dietaryFlags?: string[];
  }): Promise<IngredientNutrition[]> {
    try {
      const params = new URLSearchParams();
      if (criteria.maxCalories) params.append('maxCalories', criteria.maxCalories.toString());
      if (criteria.minProtein) params.append('minProtein', criteria.minProtein.toString());
      if (criteria.dietaryFlags) {
        criteria.dietaryFlags.forEach(flag => params.append('dietaryFlags', flag));
      }

      return await apiService.get<IngredientNutrition[]>(`/nutrition/search?${params.toString()}`);
    } catch (error) {
      console.error('Error searching nutrition data:', error);
      return [];
    }
  }

  /**
   * Calculate total nutrition for multiple ingredients
   */
  calculateTotalNutrition(ingredients: IngredientNutrition[]): NutritionalInfo {
    return ingredients.reduce((total, ingredient) => {
      const nutrition = ingredient.nutritionalInfo;
      return {
        calories: total.calories + nutrition.calories,
        protein: total.protein + nutrition.protein,
        carbohydrates: total.carbohydrates + nutrition.carbohydrates,
        fat: total.fat + nutrition.fat,
        fiber: (total.fiber || 0) + (nutrition.fiber || 0),
        sugar: (total.sugar || 0) + (nutrition.sugar || 0),
        sodium: (total.sodium || 0) + (nutrition.sodium || 0),
        cholesterol: (total.cholesterol || 0) + (nutrition.cholesterol || 0)
      };
    }, {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      cholesterol: 0
    });
  }
}

// Export singleton instance
export const nutritionService = new NutritionService();
