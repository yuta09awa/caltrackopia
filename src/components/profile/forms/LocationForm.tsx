
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileFormValues } from "../hooks/useProfileForm";
import { UseFormReturn } from "react-hook-form";
import { security } from "@/services/security/SecurityService";
import { toast } from "@/hooks/use-toast";

interface LocationFormProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => void;
  isLoading: boolean;
}

const LocationForm: React.FC<LocationFormProps> = ({ form, onSubmit, isLoading }) => {
  const handleSecureSubmit = (data: ProfileFormValues) => {
    // Rate limiting check
    const rateLimitKey = `location_update_${Date.now()}`;
    if (!security.checkRateLimit(rateLimitKey, 3, 60000)) {
      toast({
        title: "Too many requests",
        description: "Please wait a moment before updating your location again",
        variant: "destructive",
      });
      return;
    }

    // Validate and sanitize location address
    const addressValidation = security.validateInput(data.locationAddress || '', 'text');
    
    if (!addressValidation.isValid) {
      toast({
        title: "Invalid address",
        description: addressValidation.errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    // Check for suspicious activity
    if (security.detectSuspiciousActivity(data.locationAddress || '', 'location_form')) {
      toast({
        title: "Invalid input detected",
        description: "Please check your address and try again",
        variant: "destructive",
      });
      return;
    }

    // Create sanitized data object
    const sanitizedData: ProfileFormValues = {
      ...data,
      locationAddress: addressValidation.sanitized || undefined,
    };

    onSubmit(sanitizedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Settings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Set your location to get personalized restaurant recommendations
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSecureSubmit)} className="space-y-4">
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Location"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LocationForm;
