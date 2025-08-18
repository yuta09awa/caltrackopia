import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { pwa } from '@/services/pwa/PWAService';
import { logger } from '@/services/logging/LoggingService';

export const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if we should show the install prompt
    const checkInstallPrompt = () => {
      const isInstallable = pwa.canInstall();
      const isInstalled = pwa.isInstalled();
      const hasBeenDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
      
      if (isInstallable && !isInstalled && !hasBeenDismissed) {
        // Show prompt after a delay to not interrupt initial app experience
        setTimeout(() => {
          setShowPrompt(true);
        }, 10000); // 10 seconds delay
      }
    };

    checkInstallPrompt();

    // Listen for install prompt availability
    const handleInstallPrompt = () => {
      checkInstallPrompt();
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    
    try {
      const installed = await pwa.installApp();
      
      if (installed) {
        setShowPrompt(false);
        logger.userAction('PWA install - success');
      } else {
        logger.userAction('PWA install - dismissed');
      }
    } catch (error) {
      logger.error('PWA install failed', error as Error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    logger.userAction('PWA install prompt - dismissed');
  };

  const handleLater = () => {
    setShowPrompt(false);
    // Set a temporary dismissal (will show again next session)
    sessionStorage.setItem('pwa-install-later', 'true');
    logger.userAction('PWA install prompt - later');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-96">
      <Card className="bg-background border-primary/20 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Download className="w-4 h-4 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm mb-1">
                Install FoodToMe
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Install our app for faster access, offline features, and a better experience.
              </p>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="flex-1"
                >
                  {isInstalling ? (
                    <>
                      <div className="w-3 h-3 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 mr-2" />
                      Install
                    </>
                  )}
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleLater}
                  disabled={isInstalling}
                >
                  Later
                </Button>
              </div>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              disabled={isInstalling}
              className="flex-shrink-0 w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};