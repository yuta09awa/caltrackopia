
import React from 'react';

interface MapLoadingStateProps {
  height: string;
  type: 'loading' | 'initializing' | 'error';
  errorMessage?: string;
}

const MapLoadingState: React.FC<MapLoadingStateProps> = ({ height, type, errorMessage }) => {
  if (type === 'error') {
    const isRefererError = errorMessage?.includes('RefererNotAllowedMapError');
    const isTimeoutError = errorMessage?.includes('timeout');
    const isRetryError = errorMessage?.includes('attempt');
    
    return (
      <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-4 z-50">
          <div className="text-sm font-medium mb-2">
            {isRefererError ? 'Google Maps API Configuration Error' : 
             isTimeoutError ? 'Map Loading Timeout' :
             isRetryError ? 'Map Loading Failed After Retries' :
             'Map Configuration Error'}
          </div>
          <div className="text-xs">
            {isRefererError 
              ? 'The current domain is not authorized for this API key.'
              : isTimeoutError
                ? 'The map took too long to load. Please refresh the page.'
                : (errorMessage || 'Failed to load Google Maps')
            }
          </div>
          {isRefererError && (
            <div className="text-xs mt-2 opacity-90">
              <p>To fix this:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Go to Google Cloud Console → APIs & Services → Credentials</li>
                <li>Edit your Google Maps API key</li>
                <li>Add "{window.location.hostname}" to HTTP referrers</li>
                <li>Or set to unrestricted for development</li>
              </ul>
            </div>
          )}
          {isTimeoutError && (
            <div className="text-xs mt-2 opacity-90">
              <p>This usually indicates network issues or server problems.</p>
              <p>Try refreshing the page or check your internet connection.</p>
            </div>
          )}
          {!isRefererError && !isTimeoutError && (
            <div className="text-xs mt-2 opacity-90">
              Please check that your Google Maps API key is properly configured.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Enhanced loading messages based on the error message passed in
  let message = 'Loading map...';
  if (type === 'initializing') {
    message = 'Initializing map...';
  } else if (errorMessage) {
    message = errorMessage;
  }

  return (
    <div className="relative w-full bg-muted overflow-hidden" style={{ height }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-lg font-semibold mb-2">{message}</div>
        {type === 'loading' && (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground"></div>
            <span className="text-sm text-muted-foreground">Please wait...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapLoadingState;
