
import React from 'react';
import MapComponent from '@/features/map/components/MapComponent';
import { MapInfoCard } from '@/screens/MapScreen/components/MapScreenInfoCard';
import LocationList from '@/features/locations/components/LocationList';
import { useMapController } from '@/features/map/hooks/useMapController';

const MapScreen: React.FC = () => {
  const { showInfoCard, selectedPlace } = useMapController();

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <main className="flex-1 flex flex-col relative w-full">
        {/* Map Section */}
        <div className="flex-1 relative">
          <MapComponent height="100%" />
          {showInfoCard && <MapInfoCard />}
        </div>
        
        {/* Location List Section - Below the map */}
        <div className="bg-background border-t border-border max-h-64 overflow-hidden">
          <div className="w-full flex justify-center py-2">
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
          </div>
          <LocationList selectedLocationId={selectedPlace?.id || null} />
        </div>
      </main>
    </div>
  );
};

export default MapScreen;
