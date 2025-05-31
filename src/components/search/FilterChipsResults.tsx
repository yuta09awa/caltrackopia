
import React from 'react';

interface FilterChipsResultsProps {
  resultCount?: number;
  hasActiveFilters: boolean;
}

const FilterChipsResults: React.FC<FilterChipsResultsProps> = ({ 
  resultCount, 
  hasActiveFilters 
}) => {
  if (resultCount === undefined) return null;

  return (
    <div className="text-sm text-muted-foreground">
      {resultCount > 0 ? (
        `Found ${resultCount} location${resultCount !== 1 ? 's' : ''}`
      ) : (
        'No locations found'
      )}
      {hasActiveFilters && ' with current filters'}
    </div>
  );
};

export default FilterChipsResults;
