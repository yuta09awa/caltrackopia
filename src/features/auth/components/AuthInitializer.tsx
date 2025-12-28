import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * AuthInitializer handles authentication state management
 * It defers Zustand store access until after the first render to avoid
 * React initialization timing issues with useSyncExternalStore
 */
const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Defer store access to after first render
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // Dynamically import to avoid early initialization
    const initAuth = async () => {
      const { useAppStore } = await import('@/app/store');
      const store = useAppStore.getState();
      const { setUser, setAuthLoading, setAuthError } = store;

      try {
        setAuthLoading(true);
        setAuthError(null);

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setUser(null);
          setAuthLoading(false);
          return;
        }

        // Get current user with profile data
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const { AuthService } = await import('@/features/auth/services/authService');
          const profileData = await AuthService.fetchUserProfile(currentUser.id);
          const user = await AuthService.transformSupabaseUserToUser(currentUser, profileData);
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err);
        setAuthError(err.message);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        try {
          const { useAppStore } = await import('@/app/store');
          const store = useAppStore.getState();

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              const { AuthService } = await import('@/features/auth/services/authService');
              const profileData = await AuthService.fetchUserProfile(session.user.id);
              const user = await AuthService.transformSupabaseUserToUser(session.user, profileData);
              store.setUser(user);
            }
          } else if (event === 'SIGNED_OUT') {
            store.setUser(null);
          }
        } catch (err: any) {
          console.error('Auth state change error:', err);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [isReady]);

  return <>{children}</>;
};

export default AuthInitializer;
