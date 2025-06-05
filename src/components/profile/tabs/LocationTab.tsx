
import React from "react";
import LocationForm from "../forms/LocationForm";
import { ProfileFormValues } from "../hooks/useProfileForm";
import { UseFormReturn } from "react-hook-form";

interface LocationTabProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => void;
  isLoading: boolean;
}

const LocationTab: React.FC<LocationTabProps> = ({ form, onSubmit, isLoading }) => {
  return <LocationForm form={form} onSubmit={onSubmit} isLoading={isLoading} />;
};

export default LocationTab;
