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
    <div className="p-3 border-b border-border bg-card">
      {/* Location count, Open Now, and sort */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-foreground leading-tight">
            {locationCount} Location{locationCount !== 1 ? 's' : ''}
          </h3>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={isOpenNow}
              onCheckedChange={handleOpenNowToggle}
              id="open-now"
              className="scale-75"
            />
            <label htmlFor="open-now" className="text-xs text-muted-foreground cursor-pointer">
              Open Now
            </label>
          </div>
        </div>
        
        <Select value={sortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-28 h-8">
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="px-2 py-1 h-7 text-xs rounded-full"
            >
              {tab}
            </Button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          className="flex items-center gap-1 h-7 px-2"
        >
          <Filter className="w-3 h-3" />
          <span className="text-xs">Filter</span>
        </Button>
      </div>
    </div>
  );
};

export default LocationSidebarHeader;