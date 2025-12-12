import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IngredientAnalysis {
  name: string;
  portion_grams: number;
  confidence: number;
  usda_id?: string;
  matched_from_db?: boolean;
}

interface NutritionData {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
}

interface NutritionAnalysis extends NutritionData {
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
}

interface AnalysisResult {
  success: boolean;
  nutrition?: NutritionAnalysis;
  ingredients?: IngredientAnalysis[];
  confidence_score?: number;
  data_source?: 'ai_vision' | 'usda' | 'hybrid';
  db_matches?: number;
  error?: string;
}

interface MasterIngredient {
  id: string;
  name: string;
  common_names: string[] | null;
  nutritional_data: NutritionData | null;
  external_api_ids: { usda_fdc_id?: string } | null;
}

// Normalize ingredient name for matching
function normalizeIngredientName(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Find best match from master_ingredients
function findIngredientMatch(
  ingredientName: string, 
  masterIngredients: MasterIngredient[]
): MasterIngredient | null {
  const normalized = normalizeIngredientName(ingredientName);
  
  // Exact name match
  let match = masterIngredients.find(mi => 
    normalizeIngredientName(mi.name) === normalized
  );
  if (match) return match;
  
  // Check common_names array
  match = masterIngredients.find(mi => 
    mi.common_names?.some(cn => normalizeIngredientName(cn) === normalized)
  );
  if (match) return match;
  
  // Partial match - ingredient name contains master ingredient name
  match = masterIngredients.find(mi => {
    const masterNormalized = normalizeIngredientName(mi.name);
    return normalized.includes(masterNormalized) || masterNormalized.includes(normalized);
  });
  if (match) return match;
  
  // Partial match on common names
  match = masterIngredients.find(mi => 
    mi.common_names?.some(cn => {
      const cnNormalized = normalizeIngredientName(cn);
      return normalized.includes(cnNormalized) || cnNormalized.includes(normalized);
    })
  );
  
  return match || null;
}

// Calculate nutrition based on portion size
function calculateNutrition(nutritionPer100g: NutritionData, portionGrams: number): NutritionData {
  const multiplier = portionGrams / 100;
  return {
    calories: Math.round(nutritionPer100g.calories * multiplier),
    protein: Math.round(nutritionPer100g.protein * multiplier * 10) / 10,
    carbohydrates: Math.round(nutritionPer100g.carbohydrates * multiplier * 10) / 10,
    fat: Math.round(nutritionPer100g.fat * multiplier * 10) / 10,
    fiber: nutritionPer100g.fiber != null 
      ? Math.round(nutritionPer100g.fiber * multiplier * 10) / 10 
      : undefined,
    sugar: nutritionPer100g.sugar != null 
      ? Math.round(nutritionPer100g.sugar * multiplier * 10) / 10 
      : undefined,
    sodium: nutritionPer100g.sodium != null 
      ? Math.round(nutritionPer100g.sodium * multiplier) 
      : undefined,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image_base64, image_url } = await req.json();
    
    if (!image_base64 && !image_url) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Either image_base64 or image_url is required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("[analyze-food] LOVABLE_API_KEY not configured");
      throw new Error("AI service not configured");
    }

    // Initialize Supabase client for DB lookups
    let supabase = null;
    let masterIngredients: MasterIngredient[] = [];
    
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      // Fetch all master ingredients with nutritional data
      const { data: ingredients, error: dbError } = await supabase
        .from('master_ingredients')
        .select('id, name, common_names, nutritional_data, external_api_ids')
        .not('nutritional_data', 'is', null);
      
      if (dbError) {
        console.error("[analyze-food] DB lookup error:", dbError);
      } else {
        masterIngredients = ingredients || [];
        console.log(`[analyze-food] Loaded ${masterIngredients.length} ingredients from DB`);
      }
    } else {
      console.warn("[analyze-food] Supabase credentials not configured, using AI-only mode");
    }

    console.log("[analyze-food] Starting analysis...", {
      hasBase64: !!image_base64,
      hasUrl: !!image_url,
      base64Length: image_base64?.length,
      dbIngredientsAvailable: masterIngredients.length
    });

    const prompt = `Analyze this food image carefully. Identify each food item and estimate portion sizes based on visual cues.

Return ONLY a valid JSON object (no markdown, no code blocks) matching this exact structure:
{
  "ingredients": [
    {
      "name": "food item name (use common name like 'chicken breast', 'white rice', 'broccoli')",
      "portion_grams": estimated weight in grams as number,
      "confidence": confidence level 0.0-1.0 as number
    }
  ],
  "nutrition": {
    "calories": total estimated calories as number,
    "protein": grams as number,
    "carbohydrates": grams as number,
    "fat": grams as number,
    "fiber": grams as number or null,
    "sugar": grams as number or null,
    "sodium": milligrams as number or null,
    "cholesterol": milligrams as number or null,
    "vitamins": {"Vitamin C": mg, "Vitamin A": mcg, "Vitamin D": mcg, "Vitamin B12": mcg} or {},
    "minerals": {"Iron": mg, "Calcium": mg, "Potassium": mg, "Zinc": mg} or {}
  },
  "confidence_score": overall analysis confidence 0.0-1.0 as number
}

Use USDA nutritional database values as reference for calculations.
If the image does not contain food, return: {"success": false, "error": "No food detected in image"}
Be precise with portion estimation based on plate size, utensils, and common serving sizes.`;

    // Construct image content for multimodal request
    const imageContent = image_url 
      ? { type: "image_url", image_url: { url: image_url } }
      : { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image_base64}` } };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              imageContent
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[analyze-food] AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Rate limited. Please try again in a moment." 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "AI service credits exhausted. Please try again later." 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("[analyze-food] No content in AI response:", aiResponse);
      throw new Error("Empty response from AI");
    }

    console.log("[analyze-food] Raw AI response:", content.substring(0, 500));

    // Parse JSON from response - handle potential markdown code blocks
    let parsedResult: any;
    try {
      // First try to extract from markdown code block
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try parsing raw content
        parsedResult = JSON.parse(content.trim());
      }
    } catch (parseError) {
      console.error("[analyze-food] JSON parse error:", parseError, "Content:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Check if AI detected no food
    if (parsedResult.success === false || parsedResult.error) {
      return new Response(JSON.stringify({
        success: false,
        error: parsedResult.error || "Could not analyze food in image"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === HYBRID MATCHING: Enhance AI results with DB data ===
    const aiIngredients: IngredientAnalysis[] = parsedResult.ingredients || [];
    let dbMatches = 0;
    let totalNutrition: NutritionAnalysis = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      vitamins: parsedResult.nutrition?.vitamins || {},
      minerals: parsedResult.nutrition?.minerals || {}
    };

    const enhancedIngredients: IngredientAnalysis[] = [];

    for (const ingredient of aiIngredients) {
      const match = masterIngredients.length > 0 
        ? findIngredientMatch(ingredient.name, masterIngredients)
        : null;
      
      if (match && match.nutritional_data) {
        // Use DB nutritional data with AI portion size
        const calculatedNutrition = calculateNutrition(
          match.nutritional_data, 
          ingredient.portion_grams
        );
        
        // Add to totals
        totalNutrition.calories += calculatedNutrition.calories;
        totalNutrition.protein += calculatedNutrition.protein;
        totalNutrition.carbohydrates += calculatedNutrition.carbohydrates;
        totalNutrition.fat += calculatedNutrition.fat;
        totalNutrition.fiber = (totalNutrition.fiber || 0) + (calculatedNutrition.fiber || 0);
        totalNutrition.sugar = (totalNutrition.sugar || 0) + (calculatedNutrition.sugar || 0);
        totalNutrition.sodium = (totalNutrition.sodium || 0) + (calculatedNutrition.sodium || 0);
        
        enhancedIngredients.push({
          ...ingredient,
          usda_id: match.external_api_ids?.usda_fdc_id,
          matched_from_db: true,
          confidence: Math.min(0.9, ingredient.confidence + 0.15) // Boost confidence for DB matches
        });
        
        dbMatches++;
        console.log(`[analyze-food] DB match: "${ingredient.name}" -> "${match.name}" (${ingredient.portion_grams}g)`);
      } else {
        // Keep AI estimates for unmatched ingredients
        enhancedIngredients.push({
          ...ingredient,
          matched_from_db: false
        });
      }
    }

    // Determine data source and final nutrition
    let dataSource: 'ai_vision' | 'usda' | 'hybrid' = 'ai_vision';
    let finalNutrition: NutritionAnalysis;
    
    if (dbMatches > 0 && dbMatches === aiIngredients.length) {
      // All ingredients matched from DB
      dataSource = 'usda';
      finalNutrition = totalNutrition;
    } else if (dbMatches > 0) {
      // Some ingredients matched from DB - use hybrid approach
      dataSource = 'hybrid';
      // Calculate weighted average between DB total and AI total for unmatched
      const matchRatio = dbMatches / aiIngredients.length;
      const unmatchedRatio = 1 - matchRatio;
      
      // Use DB values for matched ingredients, AI values contribution for unmatched
      finalNutrition = {
        ...totalNutrition,
        calories: Math.round(totalNutrition.calories + (parsedResult.nutrition?.calories || 0) * unmatchedRatio),
        protein: Math.round((totalNutrition.protein + (parsedResult.nutrition?.protein || 0) * unmatchedRatio) * 10) / 10,
        carbohydrates: Math.round((totalNutrition.carbohydrates + (parsedResult.nutrition?.carbohydrates || 0) * unmatchedRatio) * 10) / 10,
        fat: Math.round((totalNutrition.fat + (parsedResult.nutrition?.fat || 0) * unmatchedRatio) * 10) / 10,
      };
    } else {
      // No DB matches - use pure AI estimates
      finalNutrition = parsedResult.nutrition;
    }

    // Adjust confidence score based on DB matches
    let confidenceScore = parsedResult.confidence_score || 0.5;
    if (dbMatches > 0) {
      const matchBoost = (dbMatches / aiIngredients.length) * 0.2; // Up to 0.2 boost for full match
      confidenceScore = Math.min(0.95, confidenceScore + matchBoost);
    }

    // Construct final result
    const result: AnalysisResult = {
      success: true,
      nutrition: finalNutrition,
      ingredients: enhancedIngredients,
      confidence_score: Math.round(confidenceScore * 100) / 100,
      data_source: dataSource,
      db_matches: dbMatches
    };

    console.log("[analyze-food] Analysis complete:", {
      ingredients_count: result.ingredients?.length,
      db_matches: dbMatches,
      data_source: dataSource,
      confidence: result.confidence_score,
      calories: result.nutrition?.calories,
      protein: result.nutrition?.protein
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("[analyze-food] Error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
