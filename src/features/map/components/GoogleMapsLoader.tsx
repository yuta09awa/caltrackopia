
import React, { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import MapLoadingState from './MapLoadingState';
import MapView from './MapView';
import { MapState, LatLng } from '@/features/map/hooks/useMapState';

interface GoogleMapsLoaderProps {
  apiKey: string;
  mapState: MapState;
  selectedLocationId?: string | null;
  onMarkerClick?: (locationId: string, position: { x: number; y: number }) => void;
  onLocationSelect?: (locationId: string) => void;
  height: string;
  searchQuery?: string;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMapIdle?: (center: LatLng, zoom: number) => void;
  onGoogleMapsLoad?: () => void;
  onGoogleMapsError?: (error: any) => void;
}

// Include places library to fix the Places API error
const libraries: ("places" | "marker")[] = ['places', 'marker'];

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ 
  apiKey, 
  mapState,
  selectedLocationId, 
  onMarkerClick, 
  onLocationSelect, 
  height,
  searchQuery,
  onMapLoaded,
  onMapIdle,
  onGoogleMapsLoad,
  onGoogleMapsError
}) => {
  const [mapReady, setMapReady] = useState(false);
  const [placesReady, setPlacesReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    id: 'google-map-script',
    preventGoogleFontsLoading: true,
  });

  // Handle Google Maps core loading
  useEffect(() => {
    if (!isLoaded) return;

    console.log('Google Maps script loaded, checking core APIs...');
    
    // Check if core Google Maps API is available
    if (window.google?.maps?.Map) {
      console.log('Google Maps core API is available');
      setMapReady(true);
      
      // Notify parent that core Google Maps is ready
      if (onGoogleMapsLoad) {
        console.log('Notifying parent that Google Maps core is loaded');
        onGoogleMapsLoad();
      }
    } else {
      console.error('Google Maps core API not available after script load');
      const error = new Error('Google Maps core API not available');
      setInitializationError('Google Maps core API failed to initialize');
      if (onGoogleMapsError) {
        onGoogleMapsError(error);
      }
    }
  }, [isLoaded, onGoogleMapsLoad, onGoogleMapsError]);

  // Handle Places API loading separately (with timeout and fallback)
  useEffect(() => {
    if (!mapReady) return;

    console.log('Checking Places API availability...');
    
    const checkPlacesApi = () => {
      const maxAttempts = 15; // Reduced attempts but with better fallback
      const timeoutMs = 3000; // 3 second timeout
      let attempts = 0;
      
      const checkInterval = setInterval(() => {
        attempts++;
        console.log(`Places API check attempt ${attempts}/${maxAttempts}`);
        
        if (window.google?.maps?.places?.PlacesService) {
          console.log('Places API is ready');
          setPlacesReady(true);
          clearInterval(checkInterval);
        } else if (attempts >= maxAttempts) {
          console.warn('Places API not available after maximum attempts, proceeding without it');
          // Don't treat this as an error - just proceed without Places API
          setPlacesReady(true); // Allow map to render without Places API
          clearInterval(checkInterval);
        }
      }, timeoutMs / maxAttempts);

      // Global timeout fallback
      setTimeout(() => {
        if (!placesReady) {
          console.warn('Places API timeout reached, proceeding without Places API');
          clearInterval(checkInterval);
          setPlacesReady(true); // Allow map to render
        }
      }, timeoutMs);
    };

    checkPlacesApi();
  }, [mapReady, placesReady]);

  // Handle load errors
  useEffect(() => {
    if (loadError) {
      console.error('Google Maps script load error:', loadError);
      if (onGoogleMapsError) {
        onGoogleMapsError(loadError);
      }
    }
  }, [loadError, onGoogleMapsError]);

  console.log('GoogleMapsLoader state:', { 
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
    isLoaded, 
    mapReady,
    placesReady,
    loadError: loadError?.message,
    initializationError,
    markersCount: mapState.markers.length,
    searchQuery,
    googleMapsAvailable: typeof window !== 'undefined' && 'google' in window,
    placesAvailable: typeof window !== 'undefined' && window.google?.maps?.places
  });

  // Show error if Google Maps failed to load
  if (loadError) {
    console.error('Google Maps load error details:', {
      message: loadError.message,
      stack: loadError.stack,
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
      currentDomain: window.location.hostname,
      fullUrl: window.location.href
    });
    
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={`Google Maps Error: ${loadError.message}. Check console for details.`} 
      />
    );
  }

  // Show error if initialization failed
  if (initializationError) {
    return (
      <MapLoadingState 
        height={height} 
        type="error" 
        errorMessage={initializationError} 
      />
    );
  }

  // Wait for script to load
  if (!isLoaded) {
    console.log('Waiting for Google Maps script to load...');
    return <MapLoadingState height={height} type="initializing" />;
  }

  // Wait for core Maps API to be ready
  if (!mapReady) {
    console.log('Waiting for Google Maps core API to be ready...');
    return <MapLoadingState height={height} type="initializing" />;
  }

  // Wait for Places API (with reasonable timeout)
  if (!placesReady) {
    console.log('Waiting for Places API to be ready...');
    return <MapLoadingState height={height} type="initializing" />;
  }

  console.log('Google Maps fully loaded, rendering MapView with markers:', mapState.markers.length);

  return (
    <MapView
      mapState={mapState}
      selectedLocationId={selectedLocationId}
      onMarkerClick={onMarkerClick}
      onLocationSelect={onLocationSelect}
      searchQuery={searchQuery}
      onMapLoaded={onMapLoaded}
      onMapIdle={onMapIdle}
    />
  );
};

export default GoogleMapsLoader;
