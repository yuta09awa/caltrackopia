
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterChip {
  key: string;
  label: string;
  value: string;
  type: 'single' | 'array';
}

interface FilterChipsDisplayProps {
  filters: FilterChip[];
  onRemoveFilter: (key: string, value: string, type: 'single' | 'array') => void;
  onClearAll: () => void;
}

const FilterChipsDisplay: React.FC<FilterChipsDisplayProps> = ({
  filters,
  onRemoveFilter,
  onClearAll
}) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter, index) => (
        <Badge
          key={`${filter.key}-${filter.value}-${index}`}
          variant={filter.key === 'excludeIngredients' ? 'destructive' : 
                  filter.key === 'includeIngredients' ? 'default' : 'secondary'}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <span className="text-muted-foreground">{filter.label}:</span>
          <span className="font-medium">{filter.value}</span>
          <button
            onClick={() => onRemoveFilter(filter.key, filter.value, filter.type)}
            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${filter.label}: ${filter.value} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      {filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted ml-2"
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default FilterChipsDisplay;
