
import { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "sonner";
import { Ingredient } from "@/hooks/useIngredientSearch";
import MapControls from "./MapControls";
import MapMarkers from "./MapMarkers";
import { useUserLocation } from "./hooks/useUserLocation";

// The API key should ideally be in environment variables for production
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 37.7749, // San Francisco coordinates as default
  lng: -122.4194
};

interface MapViewProps {
  selectedIngredient?: Ingredient | null;
}

const MapView = ({ selectedIngredient }: MapViewProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(14);
  const [markers, setMarkers] = useState<Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
  }>>([]);
  const [center, setCenter] = useState(defaultCenter);
  const mapContainer = useRef<HTMLDivElement>(null);
  const { userLocation, locationLoading, getUserLocation } = useUserLocation();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  // Update markers when selectedIngredient changes
  useEffect(() => {
    if (selectedIngredient?.locations?.length > 0) {
      const newMarkers = selectedIngredient.locations.map(location => ({
        id: location.id,
        position: { lat: location.lat, lng: location.lng },
        title: location.name
      }));
      
      setMarkers(newMarkers);
      
      // Center the map on the first location
      if (newMarkers.length > 0 && map) {
        setCenter(newMarkers[0].position);
        map.setCenter(newMarkers[0].position);
        
        // Adjust zoom level if there are multiple markers
        if (newMarkers.length > 1 && map) {
          const bounds = new google.maps.LatLngBounds();
          newMarkers.forEach(marker => {
            bounds.extend(marker.position);
          });
          map.fitBounds(bounds);
        }
      }
    } else {
      // If no ingredient is selected, show user location if available
      if (userLocation && map) {
        setMarkers([]);
        setCenter(userLocation);
        map.setCenter(userLocation);
        setZoom(14);
        map.setZoom(14);
      } else {
        // Fall back to default center if no user location
        setMarkers([]);
        setCenter(defaultCenter);
        if (map) {
          map.setCenter(defaultCenter);
          setZoom(14);
          map.setZoom(14);
        }
      }
    }
  }, [selectedIngredient, map, userLocation]);

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
    if (map) {
      const currentZoom = map.getZoom() || zoom;
      map.setZoom(currentZoom + 1);
      setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || zoom;
      if (currentZoom > 1) {
        map.setZoom(currentZoom - 1);
        setZoom(currentZoom - 1);
      }
    }
  };

  const handleRecenterToUserLocation = () => {
    if (userLocation && map) {
      map.setCenter(userLocation);
      setZoom(14);
      map.setZoom(14);
      toast.info("Map centered to your location");
    } else {
      getUserLocation();
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden" ref={mapContainer}>
      {selectedIngredient && (
        <div className="absolute top-4 left-0 right-0 mx-auto w-full max-w-sm px-4 z-10">
          <div className="bg-white rounded-md shadow-md p-3">
            <h3 className="font-medium">{selectedIngredient.name}</h3>
            <p className="text-xs text-muted-foreground">
              {selectedIngredient.locations ? 
                `Available at ${selectedIngredient.locations.length} location${selectedIngredient.locations.length !== 1 ? 's' : ''}` : 
                'No location data available'}
            </p>
          </div>
        </div>
      )}

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
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
            markers={markers}
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
