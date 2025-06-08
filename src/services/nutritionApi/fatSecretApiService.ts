
import { NutritionalInfo } from '@/models/NutritionalInfo';

export interface FatSecretFood {
  food_id: string;
  food_name: string;
  food_type: string;
  brand_name?: string;
  food_url: string;
  servings: {
    serving: FatSecretServing[];
  };
}

export interface FatSecretServing {
  serving_id: string;
  serving_description: string;
  serving_url: string;
  metric_serving_amount?: string;
  metric_serving_unit?: string;
  number_of_units?: string;
  measurement_description: string;
  calories: string;
  carbohydrate: string;
  protein: string;
  fat: string;
  saturated_fat?: string;
  polyunsaturated_fat?: string;
  monounsaturated_fat?: string;
  cholesterol?: string;
  sodium?: string;
  potassium?: string;
  fiber?: string;
  sugar?: string;
  vitamin_a?: string;
  vitamin_c?: string;
  calcium?: string;
  iron?: string;
}

export interface FatSecretSearchResult {
  foods: {
    food: FatSecretFood[];
    max_results: string;
    page_number: string;
    total_results: string;
  };
}

export class FatSecretApiService {
  // Note: FatSecret requires OAuth 1.0 authentication which is complex for frontend
  // This would typically be implemented via a backend service or edge function
  
  async searchFoods(query: string, pageNumber: number = 0): Promise<FatSecretSearchResult> {
    // This would need to be implemented via a Supabase Edge Function
    // due to OAuth 1.0 authentication requirements
    throw new Error('FatSecret API requires backend implementation via Edge Function');
  }

  async getFoodById(foodId: string): Promise<FatSecretFood> {
    // This would need to be implemented via a Supabase Edge Function
    throw new Error('FatSecret API requires backend implementation via Edge Function');
  }

  transformToNutritionalInfo(fatSecretFood: FatSecretFood, servingIndex: number = 0): NutritionalInfo {
    const serving = fatSecretFood.servings.serving[servingIndex];
    
    if (!serving) {
      throw new Error('No serving information available');
    }

    return {
      calories: parseFloat(serving.calories) || 0,
      protein: parseFloat(serving.protein) || 0,
      carbohydrates: parseFloat(serving.carbohydrate) || 0,
      fat: parseFloat(serving.fat) || 0,
      fiber: parseFloat(serving.fiber || '0'),
      sugar: parseFloat(serving.sugar || '0'),
      sodium: parseFloat(serving.sodium || '0') / 1000, // Convert mg to g
      cholesterol: parseFloat(serving.cholesterol || '0') / 1000, // Convert mg to g
      vitamins: {
        'Vitamin A': parseFloat(serving.vitamin_a || '0'),
        'Vitamin C': parseFloat(serving.vitamin_c || '0')
      },
      minerals: {
        'Calcium': parseFloat(serving.calcium || '0'),
        'Iron': parseFloat(serving.iron || '0'),
        'Potassium': parseFloat(serving.potassium || '0')
      }
    };
  }
}

export const fatSecretApiService = new FatSecretApiService();
