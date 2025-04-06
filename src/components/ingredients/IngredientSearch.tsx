
import React, { useState, useEffect } from 'react';
import { useIngredientSearch, Ingredient } from '@/hooks/useIngredientSearch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

interface IngredientSearchProps {
  onSelectIngredient?: (ingredient: Ingredient) => void;
  className?: string;
  compact?: boolean; // New prop to support compact mode
}

const IngredientSearch: React.FC<IngredientSearchProps> = ({ 
  onSelectIngredient, 
  className = '',
  compact = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    results, 
    loading, 
    error, 
    searchIngredients,
    selectedIngredient,
    selectIngredient
  } = useIngredientSearch();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchIngredients(searchTerm);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectIngredient = (ingredient: Ingredient) => {
    selectIngredient(ingredient);
    if (onSelectIngredient) {
      onSelectIngredient(ingredient);
    }
  };

  // Debounce search for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() && searchTerm.length > 2) {
        searchIngredients(searchTerm);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, searchIngredients]);

  if (compact) {
    return (
      <div className={className}>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search ingredients to include..."
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
        
        {error && (
          <div className="mt-1 text-xs text-destructive">
            {error}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="border rounded-md overflow-hidden mt-1">
            <ul className="divide-y max-h-[150px] overflow-y-auto bg-white">
              {results.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="p-2 hover:bg-muted cursor-pointer transition-colors text-sm"
                  onClick={() => handleSelectIngredient(ingredient)}
                >
                  <div className="font-medium">{ingredient.name}</div>
                  {ingredient.locations && ingredient.locations.length > 0 && (
                    <div className="text-xs text-primary flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{ingredient.locations.length} location{ingredient.locations.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && !error && searchTerm && results.length === 0 && (
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
            placeholder="Search ingredients..."
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
      
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <ul className="divide-y max-h-[200px] overflow-y-auto">
            {results.map((ingredient) => (
              <li
                key={ingredient.id}
                className="p-3 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => handleSelectIngredient(ingredient)}
              >
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
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && searchTerm && results.length === 0 && (
        <div className="text-center p-2 text-muted-foreground text-sm">
          No ingredients found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default IngredientSearch;
