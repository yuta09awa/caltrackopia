import { MapPin, Sparkles, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LocationDetectionResult {
  detectedCity: string;
  detectedRegion: string;
  detectionMethod: 'cloudflare' | 'ip-api' | 'fallback';
}

interface LocationDetectionBannerProps {
  detectedLocation: LocationDetectionResult | null;
  isDetecting: boolean;
  useTopRated: boolean;
  onToggleTopRated: (value: boolean) => void;
  locationCount: number;
}

export const LocationDetectionBanner = ({
  detectedLocation,
  isDetecting,
  useTopRated,
  onToggleTopRated,
  locationCount
}: LocationDetectionBannerProps) => {
  if (isDetecting) {
    return (
      <Card className="p-4 mb-4 border-muted">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 animate-pulse" />
          <span className="text-sm">Detecting your location...</span>
        </div>
      </Card>
    );
  }

  if (!detectedLocation) return null;

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'cloudflare': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'ip-api': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      default: return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'cloudflare': return 'Precise';
      case 'ip-api': return 'Regional';
      default: return 'Default';
    }
  };

  return (
    <Card className="p-4 mb-4 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">
              {detectedLocation.detectedCity}, {detectedLocation.detectedRegion}
            </span>
            <Badge 
              variant="outline" 
              className={getMethodBadgeColor(detectedLocation.detectionMethod)}
            >
              {getMethodLabel(detectedLocation.detectionMethod)}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            • {locationCount} locations found
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={useTopRated ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleTopRated(true)}
            className="h-8"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Top Rated
          </Button>
          <Button
            variant={!useTopRated ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleTopRated(false)}
            className="h-8"
          >
            <List className="h-3 w-3 mr-1" />
            All Locations
          </Button>
        </div>
      </div>
    </Card>
  );
};