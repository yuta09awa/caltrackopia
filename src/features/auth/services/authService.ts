import { supabase } from '@/integrations/supabase/client';
import { User } from '@/entities/user';

interface SignUpData {
  userType: 'customer' | 'restaurant_owner';
  firstName: string;
  lastName: string;
  restaurant?: {
    businessName: string;
    businessEmail?: string;
    businessPhone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    cuisineType: string[];
    description?: string;
    website?: string;
  };
}

export class AuthService {
  static async signIn(email: string, password: string): Promise<any> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  static async signUp(email: string, password: string, additionalData: SignUpData): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            user_type: additionalData.userType,
            first_name: additionalData.firstName,
            last_name: additionalData.lastName,
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // Create profile
        const profileData = {
          id: data.user.id,
          user_type: additionalData.userType,
          first_name: additionalData.firstName,
          last_name: additionalData.lastName,
          display_name: `${additionalData.firstName} ${additionalData.lastName}`,
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error('Failed to create user profile');
        }

        // Assign role in user_roles table
        // restaurant_owner requires approval, others are auto-approved
        const needsApproval = additionalData.userType === 'restaurant_owner';
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: data.user.id,
            role: additionalData.userType,
            approved: !needsApproval,
          }]);

        if (roleError) {
          console.error('Role assignment error:', roleError);
          throw new Error('Failed to assign user role');
        }

        // If restaurant owner, create restaurant record
        if (additionalData.userType === 'restaurant_owner' && additionalData.restaurant) {
          const restaurantData = {
            owner_id: data.user.id,
            business_name: additionalData.restaurant.businessName,
            business_email: additionalData.restaurant.businessEmail,
            business_phone: additionalData.restaurant.businessPhone,
            address: additionalData.restaurant.address,
            city: additionalData.restaurant.city,
            state: additionalData.restaurant.state,
            zip_code: additionalData.restaurant.zipCode,
            cuisine_type: additionalData.restaurant.cuisineType,
            description: additionalData.restaurant.description,
            website: additionalData.restaurant.website,
            verification_status: 'pending',
          };

          const { error: restaurantError } = await supabase
            .from('restaurants')
            .insert([restaurantData]);

          if (restaurantError) {
            console.error('Restaurant creation error:', restaurantError);
            throw new Error('Failed to create restaurant profile');
          }
        }
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  static async fetchUserProfile(userId: string): Promise<any> {
    try {
      // Fetch profile with restaurant data if applicable
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          restaurants (*)
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  static async transformSupabaseUserToUser(supabaseUser: any, profileData: any): Promise<User> {
    const restaurant = profileData?.restaurants?.[0] ? {
      id: profileData.restaurants[0].id,
      ownerId: profileData.restaurants[0].owner_id,
      businessName: profileData.restaurants[0].business_name,
      businessLicense: profileData.restaurants[0].business_license,
      businessEmail: profileData.restaurants[0].business_email,
      businessPhone: profileData.restaurants[0].business_phone,
      address: profileData.restaurants[0].address,
      city: profileData.restaurants[0].city,
      state: profileData.restaurants[0].state,
      zipCode: profileData.restaurants[0].zip_code,
      cuisineType: profileData.restaurants[0].cuisine_type || [],
      operatingHours: profileData.restaurants[0].operating_hours,
      description: profileData.restaurants[0].description,
      website: profileData.restaurants[0].website,
      verificationStatus: profileData.restaurants[0].verification_status,
      verificationDocuments: profileData.restaurants[0].verification_documents || [],
      createdAt: profileData.restaurants[0].created_at,
      updatedAt: profileData.restaurants[0].updated_at,
    } : undefined;

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      emailVerified: supabaseUser.email_confirmed_at !== null,
      userType: profileData?.user_type || 'customer',
      profile: {
        firstName: profileData?.first_name || supabaseUser.user_metadata?.first_name,
        lastName: profileData?.last_name || supabaseUser.user_metadata?.last_name,
        displayName: profileData?.display_name || supabaseUser.user_metadata?.display_name,
        avatar: profileData?.avatar_url,
        phone: profileData?.phone,
        dateOfBirth: profileData?.date_of_birth,
      },
      restaurant,
      preferences: {
        darkMode: false,
        notifications: {
          email: profileData?.notification_email ?? true,
          push: profileData?.notification_push ?? true,
          marketing: profileData?.notification_marketing ?? false,
        },
        location: profileData?.location ? {
          lat: profileData.location.coordinates[1],
          lng: profileData.location.coordinates[0],
          address: profileData.location_address || '',
        } : null,
        dietaryRestrictions: profileData?.dietary_restrictions || [],
        nutritionGoals: profileData?.nutrition_goals || [],
        privacy: {
          shareLocation: profileData?.privacy_share_location ?? false,
          publicProfile: profileData?.privacy_public_profile ?? false,
        },
        favoriteLocations: [],
      },
      metadata: {
        createdAt: supabaseUser.created_at,
        updatedAt: profileData?.updated_at || supabaseUser.updated_at,
        lastLoginAt: supabaseUser.last_sign_in_at,
        onboardingCompleted: profileData?.onboarding_completed ?? false,
      },
    };
  }

  // Add more methods as needed (e.g., password reset, email verification)
}
