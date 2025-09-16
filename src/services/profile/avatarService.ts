
import { supabase } from '@/integrations/supabase/client';

export class AvatarService {
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

      // Update profile with new avatar URL using type assertion
      const { error: updateError } = await (supabase as any)
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
}

export const avatarService = new AvatarService();
