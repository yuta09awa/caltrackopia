import { Location } from "../types";

// Location spoofing configuration for testing different regions
export interface LocationSpoof {
  region: string;
  center: { lat: number; lng: number };
  radius: number; // in miles
}

export const LOCATION_SPOOFS: Record<string, LocationSpoof> = {
  sanfrancisco: {
    region: "San Francisco, CA",
    center: { lat: 37.7749, lng: -122.4194 },
    radius: 10
  },
  newyork: {
    region: "New York, NY", 
    center: { lat: 40.7128, lng: -74.0060 },
    radius: 15
  },
  chicago: {
    region: "Chicago, IL",
    center: { lat: 41.8781, lng: -87.6298 },
    radius: 12
  },
  losangeles: {
    region: "Los Angeles, CA",
    center: { lat: 34.0522, lng: -118.2437 },
    radius: 20
  },
  seattle: {
    region: "Seattle, WA",
    center: { lat: 47.6062, lng: -122.3321 },
    radius: 10
  }
};

// Enhanced mock data with realistic chain stores and local favorites
export const mockLocations: Location[] = [
  // Whole Foods locations
  {
    id: "wf1",
    name: "Whole Foods Market",
    type: "Grocery",
    subType: "Supermarket",
    rating: 4.3,
    distance: "0.4 mi",
    address: "4 Union Square S, New York, NY 10003",
    openNow: true,
    price: "$$$",
    dietaryOptions: ["Organic", "Vegan", "Gluten-Free"],
    cuisine: "Various",
    coordinates: { lat: 40.7359, lng: -73.9906 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: "wf2",
    name: "Whole Foods Market",
    type: "Grocery",
    subType: "Supermarket",
    rating: 4.2,
    distance: "0.8 mi",
    address: "270 Greenwich St, New York, NY 10007",
    openNow: true,
    price: "$$$",
    dietaryOptions: ["Organic", "Vegan", "Gluten-Free"],
    cuisine: "Various",
    coordinates: { lat: 40.7205, lng: -74.0134 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  // Trader Joe's locations
  {
    id: "tj1",
    name: "Trader Joe's",
    type: "Grocery",
    subType: "Supermarket",
    rating: 4.5,
    distance: "0.6 mi",
    address: "142 E 14th St, New York, NY 10003",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Organic", "Value", "Unique Items"],
    cuisine: "Various",
    coordinates: { lat: 40.7328, lng: -73.9888 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  // Target locations
  {
    id: "target1",
    name: "Target",
    type: "Grocery",
    subType: "Department Store",
    rating: 4.1,
    distance: "1.2 mi",
    address: "255 Greenwich St, New York, NY 10007",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Groceries", "Household"],
    cuisine: "Various",
    coordinates: { lat: 40.7133, lng: -74.0103 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  // CVS Pharmacy locations
  {
    id: "cvs1",
    name: "CVS Pharmacy",
    type: "Grocery",
    subType: "Pharmacy",
    rating: 3.8,
    distance: "0.3 mi",
    address: "144 4th Ave, New York, NY 10003",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Convenience", "Health"],
    cuisine: "Various",
    coordinates: { lat: 40.7330, lng: -73.9898 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  // McDonald's locations
  {
    id: "mcd1",
    name: "McDonald's",
    type: "Restaurant",
    rating: 3.5,
    distance: "0.2 mi",
    address: "160 Broadway, New York, NY 10038",
    openNow: true,
    price: "$",
    dietaryOptions: ["Fast Food", "Drive-Thru"],
    cuisine: "American",
    coordinates: { lat: 40.7092, lng: -74.0106 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  // Starbucks locations
  {
    id: "sbux1",
    name: "Starbucks",
    type: "Restaurant",
    rating: 4.2,
    distance: "0.1 mi",
    address: "4 Park Ave, New York, NY 10016",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Coffee", "Light Meals"],
    cuisine: "Cafe",
    coordinates: { lat: 40.7505, lng: -73.9806 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  // Chipotle locations
  {
    id: "chipotle1",
    name: "Chipotle Mexican Grill",
    type: "Restaurant",
    rating: 4.0,
    distance: "0.5 mi",
    address: "150 E 14th St, New York, NY 10003",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Customizable", "Fresh"],
    cuisine: "Mexican",
    coordinates: { lat: 40.7331, lng: -73.9873 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  // Local favorites
  {
    id: "local1",
    name: "Joe's Pizza",
    type: "Restaurant",
    rating: 4.7,
    distance: "0.3 mi",
    address: "7 Carmine St, New York, NY 10014",
    openNow: true,
    price: "$",
    dietaryOptions: ["Classic NY Pizza"],
    cuisine: "Italian",
    coordinates: { lat: 40.7306, lng: -74.0029 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  {
    id: "local2",
    name: "Shake Shack",
    type: "Restaurant", 
    rating: 4.4,
    distance: "0.7 mi",
    address: "23 23rd St, New York, NY 10010",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Burgers", "Shakes"],
    cuisine: "American",
    coordinates: { lat: 40.7420, lng: -73.9898 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  {
    id: "local3",
    name: "Sweetgreen",
    type: "Restaurant",
    rating: 4.3,
    distance: "0.4 mi",
    address: "1164 Broadway, New York, NY 10001",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Healthy", "Salads", "Local"],
    cuisine: "Healthy",
    coordinates: { lat: 40.7447, lng: -73.9879 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  // Additional grocery stores
  {
    id: "gourmet1",
    name: "Gourmet Garage",
    type: "Grocery",
    subType: "Gourmet Market",
    rating: 4.1,
    distance: "0.9 mi",
    address: "489 Broome St, New York, NY 10013",
    openNow: true,
    price: "$$$",
    dietaryOptions: ["Gourmet", "Fresh", "Local"],
    cuisine: "Various",
    coordinates: { lat: 40.7208, lng: -74.0007 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  }
];

// Location spoofing utilities
export function spoofUserLocation(spoofKey: keyof typeof LOCATION_SPOOFS): { lat: number; lng: number } {
  const spoof = LOCATION_SPOOFS[spoofKey];
  if (!spoof) {
    console.warn(`Unknown spoof location: ${spoofKey}. Defaulting to San Francisco.`);
    return LOCATION_SPOOFS.sanfrancisco.center;
  }
  
  // Add slight randomization within the region for realistic testing
  const randomOffset = () => (Math.random() - 0.5) * 0.01; // ~0.5 mile variance
  
  return {
    lat: spoof.center.lat + randomOffset(),
    lng: spoof.center.lng + randomOffset()
  };
}

export function getLocationsByRegion(spoofKey: keyof typeof LOCATION_SPOOFS): Location[] {
  const spoof = LOCATION_SPOOFS[spoofKey];
  if (!spoof) return mockLocations;
  
  // Filter locations within the specified region's radius
  return mockLocations.filter(location => {
    if (!location.coordinates) return false;
    
    const distance = calculateDistance(
      spoof.center.lat, 
      spoof.center.lng,
      location.coordinates.lat,
      location.coordinates.lng
    );
    
    return distance <= spoof.radius;
  });
}

// Haversine formula for calculating distance between coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
