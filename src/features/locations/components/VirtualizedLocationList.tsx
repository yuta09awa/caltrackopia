
import React, { useMemo, useCallback } from 'react';
import VirtualizedList from '@/components/ui/VirtualizedList';
import LocationCard from './LocationCard';
import { Location } from '../types';

interface VirtualizedLocationListProps {
  locations: Location[];
  selectedLocationId?: string | null;
  height: number;
  onScroll?: (scrollTop: number) => void;
}

const ITEM_HEIGHT = 200; // Approximate height of LocationCard

const VirtualizedLocationList: React.FC<VirtualizedLocationListProps> = ({
  locations,
  selectedLocationId,
  height,
  onScroll
}) => {
  const renderItem = useCallback((location: Location, index: number, isHighlighted?: boolean) => (
    <div id={`location-${location.id}`} className="transition-colors duration-300">
      <LocationCard 
        location={location} 
        isHighlighted={isHighlighted}
      />
    </div>
  ), []);

  const getItemId = useCallback((location: Location) => location.id, []);

  return (
    <VirtualizedList
      items={locations}
      height={height}
      itemHeight={ITEM_HEIGHT}
      renderItem={renderItem}
      selectedItemId={selectedLocationId}
      getItemId={getItemId}
      onScroll={onScroll}
      className="divide-y divide-border"
    />
  );
};

export default React.memo(VirtualizedLocationList);
