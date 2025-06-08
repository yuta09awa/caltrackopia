
export const getDirectionsUrl = (lat: number, lng: number): string => {
  const destination = `${lat},${lng}`;
  
  // Detect platform
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /ipad|iphone|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  
  if (isIOS) {
    // Try Apple Maps first, fallback to Google Maps
    const appleMapsUrl = `maps://maps.google.com/maps?daddr=${destination}&amp;ll=`;
    const googleMapsUrl = `https://maps.google.com/maps?daddr=${destination}`;
    
    // Check if Apple Maps is available
    try {
      // Use Apple Maps if available
      return appleMapsUrl;
    } catch {
      return googleMapsUrl;
    }
  } else if (isAndroid) {
    // Try Google Maps navigation intent, fallback to web
    const navigationUrl = `google.navigation:q=${destination}`;
    const webUrl = `https://maps.google.com/maps?daddr=${destination}`;
    
    try {
      return navigationUrl;
    } catch {
      return webUrl;
    }
  } else {
    // Desktop - use Google Maps web
    return `https://maps.google.com/maps?daddr=${destination}`;
  }
};

export const openDirections = (lat: number, lng: number): void => {
  const url = getDirectionsUrl(lat, lng);
  
  // For mobile app schemes, use location.href
  if (url.startsWith('maps://') || url.startsWith('google.navigation:')) {
    try {
      window.location.href = url;
    } catch {
      // Fallback to Google Maps web
      window.open(`https://maps.google.com/maps?daddr=${lat},${lng}`, '_blank');
    }
  } else {
    // For web URLs, open in new tab
    window.open(url, '_blank');
  }
};
