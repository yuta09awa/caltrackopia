
import { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Ingredient } from "@/hooks/useIngredientSearch";
import { Location } from "@/models/Location";
import MapControls from "./MapControls";
import MapMarkers from "./MapMarkers";
import MapHeader from "./MapHeader";
import MapErrorState from "./MapErrorState";
import MapMarkerInfoCard from "@/components/map/MapMarkerInfoCard";
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
  onLocationSelect?: (locationId: string) => void;
}

const MapView = ({ selectedIngredient, onLocationSelect }: MapViewProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [infoCardPosition, setInfoCardPosition] = useState<{ x: number; y: number } | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
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

  const handleMarkerClick = (markerId: string, event?: google.maps.MapMouseEvent) => {
    if (selectedIngredient?.locations) {
      const location = selectedIngredient.locations.find(loc => loc.id === markerId);
      if (location) {
        setSelectedMarkerId(markerId);
        
        // Calculate position for info card using domEvent for pixel coordinates
        if (event?.domEvent && mapContainer.current) {
          const rect = mapContainer.current.getBoundingClientRect();
          const clientX = (event.domEvent as MouseEvent).clientX;
          const clientY = (event.domEvent as MouseEvent).clientY;
          setInfoCardPosition({
            x: clientX - rect.left - 140, // Center the card on the marker
            y: clientY - rect.top - 180   // Position above the marker
          });
        }
        
        // Notify parent component about selection
        if (onLocationSelect) {
          onLocationSelect(markerId);
        }
      }
    }
  };

  const handleInfoCardClose = () => {
    setSelectedMarkerId(null);
    setInfoCardPosition(null);
  };

  const handleViewDetails = () => {
    if (selectedMarkerId && selectedIngredient?.locations) {
      const location = selectedIngredient.locations.find(loc => loc.id === selectedMarkerId);
      if (location) {
        // Create a full Location object with default values for missing properties
        const fullLocation: Location = {
          id: location.id,
          name: location.name,
          type: "Restaurant", // Default type
          rating: 4.0, // Default rating
          distance: typeof location.distance === 'number' ? `${location.distance}mi` : location.distance || "0.5mi",
          address: location.address,
          openNow: true, // Default to open
          hours: [],
          price: (location.price as "$" | "$$" | "$$$" | "$$$$") || "$$",
          dietaryOptions: [],
          cuisine: "Various",
          images: [],
          coordinates: { lat: location.lat, lng: location.lng }
        };

        // Determine the correct route based on location type
        if (fullLocation.type.toLowerCase() === "grocery") {
          navigate(`/markets/${location.id}`);
        } else {
          navigate(`/location/${location.id}`);
        }
      }
    }
  };

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

  // Show error message if API key is invalid
  if (loadError || GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
    return <MapErrorState />;
  }

  // Create a full Location object for the selected location to pass to MapMarkerInfoCard
  const selectedLocation = selectedMarkerId && selectedIngredient?.locations 
    ? (() => {
        const location = selectedIngredient.locations.find(loc => loc.id === selectedMarkerId);
        if (!location) return null;
        
        // Convert to full Location interface with defaults
        return {
          id: location.id,
          name: location.name,
          type: "Restaurant" as const,
          rating: 4.0,
          distance: typeof location.distance === 'number' ? `${location.distance}mi` : location.distance || "0.5mi",
          address: location.address,
          openNow: true,
          hours: [],
          price: (location.price as "$" | "$$" | "$$$" | "$$$$") || "$$",
          dietaryOptions: [],
          cuisine: "Various",
          images: [],
          coordinates: { lat: location.lat, lng: location.lng }
        } as Location;
      })()
    : null;

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
          onClick={handleInfoCardClose}
        >
          <MapMarkers 
            userLocation={userLocation}
            markers={mapState.markers.map(marker => ({
              ...marker,
              isSelected: marker.id === selectedMarkerId
            }))}
            onMarkerClick={handleMarkerClick}
          />
        </GoogleMap>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p>Loading map...</p>
        </div>
      )}

      {/* Info Card Overlay */}
      {selectedLocation && infoCardPosition && (
        <div
          style={{
            position: 'absolute',
            left: infoCardPosition.x,
            top: infoCardPosition.y,
            zIndex: 1000
          }}
        >
          <MapMarkerInfoCard
            location={selectedLocation}
            onViewDetails={handleViewDetails}
            onClose={handleInfoCardClose}
          />
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
