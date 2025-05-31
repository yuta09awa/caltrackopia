
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useIngredientSearch } from '@/features/ingredients/hooks/useIngredientApi';

const IngredientFilters: React.FC = () => {
  const { mapFilters, updateMapFilters } = useAppStore();
  const [currentExcludeInput, setCurrentExcludeInput] = useState('');
  const [currentIncludeInput, setCurrentIncludeInput] = useState('');

  // Use the ingredient search hook for suggestions
  const { data: excludeSuggestions = [] } = useIngredientSearch(
    { term: currentExcludeInput }, 
    { enabled: currentExcludeInput.length > 2 }
  );
  const { data: includeSuggestions = [] } = useIngredientSearch(
    { term: currentIncludeInput }, 
    { enabled: currentIncludeInput.length > 2 }
  );

  const handleAddIngredient = (type: 'include' | 'exclude', ingredientName: string) => {
    const trimmedName = ingredientName.trim();
    if (!trimmedName) return;

    if (type === 'include') {
      const currentInclude = mapFilters.includeIngredients || [];
      if (!currentInclude.includes(trimmedName)) {
        updateMapFilters({
          includeIngredients: [...currentInclude, trimmedName]
        });
      }
      setCurrentIncludeInput('');
    } else {
      const currentExclude = mapFilters.excludeIngredients || [];
      if (!currentExclude.includes(trimmedName)) {
        updateMapFilters({
          excludeIngredients: [...currentExclude, trimmedName]
        });
      }
      setCurrentExcludeInput('');
    }
  };

  const handleRemoveIngredient = (type: 'include' | 'exclude', ingredientName: string) => {
    if (type === 'include') {
      const currentInclude = mapFilters.includeIngredients || [];
      updateMapFilters({
        includeIngredients: currentInclude.filter(name => name !== ingredientName)
      });
    } else {
      const currentExclude = mapFilters.excludeIngredients || [];
      updateMapFilters({
        excludeIngredients: currentExclude.filter(name => name !== ingredientName)
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Include Ingredients */}
      <div>
        <label className="text-sm font-medium mb-2 block">Include Ingredients</label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., spinach, quinoa"
            value={currentIncludeInput}
            onChange={(e) => setCurrentIncludeInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddIngredient('include', currentIncludeInput);
              }
            }}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleAddIngredient('include', currentIncludeInput)}
            disabled={!currentIncludeInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {includeSuggestions.length > 0 && currentIncludeInput.length > 2 && (
          <div className="border rounded-md mt-2 max-h-32 overflow-y-auto bg-background shadow-sm">
            {includeSuggestions.slice(0, 5).map((ingredient) => (
              <Button
                key={ingredient.id}
                variant="ghost"
                className="w-full justify-start text-left text-sm py-1 h-auto"
                onClick={() => handleAddIngredient('include', ingredient.name)}
              >
                {ingredient.name} 
                <span className="text-muted-foreground ml-1">({ingredient.category})</span>
              </Button>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          {(mapFilters.includeIngredients || []).map((ingredientName) => (
            <Badge 
              key={ingredientName} 
              variant="default" 
              className="flex items-center gap-1 pr-1"
            >
              {ingredientName}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0.5 rounded-full hover:bg-primary/20"
                onClick={() => handleRemoveIngredient('include', ingredientName)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Exclude Ingredients */}
      <div>
        <label className="text-sm font-medium mb-2 block">Exclude Ingredients</label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., peanuts, dairy"
            value={currentExcludeInput}
            onChange={(e) => setCurrentExcludeInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddIngredient('exclude', currentExcludeInput);
              }
            }}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleAddIngredient('exclude', currentExcludeInput)}
            disabled={!currentExcludeInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {excludeSuggestions.length > 0 && currentExcludeInput.length > 2 && (
          <div className="border rounded-md mt-2 max-h-32 overflow-y-auto bg-background shadow-sm">
            {excludeSuggestions.slice(0, 5).map((ingredient) => (
              <Button
                key={ingredient.id}
                variant="ghost"
                className="w-full justify-start text-left text-sm py-1 h-auto"
                onClick={() => handleAddIngredient('exclude', ingredient.name)}
              >
                {ingredient.name} 
                <span className="text-muted-foreground ml-1">({ingredient.category})</span>
              </Button>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          {(mapFilters.excludeIngredients || []).map((ingredientName) => (
            <Badge 
              key={ingredientName} 
              variant="destructive" 
              className="flex items-center gap-1 pr-1"
            >
              {ingredientName}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0.5 rounded-full hover:bg-destructive/20"
                onClick={() => handleRemoveIngredient('exclude', ingredientName)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IngredientFilters;
