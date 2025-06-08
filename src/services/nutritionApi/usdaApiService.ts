
import { NutritionalInfo } from '@/models/NutritionalInfo';

export interface USDAFood {
  fdcId: number;
  description: string;
  brandOwner?: string;
  ingredients?: string;
  foodNutrients: USDANutrient[];
  foodCategory?: {
    description: string;
  };
  publicationDate?: string;
}

export interface USDANutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
}

export interface USDASearchResult {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: USDAFood[];
}

export class USDAApiService {
  private readonly baseUrl = 'https://api.nal.usda.gov/fdc/v1';
  
  async searchFoods(query: string, pageSize: number = 25): Promise<USDASearchResult> {
    try {
      const response = await fetch(`${this.baseUrl}/foods/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          pageSize,
          dataType: ['Foundation', 'SR Legacy', 'Branded'],
          pageNumber: 1,
          sortBy: 'dataType.keyword',
          sortOrder: 'asc'
        })
      });

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching USDA foods:', error);
      throw error;
    }
  }

  async getFoodById(fdcId: number): Promise<USDAFood> {
    try {
      const response = await fetch(`${this.baseUrl}/food/${fdcId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching USDA food:', error);
      throw error;
    }
  }

  transformToNutritionalInfo(usdaFood: USDAFood): NutritionalInfo {
    const nutrients = usdaFood.foodNutrients;
    
    // USDA nutrient IDs for common nutrients
    const getNutrientValue = (nutrientId: number): number => {
      const nutrient = nutrients.find(n => n.nutrientId === nutrientId);
      return nutrient ? nutrient.value : 0;
    };

    return {
      calories: getNutrientValue(1008), // Energy
      protein: getNutrientValue(1003), // Protein
      carbohydrates: getNutrientValue(1005), // Carbohydrate, by difference
      fat: getNutrientValue(1004), // Total lipid (fat)
      fiber: getNutrientValue(1079), // Fiber, total dietary
      sugar: getNutrientValue(2000), // Sugars, total including NLEA
      sodium: getNutrientValue(1093) / 1000, // Sodium (convert mg to g)
      cholesterol: getNutrientValue(1253) / 1000, // Cholesterol (convert mg to g)
      vitamins: {
        'Vitamin C': getNutrientValue(1162),
        'Vitamin A': getNutrientValue(1106),
        'Vitamin D': getNutrientValue(1114),
        'Vitamin E': getNutrientValue(1109),
        'Vitamin K': getNutrientValue(1185),
        'Thiamin': getNutrientValue(1165),
        'Riboflavin': getNutrientValue(1166),
        'Niacin': getNutrientValue(1167),
        'Vitamin B-6': getNutrientValue(1175),
        'Folate': getNutrientValue(1177),
        'Vitamin B-12': getNutrientValue(1178)
      },
      minerals: {
        'Calcium': getNutrientValue(1087),
        'Iron': getNutrientValue(1089),
        'Magnesium': getNutrientValue(1090),
        'Phosphorus': getNutrientValue(1091),
        'Potassium': getNutrientValue(1092),
        'Zinc': getNutrientValue(1095),
        'Copper': getNutrientValue(1098),
        'Manganese': getNutrientValue(1101),
        'Selenium': getNutrientValue(1103)
      }
    };
  }
}

export const usdaApiService = new USDAApiService();
