
import { useMemo } from 'react';
import { MapFilters } from '@/features/map/store/mapFiltersSlice';

interface FilterChip {
  key: string;
  label: string;
  value: string;
  type: 'single' | 'array';
}

export const useFilterChips = (
  mapFilters: MapFilters,
  updateMapFilters: (filters: Partial<MapFilters>) => void
) => {
  const activeFilters = useMemo(() => {
    const filters: FilterChip[] = [];

    // Price range filter
    if (mapFilters.priceRange) {
      const [min, max] = mapFilters.priceRange;
      filters.push({
        key: 'priceRange',
        label: 'Price',
        value: `${'$'.repeat(min + 1)} - ${'$'.repeat(max + 1)}`,
        type: 'single'
      });
    }

    // Cuisine filter
    if (mapFilters.cuisine && mapFilters.cuisine !== 'all') {
      filters.push({
        key: 'cuisine',
        label: 'Cuisine',
        value: mapFilters.cuisine.charAt(0).toUpperCase() + mapFilters.cuisine.slice(1),
        type: 'single'
      });
    }

    // Grocery category filter
    if (mapFilters.groceryCategory && mapFilters.groceryCategory !== 'all') {
      filters.push({
        key: 'groceryCategory',
        label: 'Category',
        value: mapFilters.groceryCategory.charAt(0).toUpperCase() + mapFilters.groceryCategory.slice(1),
        type: 'single'
      });
    }

    // Array filters
    const arrayFilters = [
      { key: 'dietary', label: 'Dietary', values: mapFilters.dietary },
      { key: 'nutrition', label: 'Nutrition', values: mapFilters.nutrition },
      { key: 'sources', label: 'Source', values: mapFilters.sources },
      { key: 'includeIngredients', label: 'Must Have', values: mapFilters.includeIngredients },
      { key: 'excludeIngredients', label: 'Avoid', values: mapFilters.excludeIngredients }
    ];

    arrayFilters.forEach(({ key, label, values }) => {
      values.forEach(value => {
        filters.push({
          key,
          label,
          value: key === 'sources' ? 
            value.charAt(0).toUpperCase() + value.slice(1) :
            value.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type: 'array'
        });
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
      const filterKey = key as keyof Pick<MapFilters, 'dietary' | 'nutrition' | 'sources' | 'includeIngredients' | 'excludeIngredients'>;
      const currentValues = mapFilters[filterKey];
      
      if (Array.isArray(currentValues)) {
        const normalizedValue = key === 'sources' ? 
          value.toLowerCase() :
          value.toLowerCase().replace(/\s+/g, '-');
        
        const filteredValues = currentValues.filter(v => v !== normalizedValue);
        updateMapFilters({ [filterKey]: filteredValues });
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

  return {
    activeFilters,
    removeFilter,
    clearAllFilters
  };
};
