
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

// Enhanced mock data with realistic locations across different regions
export const mockLocations: Location[] = [
  // San Francisco Bay Area locations
  {
    id: "1",
    name: "Rainbow Grocery Cooperative",
    type: "Grocery",
    subType: "Health Food Store",
    rating: 4.8,
    distance: "0.3 mi",
    address: "1745 Folsom St, San Francisco, CA 94103",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Organic", "Vegan", "Gluten-Free"],
    cuisine: "Various",
    coordinates: { lat: 37.7697, lng: -122.4135 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: "2", 
    name: "Greens Restaurant",
    type: "Restaurant",
    rating: 4.6,
    distance: "0.5 mi",
    address: "2 Marina Blvd, San Francisco, CA 94123",
    openNow: true,
    price: "$$$",
    dietaryOptions: ["Vegetarian", "Vegan Options"],
    cuisine: "Fine Dining",
    coordinates: { lat: 37.8056, lng: -122.4364 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: "3",
    name: "Ferry Plaza Farmers Market",
    type: "Grocery",
    subType: "Farmers Market", 
    rating: 4.9,
    distance: "0.8 mi",
    address: "Ferry Building Marketplace, San Francisco, CA 94111",
    openNow: false,
    price: "$$",
    dietaryOptions: ["Organic", "Local", "Seasonal"],
    cuisine: "Various",
    coordinates: { lat: 37.7955, lng: -122.3938 },
    images: ["/placeholder.svg", "/placeholder.svg"],
    seasonality: "Saturdays & Tuesdays",
    vendorCount: 45,
    schedule: "Saturday: 8AM - 2PM, Tuesday: 10AM - 2PM"
  },

  // New York locations
  {
    id: "4",
    name: "Whole Foods Market Union Square",
    type: "Grocery", 
    subType: "Supermarket",
    rating: 4.4,
    distance: "0.2 mi",
    address: "4 Union Square S, New York, NY 10003",
    openNow: true,
    price: "$$$",
    dietaryOptions: ["Organic", "Vegan", "Gluten-Free"],
    cuisine: "Various",
    coordinates: { lat: 40.7359, lng: -73.9906 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: "5",
    name: "ABC Kitchen", 
    type: "Restaurant",
    rating: 4.7,
    distance: "0.4 mi",
    address: "35 E 18th St, New York, NY 10003",
    openNow: true,
    price: "$$$",
    dietaryOptions: ["Farm-to-Table", "Organic"],
    cuisine: "American",
    coordinates: { lat: 40.7370, lng: -73.9891 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  // Chicago locations
  {
    id: "6",
    name: "Green City Market",
    type: "Grocery",
    subType: "Farmers Market",
    rating: 4.8,
    distance: "1.2 mi", 
    address: "1750 N Clark St, Chicago, IL 60614",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Organic", "Local", "Seasonal"],
    cuisine: "Various",
    coordinates: { lat: 41.9128, lng: -87.6368 },
    images: ["/placeholder.svg", "/placeholder.svg"],
    seasonality: "Year-round, Wednesdays & Saturdays",
    vendorCount: 30,
    schedule: "Wednesday & Saturday: 7AM - 1PM"
  },
  {
    id: "7",
    name: "Girl & the Goat",
    type: "Restaurant", 
    rating: 4.6,
    distance: "0.9 mi",
    address: "809 W Randolph St, Chicago, IL 60607",
    openNow: false,
    price: "$$$",
    dietaryOptions: ["Bold Flavors", "Meat-Forward"],
    cuisine: "Contemporary American",
    coordinates: { lat: 41.8845, lng: -87.6474 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  // Los Angeles locations
  {
    id: "8",
    name: "Erewhon Market",
    type: "Grocery",
    subType: "Health Food Store",
    rating: 4.5,
    distance: "0.6 mi",
    address: "7660 Beverly Blvd, Los Angeles, CA 90036", 
    openNow: true,
    price: "$$$",
    dietaryOptions: ["Organic", "Superfood", "Cold-Pressed"],
    cuisine: "Various",
    coordinates: { lat: 34.0759, lng: -118.3617 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: "9",
    name: "Guelaguetza",
    type: "Restaurant",
    rating: 4.7,
    distance: "2.1 mi",
    address: "3014 W Olympic Blvd, Los Angeles, CA 90006",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Authentic", "Traditional"],
    cuisine: "Oaxacan Mexican",
    coordinates: { lat: 34.0180, lng: -118.2965 },
    images: ["/placeholder.svg", "/placeholder.svg"],
  },

  // Seattle locations
  {
    id: "10",
    name: "Pike Place Market",
    type: "Grocery",
    subType: "Public Market",
    rating: 4.9,
    distance: "0.1 mi",
    address: "85 Pike St, Seattle, WA 98101",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Fresh", "Local", "Artisanal"],
    cuisine: "Various",
    coordinates: { lat: 47.6089, lng: -122.3403 },
    images: ["/placeholder.svg", "/placeholder.svg"],
    vendorCount: 85,
    schedule: "Daily: 9AM - 6PM"
  },
  {
    id: "11",
    name: "Canlis",
    type: "Restaurant",
    rating: 4.8,
    distance: "3.2 mi", 
    address: "2576 Aurora Ave N, Seattle, WA 98103",
    openNow: false,
    price: "$$$$",
    dietaryOptions: ["Fine Dining", "Pacific Northwest"],
    cuisine: "Contemporary American",
    coordinates: { lat: 47.6417, lng: -122.3471 },
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
