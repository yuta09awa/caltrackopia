
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAppStore } from "@/store/appStore";
import { profileService, ProfileUpdateData } from "@/services/profileService";
import AvatarUpload from "./AvatarUpload";
import DietaryPreferences from "./DietaryPreferences";
import NutritionGoals from "./NutritionGoals";
import PrivacySettings from "./PrivacySettings";
import NotificationSettings from "./NotificationSettings";
import ProfileCompletionProgress from "./ProfileCompletionProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Heart, Shield, Bell } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  displayName: z.string().optional(),
  phone: z.string().min(5, { message: "Phone number is required" }),
  dateOfBirth: z.string().optional(),
  locationAddress: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileInfo: React.FC = () => {
  const { user, setUser } = useAppStore();
  const queryClient = useQueryClient();
  
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

  const updateProfileMutation = useMutation({
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

  const onSubmit = (data: ProfileFormValues) => {
    const updateData: ProfileUpdateData = {
      first_name: data.firstName,
      last_name: data.lastName,
      display_name: data.displayName,
      phone: data.phone,
      date_of_birth: data.dateOfBirth,
      location_address: data.locationAddress,
      dietary_restrictions: dietaryRestrictions,
      nutrition_goals: nutritionGoals,
      privacy_share_location: privacySettings.shareLocation,
      privacy_public_profile: privacySettings.publicProfile,
      notification_email: notificationSettings.email,
      notification_push: notificationSettings.push,
      notification_marketing: notificationSettings.marketing,
    };

    updateProfileMutation.mutate(updateData);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please log in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileCompletionProgress user={user} />
      
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Basic
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent>
                  <AvatarUpload currentAvatarUrl={user.profile.avatar} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...form.register("firstName")}
                        className={form.formState.errors.firstName ? "border-red-500" : ""}
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...form.register("lastName")}
                        className={form.formState.errors.lastName ? "border-red-500" : ""}
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="displayName">Display Name (Optional)</Label>
                    <Input id="displayName" {...form.register("displayName")} />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...form.register("phone")}
                      className={form.formState.errors.phone ? "border-red-500" : ""}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
                    <Input id="dateOfBirth" type="date" {...form.register("dateOfBirth")} />
                  </div>

                  <Button type="submit" className="w-full" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? "Updating..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <div className="grid gap-6 md:grid-cols-2">
            <DietaryPreferences
              selectedRestrictions={dietaryRestrictions}
              onRestrictionsChange={setDietaryRestrictions}
            />
            <NutritionGoals
              selectedGoals={nutritionGoals}
              onGoalsChange={setNutritionGoals}
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={form.handleSubmit(onSubmit)} disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Location Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Set your location to get personalized restaurant recommendations
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="locationAddress">Address</Label>
                  <Input
                    id="locationAddress"
                    placeholder="Enter your address"
                    {...form.register("locationAddress")}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be used to find nearby restaurants and provide location-based features
                  </p>
                </div>
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? "Updating..." : "Update Location"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacySettings
            shareLocation={privacySettings.shareLocation}
            publicProfile={privacySettings.publicProfile}
            onShareLocationChange={(value) => setPrivacySettings(prev => ({ ...prev, shareLocation: value }))}
            onPublicProfileChange={(value) => setPrivacySettings(prev => ({ ...prev, publicProfile: value }))}
          />
          <div className="flex justify-end mt-6">
            <Button onClick={form.handleSubmit(onSubmit)} disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Saving..." : "Save Privacy Settings"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings
            emailNotifications={notificationSettings.email}
            pushNotifications={notificationSettings.push}
            marketingNotifications={notificationSettings.marketing}
            onEmailChange={(value) => setNotificationSettings(prev => ({ ...prev, email: value }))}
            onPushChange={(value) => setNotificationSettings(prev => ({ ...prev, push: value }))}
            onMarketingChange={(value) => setNotificationSettings(prev => ({ ...prev, marketing: value }))}
          />
          <div className="flex justify-end mt-6">
            <Button onClick={form.handleSubmit(onSubmit)} disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Saving..." : "Save Notification Settings"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileInfo;
