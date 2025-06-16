
import React from 'react';
import { useLoadScript } from '@react-google-maps/api';
import MapLoadingState from './MapLoadingState';

interface MapApiLoaderProps {
  apiKey: string;
  children: (isReady: boolean) => React.ReactNode;
  height: string;
}

const libraries: ("places" | "marker")[] = ['places', 'marker'];

const MapApiLoader: React.FC<MapApiLoaderProps> = ({ apiKey, children, height }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    id: 'google-map-script',
    preventGoogleFontsLoading: true,
  });

  // Handle loading error
  if (loadError) {
    console.error('Google Maps load error:', loadError);
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={`Google Maps Error: ${loadError.message}`} 
      />
    );
  }

  // Show loading state
  if (!isLoaded) {
    return <MapLoadingState height={height} type="loading" errorMessage="Loading Google Maps..." />;
  }

  // Maps API is ready
  return <>{children(true)}</>;
};

export default MapApiLoader;
