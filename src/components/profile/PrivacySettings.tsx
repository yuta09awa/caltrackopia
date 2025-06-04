
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, MapPin, Eye } from 'lucide-react';

interface PrivacySettingsProps {
  shareLocation: boolean;
  publicProfile: boolean;
  onShareLocationChange: (value: boolean) => void;
  onPublicProfileChange: (value: boolean) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  shareLocation,
  publicProfile,
  onShareLocationChange,
  onPublicProfileChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Control how your information is shared and displayed
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
            <div className="space-y-1">
              <Label htmlFor="share-location" className="text-sm font-medium">
                Share Location
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow the app to use your location for finding nearby restaurants and personalized recommendations
              </p>
            </div>
          </div>
          <Switch
            id="share-location"
            checked={shareLocation}
            onCheckedChange={onShareLocationChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <Eye className="w-4 h-4 mt-1 text-muted-foreground" />
            <div className="space-y-1">
              <Label htmlFor="public-profile" className="text-sm font-medium">
                Public Profile
              </Label>
              <p className="text-xs text-muted-foreground">
                Make your profile visible to other users for social features and recommendations
              </p>
            </div>
          </div>
          <Switch
            id="public-profile"
            checked={publicProfile}
            onCheckedChange={onPublicProfileChange}
          />
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Your privacy matters:</strong> You can change these settings anytime. 
            Location data is only used to improve your experience and is never shared with third parties.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
