
import React, { useRef, useState } from 'react';
import { Camera, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { profileService } from '@/services/profileService';
import { useAppStore } from '@/store/appStore';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdate?: (newUrl: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatarUrl, 
  onAvatarUpdate 
}) => {
  const { user, setUser } = useAppStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      const newAvatarUrl = await profileService.uploadAvatar(user.id, file);
      
      // Update user in store
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          avatar: newAvatarUrl
        }
      };
      setUser(updatedUser);
      
      onAvatarUpdate?.(newAvatarUrl);
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload avatar',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const userInitials = user?.profile.firstName && user?.profile.lastName
    ? `${user.profile.firstName[0]}${user.profile.lastName[0]}`
    : user?.profile.displayName?.[0] || user?.email?.[0] || 'U';

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage src={currentAvatarUrl} alt="Profile picture" />
          <AvatarFallback className="text-lg font-semibold">
            {userInitials.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <Button
          size="sm"
          variant="secondary"
          className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
          onClick={triggerFileSelect}
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? 'Uploading...' : 'Change Photo'}
        </Button>
        <p className="text-sm text-muted-foreground mt-1">
          JPG, PNG or GIF. Max 5MB.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;
