import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RefreshCw, Flag, Users, Globe, Percent } from 'lucide-react';
import { useAllFeatureFlags } from '@/hooks/useFeatureFlag';
import { toast } from 'sonner';

interface FeatureFlagsPanelProps {
  className?: string;
}

export const FeatureFlagsPanel: React.FC<FeatureFlagsPanelProps> = ({ className }) => {
  const { flags, loading, refresh, toggleFlag } = useAllFeatureFlags();

  const handleToggle = async (flagName: string) => {
    try {
      await toggleFlag(flagName);
      toast.success(`Feature flag "${flagName}" toggled`);
    } catch (error) {
      toast.error('Failed to toggle feature flag. Admin access required.');
    }
  };

  if (loading) {
    return (
      <Card className={`w-full bg-card/95 backdrop-blur ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Feature Flags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">Loading flags...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full bg-card/95 backdrop-blur ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Feature Flags ({flags.length})
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={refresh}
            className="h-7 px-2"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs max-h-[400px] overflow-y-auto">
        {flags.length === 0 ? (
          <div className="text-muted-foreground">No feature flags configured</div>
        ) : (
          flags.map((flag) => (
            <div 
              key={flag.id} 
              className="border border-border rounded-lg p-3 space-y-2"
            >
              {/* Flag Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-mono font-semibold truncate">
                    {flag.flag_name}
                  </div>
                  {flag.description && (
                    <div className="text-muted-foreground mt-1 text-[10px]">
                      {flag.description}
                    </div>
                  )}
                </div>
                <Switch
                  checked={flag.enabled}
                  onCheckedChange={() => handleToggle(flag.flag_name)}
                  className="flex-shrink-0"
                />
              </div>

              {/* Flag Details */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <Badge 
                  variant={flag.enabled ? 'default' : 'secondary'}
                  className="text-[10px] h-5"
                >
                  {flag.enabled ? 'ON' : 'OFF'}
                </Badge>

                {flag.rollout_percentage > 0 && (
                  <Badge variant="outline" className="text-[10px] h-5 gap-1">
                    <Percent className="h-2.5 w-2.5" />
                    {flag.rollout_percentage}%
                  </Badge>
                )}

                {flag.user_ids && flag.user_ids.length > 0 && (
                  <Badge variant="outline" className="text-[10px] h-5 gap-1">
                    <Users className="h-2.5 w-2.5" />
                    {flag.user_ids.length} users
                  </Badge>
                )}

                {flag.regions && flag.regions.length > 0 && (
                  <Badge variant="outline" className="text-[10px] h-5 gap-1">
                    <Globe className="h-2.5 w-2.5" />
                    {flag.regions.join(', ')}
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}

        {/* Legend */}
        <div className="pt-2 border-t border-border text-[10px] text-muted-foreground">
          <div className="font-semibold mb-1">Toggle flags to test features</div>
          <div>Requires admin privileges to modify flags</div>
        </div>
      </CardContent>
    </Card>
  );
};
