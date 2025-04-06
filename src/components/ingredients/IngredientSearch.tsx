
import React, { useState, useEffect } from 'react';
import { useIngredientSearch, Ingredient } from '@/hooks/useIngredientSearch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

interface IngredientSearchProps {
  onSelectIngredient?: (ingredient: Ingredient) => void;
  className?: string;
}

const IngredientSearch: React.FC<IngredientSearchProps> = ({ 
  onSelectIngredient, 
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { results, loading, error, searchIngredients } = useIngredientSearch();

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

  // Debounce search for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() && searchTerm.length > 2) {
        searchIngredients(searchTerm);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, searchIngredients]);

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
        <Button onClick={handleSearch} disabled={loading || !searchTerm.trim()}>
          Search
        </Button>
      </div>

      {loading && <Loading text="Searching ingredients..." />}
      
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <ul className="divide-y">
            {results.map((ingredient) => (
              <li
                key={ingredient.id}
                className="p-3 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => onSelectIngredient && onSelectIngredient(ingredient)}
              >
                <div className="font-medium">{ingredient.name}</div>
                {ingredient.description && (
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {ingredient.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && searchTerm && results.length === 0 && (
        <div className="text-center p-4 text-muted-foreground">
          No ingredients found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default IngredientSearch;
