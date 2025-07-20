
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import LocationList from "@/features/locations/components/LocationList";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";
import SlidablePanel from '@/features/map/components/SlidablePanel';

interface EnhancedMobileMapScreenListProps {
  listRef: React.RefObject<HTMLDivElement>;
  selectedLocationId: string | null;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  isExpanded: boolean;
  onPanelStateChange: (state: 'collapsed' | 'partial' | 'expanded') => void;
  onToggleExpanded: () => void;
}

const EnhancedMobileMapScreenList: React.FC<EnhancedMobileMapScreenListProps> = ({
  listRef,
  selectedLocationId,
  onScroll,
  isExpanded,
  onPanelStateChange,
  onToggleExpanded
}) => {
  return (
    <SlidablePanel 
      isExpanded={isExpanded}
      onStateChange={onPanelStateChange}
    >
      {/* Expand/Collapse Button */}
      <div className="px-4 pb-2 flex items-center justify-between">
        <div>
          <CacheStatusIndicator cacheHitRate={null} />
        </div>
        <button
          onClick={onToggleExpanded}
          className="p-2 rounded-full hover:bg-muted/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={isExpanded ? "Collapse list" : "Expand list"}
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronUp className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {/* List Content */}
      <div 
        ref={listRef}
        className="flex-1 overflow-y-auto"
        onScroll={onScroll}
      >
        <LocationList selectedLocationId={selectedLocationId} />
      </div>
    </SlidablePanel>
  );
};

export default EnhancedMobileMapScreenList;
