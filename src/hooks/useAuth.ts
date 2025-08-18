import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';
import { environment } from '@/config/environment';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<{ error?: AuthError }>;
  resetPassword: (email: string) => Promise<{ error?: AuthError }>;
  updateProfile: (updates: Record<string, any>) => Promise<{ error?: Error }>;
}

export const useAuth = (): AuthState & AuthActions => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false
  });

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        errorHandler.logUserAction('auth_state_change', { event, userId: session?.user?.id });

        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
          initialized: true
        }));

        // Handle auth events
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer profile check to avoid blocking auth state update
          setTimeout(() => {
            checkProfileCompletion(session.user.id);
          }, 0);
        }

        if (event === 'SIGNED_OUT') {
          errorHandler.logUserAction('user_signed_out');
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          errorHandler.handleError(error, { context: 'auth_initialization' });
        }

        if (isMounted) {
          setAuthState(prev => ({
            ...prev,
            session,
            user: session?.user ?? null,
            loading: false,
            initialized: true
          }));
        }
      } catch (error) {
        if (isMounted) {
          errorHandler.handleError(error as Error, { context: 'auth_initialization' });
          setAuthState(prev => ({
            ...prev,
            loading: false,
            initialized: true
          }));
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkProfileCompletion = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('check_profile_completion', { user_id: userId });
      
      if (error) {
        errorHandler.handleError(error, { context: 'profile_completion_check' });
        return;
      }

      errorHandler.logUserAction('profile_completion_checked', { 
        userId, 
        isComplete: data 
      });
    } catch (error) {
      errorHandler.handleError(error as Error, { context: 'profile_completion_check' });
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      errorHandler.logUserAction('sign_in_attempt', { email });
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        errorHandler.handleError(error, { 
          context: 'sign_in',
          email 
        });
      } else {
        errorHandler.logUserAction('sign_in_success', { email });
      }

      return { error };
    } catch (error) {
      const authError = error as AuthError;
      errorHandler.handleError(authError, { context: 'sign_in', email });
      return { error: authError };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata = {}) => {
    try {
      errorHandler.logUserAction('sign_up_attempt', { email });
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });

      if (error) {
        errorHandler.handleError(error, { 
          context: 'sign_up',
          email 
        });
      } else {
        errorHandler.logUserAction('sign_up_success', { email });
      }

      return { error };
    } catch (error) {
      const authError = error as AuthError;
      errorHandler.handleError(authError, { context: 'sign_up', email });
      return { error: authError };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      errorHandler.logUserAction('sign_out_attempt', { userId: authState.user?.id });
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        errorHandler.handleError(error, { context: 'sign_out' });
      } else {
        errorHandler.logUserAction('sign_out_success');
      }

      return { error };
    } catch (error) {
      const authError = error as AuthError;
      errorHandler.handleError(authError, { context: 'sign_out' });
      return { error: authError };
    }
  }, [authState.user?.id]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      errorHandler.logUserAction('password_reset_attempt', { email });
      
      const redirectUrl = `${window.location.origin}/auth/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        errorHandler.handleError(error, { 
          context: 'password_reset',
          email 
        });
      } else {
        errorHandler.logUserAction('password_reset_success', { email });
      }

      return { error };
    } catch (error) {
      const authError = error as AuthError;
      errorHandler.handleError(authError, { context: 'password_reset', email });
      return { error: authError };
    }
  }, []);

  const updateProfile = useCallback(async (updates: Record<string, any>) => {
    try {
      if (!authState.user) {
        throw new Error('No authenticated user');
      }

      errorHandler.logUserAction('profile_update_attempt', { 
        userId: authState.user.id,
        fields: Object.keys(updates)
      });

      const { error } = await supabase
        .rpc('secure_profile_update', {
          profile_id: authState.user.id,
          update_data: updates
        });

      if (error) {
        errorHandler.handleError(error, { 
          context: 'profile_update',
          userId: authState.user.id 
        });
        return { error };
      }

      errorHandler.logUserAction('profile_update_success', { 
        userId: authState.user.id 
      });

      return { error: undefined };
    } catch (error) {
      errorHandler.handleError(error as Error, { 
        context: 'profile_update',
        userId: authState.user?.id 
      });
      return { error: error as Error };
    }
  }, [authState.user]);

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  };
};