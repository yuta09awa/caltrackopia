
import React from 'react';

interface PriceRangeFilterProps {
  priceFilter: string | null;
  setPriceFilter: (price: string | null) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceFilter,
  setPriceFilter,
}) => {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
        Price Range
      </label>
      <div className="flex gap-1">
        {['$', '$$', '$$$', '$$$$'].map((price) => (
          <button
            key={price}
            onClick={() => setPriceFilter(price === priceFilter ? null : price)}
            className={`flex-1 py-1 px-2 rounded-md border text-sm ${
              price === priceFilter
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            } transition-colors text-center`}
          >
            {price}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriceRangeFilter;
