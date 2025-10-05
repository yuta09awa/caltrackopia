
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useAppStore } from "@/app/store";
import { profileService, ProfileUpdateData } from "@/services/profile";

export function useProfileMutation() {
  const { user, setUser } = useAppStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      if (!user) throw new Error('User not found');
      return profileService.updateProfile(user.id, data);
    },
    onMutate: async (newData) => {
      // Optimistic update
      if (user) {
        const optimisticUser = {
          ...user,
          profile: {
            ...user.profile,
            firstName: newData.first_name || user.profile.firstName,
            lastName: newData.last_name || user.profile.lastName,
            displayName: newData.display_name || user.profile.displayName,
            phone: newData.phone || user.profile.phone,
            dateOfBirth: newData.date_of_birth || user.profile.dateOfBirth,
          },
          preferences: {
            ...user.preferences,
            dietaryRestrictions: newData.dietary_restrictions || user.preferences.dietaryRestrictions,
            nutritionGoals: newData.nutrition_goals || user.preferences.nutritionGoals,
            privacy: {
              shareLocation: newData.privacy_share_location ?? user.preferences.privacy.shareLocation,
              publicProfile: newData.privacy_public_profile ?? user.preferences.privacy.publicProfile,
            },
            notifications: {
              email: newData.notification_email ?? user.preferences.notifications.email,
              push: newData.notification_push ?? user.preferences.notifications.push,
              marketing: newData.notification_marketing ?? user.preferences.notifications.marketing,
            },
          },
        };
        setUser(optimisticUser);
      }
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Check if profile is now complete and mark onboarding as done
      if (profileService.checkProfileCompletion(updatedUser) && !updatedUser.metadata.onboardingCompleted) {
        profileService.markOnboardingComplete(updatedUser.id);
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      });
    },
    onError: (error: any, variables, context) => {
      // Revert optimistic update on error
      if (user) {
        setUser(user);
      }
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });
}
