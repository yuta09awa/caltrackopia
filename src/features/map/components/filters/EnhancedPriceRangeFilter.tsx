import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface PriceLevel {
  value: number;
  label: string;
  description: string;
  symbol: string;
}

const priceLevels: PriceLevel[] = [
  { value: 1, label: 'Budget', description: 'Under $15', symbol: '$' },
  { value: 2, label: 'Moderate', description: '$15-30', symbol: '$$' },
  { value: 3, label: 'Upscale', description: '$30-50', symbol: '$$$' },
  { value: 4, label: 'Fine Dining', description: '$50+', symbol: '$$$$' },
];

interface EnhancedPriceRangeFilterProps {
  compact?: boolean;
}

const EnhancedPriceRangeFilter: React.FC<EnhancedPriceRangeFilterProps> = ({ 
  compact = false 
}) => {
  const { mapFilters, updateMapFilters } = useAppStore();
  
  const handlePriceSelect = (priceLevel: number) => {
    const currentRange = mapFilters.priceRange;
    const isSelected = currentRange && currentRange[0] <= priceLevel && currentRange[1] >= priceLevel;
    
    if (isSelected) {
      updateMapFilters({ priceRange: null });
    } else {
      updateMapFilters({ priceRange: [priceLevel, priceLevel] });
    }
  };

  const isPriceSelected = (priceLevel: number): boolean => {
    const range = mapFilters.priceRange;
    return range ? range[0] <= priceLevel && range[1] >= priceLevel : false;
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Price Range</span>
        </div>
        <div className="flex gap-1">
          {priceLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => handlePriceSelect(level.value)}
              className={`flex-1 py-2 px-3 rounded-md border text-sm transition-all duration-200 ${
                isPriceSelected(level.value)
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {level.symbol}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Price Range
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {priceLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => handlePriceSelect(level.value)}
              className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                isPriceSelected(level.value)
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-card border-border hover:bg-accent'
              }`}
            >
              <div className="font-medium text-sm">{level.symbol} {level.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{level.description}</div>
            </button>
          ))}
        </div>
        
        {mapFilters.priceRange && (
          <div className="pt-2">
            <Badge variant="secondary" className="text-xs">
              Selected: {priceLevels.find(l => l.value === mapFilters.priceRange?.[0])?.symbol}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedPriceRangeFilter;