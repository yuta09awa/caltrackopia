
import { supabase } from '@/integrations/supabase/client';
import { security } from '@/services/security/SecurityService';

export class AvatarService {
  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      // Rate limiting check
      const rateLimitKey = `avatar_upload_${userId}`;
      if (!security.checkRateLimit(rateLimitKey, 3, 300000)) { // 3 uploads per 5 minutes
        throw new Error('Too many upload attempts. Please wait before trying again.');
      }

      // Validate file using SecurityService
      const fileValidation = security.validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
      });

      if (!fileValidation.isValid) {
        throw new Error(`File validation failed: ${fileValidation.errors.join(', ')}`);
      }

      // Additional magic number validation for security
      const fileBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(fileBuffer);
      
      // Check magic numbers for common image formats
      const isValidImage = this.validateImageMagicNumbers(uint8Array);
      if (!isValidImage) {
        throw new Error('Invalid image file format detected');
      }

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

  private validateImageMagicNumbers(uint8Array: Uint8Array): boolean {
    // JPEG magic numbers
    if (uint8Array.length >= 3 && 
        uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF) {
      return true;
    }
    
    // PNG magic numbers
    if (uint8Array.length >= 8 && 
        uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && 
        uint8Array[3] === 0x47 && uint8Array[4] === 0x0D && uint8Array[5] === 0x0A && 
        uint8Array[6] === 0x1A && uint8Array[7] === 0x0A) {
      return true;
    }
    
    // WebP magic numbers
    if (uint8Array.length >= 12 && 
        uint8Array[0] === 0x52 && uint8Array[1] === 0x49 && uint8Array[2] === 0x46 && 
        uint8Array[3] === 0x46 && uint8Array[8] === 0x57 && uint8Array[9] === 0x45 && 
        uint8Array[10] === 0x42 && uint8Array[11] === 0x50) {
      return true;
    }
    
    return false;
  }
}

export const avatarService = new AvatarService();
