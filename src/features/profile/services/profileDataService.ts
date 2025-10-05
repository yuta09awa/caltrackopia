
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/models/User';
import { geocodingService } from './geocodingService';

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  phone?: string;
  date_of_birth?: string;
  location_address?: string;
  dietary_restrictions?: string[];
  nutrition_goals?: string[];
  privacy_share_location?: boolean;
  privacy_public_profile?: boolean;
  notification_email?: boolean;
  notification_push?: boolean;
  notification_marketing?: boolean;
}

export class ProfileDataService {
  async updateProfile(userId: string, updates: ProfileUpdateData): Promise<User> {
    try {
      let locationData = null;
      
      // Geocode address if provided
      if (updates.location_address) {
        const geocoded = await geocodingService.geocodeAddress(updates.location_address);
        if (geocoded) {
          locationData = `POINT(${geocoded.longitude} ${geocoded.latitude})`;
        }
      }

      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Add location data if geocoded successfully
      if (locationData) {
        updateData.location = locationData;
        updateData.location_address = updates.location_address;
      }

      // Use type assertion to work around missing types
      const { data, error } = await (supabase as any)
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Fetch fresh user data
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('User not authenticated');

      const transformedUser = await import('@/features/auth/services/authService').then(
        ({ AuthService }) => AuthService.transformSupabaseUserToUser(authUser, data)
      );

      return transformedUser;
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  async markOnboardingComplete(userId: string): Promise<void> {
    // Use type assertion to work around missing types
    const { error } = await (supabase as any)
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', userId);

    if (error) {
      console.error('Failed to mark onboarding complete:', error);
      throw error;
    }
  }
}

export const profileDataService = new ProfileDataService();
