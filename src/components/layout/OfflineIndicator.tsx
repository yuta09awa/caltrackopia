/**
 * Offline Indicator Component
 * Shows sync status and offline queue information
 */

import { useEffect, useState } from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { useSyncStatus } from '@/hooks/useOfflineFirst';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { syncing, pendingCount, lastSync, triggerSync } = useSyncStatus();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && pendingCount === 0 && !syncing) {
    return null; // Hide when everything is fine
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg",
      isOnline ? "bg-background border" : "bg-destructive text-destructive-foreground"
    )}>
      {isOnline ? (
        <>
          <Cloud className="h-4 w-4" />
          {syncing && (
            <span className="text-sm flex items-center gap-2">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Syncing {pendingCount} items...
            </span>
          )}
          {!syncing && pendingCount > 0 && (
            <>
              <span className="text-sm">
                {pendingCount} items pending
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={triggerSync}
                className="h-6"
              >
                Sync Now
              </Button>
            </>
          )}
          {lastSync && pendingCount === 0 && (
            <span className="text-sm text-muted-foreground">
              Last synced: {lastSync.toLocaleTimeString()}
            </span>
          )}
        </>
      ) : (
        <>
          <CloudOff className="h-4 w-4" />
          <span className="text-sm font-medium">
            You're offline - Changes will sync when reconnected
          </span>
        </>
      )}
    </div>
  );
};
