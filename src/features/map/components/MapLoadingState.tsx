
import React from 'react';

interface MapLoadingStateProps {
  height: string;
  type: 'loading' | 'initializing' | 'error';
  errorMessage?: string;
}

const MapLoadingState: React.FC<MapLoadingStateProps> = ({ height, type, errorMessage }) => {
  if (type === 'error') {
    return (
      <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-4 z-50">
          <div className="text-sm font-medium mb-2">Map Configuration Error</div>
          <div className="text-xs">
            {errorMessage || 'Failed to load Google Maps'}
          </div>
          <div className="text-xs mt-2 opacity-90">
            Please check that your Google Maps API key is properly configured.
          </div>
        </div>
      </div>
    );
  }

  const message = type === 'loading' ? 'Loading map...' : 'Initializing map...';

  return (
    <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">
        {message}
      </div>
    </div>
  );
};

export default MapLoadingState;
