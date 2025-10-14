/**
 * Profile API Module
 * Handles user profile-related API calls
 */

import { supabase } from '@/integrations/supabase/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export interface ProfileData {
  id?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
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

export const profileApi = {
  /**
   * Get profile by user ID
   */
  get: async (userId: string): Promise<ProfileData | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update profile
   */
  update: async (userId: string, updates: Partial<ProfileData>): Promise<ProfileData> => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Upload avatar image
   */
  uploadAvatar: async (userId: string, file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    await profileApi.update(userId, { avatar_url: data.publicUrl });

    return data.publicUrl;
  },

  /**
   * Delete avatar
   */
  deleteAvatar: async (userId: string, avatarUrl: string): Promise<void> => {
    // Extract file path from URL
    const fileName = avatarUrl.split('/').pop();
    if (!fileName) return;

    // Delete from storage
    const { error } = await supabase.storage
      .from('avatars')
      .remove([fileName]);

    if (error) throw error;

    // Update profile to remove avatar URL
    await profileApi.update(userId, { avatar_url: null });
  },
};
