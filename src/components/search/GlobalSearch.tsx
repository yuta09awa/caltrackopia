import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIngredientSearch } from '@/features/ingredients/hooks/useIngredientApi';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useDebounce } from '@/hooks/useDebounce';
import { useRotatingPlaceholder } from '@/hooks/useRotatingPlaceholder';
import { Ingredient } from '@/models/NutritionalInfo';
import SearchDropdown from './SearchDropdown';
import { security } from '@/services/security/SecurityService';

interface GlobalSearchProps {
  className?: string;
  onSelectIngredient?: (ingredient: Ingredient) => void;
  navigateTo?: string;
  onSearchReset?: () => void;
  displayValue?: string;
  compact?: boolean;
}

const GlobalSearch = React.memo<GlobalSearchProps>(({ 
  className, 
  onSelectIngredient,
  navigateTo,
  onSearchReset,
  displayValue = "",
  compact = false 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { placeholder, pause, resume } = useRotatingPlaceholder();
  
  // Debounce search term for API calls (300ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { data: results = [], isLoading: loading } = useIngredientSearch(
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
    
    // Security: Detect suspicious activity in search queries
    if (query.length > 0 && security.detectSuspiciousActivity(query, 'search')) {
      console.warn('Suspicious search query detected');
      return;
    }

    // Security: Validate and sanitize search input
    const validation = security.validateInput(query, 'text');
    const sanitized = validation.sanitized;
    
    setSearchTerm(sanitized);
    setIsOpen(true);
  }, []);

  const handleFocus = useCallback(() => {
    // If there's a displayed value (active search), clear it to start new search
    if (displayValue && onSearchReset) {
      onSearchReset();
      setSearchTerm('');
    }
    pause(); // Pause placeholder rotation
    setIsOpen(true);
  }, [displayValue, onSearchReset, pause]);

  const handleClearSearch = useCallback(() => {
    if (onSearchReset) {
      onSearchReset();
    }
    setSearchTerm('');
    setIsOpen(false);
    resume(); // Resume placeholder rotation
  }, [onSearchReset, resume]);

  const handleBlur = useCallback(() => {
    // Resume rotation when input loses focus if empty
    if (searchTerm.length === 0) {
      resume();
    }
  }, [searchTerm, resume]);

  const handleSelectIngredient = useCallback((ingredient: Ingredient) => {
    // Add to search history
    addToHistory({
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category
    });
    
    // Close dropdown
    setIsOpen(false);
    
    // Handle navigation
    if (navigateTo) {
      navigate(navigateTo);
    }
    
    // Notify parent callback
    if (onSelectIngredient) {
      onSelectIngredient(ingredient);
    }
  }, [addToHistory, onSelectIngredient, navigateTo, navigate]);

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

  // Show loading state when typing but before debounced search
  const isTyping = searchTerm !== debouncedSearchTerm && searchTerm.length > 2;
  const showLoading = loading || isTyping;

  return (
    <div className={cn("relative w-full", className)} ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          className={cn(
            "w-full pl-9 transition-opacity duration-300",
            displayValue ? "pr-10" : "pr-4",
            compact ? "h-9 text-sm" : "h-10"
          )}
          value={searchTerm}
          onChange={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
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

      <SearchDropdown
        isOpen={isOpen}
        results={results}
        searchHistory={searchHistory}
        loading={showLoading}
        debouncedSearchTerm={debouncedSearchTerm}
        onSelectIngredient={handleSelectIngredient}
        onSelectHistoryItem={handleSelectHistoryItem}
      />
    </div>
  );
});

GlobalSearch.displayName = 'GlobalSearch';

export default GlobalSearch;
