
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface CategoryOption {
  id: string;
  label: string;
}

interface CategoryFilterProps {
  label: string;
  options: CategoryOption[];
  selectedOptions: string[];
  onOptionChange: (optionId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  label,
  options,
  selectedOptions,
  onOptionChange,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground block">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-1">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-2 text-sm py-1 px-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            <Checkbox
              id={option.id}
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={() => onOptionChange(option.id)}
              className="h-4 w-4 rounded-sm border-gray-300 text-green-500 focus:ring-green-500"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
