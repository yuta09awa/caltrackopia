
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/app/store";
import ProfileCompletionProgress from "./ProfileCompletionProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Heart, Shield, Bell } from "lucide-react";
import { useProfileForm, ProfileFormValues } from "./hooks/useProfileForm";
import { useProfileMutation } from "./hooks/useProfileMutation";
import { ProfileUpdateData } from "@/features/profile/services";
import BasicTab from "./tabs/BasicTab";
import PreferencesTab from "./tabs/PreferencesTab";
import LocationTab from "./tabs/LocationTab";
import PrivacyTab from "./tabs/PrivacyTab";
import NotificationsTab from "./tabs/NotificationsTab";

const ProfileInfo: React.FC = () => {
  const { user } = useAppStore();
  const {
    form,
    dietaryRestrictions,
    setDietaryRestrictions,
    nutritionGoals,
    setNutritionGoals,
    privacySettings,
    setPrivacySettings,
    notificationSettings,
    setNotificationSettings,
  } = useProfileForm();

  const updateProfileMutation = useProfileMutation();

  const handleFormSubmit = (data: ProfileFormValues) => {
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

  const handlePreferencesUpdate = () => {
    const currentValues = form.getValues();
    handleFormSubmit(currentValues);
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
          <BasicTab
            form={form}
            onSubmit={handleFormSubmit}
            isLoading={updateProfileMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab
            dietaryRestrictions={dietaryRestrictions}
            onRestrictionsChange={setDietaryRestrictions}
            nutritionGoals={nutritionGoals}
            onGoalsChange={setNutritionGoals}
            onSave={handlePreferencesUpdate}
            isLoading={updateProfileMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="location">
          <LocationTab
            form={form}
            onSubmit={handleFormSubmit}
            isLoading={updateProfileMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacyTab
            shareLocation={privacySettings.shareLocation}
            publicProfile={privacySettings.publicProfile}
            onShareLocationChange={(value) => setPrivacySettings(prev => ({ ...prev, shareLocation: value }))}
            onPublicProfileChange={(value) => setPrivacySettings(prev => ({ ...prev, publicProfile: value }))}
            onSave={handlePreferencesUpdate}
            isLoading={updateProfileMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab
            emailNotifications={notificationSettings.email}
            pushNotifications={notificationSettings.push}
            marketingNotifications={notificationSettings.marketing}
            onEmailChange={(value) => setNotificationSettings(prev => ({ ...prev, email: value }))}
            onPushChange={(value) => setNotificationSettings(prev => ({ ...prev, push: value }))}
            onMarketingChange={(value) => setNotificationSettings(prev => ({ ...prev, marketing: value }))}
            onSave={handlePreferencesUpdate}
            isLoading={updateProfileMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileInfo;
