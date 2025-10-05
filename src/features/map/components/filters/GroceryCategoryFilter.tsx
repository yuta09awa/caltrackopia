
import React from 'react';
import { useAppStore } from '@/app/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryOption {
  value: string;
  label: string;
}

interface GroceryCategoryFilterProps {
  categoryOptions: CategoryOption[];
}

const GroceryCategoryFilter: React.FC<GroceryCategoryFilterProps> = ({ categoryOptions }) => {
  const { mapFilters, updateMapFilters } = useAppStore();

  const handleCategoryChange = (value: string) => {
    updateMapFilters({ groceryCategory: value });
  };

  return (
    <div className="flex items-center">
      <Select
        value={mapFilters.groceryCategory || "all"}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger 
          className="w-auto min-w-[120px] h-8 text-xs border-none bg-transparent focus:ring-0 px-2 gap-1"
        >
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent align="end" className="w-[150px]">
          <SelectItem value="all">All Categories</SelectItem>
          {categoryOptions.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GroceryCategoryFilter;
