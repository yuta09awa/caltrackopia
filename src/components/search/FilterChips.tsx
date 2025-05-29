
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

interface FilterChipsProps {
  className?: string;
}

const FilterChips: React.FC<FilterChipsProps> = ({ className }) => {
  const { mapFilters, updateMapFilters } = useAppStore();

  const activeFilters = React.useMemo(() => {
    const filters: Array<{ key: string; label: string; value: string }> = [];

    // Price range filter
    if (mapFilters.priceRange && mapFilters.priceRange !== 'all') {
      filters.push({
        key: 'priceRange',
        label: 'Price',
        value: mapFilters.priceRange
      });
    }

    // Cuisine filter
    if (mapFilters.cuisine && mapFilters.cuisine !== 'all') {
      filters.push({
        key: 'cuisine',
        label: 'Cuisine',
        value: mapFilters.cuisine
      });
    }

    // Grocery category filter
    if (mapFilters.groceryCategory && mapFilters.groceryCategory !== 'all') {
      filters.push({
        key: 'groceryCategory',
        label: 'Category',
        value: mapFilters.groceryCategory
      });
    }

    // Dietary filters
    mapFilters.dietary.forEach(dietary => {
      filters.push({
        key: 'dietary',
        label: 'Dietary',
        value: dietary
      });
    });

    // Nutrition filters
    mapFilters.nutrition.forEach(nutrition => {
      filters.push({
        key: 'nutrition',
        label: 'Nutrition',
        value: nutrition
      });
    });

    // Source filters
    mapFilters.sources.forEach(source => {
      filters.push({
        key: 'sources',
        label: 'Source',
        value: source
      });
    });

    return filters;
  }, [mapFilters]);

  const removeFilter = (key: string, value: string) => {
    if (key === 'priceRange') {
      updateMapFilters({ priceRange: null });
    } else if (key === 'cuisine') {
      updateMapFilters({ cuisine: 'all' });
    } else if (key === 'groceryCategory') {
      updateMapFilters({ groceryCategory: 'all' });
    } else if (key === 'dietary') {
      updateMapFilters({ 
        dietary: mapFilters.dietary.filter(d => d !== value) 
      });
    } else if (key === 'nutrition') {
      updateMapFilters({ 
        nutrition: mapFilters.nutrition.filter(n => n !== value) 
      });
    } else if (key === 'sources') {
      updateMapFilters({ 
        sources: mapFilters.sources.filter(s => s !== value) 
      });
    }
  };

  const clearAllFilters = () => {
    updateMapFilters({
      priceRange: null,
      cuisine: 'all',
      groceryCategory: 'all',
      dietary: [],
      nutrition: [],
      sources: [],
      excludeIngredients: []
    });
  };

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2 p-3 bg-muted/30", className)}>
      <div className="flex flex-wrap gap-2 flex-1">
        {activeFilters.map((filter, index) => (
          <Badge
            key={`${filter.key}-${filter.value}-${index}`}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-xs"
          >
            <span className="text-muted-foreground">{filter.label}:</span>
            <span className="capitalize">{filter.value.replace('-', ' ')}</span>
            <button
              onClick={() => removeFilter(filter.key, filter.value)}
              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      {activeFilters.length > 1 && (
        <button
          onClick={clearAllFilters}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default FilterChips;
