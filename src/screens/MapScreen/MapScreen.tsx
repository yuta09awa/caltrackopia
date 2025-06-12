
import React from 'react';
import MapComponent from '@/features/map/components/MapComponent';
import { MapInfoCard } from '@/screens/MapScreen/components/MapScreenInfoCard';
import LocationList from '@/features/locations/components/LocationList';
import { useMapController } from '@/features/map/hooks/useMapController';

const MapScreen: React.FC = () => {
  const { showInfoCard, selectedPlace } = useMapController();

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        {/* Map Section - Full height background */}
        <div className="absolute inset-0">
          <MapComponent height="100%" />
          {showInfoCard && <MapInfoCard />}
        </div>
        
        {/* Location List Section - Overlay that can scroll up */}
        <div className="absolute bottom-0 left-0 right-0 h-[60vh] bg-background border-t border-border rounded-t-xl shadow-lg flex flex-col">
          <div className="w-full flex justify-center py-2 bg-background border-b border-border">
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
          </div>
          <div className="flex-1 overflow-y-auto">
            <LocationList selectedLocationId={selectedPlace?.id || null} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapScreen;
