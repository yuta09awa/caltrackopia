
import React from 'react';
import { useAppStore } from '@/app/store';
import { cn } from '@/lib/utils';
import FilterChipsDisplay from './FilterChipsDisplay';
import FilterChipsResults from './FilterChipsResults';
import { useFilterChips } from './hooks/useFilterChips';

interface FilterChipsProps {
  className?: string;
  resultCount?: number;
}

const FilterChips: React.FC<FilterChipsProps> = ({ className, resultCount }) => {
  const { mapFilters, updateMapFilters } = useAppStore();
  const { activeFilters, removeFilter, clearAllFilters } = useFilterChips(mapFilters, updateMapFilters);

  const hasActiveFilters = activeFilters.length > 0;

  if (!hasActiveFilters && resultCount === undefined) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-2 p-3 bg-muted/30", className)}>
      <FilterChipsResults 
        resultCount={resultCount} 
        hasActiveFilters={hasActiveFilters}
      />
      
      {hasActiveFilters && (
        <FilterChipsDisplay
          filters={activeFilters}
          onRemoveFilter={removeFilter}
          onClearAll={clearAllFilters}
        />
      )}
    </div>
  );
};

export default FilterChips;
