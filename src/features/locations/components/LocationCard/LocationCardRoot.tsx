import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LocationCardProps } from './types';

interface LocationCardRootProps extends Omit<LocationCardProps, 'onClick'> {
  detailLink: string;
  onCardClick: (e: React.MouseEvent<HTMLAnchorElement>) => boolean;
}

const LocationCardRoot: React.FC<LocationCardRootProps> = ({ 
  location, 
  isHighlighted, 
  detailLink, 
  onCardClick, 
  children,
  className,
  testId,
  loading,
  error,
  disabled
}) => {
  return (
    <Link
      to={detailLink}
      className={cn(
        "block px-3 py-3 hover:bg-accent/50 transition-colors duration-200",
        isHighlighted && "bg-primary/10 border-l-4 border-l-primary",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      onClick={onCardClick}
      data-testid={testId || `location-card-${location.id}`}
      aria-disabled={disabled}
    >
      {loading && <div className="absolute inset-0 flex items-center justify-center bg-background/50">Loading...</div>}
      {error && <div className="text-destructive text-sm">{typeof error === 'string' ? error : error.message}</div>}
      {children}
    </Link>
  );
};

LocationCardRoot.displayName = 'LocationCardRoot';

export default LocationCardRoot;
