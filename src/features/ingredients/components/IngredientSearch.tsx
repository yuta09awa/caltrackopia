
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Utensils, ShoppingCart, Leaf } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { useIngredientSearch } from '../hooks/useIngredientApi';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { Ingredient } from '@/hooks/useIngredientSearch';

interface IngredientSearchProps {
  onSelectIngredient?: (ingredient: Ingredient) => void;
  className?: string;
  compact?: boolean;
  placeholder?: string;
}

const getCategoryIcon = (category?: string) => {
  if (!category) return <Search className="h-3 w-3" />;
  
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('meat') || lowerCategory.includes('protein')) {
    return <Utensils className="h-3 w-3 text-orange-500" />;
  }
  if (lowerCategory.includes('vegetable') || lowerCategory.includes('fruit')) {
    return <Leaf className="h-3 w-3 text-green-500" />;
  }
  if (lowerCategory.includes('dairy')) {
    return <ShoppingCart className="h-3 w-3 text-blue-500" />;
  }
  return <Search className="h-3 w-3 text-muted-foreground" />;
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
                  <div className="flex-shrink-0">
                    {getCategoryIcon(ingredient.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{ingredient.name}</div>
                    {ingredient.locations && ingredient.locations.length > 0 && (
                      <div className="text-xs text-primary flex items-center mt-0.5">
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
