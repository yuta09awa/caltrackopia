
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface OpenNowFilterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const OpenNowFilter: React.FC<OpenNowFilterProps> = ({ checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span>Open Now</span>
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
      />
    </label>
  );
};

export default OpenNowFilter;
