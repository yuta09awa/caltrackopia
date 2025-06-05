
import React from "react";
import { Button } from "@/components/ui/button";
import NotificationSettings from "../NotificationSettings";

interface NotificationsTabProps {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingNotifications: boolean;
  onEmailChange: (value: boolean) => void;
  onPushChange: (value: boolean) => void;
  onMarketingChange: (value: boolean) => void;
  onSave: () => void;
  isLoading: boolean;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
  emailNotifications,
  pushNotifications,
  marketingNotifications,
  onEmailChange,
  onPushChange,
  onMarketingChange,
  onSave,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      <NotificationSettings
        emailNotifications={emailNotifications}
        pushNotifications={pushNotifications}
        marketingNotifications={marketingNotifications}
        onEmailChange={onEmailChange}
        onPushChange={onPushChange}
        onMarketingChange={onMarketingChange}
      />
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Notification Settings"}
        </Button>
      </div>
    </div>
  );
};

export default NotificationsTab;
