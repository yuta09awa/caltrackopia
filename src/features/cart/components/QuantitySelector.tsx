
import React, { useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  disabled?: boolean;
}

const PRESET_QUANTITIES = [1, 2, 3, 4, 5, 10, 15, 20];

const QuantitySelector = ({ quantity, onQuantityChange, disabled }: QuantitySelectorProps) => {
  const [isCustom, setIsCustom] = useState(!PRESET_QUANTITIES.includes(quantity));
  const [customValue, setCustomValue] = useState(quantity.toString());

  const handleSelectChange = useCallback((value: string) => {
    if (value === 'custom') {
      setIsCustom(true);
      setCustomValue(quantity.toString());
    } else {
      setIsCustom(false);
      const newQuantity = parseInt(value);
      onQuantityChange(newQuantity);
    }
  }, [quantity, onQuantityChange]);

  const handleCustomInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 999) {
      onQuantityChange(numValue);
    }
  }, [onQuantityChange]);

  const handleCustomBlur = useCallback(() => {
    const numValue = parseInt(customValue);
    if (isNaN(numValue) || numValue <= 0) {
      setCustomValue('1');
      onQuantityChange(1);
    } else if (numValue > 999) {
      setCustomValue('999');
      onQuantityChange(999);
    }
  }, [customValue, onQuantityChange]);

  if (isCustom) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={customValue}
          onChange={handleCustomInputChange}
          onBlur={handleCustomBlur}
          className="w-16 h-8 text-center"
          min="1"
          max="999"
          disabled={disabled}
          aria-label="Custom quantity"
        />
        <Select value="custom" onValueChange={handleSelectChange} disabled={disabled}>
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRESET_QUANTITIES.map((qty) => (
              <SelectItem key={qty} value={qty.toString()}>
                {qty}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Select 
      value={quantity.toString()} 
      onValueChange={handleSelectChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-20 h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PRESET_QUANTITIES.map((qty) => (
          <SelectItem key={qty} value={qty.toString()}>
            {qty}
          </SelectItem>
        ))}
        <SelectItem value="custom">Custom</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default QuantitySelector;
