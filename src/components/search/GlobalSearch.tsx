
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Clock, MapPin, Utensils, ShoppingCart, X, Leaf, CalendarDays, Beef, Apple, Milk } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIngredientSearch } from '@/features/ingredients/hooks/useIngredientApi';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useDebounce } from '@/hooks/useDebounce';
import { Ingredient } from '@/models/NutritionalInfo';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface GlobalSearchProps {
  className?: string;
  onSelectIngredient?: (ingredient: Ingredient) => void;
  onSearchReset?: () => void;
  displayValue?: string;
  compact?: boolean;
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

const GlobalSearch = React.memo<GlobalSearchProps>(({ 
  className, 
  onSelectIngredient, 
  onSearchReset,
  displayValue = "",
  compact = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // Debounce search term for API calls (300ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { data: results = [], isLoading: loading, isError, error } = useIngredientSearch(
    { term: debouncedSearchTerm }, 
    { enabled: debouncedSearchTerm.length > 2 }
  );
  const { searchHistory, addToHistory } = useSearchHistory();
  const searchRef = useRef<HTMLDivElement>(null);

  // Update internal state when displayValue changes
  useEffect(() => {
    setSearchTerm(displayValue);
  }, [displayValue]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    setIsOpen(true);
  }, []);

  const handleFocus = useCallback(() => {
    // If there's a displayed value (active search), clear it to start new search
    if (displayValue && onSearchReset) {
      onSearchReset();
      setSearchTerm('');
    }
    setIsOpen(true);
  }, [displayValue, onSearchReset]);

  const handleClearSearch = useCallback(() => {
    if (onSearchReset) {
      onSearchReset();
    }
    setSearchTerm('');
    setIsOpen(false);
  }, [onSearchReset]);

  const handleSelectIngredient = useCallback((ingredient: Ingredient) => {
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
  }, [addToHistory, onSelectIngredient]);

  const handleSelectHistoryItem = useCallback((historyItem: any) => {
    setIsOpen(false);
    
    // Create a mock ingredient object for compatibility with the new Ingredient model
    const ingredient: Ingredient = {
      id: historyItem.id,
      name: historyItem.name,
      category: historyItem.category || 'other',
      description: `Recent search: ${historyItem.name}`,
      nutritionPer100g: {},
      allergens: [],
      dietaryRestrictions: [],
      locations: [],
    };
    
    if (onSelectIngredient) {
      onSelectIngredient(ingredient);
    }
  }, [onSelectIngredient]);

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

  // Memoize dropdown visibility calculation
  const showDropdown = useMemo(() => 
    isOpen && (results.length > 0 || searchHistory.length > 0 || debouncedSearchTerm.length >= 2),
    [isOpen, results.length, searchHistory.length, debouncedSearchTerm.length]
  );

  // Show loading state when typing but before debounced search
  const isTyping = searchTerm !== debouncedSearchTerm && searchTerm.length > 2;
  const showLoading = loading || isTyping;

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
        
        {showLoading && !displayValue && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
          {/* Loading State */}
          {showLoading && debouncedSearchTerm.length >= 2 && (
            <LoadingSkeleton variant="search-dropdown" />
          )}

          {/* Search Results */}
          {!showLoading && results.length > 0 && (
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
                    {/* Enhanced properties badges */}
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
          )}

          {/* Search History */}
          {!showLoading && searchHistory.length > 0 && results.length === 0 && debouncedSearchTerm.length < 2 && (
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
          {!showLoading && results.length === 0 && debouncedSearchTerm.length >= 2 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No ingredients found for "{debouncedSearchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
});

GlobalSearch.displayName = 'GlobalSearch';

export default GlobalSearch;
