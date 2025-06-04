
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/models/User';

export class AuthService {
  static async transformSupabaseUserToUser(supabaseUser: any, profileData: any = null): Promise<User> {
    // If no profile data provided, try to fetch it
    if (!profileData && supabaseUser?.id) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      profileData = data;
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      emailVerified: supabaseUser.email_confirmed_at !== null,
      profile: {
        firstName: profileData?.first_name,
        lastName: profileData?.last_name,
        displayName: profileData?.display_name,
        avatar: profileData?.avatar_url,
        phone: profileData?.phone,
        dateOfBirth: profileData?.date_of_birth,
      },
      preferences: {
        darkMode: false, // Default or from profileData
        notifications: {
          email: profileData?.notification_email ?? true,
          push: profileData?.notification_push ?? true,
          marketing: profileData?.notification_marketing ?? false,
        },
        location: profileData?.location ? {
          lat: profileData.location.coordinates[1],
          lng: profileData.location.coordinates[0],
          address: profileData.location_address || ''
        } : null,
        dietaryRestrictions: profileData?.dietary_restrictions || [],
        nutritionGoals: profileData?.nutrition_goals || [],
        privacy: {
          shareLocation: profileData?.privacy_share_location ?? false,
          publicProfile: profileData?.privacy_public_profile ?? false,
        },
        favoriteLocations: [], // This might come from a separate table later
      },
      metadata: {
        createdAt: supabaseUser.created_at,
        updatedAt: supabaseUser.updated_at || profileData?.updated_at,
        lastLoginAt: profileData?.last_login_at,
        onboardingCompleted: profileData?.onboarding_completed ?? false,
      },
    };
  }

  static async fetchUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  }
}

export const authService = new AuthService();
