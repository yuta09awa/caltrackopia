
import { enhancedDatabaseService } from './enhancedDatabaseService';
import { databaseService } from './databaseService';
import { AllergenType, DietaryTagType, MasterIngredient } from '@/models/StandardizedData';
import { DatabaseError } from './errors/DatabaseError';

/**
 * Service that provides a unified interface for both standardized and legacy data.
 * Falls back to mock data when standardized tables are not available.
 */
export class StandardizedDataService {
  // Allergen management with fallback
  async getAllergenTypes(): Promise<AllergenType[]> {
    try {
      return await enhancedDatabaseService.getAllergenTypes();
    } catch (error) {
      console.warn('Failed to fetch standardized allergen types, using fallback data:', error);
      return this.getFallbackAllergenTypes();
    }
  }

  // Dietary tag management with fallback
  async getDietaryTagTypes(): Promise<DietaryTagType[]> {
    try {
      return await enhancedDatabaseService.getDietaryTagTypes();
    } catch (error) {
      console.warn('Failed to fetch standardized dietary tag types, using fallback data:', error);
      return this.getFallbackDietaryTagTypes();
    }
  }

  async getDietaryTagTypesByCategory(category: string): Promise<DietaryTagType[]> {
    try {
      return await enhancedDatabaseService.getDietaryTagTypesByCategory(category);
    } catch (error) {
      console.warn('Failed to fetch dietary tag types by category, using fallback data:', error);
      const fallbackTags = this.getFallbackDietaryTagTypes();
      return fallbackTags.filter(tag => tag.category === category);
    }
  }

  // Master ingredients management with fallback
  async getMasterIngredients(): Promise<MasterIngredient[]> {
    try {
      return await enhancedDatabaseService.getMasterIngredients();
    } catch (error) {
      console.warn('Failed to fetch standardized master ingredients, using fallback data:', error);
      return this.getFallbackMasterIngredients();
    }
  }

  async searchMasterIngredients(query: string, limit: number = 20): Promise<MasterIngredient[]> {
    try {
      return await enhancedDatabaseService.searchMasterIngredients(query, limit);
    } catch (error) {
      console.warn('Failed to search standardized master ingredients, using fallback search:', error);
      const fallbackIngredients = this.getFallbackMasterIngredients();
      return fallbackIngredients
        .filter(ingredient => 
          ingredient.name.toLowerCase().includes(query.toLowerCase()) ||
          ingredient.commonNames.some(name => name.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, limit);
    }
  }

  async getMasterIngredientsByCategory(category: string): Promise<MasterIngredient[]> {
    try {
      return await enhancedDatabaseService.getMasterIngredientsByCategory(category);
    } catch (error) {
      console.warn('Failed to fetch master ingredients by category, using fallback data:', error);
      const fallbackIngredients = this.getFallbackMasterIngredients();
      return fallbackIngredients.filter(ingredient => ingredient.category === category);
    }
  }

  // Enhanced place methods (delegate to existing service)
  async getEnhancedPlaceById(id: string) {
    return databaseService.getCachedPlaceById(id);
  }

  async searchPlaces(query: string, limit: number = 20) {
    return databaseService.searchPlaces(query, limit);
  }

  // Quota management (with safe fallbacks)
  async checkApiQuota(serviceName: string) {
    try {
      return await enhancedDatabaseService.checkApiQuota(serviceName);
    } catch (error) {
      console.warn('Failed to check API quota, allowing request:', error);
      return {
        allowed: true,
        quotaStatus: {
          serviceName,
          quotaUsed: 0,
          quotaLimit: 1000,
          quotaRemaining: 1000,
          resetAt: new Date().toISOString(),
          isExceeded: false
        }
      };
    }
  }

  async incrementApiQuota(serviceName: string, amount: number = 1) {
    try {
      await enhancedDatabaseService.incrementApiQuota(serviceName, amount);
    } catch (error) {
      console.warn('Failed to increment API quota (non-critical):', error);
      // Non-critical error - don't throw
    }
  }

  // Audit logging (non-blocking)
  async logAuditEvent(entry: any) {
    try {
      await enhancedDatabaseService.logAuditEvent(entry);
    } catch (error) {
      console.warn('Failed to log audit event (non-critical):', error);
      // Non-critical error - don't throw
    }
  }

  // Fallback data methods
  private getFallbackAllergenTypes(): AllergenType[] {
    return [
      {
        id: 'fallback-gluten',
        name: 'Gluten',
        description: 'Protein found in wheat, barley, rye',
        commonAliases: ['wheat', 'gluten-containing grains'],
        severityLevel: 'medium',
        i18nKey: 'allergen.gluten',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'fallback-dairy',
        name: 'Dairy',
        description: 'Milk and milk products',
        commonAliases: ['milk', 'lactose', 'casein'],
        severityLevel: 'medium',
        i18nKey: 'allergen.dairy',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'fallback-nuts',
        name: 'Nuts',
        description: 'Tree nuts including almonds, walnuts, etc.',
        commonAliases: ['tree nuts', 'almonds', 'walnuts'],
        severityLevel: 'high',
        i18nKey: 'allergen.nuts',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  private getFallbackDietaryTagTypes(): DietaryTagType[] {
    return [
      {
        id: 'fallback-vegetarian',
        name: 'Vegetarian',
        description: 'No meat or fish',
        category: 'diet',
        iconName: 'leaf',
        i18nKey: 'dietary.vegetarian',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'fallback-vegan',
        name: 'Vegan',
        description: 'No animal products',
        category: 'diet',
        iconName: 'sprout',
        i18nKey: 'dietary.vegan',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'fallback-gluten-free',
        name: 'Gluten-Free',
        description: 'No gluten-containing ingredients',
        category: 'health',
        iconName: 'wheat-off',
        i18nKey: 'dietary.gluten_free',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  private getFallbackMasterIngredients(): MasterIngredient[] {
    return [
      {
        id: 'fallback-tomato',
        name: 'Tomato',
        commonNames: ['tomatoes', 'cherry tomatoes'],
        category: 'vegetables',
        description: 'Fresh tomatoes',
        allergenIds: [],
        isOrganicAvailable: true,
        isSeasonal: true,
        peakSeasonMonths: [6, 7, 8, 9],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'fallback-chicken',
        name: 'Chicken Breast',
        commonNames: ['chicken', 'poultry'],
        category: 'protein',
        description: 'Boneless chicken breast',
        allergenIds: [],
        isOrganicAvailable: true,
        isSeasonal: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'fallback-rice',
        name: 'Rice',
        commonNames: ['white rice', 'brown rice'],
        category: 'grains',
        description: 'Rice grains',
        allergenIds: [],
        isOrganicAvailable: true,
        isSeasonal: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
}

export const standardizedDataService = new StandardizedDataService();
