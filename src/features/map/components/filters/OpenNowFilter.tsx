
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OpenNowFilterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  className?: string;
  label?: string;
}

const OpenNowFilter: React.FC<OpenNowFilterProps> = ({
  checked,
  onChange,
  id = "open-now-filter",
  className = "",
  label = "Open Now"
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          aria-label={`Filter by locations that are ${label.toLowerCase()}`}
        />
        <Label 
          htmlFor={id} 
          className="text-sm font-medium leading-none cursor-pointer select-none"
        >
          {label}
        </Label>
      </div>
    </div>
  );
};

export default OpenNowFilter;
