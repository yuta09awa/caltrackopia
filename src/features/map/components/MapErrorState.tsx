
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
    <div className="relative w-full h-full bg-gray-100 overflow-hidden flex items-center justify-center">
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
        <h3 className="text-lg font-semibold text-red-600 mb-2">{errorMessage}</h3>
        <p className="text-gray-600 mb-4">
          To use the map feature, please set up a Google Maps API key.
        </p>
        <ol className="text-left text-sm text-gray-500 space-y-1">
          <li>1. Go to Google Cloud Console</li>
          <li>2. Enable Maps JavaScript API</li>
          <li>3. Create an API key</li>
          <li>4. Set VITE_GOOGLE_MAPS_API_KEY in your environment</li>
        </ol>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default MapErrorState;
