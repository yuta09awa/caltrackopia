import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AnalysisResult {
  success: boolean;
  nutrition: {
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
  };
  ingredients: Array<{
    name: string;
    portion_grams: number;
    confidence: number;
    usda_id?: string;
  }>;
  confidence_score: number;
  data_source: 'ai_vision' | 'usda' | 'hybrid';
  error?: string;
}

interface UseAnalyzeFoodReturn {
  analyze: (imageBase64: string) => Promise<AnalysisResult | null>;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
  reset: () => void;
}

export const useAnalyzeFood = (): UseAnalyzeFoodReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (imageBase64: string): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-food', {
        body: { image_base64: imageBase64 }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze image';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { analyze, isAnalyzing, result, error, reset };
};
