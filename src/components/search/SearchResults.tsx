
import React from 'react';
import { Ingredient } from '@/models/NutritionalInfo';
import { Apple, Beef, Milk, Utensils, ShoppingCart, Search, Leaf, MapPin, CalendarDays } from 'lucide-react';

interface SearchResultsProps {
  results: Ingredient[];
  onSelectIngredient: (ingredient: Ingredient) => void;
}

const getCategoryIcon = (category?: string) => {
  if (!category) return <Search className="h-4 w-4 text-muted-foreground" />;
  
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('vegetable') || lowerCategory.includes('fruit') || lowerCategory.includes('produce')) {
    return <Apple className="h-4 w-4 text-green-600" />;
  }
  if (lowerCategory.includes('meat') || lowerCategory.includes('poultry') || lowerCategory.includes('seafood') || lowerCategory.includes('fish')) {
    return <Beef className="h-4 w-4 text-red-600" />;
  }
  if (lowerCategory.includes('dairy') || lowerCategory.includes('milk') || lowerCategory.includes('cheese')) {
    return <Milk className="h-4 w-4 text-blue-600" />;
  }
  if (lowerCategory.includes('grain') || lowerCategory.includes('bread') || lowerCategory.includes('bakery')) {
    return <Utensils className="h-4 w-4 text-yellow-600" />;
  }
  if (lowerCategory.includes('store') || lowerCategory.includes('market')) {
    return <ShoppingCart className="h-4 w-4 text-purple-600" />;
  }
  if (lowerCategory.includes('restaurant') || lowerCategory.includes('cafe') || lowerCategory.includes('bar')) {
    return <Utensils className="h-4 w-4 text-orange-600" />;
  }
  return <Search className="h-4 w-4 text-muted-foreground" />;
};

const SearchResults: React.FC<SearchResultsProps> = React.memo(({ results, onSelectIngredient }) => {
  if (results.length === 0) return null;

  return (
    <div className="p-2">
      <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Search Results</div>
      {results.map((ingredient) => (
        <button
          key={ingredient.id}
          className="w-full text-left p-2 hover:bg-muted rounded-sm transition-colors flex items-center gap-3"
          onClick={() => onSelectIngredient(ingredient)}
        >
          <div className="flex-shrink-0 text-muted-foreground">
            {getCategoryIcon(ingredient.category)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{ingredient.name}</div>
            {ingredient.description && (
              <div className="text-xs text-muted-foreground truncate">
                {ingredient.description}
              </div>
            )}
            <div className="flex flex-wrap gap-1 mt-1">
              {ingredient.isOrganic && (
                <span className="flex items-center gap-0.5 text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">
                  <Leaf className="w-2.5 h-2.5" /> Organic
                </span>
              )}
              {ingredient.isLocal && (
                <span className="flex items-center gap-0.5 text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">
                  <MapPin className="w-2.5 h-2.5" /> Local
                </span>
              )}
              {ingredient.isSeasonal && (
                <span className="flex items-center gap-0.5 text-[10px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-full">
                  <CalendarDays className="w-2.5 h-2.5" /> Seasonal
                </span>
              )}
              {ingredient.nutritionPer100g.calories && (
                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {ingredient.nutritionPer100g.calories} cal
                </span>
              )}
              {ingredient.nutritionPer100g.protein && (
                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {ingredient.nutritionPer100g.protein}g protein
                </span>
              )}
            </div>
            {ingredient.locations && ingredient.locations.length > 0 && (
              <div className="text-xs text-primary flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{ingredient.locations.length} location{ingredient.locations.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
});

SearchResults.displayName = 'SearchResults';

export default SearchResults;
