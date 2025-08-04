import { Location } from '@/features/locations/types';
import { locationService } from './locationService';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  dietary_restrictions: string[];
  nutrition_goals: string[];
}

interface TopRatedFilter {
  center: { lat: number; lng: number };
  radiusKm?: number;
  userProfile?: UserProfile;
  limit?: number;
}

class TopRatedLocationService {
  private readonly DEFAULT_RADIUS_KM = 10;
  private readonly DEFAULT_LIMIT = 20;

  async getTopRatedLocations(filter: TopRatedFilter): Promise<Location[]> {
    try {
      // Get all locations first
      const allLocations = await locationService.getLocations();
      
      // Filter by distance
      const nearbyLocations = this.filterByDistance(
        allLocations, 
        filter.center, 
        filter.radiusKm || this.DEFAULT_RADIUS_KM
      );

      // Filter by user profile if provided
      let filteredLocations = nearbyLocations;
      if (filter.userProfile) {
        filteredLocations = this.filterByUserProfile(nearbyLocations, filter.userProfile);
      }

      // Sort by composite rating
      const sortedLocations = this.sortByCompositeRating(filteredLocations);

      // Apply limit
      return sortedLocations.slice(0, filter.limit || this.DEFAULT_LIMIT);
    } catch (error) {
      console.error('Error getting top rated locations:', error);
      return [];
    }
  }

  private filterByDistance(
    locations: Location[], 
    center: { lat: number; lng: number }, 
    radiusKm: number
  ): Location[] {
    return locations.filter(location => {
      if (!location.coordinates) return false;
      
      const distance = this.calculateDistance(
        center.lat,
        center.lng,
        location.coordinates.lat,
        location.coordinates.lng
      );
      
      // Update the distance in the location object
      location.distance = `${distance.toFixed(1)} mi`;
      
      return distance <= radiusKm * 0.621371; // Convert km to miles
    });
  }

  private filterByUserProfile(locations: Location[], profile: UserProfile): Location[] {
    return locations.filter(location => {
      // Filter based on dietary restrictions
      if (profile.dietary_restrictions?.length > 0) {
        const hasDietaryMatch = profile.dietary_restrictions.some(restriction => {
          // Check if location supports the dietary restriction
          return location.dietaryOptions?.some(option => 
            option.toLowerCase().includes(restriction.toLowerCase()) ||
            this.matchesDietaryRestriction(restriction, option)
          );
        });
        
        // Only include if it matches dietary requirements or is a general grocery store
        if (!hasDietaryMatch && location.type !== 'Grocery') {
          return false;
        }
      }

      // Filter based on nutrition goals
      if (profile.nutrition_goals?.length > 0) {
        const hasNutritionMatch = profile.nutrition_goals.some(goal => {
          return this.matchesNutritionGoal(goal, location);
        });
        
        // More lenient for nutrition goals - include if matches or is grocery
        if (!hasNutritionMatch && location.type !== 'Grocery') {
          return false;
        }
      }

      return true;
    });
  }

  private matchesDietaryRestriction(restriction: string, option: string): boolean {
    const restrictionMap: Record<string, string[]> = {
      'vegetarian': ['vegetarian', 'vegan', 'plant-based', 'organic'],
      'vegan': ['vegan', 'plant-based'],
      'gluten-free': ['gluten-free', 'gluten free', 'celiac'],
      'keto': ['keto', 'low-carb', 'low carb'],
      'paleo': ['paleo', 'organic', 'natural']
    };

    const matchTerms = restrictionMap[restriction.toLowerCase()] || [];
    return matchTerms.some(term => option.toLowerCase().includes(term));
  }

  private matchesNutritionGoal(goal: string, location: Location): boolean {
    const goalMap: Record<string, string[]> = {
      'weight_loss': ['healthy', 'fresh', 'salads', 'low-cal'],
      'muscle_gain': ['protein', 'meat', 'supplements', 'butcher'],
      'heart_health': ['organic', 'fresh', 'healthy', 'low-sodium'],
      'diabetes_friendly': ['fresh', 'organic', 'sugar-free', 'healthy']
    };

    const matchTerms = goalMap[goal.toLowerCase()] || [];
    return matchTerms.some(term => 
      location.dietaryOptions?.some(option => option.toLowerCase().includes(term)) ||
      location.cuisine?.toLowerCase().includes(term)
    );
  }

  private sortByCompositeRating(locations: Location[]): Location[] {
    return locations.sort((a, b) => {
      // Composite rating calculation
      const aScore = this.calculateCompositeScore(a);
      const bScore = this.calculateCompositeScore(b);
      
      return bScore - aScore; // Higher scores first
    });
  }

  private calculateCompositeScore(location: Location): number {
    let score = 0;
    
    // Base rating (40% weight)
    score += (location.rating || 0) * 0.4;
    
    // Distance penalty (30% weight) - closer is better
    const distanceValue = parseFloat(location.distance?.replace(' mi', '') || '10');
    const distanceScore = Math.max(0, 5 - distanceValue); // Max 5 points for being very close
    score += distanceScore * 0.3;
    
    // Price bonus for better value (15% weight)
    const priceBonus = location.price === '$' ? 1.5 : location.price === '$$' ? 1.2 : 1.0;
    score += priceBonus * 0.15;
    
    // Open now bonus (10% weight)
    if (location.openNow) {
      score += 1 * 0.10;
    }
    
    // Dietary options bonus (5% weight)
    const dietaryBonus = (location.dietaryOptions?.length || 0) * 0.1;
    score += Math.min(dietaryBonus, 1) * 0.05; // Max 1 point for having many options
    
    return score;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('dietary_restrictions, nutrition_goals')
        .eq('id', user.id)
        .single();

      return profile || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
}

export const topRatedLocationService = new TopRatedLocationService();