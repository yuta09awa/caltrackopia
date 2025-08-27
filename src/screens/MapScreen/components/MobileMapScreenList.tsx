
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
        "fixed bottom-0 left-0 right-0 z-20 flex flex-col rounded-t-xl bg-background shadow-lg transition-transform duration-300 ease-in-out",
        isExpanded
          ? "h-[50vh]" // Expanded: 50/50 split with map
          : "h-[120px]" // Collapsed: just show handle and preview
      )}
    >
      {/* Clickable Header Bar */}
      <div 
        className="w-full px-4 py-3 cursor-pointer active:bg-muted/20 flex items-center justify-between transition-colors hover:bg-muted/10"
        onClick={onToggleExpanded}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleExpanded();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Collapse location list" : "Expand location list"}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-1.5 bg-muted-foreground/30 rounded-full" />
          <CacheStatusIndicator cacheHitRate={null} />
        </div>
        <div className="text-xs text-muted-foreground">
          {isExpanded ? "Tap to collapse" : "Tap to expand"}
        </div>
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
