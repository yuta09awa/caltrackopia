
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface Option {
  value: string;
  label: string;
}

interface CheckboxPopoverProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  triggerText: string;
}

const CheckboxPopover: React.FC<CheckboxPopoverProps> = ({
  options,
  selectedValues,
  onChange,
  triggerText,
}) => {
  const handleCheckboxChange = (checked: boolean | "indeterminate", value: string) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter((v) => v !== value));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-background border-input"
        >
          {triggerText} {selectedValues.length > 0 && `(${selectedValues.length})`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-accent rounded-sm"
            >
              <Checkbox
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => handleCheckboxChange(checked, option.value)}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CheckboxPopover;
