import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { environment } from '@/config/environment';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface HealthStatus {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  responseTime?: number;
}

export const HealthCheck: React.FC = () => {
  const [healthStatuses, setHealthStatuses] = useState<HealthStatus[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (environment.isDevelopment || environment.enableDevelopmentTools) {
      setIsVisible(true);
      checkHealth();
    }
  }, []);

  const checkHealth = async () => {
    const statuses: HealthStatus[] = [];

    // Check Supabase connection
    try {
      const start = Date.now();
      const { error } = await supabase.from('profiles').select('count').limit(1);
      const responseTime = Date.now() - start;
      
      statuses.push({
        service: 'Supabase',
        status: error ? 'unhealthy' : responseTime > 2000 ? 'degraded' : 'healthy',
        message: error?.message,
        responseTime
      });
    } catch (e) {
      statuses.push({
        service: 'Supabase',
        status: 'unhealthy',
        message: 'Connection failed'
      });
    }

    // Check Google Maps API
    if (window.google?.maps) {
      statuses.push({
        service: 'Google Maps',
        status: 'healthy',
        message: 'API loaded successfully'
      });
    } else {
      statuses.push({
        service: 'Google Maps',
        status: environment.googleMapsApiKey ? 'degraded' : 'unhealthy',
        message: environment.googleMapsApiKey ? 'API not loaded' : 'API key missing'
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
        message: missingEnvVars.length > 0 ? `Missing: ${missingEnvVars.join(', ')}` : 'All required variables present'
      });
    } catch (e) {
      statuses.push({
        service: 'Environment',
        status: 'unhealthy',
        message: 'Configuration error'
      });
    }

    setHealthStatuses(statuses);
  };

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
          <Badge variant="outline" className="ml-auto">
            {environment.environment}
          </Badge>
        </div>
        <AlertDescription>
          <div className="space-y-2">
            {healthStatuses.map((status) => (
              <div key={status.service} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(status.status)}`} />
                  <span>{status.service}</span>
                </div>
                <div className="text-right">
                  {status.responseTime && (
                    <div className="text-xs text-muted-foreground">
                      {status.responseTime}ms
                    </div>
                  )}
                  {status.message && status.status !== 'healthy' && (
                    <div className="text-xs text-red-600 max-w-32 truncate" title={status.message}>
                      {status.message}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};