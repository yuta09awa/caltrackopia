
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'location-card' | 'search-dropdown' | 'info-card' | 'map-marker';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className, 
  variant = 'location-card', 
  count = 1 
}) => {
  const renderLocationCardSkeleton = () => (
    <div className="flex border-b border-border py-3">
      <Skeleton className="w-32 h-28 sm:w-36 sm:h-32 md:w-44 md:h-36 rounded-md" />
      <div className="flex-1 min-w-0 p-3 pl-3 sm:p-4 sm:pl-4 space-y-2">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );

  const renderSearchDropdownSkeleton = () => (
    <div className="p-2 space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3 w-3/4 mb-1" />
            <Skeleton className="h-2 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderInfoCardSkeleton = () => (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-10" />
      </div>
      <Skeleton className="h-32 w-full rounded-md" />
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  );

  const renderMapMarkerSkeleton = () => (
    <div className="flex items-center justify-center">
      <Skeleton className="w-6 h-6 rounded-full animate-pulse" />
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'location-card':
        return renderLocationCardSkeleton();
      case 'search-dropdown':
        return renderSearchDropdownSkeleton();
      case 'info-card':
        return renderInfoCardSkeleton();
      case 'map-marker':
        return renderMapMarkerSkeleton();
      default:
        return renderLocationCardSkeleton();
    }
  };

  return (
    <div className={cn(className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
