
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Clock, MapPin, Utensils, ShoppingCart, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIngredientSearch } from '@/hooks/useIngredientSearch';
import { useSearchHistory } from '@/hooks/useSearchHistory';

interface GlobalSearchProps {
  className?: string;
  onSelectIngredient?: (ingredient: any) => void;
  onSearchReset?: () => void;
  displayValue?: string;
  compact?: boolean;
}

const getCategoryIcon = (category?: string) => {
  if (!category) return <Search className="h-3 w-3" />;
  
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('meat') || lowerCategory.includes('protein')) {
    return <Utensils className="h-3 w-3" />;
  }
  if (lowerCategory.includes('vegetable') || lowerCategory.includes('fruit')) {
    return <ShoppingCart className="h-3 w-3" />;
  }
  return <Search className="h-3 w-3" />;
};

const GlobalSearch = ({ 
  className, 
  onSelectIngredient, 
  onSearchReset,
  displayValue = "",
  compact = false 
}: GlobalSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { results, loading, searchIngredients } = useIngredientSearch();
  const { searchHistory, addToHistory } = useSearchHistory();
  const searchRef = useRef<HTMLDivElement>(null);

  // Update internal state when displayValue changes
  useEffect(() => {
    setSearchTerm(displayValue);
  }, [displayValue]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    setIsOpen(true);
    
    if (query.length >= 2) {
      searchIngredients(query);
    }
  };

  const handleFocus = () => {
    // If there's a displayed value (active search), clear it to start new search
    if (displayValue && onSearchReset) {
      onSearchReset();
      setSearchTerm('');
    }
    setIsOpen(true);
  };

  const handleClearSearch = () => {
    if (onSearchReset) {
      onSearchReset();
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleSelectIngredient = (ingredient: any) => {
    // Add to search history
    addToHistory({
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category
    });
    
    // Close dropdown
    setIsOpen(false);
    
    // Notify parent
    if (onSelectIngredient) {
      onSelectIngredient(ingredient);
    }
  };

  const handleSelectHistoryItem = (historyItem: any) => {
    setIsOpen(false);
    
    // Create a mock ingredient object for compatibility
    const ingredient = {
      id: historyItem.id,
      name: historyItem.name,
      category: historyItem.category,
      description: `Recent search: ${historyItem.name}`
    };
    
    if (onSelectIngredient) {
      onSelectIngredient(ingredient);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown = isOpen && (results.length > 0 || searchHistory.length > 0 || searchTerm.length >= 2);

  return (
    <div className={cn("relative w-full", className)} ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search ingredients, restaurants, dishes..."
          className={cn(
            "w-full pl-9",
            displayValue ? "pr-10" : "pr-4",
            compact ? "h-9 text-sm" : "h-10"
          )}
          value={searchTerm}
          onChange={handleSearch}
          onFocus={handleFocus}
        />
        
        {/* Clear button when there's a displayed value */}
        {displayValue && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {loading && !displayValue && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
          {/* Search Results */}
          {results.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Search Results</div>
              {results.map((ingredient) => (
                <button
                  key={ingredient.id}
                  className="w-full text-left p-2 hover:bg-muted rounded-sm transition-colors flex items-center gap-3"
                  onClick={() => handleSelectIngredient(ingredient)}
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
          )}

          {/* Search History */}
          {searchHistory.length > 0 && results.length === 0 && searchTerm.length < 2 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Recent Searches</div>
              {searchHistory.slice(0, 5).map((item) => (
                <button
                  key={`${item.id}-${item.timestamp}`}
                  className="w-full text-left p-2 hover:bg-muted rounded-sm transition-colors flex items-center gap-3"
                  onClick={() => handleSelectHistoryItem(item)}
                >
                  <div className="flex-shrink-0 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.name}</div>
                    {item.category && (
                      <div className="text-xs text-muted-foreground capitalize">
                        {item.category}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {results.length === 0 && searchTerm.length >= 2 && !loading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No ingredients found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
