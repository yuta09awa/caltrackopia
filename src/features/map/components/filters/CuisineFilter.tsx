
import React from 'react';
import { useAppStore } from '@/app/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CuisineOption {
  value: string;
  label: string;
}

interface CuisineFilterProps {
  cuisineOptions: CuisineOption[];
}

const CuisineFilter: React.FC<CuisineFilterProps> = ({ cuisineOptions }) => {
  const { mapFilters, updateMapFilters } = useAppStore();

  const handleCuisineChange = (value: string) => {
    updateMapFilters({ cuisine: value });
  };

  return (
    <div className="flex items-center">
      <Select
        value={mapFilters.cuisine || "all"}
        onValueChange={handleCuisineChange}
      >
        <SelectTrigger 
          className="w-auto min-w-[120px] h-8 text-xs border-none bg-transparent focus:ring-0 px-2 gap-1"
        >
          <SelectValue placeholder="Cuisine" />
        </SelectTrigger>
        <SelectContent align="end" className="w-[150px]">
          <SelectItem value="all">All Cuisines</SelectItem>
          {cuisineOptions.map((cuisine) => (
            <SelectItem key={cuisine.value} value={cuisine.value}>
              {cuisine.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CuisineFilter;
