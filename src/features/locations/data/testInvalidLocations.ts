
import { Location } from "../types";

// Test locations with various data issues to test validation
export const invalidTestLocations: Partial<Location>[] = [
  // Missing coordinates
  {
    id: "invalid-1",
    name: "Location Without Coordinates",
    type: "Restaurant",
    rating: 4.5,
    distance: "1.0 mi",
    address: "123 Test St",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Vegan"],
    cuisine: "Italian",
    images: ["/placeholder.svg"],
    // coordinates missing
  },
  
  // Invalid coordinates (null)
  {
    id: "invalid-2", 
    name: "Location With Null Coordinates",
    type: "Grocery",
    rating: 3.8,
    distance: "0.5 mi",
    address: "456 Test Ave",
    openNow: false,
    price: "$",
    dietaryOptions: ["Organic"],
    cuisine: "Various",
    images: ["/placeholder.svg"],
    coordinates: null as any,
  },
  
  // Invalid coordinates (NaN)
  {
    id: "invalid-3",
    name: "Location With NaN Coordinates", 
    type: "Restaurant",
    rating: 4.2,
    distance: "2.0 mi",
    address: "789 Test Blvd",
    openNow: true,
    price: "$$$",
    dietaryOptions: ["Gluten-Free"],
    cuisine: "Asian",
    images: ["/placeholder.svg"],
    coordinates: { lat: NaN, lng: NaN },
  },
  
  // Coordinates at 0,0 (edge case)
  {
    id: "invalid-4",
    name: "Location At Zero Coordinates",
    type: "Grocery", 
    subType: "Convenience Store",
    rating: 3.0,
    distance: "0.1 mi",
    address: "000 Zero Point",
    openNow: true,
    price: "$",
    dietaryOptions: ["Quick Meals"],
    cuisine: "Various",
    images: ["/placeholder.svg"],
    coordinates: { lat: 0, lng: 0 },
  },
  
  // Missing required fields
  {
    id: "invalid-5",
    // name missing
    type: "Restaurant",
    rating: 4.0,
    distance: "1.5 mi",
    openNow: true,
    price: "$$",
    dietaryOptions: ["Vegetarian"],
    cuisine: "Mediterranean",
    images: ["/placeholder.svg"],
    coordinates: { lat: 37.7749, lng: -122.4194 },
  } as any,
];

// Function to add invalid test data (for development testing)
export function addInvalidTestData(): boolean {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Adding invalid test locations for validation testing');
    return true;
  }
  return false;
}
