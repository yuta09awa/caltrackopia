import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { pwa } from '@/services/pwa/PWAService';
import { logger } from '@/services/logging/LoggingService';

export const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);
  const [justWentOffline, setJustWentOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustWentOffline(false);
      setShowStatus(true);
      logger.info('Connection restored');
      
      // Hide status after 3 seconds when back online
      setTimeout(() => {
        setShowStatus(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustWentOffline(true);
      setShowStatus(true);
      logger.warn('Connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show initial status if offline
    if (!navigator.onLine) {
      setShowStatus(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      // Try to trigger a connection check
      fetch('/manifest.json', { method: 'HEAD', cache: 'no-cache' })
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          logger.info('Still offline after retry attempt');
        });
    }
  };

  const handleDismiss = () => {
    setShowStatus(false);
  };

  if (!showStatus) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-96">
      <Alert className={isOnline ? 'border-green-500/50 bg-green-50' : 'border-orange-500/50 bg-orange-50'}>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-orange-600" />
          )}
          
          <AlertDescription className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-medium ${isOnline ? 'text-green-800' : 'text-orange-800'}`}>
                  {isOnline ? 'Back Online!' : 'You\'re Offline'}
                </div>
                <div className={`text-xs ${isOnline ? 'text-green-700' : 'text-orange-700'}`}>
                  {isOnline 
                    ? 'Your connection has been restored'
                    : 'Some features may be limited while offline'
                  }
                </div>
              </div>
              
              <div className="flex gap-1 ml-2">
                {!isOnline && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRetry}
                    className="h-7 px-2 text-xs"
                  >
                    Retry
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="h-7 px-2 text-xs"
                >
                  ×
                </Button>
              </div>
            </div>
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
};

// Offline feature availability indicator
export const OfflineFeatures: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleConnectionChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-orange-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-orange-700">
            <strong>Offline Mode:</strong> You can still view cached restaurants and markets, 
            but live data and map updates are not available.
          </p>
          <div className="mt-2 text-xs text-orange-600">
            <div>✓ View cached locations</div>
            <div>✓ Browse saved favorites</div>
            <div>✗ Real-time updates</div>
            <div>✗ New search results</div>
          </div>
        </div>
      </div>
    </div>
  );
};