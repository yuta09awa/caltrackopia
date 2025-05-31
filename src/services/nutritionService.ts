import { databaseService } from './databaseService';
import { Ingredient, IngredientNutrition, NutritionalInfo } from '@/models/NutritionalInfo';

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
  category: string;
  isOrganic: boolean;
  isLocal: boolean;
  isInSeason: boolean;
}

export class NutritionService {
  async getIngredientNutrition(ingredientId: string): Promise<IngredientNutrition | null> {
    try {
      const ingredient = await databaseService.getIngredientById(ingredientId);
      if (!ingredient) return null;

      return this.transformIngredientToNutrition(ingredient);
    } catch (error) {
      console.error('Error fetching ingredient nutrition:', error);
      return null;
    }
  }

  async searchIngredients(query: string, limit: number = 20): Promise<IngredientNutrition[]> {
    try {
      const ingredients = await databaseService.searchIngredients(query, limit);
      return ingredients.map(ingredient => this.transformIngredientToNutrition(ingredient));
    } catch (error) {
      console.error('Error searching ingredients:', error);
      return [];
    }
  }

  async getIngredientsByCategory(category: string): Promise<IngredientNutrition[]> {
    try {
      const ingredients = await databaseService.getIngredientsByCategory(category);
      return ingredients.map(ingredient => this.transformIngredientToNutrition(ingredient));
    } catch (error) {
      console.error('Error fetching ingredients by category:', error);
      return [];
    }
  }

  async searchByNutrition(criteria: {
    maxCalories?: number;
    minProtein?: number;
    dietaryFlags?: string[];
    allergenFree?: string[];
  }): Promise<IngredientNutrition[]> {
    try {
      const allIngredients = await databaseService.getAllIngredients();
      
      return allIngredients
        .filter(ingredient => {
          // Filter by max calories
          if (criteria.maxCalories && ingredient.calories_per_100g && ingredient.calories_per_100g > criteria.maxCalories) {
            return false;
          }
          
          // Filter by min protein
          if (criteria.minProtein && ingredient.protein_per_100g && ingredient.protein_per_100g < criteria.minProtein) {
            return false;
          }
          
          // Filter by dietary flags
          if (criteria.dietaryFlags && criteria.dietaryFlags.length > 0) {
            const hasAllFlags = criteria.dietaryFlags.every(flag => 
              ingredient.dietary_restrictions.includes(flag)
            );
            if (!hasAllFlags) return false;
          }
          
          // Filter by allergen-free
          if (criteria.allergenFree && criteria.allergenFree.length > 0) {
            const hasAllergen = criteria.allergenFree.some(allergen => 
              ingredient.allergens.includes(allergen)
            );
            if (hasAllergen) return false;
          }
          
          return true;
        })
        .map(ingredient => this.transformIngredientToNutrition(ingredient));
    } catch (error) {
      console.error('Error searching nutrition data:', error);
      return [];
    }
  }

  async getMenuItemsWithNutrition(placeId: string): Promise<MenuItem[]> {
    try {
      return await databaseService.getMenuItemsByPlace(placeId);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  }

  async searchMenuItems(
    query: string,
    dietaryTags?: string[],
    allergenFree?: string[],
    limit: number = 20
  ): Promise<MenuItem[]> {
    try {
      return await databaseService.searchMenuItems(query, dietaryTags, allergenFree, limit);
    } catch (error) {
      console.error('Error searching menu items:', error);
      return [];
    }
  }

  async getDietaryRestrictions(): Promise<DietaryRestriction[]> {
    try {
      return await databaseService.getAllDietaryRestrictions();
    } catch (error) {
      console.error('Error fetching dietary restrictions:', error);
      return [];
    }
  }

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
        cholesterol: (total.cholesterol || 0) + (nutrition.cholesterol || 0),
        vitamins: { ...total.vitamins, ...nutrition.vitamins },
        minerals: { ...total.minerals, ...nutrition.minerals }
      };
    }, {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      cholesterol: 0,
      vitamins: {},
      minerals: {}
    });
  }

  private isInSeason(ingredient: Ingredient): boolean {
    if (!ingredient.peak_season_start || !ingredient.peak_season_end) {
      return true; // Available year-round if no season specified
    }

    const currentMonth = new Date().getMonth() + 1; // 1-12
    const start = ingredient.peak_season_start;
    const end = ingredient.peak_season_end;

    // Handle seasons that cross year boundary (e.g., Nov-Feb)
    if (start <= end) {
      return currentMonth >= start && currentMonth <= end;
    } else {
      return currentMonth >= start || currentMonth <= end;
    }
  }

  private transformIngredientToNutrition(ingredient: any): IngredientNutrition {
    return {
      id: ingredient.id,
      name: ingredient.name,
      servingSize: '100g',
      category: ingredient.category,
      isOrganic: ingredient.is_organic || false,
      isLocal: ingredient.is_local || false,
      isInSeason: this.isInSeason(ingredient),
      nutritionalInfo: {
        calories: ingredient.calories_per_100g || 0,
        protein: ingredient.protein_per_100g || 0,
        carbohydrates: ingredient.carbs_per_100g || 0,
        fat: ingredient.fat_per_100g || 0,
        fiber: ingredient.fiber_per_100g,
        sugar: ingredient.sugar_per_100g,
        sodium: ingredient.sodium_per_100g,
        vitamins: ingredient.vitamins,
        minerals: ingredient.minerals
      },
      dietaryFlags: ingredient.dietary_restrictions || [],
      allergens: ingredient.allergens || []
    };
  }
}

export const nutritionService = new NutritionService();
