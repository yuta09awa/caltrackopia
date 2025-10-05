
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface DietaryRestrictionType {
  id: string;
  name: string;
  description: string;
  excluded_allergens: string[];
}

interface DietaryPreferencesProps {
  selectedRestrictions: string[];
  onRestrictionsChange: (restrictions: string[]) => void;
}

const DietaryPreferences: React.FC<DietaryPreferencesProps> = ({
  selectedRestrictions,
  onRestrictionsChange,
}) => {
  const { data: restrictions, isLoading, error } = useQuery({
    queryKey: ['dietaryRestrictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dietary_restriction_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as DietaryRestrictionType[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRestrictionToggle = (restrictionName: string) => {
    const isSelected = selectedRestrictions.includes(restrictionName);
    
    if (isSelected) {
      onRestrictionsChange(selectedRestrictions.filter(r => r !== restrictionName));
    } else {
      onRestrictionsChange([...selectedRestrictions, restrictionName]);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dietary Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
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
          <CardTitle>Dietary Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Failed to load dietary options. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dietary Preferences</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select any dietary restrictions or preferences you follow
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {restrictions?.map((restriction) => (
            <div key={restriction.id} className="flex items-start space-x-3">
              <Checkbox
                id={restriction.id}
                checked={selectedRestrictions.includes(restriction.name)}
                onCheckedChange={() => handleRestrictionToggle(restriction.name)}
              />
              <div className="flex-1">
                <Label
                  htmlFor={restriction.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {restriction.name}
                </Label>
                {restriction.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {restriction.description}
                  </p>
                )}
                {restriction.excluded_allergens.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {restriction.excluded_allergens.map((allergen) => (
                      <span
                        key={allergen}
                        className="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DietaryPreferences;
