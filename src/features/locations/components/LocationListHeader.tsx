
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationDetectionBanner } from '@/components/locations/LocationDetectionBanner';
import { SortOption } from '../types';

interface LocationDetectionResult {
  detectedCity: string;
  detectedRegion: string;
  detectionMethod: 'cloudflare' | 'ip-api' | 'fallback';
}

interface LocationListHeaderProps {
  totalCount: number;
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  detectedLocation?: LocationDetectionResult | null;
  isDetecting?: boolean;
  useTopRated?: boolean;
  onToggleTopRated?: (value: boolean) => void;
}

const LocationListHeader: React.FC<LocationListHeaderProps> = ({
  totalCount,
  sortOption,
  setSortOption,
  detectedLocation,
  isDetecting = false,
  useTopRated = false,
  onToggleTopRated
}) => {
  return (
    <div className="space-y-4">
      {onToggleTopRated && (
        <LocationDetectionBanner
          detectedLocation={detectedLocation}
          isDetecting={isDetecting}
          useTopRated={useTopRated}
          onToggleTopRated={onToggleTopRated}
          locationCount={totalCount}
        />
      )}
      
      <div className="flex items-center justify-between py-2">
        <h3 className="text-lg font-semibold">
          {useTopRated ? 'Top Rated' : 'All'} Locations ({totalCount})
        </h3>
        
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">
              {useTopRated ? 'Best Match' : 'Default'}
            </SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationListHeader;
