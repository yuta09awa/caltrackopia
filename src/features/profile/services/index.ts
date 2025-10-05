
import { avatarService } from './avatarService';
import { geocodingService, type GeocodeResult } from './geocodingService';
import { profileDataService, type ProfileUpdateData } from './profileDataService';
import { profileValidationService } from './profileValidationService';
import { User } from '@/models/User';

class ProfileService {
  async updateProfile(userId: string, updates: ProfileUpdateData): Promise<User> {
    return profileDataService.updateProfile(userId, updates);
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    return avatarService.uploadAvatar(userId, file);
  }

  async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    return geocodingService.geocodeAddress(address);
  }

  checkProfileCompletion(user: User): boolean {
    return profileValidationService.checkProfileCompletion(user);
  }

  async markOnboardingComplete(userId: string): Promise<void> {
    return profileDataService.markOnboardingComplete(userId);
  }
}

export const profileService = new ProfileService();
export type { ProfileUpdateData, GeocodeResult };
