import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IngredientAnalysis {
  name: string;
  portion_grams: number;
  confidence: number;
  usda_id?: string;
}

interface NutritionAnalysis {
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

interface AnalysisResult {
  success: boolean;
  nutrition?: NutritionAnalysis;
  ingredients?: IngredientAnalysis[];
  confidence_score?: number;
  data_source?: 'ai_vision' | 'usda' | 'hybrid';
  error?: string;
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
    
    if (!LOVABLE_API_KEY) {
      console.error("[analyze-food] LOVABLE_API_KEY not configured");
      throw new Error("AI service not configured");
    }

    console.log("[analyze-food] Starting analysis...", {
      hasBase64: !!image_base64,
      hasUrl: !!image_url,
      base64Length: image_base64?.length
    });

    const prompt = `Analyze this food image carefully. Identify each food item and estimate portion sizes based on visual cues.

Return ONLY a valid JSON object (no markdown, no code blocks) matching this exact structure:
{
  "ingredients": [
    {
      "name": "food item name",
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

    // Construct final result with data source
    const result: AnalysisResult = {
      success: true,
      nutrition: parsedResult.nutrition,
      ingredients: parsedResult.ingredients || [],
      confidence_score: parsedResult.confidence_score || 0.5,
      data_source: 'ai_vision'
    };

    console.log("[analyze-food] Analysis complete:", {
      ingredients_count: result.ingredients?.length,
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
