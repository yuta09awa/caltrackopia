
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileFormValues } from "../hooks/useProfileForm";
import { UseFormReturn } from "react-hook-form";
import { security } from "@/services/security/SecurityService";

interface BasicInfoFormProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => void;
  isLoading: boolean;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ form, onSubmit, isLoading }) => {
  const handleSecureSubmit = (data: ProfileFormValues) => {
    // Security validation
    const firstNameValidation = security.validateInput(data.firstName || '', 'text');
    const lastNameValidation = security.validateInput(data.lastName || '', 'text');
    const phoneValidation = data.phone ? security.validateInput(data.phone, 'phone') : { isValid: true, sanitized: '' };

    if (!firstNameValidation.isValid || !lastNameValidation.isValid || !phoneValidation.isValid) {
      console.error('Invalid input data');
      return;
    }

    // Check for suspicious activity
    if (security.detectSuspiciousActivity(data.firstName + data.lastName, 'profile-update')) {
      console.error('Suspicious profile update detected');
      return;
    }

    // Submit sanitized data
    onSubmit({
      ...data,
      firstName: firstNameValidation.sanitized,
      lastName: lastNameValidation.sanitized,
      phone: phoneValidation.sanitized,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSecureSubmit)} className="space-y-4">
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;
