
import { useCallback } from 'react';
import { LatLng } from '@/features/map/hooks/useMapState';

interface UseMapScreenHandlersProps {
  updateCenter: (center: LatLng) => void;
  updateZoom: (zoom: number) => void;
  stableDependencies: any;
}

export const useMapScreenHandlers = ({
  updateCenter,
  updateZoom,
  stableDependencies
}: UseMapScreenHandlersProps) => {

  const handleLocationSelect = useCallback((locationId: string) => {
    stableDependencies.handleLocationSelect(locationId, stableDependencies.locations, stableDependencies.selectLocation);
  }, [stableDependencies]);

  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    stableDependencies.handleMarkerClick(locationId, position, stableDependencies.locations, stableDependencies.selectLocation);
  }, [stableDependencies]);

  const handleInfoCardClose = useCallback(() => {
    stableDependencies.handleInfoCardClose(stableDependencies.selectLocation);
  }, [stableDependencies]);

  const handleViewDetails = useCallback((locationId: string) => {
    stableDependencies.handleViewDetails(locationId, stableDependencies.locations);
    handleInfoCardClose();
  }, [stableDependencies, handleInfoCardClose]);

  const handleMapIdle = useCallback((center: LatLng, zoom: number) => {
    updateCenter(center);
    updateZoom(zoom);
  }, [updateCenter, updateZoom]);

  return {
    handleLocationSelect,
    handleMarkerClick,
    handleInfoCardClose,
    handleViewDetails,
    handleMapIdle
  };
};
