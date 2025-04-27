
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface OpenNowFilterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const OpenNowFilter: React.FC<OpenNowFilterProps> = ({ checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
      />
      <span>Open Now</span>
    </label>
  );
};

export default OpenNowFilter;
