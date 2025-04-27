
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from '@/store/appStore';

interface CuisineFilterProps {
  cuisineOptions: Array<{ value: string; label: string }>;
}

const CuisineFilter: React.FC<CuisineFilterProps> = ({ cuisineOptions }) => {
  const { mapFilters, updateMapFilters } = useAppStore();
  const cuisineValue = mapFilters.cuisine || "all";

  return (
    <div>
      <Select
        value={cuisineValue}
        onValueChange={(value) => updateMapFilters({ cuisine: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Cuisine Type" />
        </SelectTrigger>
        <SelectContent>
          {cuisineOptions.map((cuisine) => (
            <SelectItem key={cuisine.value} value={cuisine.value || "all"}>
              {cuisine.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CuisineFilter;
