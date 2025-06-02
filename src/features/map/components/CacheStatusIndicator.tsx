
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CacheStatusIndicatorProps {
  cacheHitRate: number | null;
}

const CacheStatusIndicator: React.FC<CacheStatusIndicatorProps> = ({ cacheHitRate }) => {
  if (cacheHitRate === null) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Badge variant="outline">
        Session: {(cacheHitRate * 100).toFixed(0)}%
      </Badge>
    </div>
  );
};

export default CacheStatusIndicator;
