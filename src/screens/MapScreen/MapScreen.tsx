
import React from 'react';
import MapComponent from '@/features/map/components/MapComponent';
import { MapInfoCard } from '@/screens/MapScreen/components/MapScreenInfoCard';
import { useMapController } from '@/features/map/hooks/useMapController';

const MapScreen: React.FC = () => {
  const { showInfoCard } = useMapController();

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <main className="flex-1 flex flex-col relative w-full">
        <div className="flex-1 relative">
          <MapComponent height="100vh" />
          {showInfoCard && <MapInfoCard />}
        </div>
      </main>
    </div>
  );
};

export default MapScreen;
