
import React from "react";
import AvatarUpload from "../AvatarUpload";
import BasicInfoForm from "../forms/BasicInfoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/app/store";
import { ProfileFormValues } from "../hooks/useProfileForm";
import { UseFormReturn } from "react-hook-form";

interface BasicTabProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => void;
  isLoading: boolean;
}

const BasicTab: React.FC<BasicTabProps> = ({ form, onSubmit, isLoading }) => {
  const { user } = useAppStore();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <AvatarUpload currentAvatarUrl={user?.profile.avatar} />
          </CardContent>
        </Card>
      </div>

      <BasicInfoForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export default BasicTab;
