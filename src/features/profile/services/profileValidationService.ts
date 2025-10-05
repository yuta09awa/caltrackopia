
import { User } from '@/models/User';

export class ProfileValidationService {
  checkProfileCompletion(user: User): boolean {
    const required = [
      user.profile.firstName,
      user.profile.lastName,
      user.preferences.dietaryRestrictions?.length,
      user.preferences.nutritionGoals?.length
    ];
    
    return required.every(field => field && field !== '');
  }
}

export const profileValidationService = new ProfileValidationService();
