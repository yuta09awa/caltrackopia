
import { useMemo } from 'react';

export const useMapOptions = () => {
  // Memoize map styles to prevent recreation on every render
  const mapStyles = useMemo(() => [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.attraction",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.government",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.medical",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.park",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.place_of_worship",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.school",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.sports_complex",
      stylers: [{ visibility: "off" }]
    }
  ], []);

  // Memoize Google Maps options to prevent recreation on every render
  const mapOptions: google.maps.MapOptions = useMemo(() => ({
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    draggable: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    clickableIcons: false,
    styles: mapStyles,
  }), [mapStyles]);

  return { mapOptions };
};
