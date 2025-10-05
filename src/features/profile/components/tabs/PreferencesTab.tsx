
import React from "react";
import { Button } from "@/components/ui/button";
import DietaryPreferences from "../DietaryPreferences";
import NutritionGoals from "../NutritionGoals";

interface PreferencesTabProps {
  dietaryRestrictions: string[];
  onRestrictionsChange: (restrictions: string[]) => void;
  nutritionGoals: string[];
  onGoalsChange: (goals: string[]) => void;
  onSave: () => void;
  isLoading: boolean;
}

const PreferencesTab: React.FC<PreferencesTabProps> = ({
  dietaryRestrictions,
  onRestrictionsChange,
  nutritionGoals,
  onGoalsChange,
  onSave,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <DietaryPreferences
          selectedRestrictions={dietaryRestrictions}
          onRestrictionsChange={onRestrictionsChange}
        />
        <NutritionGoals
          selectedGoals={nutritionGoals}
          onGoalsChange={onGoalsChange}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};

export default PreferencesTab;
