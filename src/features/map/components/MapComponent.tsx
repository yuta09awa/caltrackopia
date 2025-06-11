
import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import MapMarkers from './MapMarkers';
import MapLoadingState from './MapLoadingState';
import { useMapController } from '../hooks/useMapController';
import { useMapOptions } from '../hooks/useMapOptions';

interface MapComponentProps {
  height: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ height }) => {
  const {
    center,
    zoom,
    markers,
    selectedPlace,
    hoveredLocationId,
    apiKey,
    isLoaded,
    loadError,
    handleMarkerClick,
    handleMapClick,
    onMapLoad,
    onMapIdle
  } = useMapController();

  const { mapOptions } = useMapOptions();

  console.log('🏗️ MapComponent render:', { 
    apiKey: apiKey ? 'present' : 'missing', 
    isLoaded,
    loadError,
    markersCount: markers.length
  });

  // Show loading while API key loads
  if (!apiKey && !loadError) {
    console.log('⏳ MapComponent: Loading API key');
    return <MapLoadingState height={height} type="loading" errorMessage="Loading API key..." />;
  }

  // Show error if API key failed
  if (loadError) {
    console.error('💥 MapComponent: Error:', loadError);
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={loadError} 
      />
    );
  }

  // Wait for Google Maps to load
  if (!isLoaded) {
    console.log('⏳ MapComponent: Waiting for Google Maps to load...');
    return <MapLoadingState height={height} type="loading" errorMessage="Loading Google Maps..." />;
  }

  console.log('🚀 MapComponent: Ready to render map');

  const handleCameraChanged = () => {
    // Debounced camera change handler would go here
    // For now, we'll use the existing onMapIdle logic
  };

  return (
    <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
      <GoogleMap
        onLoad={onMapLoad}
        zoom={zoom}
        center={center}
        onCenterChanged={handleCameraChanged}
        onZoomChanged={handleCameraChanged}
        onIdle={() => {
          const map = onMapLoad as any; // Type assertion for now
          if (map && map.current) {
            const newCenter = map.current.getCenter();
            const newZoom = map.current.getZoom();
            if (newCenter && newZoom !== undefined) {
              onMapIdle(
                { lat: newCenter.lat(), lng: newCenter.lng() },
                newZoom
              );
            }
          }
        }}
        mapContainerClassName="w-full h-full"
        options={mapOptions}
        onClick={handleMapClick}
      >
        <MapMarkers 
          markers={markers}
          selectedLocationId={selectedPlace?.id || null}
          hoveredLocationId={hoveredLocationId}
          onMarkerClick={handleMarkerClick}
        />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
