
import { useCallback } from 'react';
import { LatLng } from '@/features/map/hooks/useMapState';

interface UseMapScreenHandlersProps {
  updateCenter: (center: LatLng) => void;
  updateZoom: (zoom: number) => void;
  handleLocationSelect: (locationId: string, locations: any[], selectLocation: (id: string | null) => void) => void;
  handleMarkerClick: (locationId: string, position: { x: number; y: number }, locations: any[], selectLocation: (id: string | null) => void) => void;
  handleInfoCardClose: (selectLocation: (id: string | null) => void) => void;
  handleViewDetails: (locationId: string, locations: any[]) => void;
  stableDependencies: any;
}

export const useMapScreenHandlers = ({
  updateCenter,
  updateZoom,
  handleLocationSelect: baseHandleLocationSelect,
  handleMarkerClick: baseHandleMarkerClick,
  handleInfoCardClose: baseHandleInfoCardClose,
  handleViewDetails: baseHandleViewDetails,
  stableDependencies
}: UseMapScreenHandlersProps) => {

  const handleLocationSelect = useCallback((locationId: string) => {
    baseHandleLocationSelect(locationId, stableDependencies.locations, stableDependencies.selectLocation);
  }, [baseHandleLocationSelect, stableDependencies]);

  const handleMarkerClick = useCallback((locationId: string, position: { x: number; y: number }) => {
    baseHandleMarkerClick(locationId, position, stableDependencies.locations, stableDependencies.selectLocation);
  }, [baseHandleMarkerClick, stableDependencies]);

  const handleInfoCardClose = useCallback(() => {
    baseHandleInfoCardClose(stableDependencies.selectLocation);
  }, [baseHandleInfoCardClose, stableDependencies]);

  const handleViewDetails = useCallback((locationId: string) => {
    baseHandleViewDetails(locationId, stableDependencies.locations);
    handleInfoCardClose();
  }, [baseHandleViewDetails, stableDependencies, handleInfoCardClose]);

  const handleMapIdle = useCallback((center: LatLng, zoom: number) => {
    updateCenter(center);
    updateZoom(zoom);
    console.log('Map idle:', { center, zoom });
  }, [updateCenter, updateZoom]);

  return {
    handleLocationSelect,
    handleMarkerClick,
    handleInfoCardClose,
    handleViewDetails,
    handleMapIdle
  };
};
