
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption } from '../types';

interface LocationListHeaderProps {
  totalCount: number;
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
}

const LocationListHeader: React.FC<LocationListHeaderProps> = ({
  totalCount,
  sortOption,
  setSortOption
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <h3 className="text-lg font-semibold">
        {totalCount} Location{totalCount !== 1 ? 's' : ''}
      </h3>
      
      <Select value={sortOption} onValueChange={setSortOption}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="distance">Distance</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
          <SelectItem value="price">Price</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationListHeader;
