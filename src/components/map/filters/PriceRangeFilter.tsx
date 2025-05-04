
import React from 'react';
import { Button } from "@/components/ui/button";

interface PriceRangeFilterProps {
  priceFilter: string | null;
  setPriceFilter: (price: string | null) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceFilter,
  setPriceFilter,
}) => {
  const priceRanges = [
    { value: "$", label: "$" },
    { value: "$$", label: "$$" },
    { value: "$$$", label: "$$$" },
    { value: "$$$$", label: "$$$$" },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground block">
        Price Range
      </label>
      <div className="flex gap-1">
        {priceRanges.map((range) => (
          <Button
            key={range.value}
            variant={priceFilter === range.value ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs font-medium"
            onClick={() => setPriceFilter(priceFilter === range.value ? null : range.value)}
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PriceRangeFilter;
