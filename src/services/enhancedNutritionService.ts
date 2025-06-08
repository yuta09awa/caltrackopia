
import { NutritionalInfo, Ingredient } from '@/models/NutritionalInfo';
import { nutritionService } from './nutritionService';
import { usdaApiService, USDAFood } from './nutritionApi/usdaApiService';
import { fatSecretApiService, FatSecretFood } from './nutritionApi/fatSecretApiService';
import { databaseService } from './databaseService';

export interface NutritionDataSource {
  source: 'local' | 'usda' | 'fatsecret';
  confidence: number;
  lastUpdated: Date;
}

export interface EnhancedIngredient extends Ingredient {
  nutritionSource?: NutritionDataSource;
  externalIds?: {
    usdaFdcId?: number;
    fatSecretId?: string;
  };
}

export class EnhancedNutritionService {
  private cacheExpiryDays = 30; // Cache nutrition data for 30 days

  async searchIngredientsWithNutrition(query: string, includeExternal: boolean = true): Promise<EnhancedIngredient[]> {
    try {
      // First, search local database
      const localResults = await nutritionService.searchIngredients(query, 10);
      const enhancedResults: EnhancedIngredient[] = localResults.map(ingredient => ({
        ...ingredient,
        nutritionSource: {
          source: 'local',
          confidence: 0.9,
          lastUpdated: new Date()
        }
      }));

      // If we have enough local results or external search is disabled, return them
      if (enhancedResults.length >= 5 || !includeExternal) {
        return enhancedResults;
      }

      // Search USDA for additional results
      try {
        const usdaResults = await usdaApiService.searchFoods(query, 10);
        const usdaIngredients = await Promise.all(
          usdaResults.foods.slice(0, 5).map(async (usdaFood) => {
            return this.transformUSDAToIngredient(usdaFood);
          })
        );
        enhancedResults.push(...usdaIngredients);
      } catch (error) {
        console.warn('USDA search failed:', error);
      }

      return enhancedResults.slice(0, 15); // Limit total results
    } catch (error) {
      console.error('Enhanced nutrition search failed:', error);
      throw error;
    }
  }

  async getIngredientNutrition(ingredientId: string, forceRefresh: boolean = false): Promise<EnhancedIngredient | null> {
    try {
      // Check local database first
      const localIngredient = await nutritionService.getIngredientNutrition(ingredientId);
      
      if (localIngredient && !forceRefresh) {
        return {
          ...this.transformLocalToEnhanced(localIngredient),
          nutritionSource: {
            source: 'local',
            confidence: 0.9,
            lastUpdated: new Date()
          }
        };
      }

      // If not found locally or refresh requested, try external APIs
      return await this.fetchFromExternalAPIs(ingredientId);
    } catch (error) {
      console.error('Error fetching ingredient nutrition:', error);
      return null;
    }
  }

  async syncNutritionData(ingredientName: string): Promise<void> {
    try {
      console.log(`Syncing nutrition data for: ${ingredientName}`);
      
      // Search USDA for the ingredient
      const usdaResults = await usdaApiService.searchFoods(ingredientName, 5);
      
      for (const usdaFood of usdaResults.foods.slice(0, 2)) {
        const enhancedIngredient = await this.transformUSDAToIngredient(usdaFood);
        
        // Save to local database for future use
        await this.saveToLocalDatabase(enhancedIngredient);
      }
      
      console.log(`Successfully synced nutrition data for: ${ingredientName}`);
    } catch (error) {
      console.error(`Failed to sync nutrition data for ${ingredientName}:`, error);
    }
  }

  private async transformUSDAToIngredient(usdaFood: USDAFood): Promise<EnhancedIngredient> {
    const nutritionInfo = usdaApiService.transformToNutritionalInfo(usdaFood);
    
    return {
      id: `usda-${usdaFood.fdcId}`,
      name: usdaFood.description,
      category: usdaFood.foodCategory?.description || 'Unknown',
      description: usdaFood.description,
      nutritionPer100g: {
        calories: nutritionInfo.calories,
        protein: nutritionInfo.protein,
        carbs: nutritionInfo.carbohydrates,
        fat: nutritionInfo.fat,
        fiber: nutritionInfo.fiber,
        sugar: nutritionInfo.sugar,
        sodium: nutritionInfo.sodium,
        vitamins: nutritionInfo.vitamins,
        minerals: nutritionInfo.minerals
      },
      allergens: this.extractAllergensFromUSDA(usdaFood),
      dietaryRestrictions: this.extractDietaryRestrictionsFromUSDA(usdaFood),
      locations: [],
      nutritionSource: {
        source: 'usda',
        confidence: 0.8,
        lastUpdated: new Date()
      },
      externalIds: {
        usdaFdcId: usdaFood.fdcId
      }
    };
  }

  private transformLocalToEnhanced(localIngredient: any): EnhancedIngredient {
    return {
      id: localIngredient.id,
      name: localIngredient.name,
      category: localIngredient.category,
      description: localIngredient.name,
      nutritionPer100g: {
        calories: localIngredient.nutritionalInfo.calories,
        protein: localIngredient.nutritionalInfo.protein,
        carbs: localIngredient.nutritionalInfo.carbohydrates,
        fat: localIngredient.nutritionalInfo.fat,
        fiber: localIngredient.nutritionalInfo.fiber,
        sugar: localIngredient.nutritionalInfo.sugar,
        sodium: localIngredient.nutritionalInfo.sodium,
        vitamins: localIngredient.nutritionalInfo.vitamins,
        minerals: localIngredient.nutritionalInfo.minerals
      },
      isOrganic: localIngredient.isOrganic,
      isLocal: localIngredient.isLocal,
      isSeasonal: localIngredient.isInSeason,
      allergens: localIngredient.allergens,
      dietaryRestrictions: localIngredient.dietaryFlags,
      locations: []
    };
  }

  private async fetchFromExternalAPIs(ingredientId: string): Promise<EnhancedIngredient | null> {
    // This would implement the fallback chain: USDA → FatSecret → Manual entry
    // For now, we'll just return null if not found locally
    return null;
  }

  private async saveToLocalDatabase(ingredient: EnhancedIngredient): Promise<void> {
    // This would save the enhanced ingredient data to the local database
    // Implementation would depend on your database schema
    console.log('Saving ingredient to local database:', ingredient.name);
  }

  private extractAllergensFromUSDA(usdaFood: USDAFood): string[] {
    // Extract common allergens from USDA ingredients string
    const allergens: string[] = [];
    const ingredients = usdaFood.ingredients?.toLowerCase() || '';
    
    const commonAllergens = [
      'milk', 'eggs', 'fish', 'shellfish', 'tree nuts', 'peanuts', 'wheat', 'soybeans'
    ];
    
    commonAllergens.forEach(allergen => {
      if (ingredients.includes(allergen)) {
        allergens.push(allergen);
      }
    });
    
    return allergens;
  }

  private extractDietaryRestrictionsFromUSDA(usdaFood: USDAFood): string[] {
    // Extract dietary information from USDA data
    const restrictions: string[] = [];
    const description = usdaFood.description.toLowerCase();
    const ingredients = usdaFood.ingredients?.toLowerCase() || '';
    
    // Check for common dietary markers
    if (!ingredients.includes('milk') && !ingredients.includes('dairy')) {
      restrictions.push('dairy-free');
    }
    
    if (!ingredients.includes('gluten') && !ingredients.includes('wheat')) {
      restrictions.push('gluten-free');
    }
    
    if (description.includes('organic')) {
      restrictions.push('organic');
    }
    
    return restrictions;
  }
}

export const enhancedNutritionService = new EnhancedNutritionService();
