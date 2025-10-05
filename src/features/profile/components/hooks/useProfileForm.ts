
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppStore } from "@/app/store";

const profileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  displayName: z.string().optional(),
  phone: z.string().min(5, { message: "Phone number is required" }),
  dateOfBirth: z.string().optional(),
  locationAddress: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function useProfileForm() {
  const { user } = useAppStore();
  
  // Local state for complex preferences
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [nutritionGoals, setNutritionGoals] = useState<string[]>([]);
  const [privacySettings, setPrivacySettings] = useState({
    shareLocation: false,
    publicProfile: false,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    marketing: false,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      displayName: "",
      phone: "",
      dateOfBirth: "",
      locationAddress: "",
    },
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.profile.firstName || "",
        lastName: user.profile.lastName || "",
        displayName: user.profile.displayName || "",
        phone: user.profile.phone || "",
        dateOfBirth: user.profile.dateOfBirth || "",
        locationAddress: user.preferences.location?.address || "",
      });

      setDietaryRestrictions(user.preferences.dietaryRestrictions || []);
      setNutritionGoals(user.preferences.nutritionGoals || []);
      setPrivacySettings({
        shareLocation: user.preferences.privacy.shareLocation,
        publicProfile: user.preferences.privacy.publicProfile,
      });
      setNotificationSettings({
        email: user.preferences.notifications.email,
        push: user.preferences.notifications.push,
        marketing: user.preferences.notifications.marketing,
      });
    }
  }, [user, form]);

  return {
    form,
    dietaryRestrictions,
    setDietaryRestrictions,
    nutritionGoals,
    setNutritionGoals,
    privacySettings,
    setPrivacySettings,
    notificationSettings,
    setNotificationSettings,
  };
}
