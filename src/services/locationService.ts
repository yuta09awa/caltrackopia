
import { Location } from "@/models/Location";
import { apiService } from "./api/apiService";

export class LocationService {
  /**
   * Fetch all locations from the API
   */
  async getLocations(): Promise<Location[]> {
    try {
      return await apiService.get<Location[]>('/locations');
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Return mock data as fallback for MVP
      return this.getMockLocations();
    }
  }

  /**
   * Fetch locations by type
   */
  async getLocationsByType(type: string): Promise<Location[]> {
    try {
      return await apiService.get<Location[]>(`/locations?type=${type}`);
    } catch (error) {
      console.error('Error fetching locations by type:', error);
      // Return filtered mock data as fallback
      const mockLocations = this.getMockLocations();
      return mockLocations.filter(location => 
        type === 'all' || location.type.toLowerCase() === type.toLowerCase()
      );
    }
  }

  /**
   * Search locations by name or cuisine
   */
  async searchLocations(query: string): Promise<Location[]> {
    try {
      return await apiService.get<Location[]>(`/locations/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Error searching locations:', error);
      // Return filtered mock data as fallback
      const mockLocations = this.getMockLocations();
      return mockLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.cuisine.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  /**
   * Mock data for development/fallback
   */
  private getMockLocations(): Location[] {
    return [
      {
        id: "1",
        name: "Green Valley Market",
        type: "Grocery",
        subType: "Health Food Store",
        rating: 4.5,
        distance: "0.3 miles",
        address: "123 Main St, San Francisco, CA",
        openNow: true,
        hours: [
          { day: "Monday", hours: "8:00 AM - 9:00 PM" },
          { day: "Tuesday", hours: "8:00 AM - 9:00 PM" }
        ],
        price: "$$",
        dietaryOptions: ["Organic", "Vegan", "Gluten-Free"],
        cuisine: "Health Food",
        images: ["/placeholder.svg"],
        coordinates: { lat: 37.7749, lng: -122.4194 }
      },
      {
        id: "2",
        name: "Farm Fresh Bistro",
        type: "Restaurant",
        rating: 4.8,
        distance: "0.5 miles",
        address: "456 Oak Ave, San Francisco, CA",
        openNow: true,
        price: "$$$",
        dietaryOptions: ["Farm-to-Table", "Vegetarian"],
        cuisine: "American",
        images: ["/placeholder.svg"],
        coordinates: { lat: 37.7849, lng: -122.4094 }
      }
    ];
  }
}

// Export singleton instance
export const locationService = new LocationService();
