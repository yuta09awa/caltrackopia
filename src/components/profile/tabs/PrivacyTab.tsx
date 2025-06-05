
import React from "react";
import { Button } from "@/components/ui/button";
import PrivacySettings from "../PrivacySettings";

interface PrivacyTabProps {
  shareLocation: boolean;
  publicProfile: boolean;
  onShareLocationChange: (value: boolean) => void;
  onPublicProfileChange: (value: boolean) => void;
  onSave: () => void;
  isLoading: boolean;
}

const PrivacyTab: React.FC<PrivacyTabProps> = ({
  shareLocation,
  publicProfile,
  onShareLocationChange,
  onPublicProfileChange,
  onSave,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      <PrivacySettings
        shareLocation={shareLocation}
        publicProfile={publicProfile}
        onShareLocationChange={onShareLocationChange}
        onPublicProfileChange={onPublicProfileChange}
      />
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Privacy Settings"}
        </Button>
      </div>
    </div>
  );
};

export default PrivacyTab;
