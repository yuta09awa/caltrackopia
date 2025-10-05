
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Utensils, ShoppingCart, Leaf, CalendarDays, Beef, Apple, Milk } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { useIngredientSearch } from '../hooks/useIngredientApi';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { Ingredient } from '@/entities/nutrition';

interface IngredientSearchProps {
  onSelectIngredient?: (ingredient: Ingredient) => void;
  className?: string;
  compact?: boolean;
  placeholder?: string;
}

const getCategoryIcon = (category?: string) => {
  if (!category) return <Search className="h-4 w-4" />;
  
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
  return <Search className="h-4 w-4 text-muted-foreground" />;
};

const IngredientSearch: React.FC<IngredientSearchProps> = ({ 
  onSelectIngredient, 
  className = '',
  compact = false,
  placeholder = 'Search ingredients...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const { addToHistory } = useSearchHistory();
  
  // Use the new hook for searching
  const { 
    data: results = [], 
    isLoading: loading, 
    isError, 
    error,
  } = useIngredientSearch(
    { term: searchTerm }, 
    { enabled: searchTerm.length > 2 }
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // The search happens automatically through the hook
    }
  };

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    
    // Add to search history
    addToHistory({
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category
    });
    
    if (onSelectIngredient) {
      onSelectIngredient(ingredient);
    }
    // Optionally clear the search after selection
    // setSearchTerm('');
  };

  if (compact) {
    return (
      <div className={className}>
        <div className="relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-2 rounded-md border border-gray-200 text-sm"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        {isError && (
          <div className="mt-1 text-xs text-destructive">
            {error?.message || 'Error searching ingredients'}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="border rounded-md overflow-hidden mt-1 bg-background shadow-md">
            <ul className="divide-y max-h-[150px] overflow-y-auto">
              {results.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="p-2 hover:bg-muted cursor-pointer transition-colors text-sm flex items-center gap-2"
                  onClick={() => handleSelectIngredient(ingredient)}
                >
                  <div className="flex-shrink-0 text-muted-foreground">
                    {getCategoryIcon(ingredient.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{ingredient.name}</div>
                    {ingredient.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {ingredient.description}
                      </div>
                    )}
                    {/* Enhanced properties for compact view */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ingredient.isOrganic && (
                        <span className="flex items-center gap-0.5 text-[10px] bg-green-50 text-green-700 px-1 py-0.5 rounded-full">
                          <Leaf className="w-2.5 h-2.5" /> Organic
                        </span>
                      )}
                      {ingredient.isLocal && (
                        <span className="flex items-center gap-0.5 text-[10px] bg-blue-50 text-blue-700 px-1 py-0.5 rounded-full">
                          <MapPin className="w-2.5 h-2.5" /> Local
                        </span>
                      )}
                      {ingredient.isSeasonal && (
                        <span className="flex items-center gap-0.5 text-[10px] bg-orange-50 text-orange-700 px-1 py-0.5 rounded-full">
                          <CalendarDays className="w-2.5 h-2.5" /> Seasonal
                        </span>
                      )}
                      {ingredient.nutritionPer100g.calories && (
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded-full">
                          {ingredient.nutritionPer100g.calories} cal
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
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && !isError && searchTerm && searchTerm.length > 2 && results.length === 0 && (
          <div className="text-center p-1 text-muted-foreground text-xs mt-1">
            No ingredients found
          </div>
        )}
      </div>
    );
  }

  // Original non-compact version
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
        </div>
      </div>

      {loading && <Loading text="Searching ingredients..." />}
      
      {isError && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error?.message || 'Error searching ingredients'}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="border rounded-md overflow-hidden bg-background shadow-md">
          <ul className="divide-y max-h-[200px] overflow-y-auto">
            {results.map((ingredient) => (
              <li
                key={ingredient.id}
                className="p-3 hover:bg-muted cursor-pointer transition-colors flex items-center gap-3"
                onClick={() => handleSelectIngredient(ingredient)}
              >
                <div className="flex-shrink-0">
                  {getCategoryIcon(ingredient.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{ingredient.name}</div>
                  {ingredient.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {ingredient.description}
                    </div>
                  )}
                  {/* Enhanced properties for non-compact view */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ingredient.isOrganic && (
                      <span className="flex items-center gap-0.5 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        <Leaf className="w-3 h-3" /> Organic
                      </span>
                    )}
                    {ingredient.isLocal && (
                      <span className="flex items-center gap-0.5 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        <MapPin className="w-3 h-3" /> Local
                      </span>
                    )}
                    {ingredient.isSeasonal && (
                      <span className="flex items-center gap-0.5 text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
                        <CalendarDays className="w-3 h-3" /> Seasonal
                      </span>
                    )}
                    {ingredient.nutritionPer100g.calories && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {ingredient.nutritionPer100g.calories} cal
                      </span>
                    )}
                    {ingredient.nutritionPer100g.protein && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {ingredient.nutritionPer100g.protein}g protein
                      </span>
                    )}
                  </div>
                  {ingredient.locations && ingredient.locations.length > 0 && (
                    <div className="mt-1 text-xs text-primary flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Available at {ingredient.locations.length} location{ingredient.locations.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !isError && searchTerm && searchTerm.length > 2 && results.length === 0 && (
        <div className="text-center p-2 text-muted-foreground text-sm">
          No ingredients found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default IngredientSearch;
