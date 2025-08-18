import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { environment } from '@/config/environment';
import { useApiKeyState } from '@/features/map/hooks/useApiKeyState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, RotateCcw, ChevronRight, ChevronDown } from 'lucide-react';

interface HealthStatus {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  responseTime?: number;
}

export const HealthCheck: React.FC = () => {
  const [healthStatuses, setHealthStatuses] = useState<HealthStatus[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { apiKey, error: apiKeyError, loading: apiKeyLoading } = useApiKeyState();

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (environment.isDevelopment || environment.enableDevelopmentTools) {
      setIsVisible(true);
      checkHealth();
    }
  }, [apiKey, apiKeyError, apiKeyLoading]);

  const checkEdgeFunction = async (): Promise<HealthStatus> => {
    try {
      const start = Date.now();
      const { data, error } = await supabase.functions.invoke('get-google-maps-api-key');
      const responseTime = Date.now() - start;
      
      if (error) {
        return {
          service: 'Edge Function',
          status: 'unhealthy',
          message: `Error: ${error.message}`,
          responseTime
        };
      }
      
      if (!data?.apiKey) {
        return {
          service: 'Edge Function',
          status: 'unhealthy',
          message: 'Set GOOGLE_MAPS_API_KEY secret',
          responseTime
        };
      }
      
      return {
        service: 'Edge Function',
        status: 'healthy',
        message: `${responseTime}ms`,
        responseTime
      };
    } catch (error: any) {
      return {
        service: 'Edge Function',
        status: 'unhealthy',
        message: `Failed: ${error.message}`
      };
    }
  };

  const checkHealth = useCallback(async () => {
    const statuses: HealthStatus[] = [];

    // Check Supabase connection
    try {
      const start = Date.now();
      const { error } = await supabase.from('profiles').select('count').limit(1);
      const responseTime = Date.now() - start;
      
      statuses.push({
        service: 'Supabase',
        status: error ? 'unhealthy' : responseTime > 2000 ? 'degraded' : 'healthy',
        message: error?.message || `${responseTime}ms`,
        responseTime
      });
    } catch (e) {
      statuses.push({
        service: 'Supabase',
        status: 'unhealthy',
        message: 'Connection failed'
      });
    }

    // Check Google Maps API with improved logic
    if (window.google?.maps) {
      statuses.push({
        service: 'Google Maps',
        status: 'healthy',
        message: 'Maps API loaded'
      });
    } else if (apiKeyLoading) {
      statuses.push({
        service: 'Google Maps',
        status: 'degraded',
        message: 'Loading API key...'
      });
    } else if (apiKeyError) {
      statuses.push({
        service: 'Google Maps',
        status: 'unhealthy',
        message: 'Set GOOGLE_MAPS_API_KEY secret'
      });
    } else if (apiKey) {
      statuses.push({
        service: 'Google Maps',
        status: 'degraded',
        message: 'Loading Maps script...'
      });
    } else if (environment.googleMapsApiKey) {
      statuses.push({
        service: 'Google Maps',
        status: 'degraded',
        message: 'Using env API key'
      });
    } else {
      statuses.push({
        service: 'Google Maps',
        status: 'degraded',
        message: 'Using edge function'
      });
    }

    // Check environment configuration
    try {
      const missingEnvVars = [];
      if (!environment.supabaseUrl) missingEnvVars.push('SUPABASE_URL');
      if (!environment.supabaseAnonKey) missingEnvVars.push('SUPABASE_ANON_KEY');
      
      statuses.push({
        service: 'Environment',
        status: missingEnvVars.length > 0 ? 'unhealthy' : 'healthy',
        message: missingEnvVars.length > 0 ? `Missing: ${missingEnvVars.join(', ')}` : 'All vars present'
      });
    } catch (e) {
      statuses.push({
        service: 'Environment',
        status: 'unhealthy',
        message: 'Configuration error'
      });
    }

    // Add edge function check if advanced view is enabled
    if (showAdvanced) {
      const edgeFunctionStatus = await checkEdgeFunction();
      statuses.push(edgeFunctionStatus);
    }

    setHealthStatuses(statuses);
  }, [apiKey, apiKeyError, apiKeyLoading, showAdvanced]);

  if (!isVisible || healthStatuses.length === 0) {
    return null;
  }

  const getStatusIcon = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'unhealthy':
        return 'bg-red-500';
    }
  };

  const overallHealth = healthStatuses.every(s => s.status === 'healthy') 
    ? 'healthy' 
    : healthStatuses.some(s => s.status === 'unhealthy') 
    ? 'unhealthy' 
    : 'degraded';

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Alert className="border-2">
        <div className="flex items-center gap-2 mb-2">
          {getStatusIcon(overallHealth)}
          <span className="font-semibold">System Health</span>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-1 hover:bg-muted rounded"
              title="Toggle advanced view"
            >
              {showAdvanced ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            <button
              onClick={checkHealth}
              className="p-1 hover:bg-muted rounded"
              title="Refresh health check"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <Badge variant="outline">
              {environment.environment}
            </Badge>
          </div>
        </div>
        <AlertDescription>
          <div className="space-y-2">
            {healthStatuses.map((status) => (
              <div key={status.service} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(status.status)}`} />
                  <span className="text-xs">{status.service}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground max-w-32 truncate" title={status.message}>
                    {status.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};