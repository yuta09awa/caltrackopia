import { useState, useEffect } from 'react';
import { featureFlagService } from '@/services/featureFlags';
import { supabase } from '@/integrations/supabase/client';

/**
 * React hook for checking feature flag status
 * 
 * @param flagName - Name of the feature flag to check
 * @param defaultValue - Default value to return while loading (default: false)
 * @returns Object containing enabled status, loading state, and error
 * 
 * @example
 * ```tsx
 * const { enabled, loading } = useFeatureFlag('ai-calorie-tracking');
 * 
 * if (loading) return <LoadingSkeleton />;
 * if (!enabled) return null;
 * return <AICalorieTracker />;
 * ```
 */
export function useFeatureFlag(flagName: string, defaultValue: boolean = false) {
  const [enabled, setEnabled] = useState<boolean>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkFlag = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user ID if authenticated
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        // Check flag with user context
        const isEnabled = await featureFlagService.isEnabled(flagName, userId);
        
        if (mounted) {
          setEnabled(isEnabled);
          console.log(`[FeatureFlag] ${flagName}:`, isEnabled ? 'enabled' : 'disabled');
        }
      } catch (err) {
        console.error(`[FeatureFlag] Error checking ${flagName}:`, err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setEnabled(defaultValue);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkFlag();

    return () => {
      mounted = false;
    };
  }, [flagName, defaultValue]);

  return { enabled, loading, error };
}

/**
 * Hook to get all feature flags (for admin UI)
 */
export function useAllFeatureFlags() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const allFlags = await featureFlagService.getAllFlags();
      setFlags(allFlags);
    } catch (err) {
      console.error('[FeatureFlags] Error fetching all flags:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const toggleFlag = async (flagName: string) => {
    try {
      await featureFlagService.toggleFlag(flagName);
      await refresh();
    } catch (err) {
      console.error('[FeatureFlags] Error toggling flag:', err);
      throw err;
    }
  };

  return { flags, loading, error, refresh, toggleFlag };
}
