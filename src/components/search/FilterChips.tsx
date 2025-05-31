import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

interface FilterChipsProps {
  className?: string;
  resultCount?: number;
}

const FilterChips: React.FC<FilterChipsProps> = ({ className, resultCount }) => {
  const { mapFilters, updateMapFilters } = useAppStore();

  const activeFilters = React.useMemo(() => {
    const filters: Array<{ key: string; label: string; value: string; type: 'single' | 'array' }> = [];

    // Price range filter - fixed type handling
    if (mapFilters.priceRange) {
      const [min, max] = mapFilters.priceRange;
      filters.push({
        key: 'priceRange',
        label: 'Price',
        value: `${'$'.repeat(min + 1)} - ${'$'.repeat(max + 1)}`,
        type: 'single'
      });
    }

    // cuisine filter
    if (mapFilters.cuisine && mapFilters.cuisine !== 'all') {
      filters.push({
        key: 'cuisine',
        label: 'Cuisine',
        value: mapFilters.cuisine.charAt(0).toUpperCase() + mapFilters.cuisine.slice(1),
        type: 'single'
      });
    }

    // grocery category filter
    if (mapFilters.groceryCategory && mapFilters.groceryCategory !== 'all') {
      filters.push({
        key: 'groceryCategory',
        label: 'Category',
        value: mapFilters.groceryCategory.charAt(0).toUpperCase() + mapFilters.groceryCategory.slice(1),
        type: 'single'
      });
    }

    // Dietary filters
    mapFilters.dietary.forEach(dietary => {
      filters.push({
        key: 'dietary',
        label: 'Dietary',
        value: dietary.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: 'array'
      });
    });

    // Nutrition filters
    mapFilters.nutrition.forEach(nutrition => {
      filters.push({
        key: 'nutrition',
        label: 'Nutrition',
        value: nutrition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: 'array'
      });
    });

    // Source filters
    mapFilters.sources.forEach(source => {
      filters.push({
        key: 'sources',
        label: 'Source',
        value: source.charAt(0).toUpperCase() + source.slice(1),
        type: 'array'
      });
    });

    // Include ingredients
    mapFilters.includeIngredients.forEach(ingredient => {
      filters.push({
        key: 'includeIngredients',
        label: 'Must Have',
        value: ingredient,
        type: 'array'
      });
    });

    // Exclude ingredients
    mapFilters.excludeIngredients.forEach(ingredient => {
      filters.push({
        key: 'excludeIngredients',
        label: 'Avoid',
        value: ingredient,
        type: 'array'
      });
    });

    return filters;
  }, [mapFilters]);

  const removeFilter = (key: string, value: string, type: 'single' | 'array') => {
    if (type === 'single') {
      if (key === 'priceRange') {
        updateMapFilters({ priceRange: null });
      } else if (key === 'cuisine') {
        updateMapFilters({ cuisine: 'all' });
      } else if (key === 'groceryCategory') {
        updateMapFilters({ groceryCategory: 'all' });
      }
    } else {
      // Array filters
      if (key === 'dietary') {
        updateMapFilters({ 
          dietary: mapFilters.dietary.filter(d => d !== value.toLowerCase().replace(/\s+/g, '-'))
        });
      } else if (key === 'nutrition') {
        updateMapFilters({ 
          nutrition: mapFilters.nutrition.filter(n => n !== value.toLowerCase().replace(/\s+/g, '-'))
        });
      } else if (key === 'sources') {
        updateMapFilters({ 
          sources: mapFilters.sources.filter(s => s !== value.toLowerCase())
        });
      } else if (key === 'includeIngredients') {
        updateMapFilters({ 
          includeIngredients: mapFilters.includeIngredients.filter(i => i !== value)
        });
      } else if (key === 'excludeIngredients') {
        updateMapFilters({ 
          excludeIngredients: mapFilters.excludeIngredients.filter(i => i !== value)
        });
      }
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
      includeIngredients: [],
      excludeIngredients: []
    });
  };

  if (activeFilters.length === 0 && resultCount === undefined) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-2 p-3 bg-muted/30", className)}>
      {/* Results count */}
      {resultCount !== undefined && (
        <div className="text-sm text-muted-foreground">
          {resultCount > 0 ? (
            `Found ${resultCount} location${resultCount !== 1 ? 's' : ''}`
          ) : (
            'No locations found'
          )}
          {activeFilters.length > 0 && ' with current filters'}
        </div>
      )}
      
      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge
              key={`${filter.key}-${filter.value}-${index}`}
              variant={filter.key === 'excludeIngredients' ? 'destructive' : 
                      filter.key === 'includeIngredients' ? 'default' : 'secondary'}
              className="flex items-center gap-1 px-2 py-1 text-xs"
            >
              <span className="text-muted-foreground">{filter.label}:</span>
              <span className="font-medium">{filter.value}</span>
              <button
                onClick={() => removeFilter(filter.key, filter.value, filter.type)}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${filter.label}: ${filter.value} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {activeFilters.length > 1 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted ml-2"
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterChips;
