
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileFormValues } from "../hooks/useProfileForm";
import { UseFormReturn } from "react-hook-form";

interface LocationFormProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => void;
  isLoading: boolean;
}

const LocationForm: React.FC<LocationFormProps> = ({ form, onSubmit, isLoading }) => {
  return (
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Location"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LocationForm;
