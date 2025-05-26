
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { validateSpoofedLocation } from "@/features/locations/utils/validationUtils";

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const getUserLocation = () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Validate the user location
          const validatedLocation = validateSpoofedLocation(userPos);
          setUserLocation(validatedLocation);
          setLocationLoading(false);
          
          if (validatedLocation) {
            toast.success("Using your current location");
          } else {
            toast.warning("Invalid location coordinates", {
              description: "Using default location instead"
            });
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
          setLocationLoading(false);
          toast.error("Couldn't access your location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setLocationLoading(false);
    }
  };

  // Get user's location on first load
  useEffect(() => {
    getUserLocation();
  }, []);

  return { userLocation, locationLoading, getUserLocation };
};
