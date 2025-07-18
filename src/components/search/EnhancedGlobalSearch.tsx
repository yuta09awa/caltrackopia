import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X, Clock, MapPin, Utensils, Carrot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIngredientSearch } from '@/features/ingredients/hooks/useIngredientApi';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useDebounce } from '@/hooks/useDebounce';
import { Ingredient } from '@/models/NutritionalInfo';
import SearchDropdown from './SearchDropdown';

interface SearchSuggestion {
  id: string;
  text: string;
  category: 'ingredient' | 'restaurant' | 'dish' | 'location';
  icon: React.ReactNode;
}

const quickSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'Italian restaurants near me', category: 'restaurant', icon: <Utensils className="h-3 w-3" /> },
  { id: '2', text: 'Organic produce stores', category: 'location', icon: <MapPin className="h-3 w-3" /> },
  { id: '3', text: 'Gluten-free options', category: 'dish', icon: <Utensils className="h-3 w-3" /> },
  { id: '4', text: 'Fresh tomatoes', category: 'ingredient', icon: <Carrot className="h-3 w-3" /> },
];

interface EnhancedGlobalSearchProps {
  className?: string;
  onSelectIngredient?: (ingredient: Ingredient) => void;
  onSearchReset?: () => void;
  displayValue?: string;
  compact?: boolean;
  showSuggestions?: boolean;
}

const EnhancedGlobalSearch = React.memo<EnhancedGlobalSearchProps>(({ 
  className, 
  onSelectIngredient, 
  onSearchReset,
  displayValue = "",
  compact = false,
  showSuggestions = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Debounce search term for API calls (300ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { data: results = [], isLoading: loading } = useIngredientSearch(
    { term: debouncedSearchTerm }, 
    { enabled: debouncedSearchTerm.length > 2 }
  );
  const { searchHistory, addToHistory } = useSearchHistory();
  const searchRef = useRef<HTMLDivElement>(null);

  // Dynamic placeholder based on context
  const getPlaceholder = () => {
    if (selectedCategory === 'ingredient') return 'Search for ingredients...';
    if (selectedCategory === 'restaurant') return 'Find restaurants and cafes...';
    if (selectedCategory === 'dish') return 'Discover dishes and recipes...';
    return 'Search ingredients, restaurants, dishes...';
  };

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
    addToHistory({
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category
    });
    
    setIsOpen(false);
    
    if (onSelectIngredient) {
      onSelectIngredient(ingredient);
    }
  }, [addToHistory, onSelectIngredient]);

  const handleSelectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.text);
    setIsOpen(false);
    // Could trigger search or navigation based on category
  }, []);

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

  const isTyping = searchTerm !== debouncedSearchTerm && searchTerm.length > 2;
  const showLoading = loading || isTyping;

  return (
    <div className={cn("relative w-full", className)} ref={searchRef}>
      {/* Search Categories */}
      {!compact && showSuggestions && searchTerm.length === 0 && (
        <div className="mb-3">
          <div className="flex gap-2 flex-wrap">
            {['all', 'ingredient', 'restaurant', 'dish'].map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer capitalize text-xs"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All' : category}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={getPlaceholder()}
          className={cn(
            "w-full pl-9",
            displayValue ? "pr-10" : "pr-4",
            compact ? "h-9 text-sm" : "h-11",
            "transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          )}
          value={searchTerm}
          onChange={handleSearch}
          onFocus={handleFocus}
        />
        
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

      {/* Enhanced Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Quick Suggestions */}
          {searchTerm.length === 0 && showSuggestions && (
            <div className="p-3">
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Quick Searches
              </div>
              <div className="space-y-1">
                {quickSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                  >
                    {suggestion.icon}
                    <span className="text-sm">{suggestion.text}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {suggestion.category}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {searchTerm.length === 0 && searchHistory.length > 0 && (
            <div className="p-3 border-t">
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Recent Searches
              </div>
              <div className="space-y-1">
                {searchHistory.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const ingredient: Ingredient = {
                        id: item.id,
                        name: item.name,
                        category: item.category || 'other',
                        description: `Recent search: ${item.name}`,
                        nutritionPer100g: {},
                        allergens: [],
                        dietaryRestrictions: [],
                        locations: [],
                      };
                      handleSelectIngredient(ingredient);
                    }}
                    className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                  >
                    <Carrot className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{item.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{item.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          <SearchDropdown
            isOpen={true}
            results={results}
            searchHistory={[]}
            loading={showLoading}
            debouncedSearchTerm={debouncedSearchTerm}
            onSelectIngredient={handleSelectIngredient}
            onSelectHistoryItem={() => {}}
          />
        </div>
      )}
    </div>
  );
});

EnhancedGlobalSearch.displayName = 'EnhancedGlobalSearch';

export default EnhancedGlobalSearch;