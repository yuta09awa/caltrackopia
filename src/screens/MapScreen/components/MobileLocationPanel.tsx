
import React from 'react';
import { ChevronUp } from 'lucide-react';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import LocationList from "@/features/locations/components/LocationList";
import CacheStatusIndicator from "@/features/map/components/CacheStatusIndicator";

interface MobileLocationPanelProps {
  selectedLocationId: string | null;
  listRef: React.RefObject<HTMLDivElement>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

const MobileLocationPanel: React.FC<MobileLocationPanelProps> = ({
  selectedLocationId,
  listRef,
  onScroll
}) => {
  return (
    <div className="vaul-drawer-wrapper">
      <Drawer shouldScaleBackground={false} snapPoints={[140, 0.8]} defaultOpen>
        <DrawerContent className="flex flex-col h-full max-h-[80vh] outline-none mt-24">
          {/* Drag Handle */}
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
          
          {/* Header with Cache Status */}
          <div className="px-4 pb-2 flex items-center justify-between">
            <div>
              <CacheStatusIndicator cacheHitRate={null} />
            </div>
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          </div>
          
          {/* List Content */}
          <div 
            ref={listRef}
            className="flex-1 overflow-y-auto"
            onScroll={onScroll}
          >
            <LocationList selectedLocationId={selectedLocationId} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileLocationPanel;
