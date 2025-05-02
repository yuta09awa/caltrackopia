
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface OpenNowFilterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const OpenNowFilter: React.FC<OpenNowFilterProps> = ({ checked, onChange }) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        id="open-now-filter"
      />
      <label htmlFor="open-now-filter" className="cursor-pointer">Open Now</label>
    </div>
  );
};

export default OpenNowFilter;
