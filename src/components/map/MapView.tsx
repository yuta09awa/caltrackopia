import { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "sonner";
import { Ingredient } from "@/hooks/useIngredientSearch";
import MapControls from "@/components/map/MapControls";
import MapMarkers from "@/components/map/MapMarkers";
import MapHeader from "@/components/map/MapHeader";
import { useUserLocation } from "@/components/map/hooks/useUserLocation";
import { useMapState } from "@/components/map/hooks/useMapState";

// The API key should ideally be in environment variables for production
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

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

  const { isLoaded } = useJsApiLoader({
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
