import React from 'react';
import { AlertTriangle, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MapErrorStateProps {
  errorMessage?: string;
  onRetry?: () => void;
  showInstructions?: boolean;
}

const MapErrorState: React.FC<MapErrorStateProps> = ({ 
  errorMessage = "Map Configuration Required",
  onRetry,
  showInstructions = true
}) => {
  return (
    <div className="relative w-full h-full bg-muted/30 overflow-hidden flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-destructive">{errorMessage}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            The map feature requires a Google Maps API key to function properly.
          </p>
          
          {showInstructions && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Settings className="h-4 w-4 text-primary" />
                <span className="font-medium">Quick Setup:</span>
              </div>
              
              <ol className="text-sm text-muted-foreground space-y-2 pl-6">
                <li className="list-decimal">
                  Visit the{' '}
                  <a 
                    href="https://console.cloud.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Cloud Console
                  </a>
                </li>
                <li className="list-decimal">Enable the Maps JavaScript API</li>
                <li className="list-decimal">Create a new API key</li>
                <li className="list-decimal">
                  Add the API key to your{' '}
                  <a 
                    href={`https://supabase.com/dashboard/project/${import.meta.env.VITE_SUPABASE_URL?.split('.')[0]?.split('//')[1]}/settings/functions`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Supabase Edge Function Secrets
                  </a>
                </li>
              </ol>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            {onRetry && (
              <Button 
                onClick={onRetry}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Connection
              </Button>
            )}
            
            <Button 
              variant="default"
              className="flex-1"
              onClick={() => window.open('https://console.cloud.google.com', '_blank')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Setup API Key
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapErrorState;