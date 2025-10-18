
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { authApi } from '@/features/auth/api/authApi';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const { setUser, setAuthLoading, setAuthError } = useAuth();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setAuthLoading(true);
        setAuthError(null);
        
        const session = await authApi.getSession();

        if (!session) {
          setUser(null);
          return;
        }

        // Get current user with profile data already transformed
        const currentUser = await authApi.getCurrentUser();
        if (currentUser) {
          // Transform to app user format (this will be handled by authApi in future)
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

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        try {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              const { AuthService } = await import('@/features/auth/services/authService');
              const profileData = await AuthService.fetchUserProfile(session.user.id);
              const user = await AuthService.transformSupabaseUserToUser(session.user, profileData);
              setUser(user);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        } catch (err: any) {
          console.error('Auth state change error:', err);
          setAuthError(err.message);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, setAuthLoading, setAuthError]);

  return <>{children}</>;
};

export default AuthInitializer;
