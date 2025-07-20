
import React, { useState, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import LocationList from "@/features/locations/components/LocationList";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";

interface MobileMapScreenListProps {
  listRef: React.RefObject<HTMLDivElement>;
  selectedLocationId: string | null;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const MobileMapScreenList: React.FC<MobileMapScreenListProps> = ({
  listRef,
  selectedLocationId,
  onScroll,
  isExpanded,
  onToggleExpanded
}) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (startY === null) return;
    setCurrentY(e.touches[0].clientY);
  }, [startY]);

  const handleTouchEnd = useCallback(() => {
    if (startY === null || currentY === null) {
      setStartY(null);
      setCurrentY(null);
      return;
    }

    const deltaY = startY - currentY;
    const threshold = 50;

    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // Swiped up - expand
        if (!isExpanded) onToggleExpanded();
      } else {
        // Swiped down - collapse
        if (isExpanded) onToggleExpanded();
      }
    }

    setStartY(null);
    setCurrentY(null);
  }, [startY, currentY, isExpanded, onToggleExpanded]);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-20 flex h-full flex-col rounded-t-xl bg-background shadow-lg transition-transform duration-300 ease-in-out",
        isExpanded
          ? "translate-y-[50vh]" // When expanded, align with 50vh map height
          : "translate-y-[calc(100vh-140px)]" // When collapsed, 140px is visible from the bottom
      )}
    >
      {/* Drag Handle */}
      <div 
        className="w-full flex justify-center py-3 cursor-pointer active:bg-muted/20"
        onClick={onToggleExpanded}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
      </div>

      {/* Header with Cache Status and Toggle */}
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
        className="flex-1 overflow-y-auto px-2 pb-24"
        onScroll={onScroll}
      >
        <LocationList selectedLocationId={selectedLocationId} />
      </div>
    </div>
  );
};

export default MobileMapScreenList;
