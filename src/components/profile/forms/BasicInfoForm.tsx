
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileFormValues } from "../hooks/useProfileForm";
import { UseFormReturn } from "react-hook-form";
import { security } from "@/services/security/SecurityService";
import { toast } from "@/hooks/use-toast";

interface BasicInfoFormProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => void;
  isLoading: boolean;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ form, onSubmit, isLoading }) => {
  const handleSecureSubmit = (data: ProfileFormValues) => {
    // Rate limiting check
    const rateLimitKey = `profile_update_${Date.now()}`;
    if (!security.checkRateLimit(rateLimitKey, 5, 60000)) {
      toast({
        title: "Too many requests",
        description: "Please wait a moment before updating your profile again",
        variant: "destructive",
      });
      return;
    }

    // Validate and sanitize all inputs
    const validationResults = {
      firstName: security.validateInput(data.firstName || '', 'text'),
      lastName: security.validateInput(data.lastName || '', 'text'),
      displayName: security.validateInput(data.displayName || '', 'text'),
      phone: security.validateInput(data.phone || '', 'phone'),
      locationAddress: security.validateInput(data.locationAddress || '', 'text'),
    };

    // Check for validation errors
    const allErrors: string[] = [];
    Object.entries(validationResults).forEach(([field, result]) => {
      if (!result.isValid) {
        allErrors.push(`${field}: ${result.errors.join(', ')}`);
      }
    });

    if (allErrors.length > 0) {
      toast({
        title: "Validation errors",
        description: allErrors.join('; '),
        variant: "destructive",
      });
      return;
    }

    // Check for suspicious activity
    const inputsToCheck = [data.firstName, data.lastName, data.displayName, data.locationAddress].filter(Boolean);
    const hasSuspiciousInput = inputsToCheck.some(input => 
      security.detectSuspiciousActivity(input || '', 'profile_form')
    );

    if (hasSuspiciousInput) {
      toast({
        title: "Invalid input detected",
        description: "Please check your input and try again",
        variant: "destructive",
      });
      return;
    }

    // Create sanitized data object
    const sanitizedData: ProfileFormValues = {
      firstName: validationResults.firstName.sanitized,
      lastName: validationResults.lastName.sanitized,
      displayName: validationResults.displayName.sanitized || undefined,
      phone: validationResults.phone.sanitized,
      dateOfBirth: data.dateOfBirth,
      locationAddress: validationResults.locationAddress.sanitized || undefined,
    };

    onSubmit(sanitizedData);
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
