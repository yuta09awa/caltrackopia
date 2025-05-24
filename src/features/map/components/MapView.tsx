
import { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "sonner";
import { Ingredient } from "@/hooks/useIngredientSearch";
import MapControls from "./MapControls";
import MapMarkers from "./MapMarkers";
import MapHeader from "./MapHeader";
import { useUserLocation } from "../hooks/useUserLocation";
import { useMapState } from "../hooks/useMapState";

// Use environment variable or fallback to a placeholder
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";

const containerStyle = {
  width: '100%',
  height: '100%'
};

interface MapViewProps {
  selectedIngredient?: Ingredient | null;
}

const MapView = ({ selectedIngredient }: MapViewProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const { userLocation, locationLoading, getUserLocation } = useUserLocation();
  const { mapState, zoomIn, zoomOut, centerToUserLocation } = useMapState(map, selectedIngredient, userLocation);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // If user location is already available, center the map on it
    if (userLocation) {
      map.setCenter(userLocation);
    }
  }, [userLocation]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  const handleRecenterToUserLocation = () => {
    if (userLocation) {
      centerToUserLocation(userLocation);
      toast.info("Map centered to your location");
    } else {
      getUserLocation();
    }
  };

  const handleMarkerClick = (markerId: string) => {
    // Find the location in the selected ingredient's locations
    if (selectedIngredient?.locations) {
      const location = selectedIngredient.locations.find(loc => loc.id === markerId);
      if (location) {
        toast.info(`Selected: ${location.name}`);
      }
    }
  };

  // Show error message if API key is invalid
  if (loadError || GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
      <div className="relative w-full h-full bg-gray-100 overflow-hidden flex items-center justify-center" ref={mapContainer}>
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Map Configuration Required</h3>
          <p className="text-gray-600 mb-4">
            To use the map feature, please set up a Google Maps API key.
          </p>
          <ol className="text-left text-sm text-gray-500 space-y-1">
            <li>1. Go to Google Cloud Console</li>
            <li>2. Enable Maps JavaScript API</li>
            <li>3. Create an API key</li>
            <li>4. Set VITE_GOOGLE_MAPS_API_KEY in your environment</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden" ref={mapContainer}>
      <MapHeader selectedIngredient={selectedIngredient || null} />

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapState.center}
          zoom={mapState.zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <MapMarkers 
            userLocation={userLocation}
            markers={mapState.markers}
            onMarkerClick={handleMarkerClick}
          />
        </GoogleMap>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p>Loading map...</p>
        </div>
      )}

      <MapControls 
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRecenter={handleRecenterToUserLocation}
        locationLoading={locationLoading}
      />
    </div>
  );
};

export default MapView;
