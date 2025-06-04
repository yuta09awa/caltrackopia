
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Mail, Smartphone, Megaphone } from 'lucide-react';

interface NotificationSettingsProps {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingNotifications: boolean;
  onEmailChange: (value: boolean) => void;
  onPushChange: (value: boolean) => void;
  onMarketingChange: (value: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  emailNotifications,
  pushNotifications,
  marketingNotifications,
  onEmailChange,
  onPushChange,
  onMarketingChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose how you want to be notified about updates and offers
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="text-sm font-medium">
                Email Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive important updates, order confirmations, and account information via email
              </p>
            </div>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={onEmailChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-4 h-4 mt-1 text-muted-foreground" />
            <div className="space-y-1">
              <Label htmlFor="push-notifications" className="text-sm font-medium">
                Push Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Get real-time notifications about nearby restaurants, special offers, and app updates
              </p>
            </div>
          </div>
          <Switch
            id="push-notifications"
            checked={pushNotifications}
            onCheckedChange={onPushChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <Megaphone className="w-4 h-4 mt-1 text-muted-foreground" />
            <div className="space-y-1">
              <Label htmlFor="marketing-notifications" className="text-sm font-medium">
                Marketing Communications
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive promotional offers, new feature announcements, and curated food recommendations
              </p>
            </div>
          </div>
          <Switch
            id="marketing-notifications"
            checked={marketingNotifications}
            onCheckedChange={onMarketingChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
