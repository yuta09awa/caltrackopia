
import { Location } from "@/models/Location";
import { apiService } from "./api/apiService";
import { mockLocations } from "@/features/locations/data/mockLocations";

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
   * Get a single location by ID
   */
  async getLocationById(id: string): Promise<Location | null> {
    try {
      return await apiService.get<Location>(`/locations/${id}`);
    } catch (error) {
      console.error('Error fetching location by ID:', error);
      // Return mock data as fallback
      const mockLocations = this.getMockLocations();
      return mockLocations.find(location => location.id === id) || null;
    }
  }

  /**
   * Mock data for development/fallback - now uses consolidated data
   */
  private getMockLocations(): Location[] {
    return mockLocations;
  }
}

// Export singleton instance
export const locationService = new LocationService();
