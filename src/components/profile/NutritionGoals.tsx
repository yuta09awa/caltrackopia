
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, TrendingUp, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NutritionGoalType {
  id: string;
  name: string;
  description: string;
  category: string;
  target_type: string;
}

interface NutritionGoalsProps {
  selectedGoals: string[];
  onGoalsChange: (goals: string[]) => void;
}

const categoryIcons = {
  weight_management: TrendingUp,
  fitness: Target,
  health: Heart,
};

const categoryColors = {
  weight_management: 'bg-blue-100 text-blue-800',
  fitness: 'bg-green-100 text-green-800',
  health: 'bg-red-100 text-red-800',
};

const NutritionGoals: React.FC<NutritionGoalsProps> = ({
  selectedGoals,
  onGoalsChange,
}) => {
  const { data: goals, isLoading, error } = useQuery({
    queryKey: ['nutritionGoals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nutrition_goal_types')
        .select('*')
        .order('category, name');
      
      if (error) throw error;
      return data as NutritionGoalType[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleGoalToggle = (goalName: string) => {
    const isSelected = selectedGoals.includes(goalName);
    
    if (isSelected) {
      onGoalsChange(selectedGoals.filter(g => g !== goalName));
    } else {
      onGoalsChange([...selectedGoals, goalName]);
    }
  };

  // Group goals by category
  const groupedGoals = goals?.reduce((acc, goal) => {
    if (!acc[goal.category]) {
      acc[goal.category] = [];
    }
    acc[goal.category].push(goal);
    return acc;
  }, {} as Record<string, NutritionGoalType[]>);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Failed to load nutrition goals. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Goals</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose your nutrition and health objectives
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedGoals || {}).map(([category, categoryGoals]) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Target;
            const colorClass = categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';
            
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  <h4 className="font-medium capitalize">
                    {category.replace('_', ' ')}
                  </h4>
                </div>
                
                <div className="space-y-3 pl-6 border-l-2 border-gray-100">
                  {categoryGoals.map((goal) => (
                    <div key={goal.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={goal.id}
                        checked={selectedGoals.includes(goal.name)}
                        onCheckedChange={() => handleGoalToggle(goal.name)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={goal.id}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {goal.name}
                          </Label>
                          <Badge variant="secondary" className={`text-xs ${colorClass}`}>
                            {goal.target_type}
                          </Badge>
                        </div>
                        {goal.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {goal.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionGoals;
