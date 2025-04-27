
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

  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
        Cuisine Type
      </label>
      <Select
        value={mapFilters.cuisine}
        onValueChange={(value) => updateMapFilters({ cuisine: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select cuisine" />
        </SelectTrigger>
        <SelectContent>
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
