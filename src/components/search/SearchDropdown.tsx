
import React from 'react';
import { MapPin } from 'lucide-react';
import { Ingredient } from '@/models/NutritionalInfo';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import SearchResults from './SearchResults';
import SearchHistory from './SearchHistory';

interface SearchHistoryItem {
  id: string;
  name: string;
  category?: string;
  timestamp: number;
}

interface SearchDropdownProps {
  isOpen: boolean;
  results: Ingredient[];
  searchHistory: SearchHistoryItem[];
  loading: boolean;
  debouncedSearchTerm: string;
  onSelectIngredient: (ingredient: Ingredient) => void;
  onSelectHistoryItem: (item: SearchHistoryItem) => void;
  onSearchOnMap?: (query: string) => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = React.memo(({
  isOpen,
  results,
  searchHistory,
  loading,
  debouncedSearchTerm,
  onSelectIngredient,
  onSelectHistoryItem,
  onSearchOnMap
}) => {
  const showDropdown = isOpen && (results.length > 0 || searchHistory.length > 0 || debouncedSearchTerm.length >= 2);

  if (!showDropdown) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
      {/* Search on Map Option */}
      {debouncedSearchTerm.length >= 2 && onSearchOnMap && (
        <div 
          className="p-3 border-b cursor-pointer hover:bg-accent flex items-center gap-2 text-sm"
          onClick={() => onSearchOnMap(debouncedSearchTerm)}
        >
          <MapPin className="h-4 w-4 text-primary" />
          <span>Search for "<strong>{debouncedSearchTerm}</strong>" on map</span>
        </div>
      )}

      {/* Loading State */}
      {loading && debouncedSearchTerm.length >= 2 && (
        <LoadingSkeleton variant="search-dropdown" />
      )}

      {/* Search Results */}
      {!loading && results.length > 0 && (
        <SearchResults 
          results={results} 
          onSelectIngredient={onSelectIngredient} 
        />
      )}

      {/* Search History */}
      {!loading && searchHistory.length > 0 && results.length === 0 && debouncedSearchTerm.length < 2 && (
        <SearchHistory 
          searchHistory={searchHistory}
          onSelectItem={onSelectHistoryItem}
        />
      )}

      {/* No Results - only show if no map search option */}
      {!loading && results.length === 0 && debouncedSearchTerm.length >= 2 && !onSearchOnMap && (
        <div className="p-4 text-center text-sm text-muted-foreground">
          No ingredients found for "{debouncedSearchTerm}"
        </div>
      )}
    </div>
  );
});

SearchDropdown.displayName = 'SearchDropdown';

export default SearchDropdown;
