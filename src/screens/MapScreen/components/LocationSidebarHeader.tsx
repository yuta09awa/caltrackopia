import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Filter } from "lucide-react";

interface LocationSidebarHeaderProps {
  locationCount: number;
  onSortChange?: (sort: string) => void;
  onOpenNowToggle?: (enabled: boolean) => void;
  onFilterClick?: () => void;
}

const LocationSidebarHeader: React.FC<LocationSidebarHeaderProps> = ({
  locationCount,
  onSortChange,
  onOpenNowToggle,
  onFilterClick
}) => {
  const [sortValue, setSortValue] = useState("default");
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const handleSortChange = (value: string) => {
    setSortValue(value);
    onSortChange?.(value);
  };

  const handleOpenNowToggle = (checked: boolean) => {
    setIsOpenNow(checked);
    onOpenNowToggle?.(checked);
  };

  const tabs = ["All", "Restaurants"];

  return (
    <div className="p-4 border-b border-border bg-card">
      {/* Location count and sort */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {locationCount} Location{locationCount !== 1 ? 's' : ''}
        </h3>
        
        <Select value={sortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="px-3 py-1.5 h-auto text-sm rounded-full"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={isOpenNow}
            onCheckedChange={handleOpenNowToggle}
            id="open-now"
          />
          <label htmlFor="open-now" className="text-sm text-foreground cursor-pointer">
            Open Now
          </label>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>
    </div>
  );
};

export default LocationSidebarHeader;