import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";

interface NutritionData {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface Ingredient {
  name: string;
  portion_grams: number;
  confidence: number;
}

interface NutritionResultCardProps {
  nutrition: NutritionData;
  ingredients: Ingredient[];
  confidenceScore: number;
  dataSource: string;
  onAddToLog?: () => void;
  onReportIssue?: () => void;
}

const NutritionResultCard = ({
  nutrition,
  ingredients,
  confidenceScore,
  dataSource,
  onAddToLog,
  onReportIssue,
}: NutritionResultCardProps) => {
  const macros = [
    { label: "Protein", value: nutrition.protein, unit: "g", color: "bg-blue-500" },
    { label: "Carbs", value: nutrition.carbohydrates, unit: "g", color: "bg-amber-500" },
    { label: "Fat", value: nutrition.fat, unit: "g", color: "bg-rose-500" },
  ];

  const totalMacroGrams = nutrition.protein + nutrition.carbohydrates + nutrition.fat;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Nutrition Analysis</CardTitle>
          <ConfidenceBadge score={confidenceScore} />
        </div>
        <p className="text-xs text-muted-foreground">
          Source: {dataSource === 'ai_vision' ? 'AI Estimate' : dataSource}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Calories */}
        <div className="text-center p-4 bg-primary/5 rounded-lg">
          <span className="text-3xl font-bold text-primary">{Math.round(nutrition.calories)}</span>
          <span className="text-muted-foreground ml-1">kcal</span>
        </div>

        {/* Macros Bar */}
        <div className="space-y-2">
          <div className="flex h-3 rounded-full overflow-hidden bg-muted">
            {macros.map((macro) => (
              <div
                key={macro.label}
                className={macro.color}
                style={{ width: `${(macro.value / totalMacroGrams) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm">
            {macros.map((macro) => (
              <div key={macro.label} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${macro.color}`} />
                <span className="text-muted-foreground">{macro.label}</span>
                <span className="font-medium">{Math.round(macro.value)}{macro.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Nutrients */}
        {(nutrition.fiber || nutrition.sugar || nutrition.sodium) && (
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            {nutrition.fiber !== undefined && (
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-muted-foreground">Fiber</p>
                <p className="font-medium">{Math.round(nutrition.fiber)}g</p>
              </div>
            )}
            {nutrition.sugar !== undefined && (
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-muted-foreground">Sugar</p>
                <p className="font-medium">{Math.round(nutrition.sugar)}g</p>
              </div>
            )}
            {nutrition.sodium !== undefined && (
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-muted-foreground">Sodium</p>
                <p className="font-medium">{Math.round(nutrition.sodium)}mg</p>
              </div>
            )}
          </div>
        )}

        {/* Detected Ingredients */}
        {ingredients.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Detected Items</h4>
            <div className="flex flex-wrap gap-1">
              {ingredients.map((ingredient, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-secondary rounded-full"
                >
                  {ingredient.name} ({ingredient.portion_grams}g)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={onAddToLog} className="flex-1">
            <Plus className="w-4 h-4 mr-1" />
            Add to Log
          </Button>
          <Button variant="outline" size="icon" onClick={onReportIssue}>
            <AlertCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionResultCard;
