
import { supabase } from '@/integrations/supabase/client';
import { User, UserPreferences } from '@/models/User';
import { toast } from '@/hooks/use-toast';

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

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
}

class ProfileService {
  private googleMapsApiKey: string | null = null;

  async initializeGoogleMaps() {
    if (!this.googleMapsApiKey) {
      try {
        const { data } = await supabase.functions.invoke('get-google-maps-api-key');
        this.googleMapsApiKey = data?.apiKey;
      } catch (error) {
        console.warn('Failed to get Google Maps API key for geocoding');
      }
    }
  }

  async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    await this.initializeGoogleMaps();
    
    if (!this.googleMapsApiKey || !address.trim()) {
      return null;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.googleMapsApiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        return {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          formatted_address: result.formatted_address
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    
    return null;
  }

  async updateProfile(userId: string, updates: ProfileUpdateData): Promise<User> {
    try {
      let locationData = null;
      
      // Geocode address if provided
      if (updates.location_address) {
        const geocoded = await this.geocodeAddress(updates.location_address);
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

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Fetch fresh user data
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('User not authenticated');

      const transformedUser = await import('@/services/authService').then(
        ({ AuthService }) => AuthService.transformSupabaseUserToUser(authUser, data)
      );

      return transformedUser;
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      // Resize image on client side
      const resizedFile = await this.resizeImage(file, 200, 200);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, resizedFile, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      return data.publicUrl;
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      throw new Error(error.message || 'Failed to upload avatar');
    }
  }

  private async resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and resize
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob!], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          file.type,
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  checkProfileCompletion(user: User): boolean {
    const required = [
      user.profile.firstName,
      user.profile.lastName,
      user.preferences.dietaryRestrictions?.length,
      user.preferences.nutritionGoals?.length
    ];
    
    return required.every(field => field && field !== '');
  }

  async markOnboardingComplete(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', userId);

    if (error) {
      console.error('Failed to mark onboarding complete:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
