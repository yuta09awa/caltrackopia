
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/appStore';
import { AuthService } from '@/services/authService';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const { setUser, setAuthLoading, setAuthError } = useAppStore();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setAuthLoading(true);
        setAuthError(null);
        
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          setAuthError(error.message);
          setUser(null);
          return;
        }

        if (session?.user) {
          const profileData = await AuthService.fetchUserProfile(session.user.id);
          const user = await AuthService.transformSupabaseUserToUser(session.user, profileData);
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
              // Use setTimeout(0) to defer data fetching and prevent potential deadlocks
              setTimeout(async () => {
                try {
                  const profileData = await AuthService.fetchUserProfile(session.user.id);
                  const user = await AuthService.transformSupabaseUserToUser(session.user, profileData);
                  setUser(user);
                } catch (err: any) {
                  console.error('Deferred profile fetch error:', err);
                  setAuthError(err.message);
                }
              }, 0);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            // Clear any stored auth data
            localStorage.removeItem('supabase.auth.token');
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
                localStorage.removeItem(key);
              }
            });
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
