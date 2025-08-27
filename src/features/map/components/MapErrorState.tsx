
import React from 'react';

interface MapErrorStateProps {
  errorMessage?: string;
  onRetry?: () => void;
}

const MapErrorState: React.FC<MapErrorStateProps> = ({ 
  errorMessage = "Map Configuration Required",
  onRetry 
}) => {
  return (
    <div className="relative w-full bg-destructive/10 border-l-4 border-destructive">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="text-destructive text-sm font-medium">
            Map is unavailable
          </div>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapErrorState;
