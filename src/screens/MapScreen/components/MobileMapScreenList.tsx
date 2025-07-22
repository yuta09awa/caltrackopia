
import React from 'react';
import LocationList from "@/features/locations/components/LocationList";

interface MobileMapScreenListProps {
  listRef: React.RefObject<HTMLDivElement>;
  selectedLocationId: string | null;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

const MobileMapScreenList: React.FC<MobileMapScreenListProps> = ({
  listRef,
  selectedLocationId,
  onScroll,
}) => {
  return (
    <div className="h-full flex flex-col bg-background shadow-lg">
      {/* List Content */}
      <div 
        ref={listRef}
        className="flex-1 overflow-y-auto"
        onScroll={onScroll}
      >
        <LocationList selectedLocationId={selectedLocationId} />
      </div>
    </div>
  );
};

export default MobileMapScreenList;
