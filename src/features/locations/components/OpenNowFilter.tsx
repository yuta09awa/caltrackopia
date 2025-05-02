
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OpenNowFilterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  className?: string;
}

const OpenNowFilter: React.FC<OpenNowFilterProps> = ({
  checked,
  onChange,
  id = "open-now-filter",
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onChange}
        />
        <Label 
          htmlFor={id} 
          className="text-sm font-medium leading-none cursor-pointer"
        >
          Open Now
        </Label>
      </div>
    </div>
  );
};

export default OpenNowFilter;
