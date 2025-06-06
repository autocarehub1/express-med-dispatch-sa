import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session, Provider, AuthError } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Define a type for our auth context
type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: object) => Promise<{ error: AuthError | null, user: User | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  signInWithProvider: (provider: Provider) => Promise<void>;
};

// Create the auth context with a default value
const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  signInWithProvider: async () => {},
});

// Export the useAuth hook directly
export const useAuth = () => useContext(AuthContext);

// Export the auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');

    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        // Get current session
        console.log('Getting current session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        console.log('Session data:', data);
        
        if (mounted) {
          setSession(data.session);
          setUser(data.session?.user || null);
          setIsLoading(false);
          console.log('Auth state initialized with user:', data.session?.user?.id || 'none');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event);
      
      if (mounted) {
        setSession(newSession);
        setUser(newSession?.user || null);
        setIsLoading(false);
        
        if (event === 'SIGNED_IN') {
          toast.success('Signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          toast.success('Signed out successfully');
        }
      }
    });

    // Clean up on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string, rememberMe = true) => {
    try {
      console.log('Signing in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: rememberMe
        }
      });

      if (!error) {
        console.log('Sign in successful:', data);
      } else {
        console.error('Sign in error:', error);
      }

      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: object) => {
    try {
      console.log('Signing up with email:', email, 'metadata:', metadata);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (!error && data.user) {
        console.log('Sign up successful:', data.user);
        toast.success('Verification email sent! Please check your inbox.');
      } else {
        console.error('Sign up error:', error);
      }

      return { error, user: data.user || null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as AuthError, user: null };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Failed to sign out');
      } else {
        console.log('Sign out successful');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      console.log('Sending password reset for email:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (!error) {
        console.log('Password reset email sent');
        toast.success('Password reset email sent!');
      } else {
        console.error('Password reset error:', error);
      }

      return { error };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: error as AuthError };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      console.log('Updating password');
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (!error) {
        console.log('Password updated successfully');
        toast.success('Password updated successfully!');
      } else {
        console.error('Update password error:', error);
      }

      return { error };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error as AuthError };
    }
  };

  // Sign in with provider
  const signInWithProvider = async (provider: Provider) => {
    try {
      console.log('Signing in with provider:', provider);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('OAuth sign in error:', error);
        toast.error(`Failed to sign in with ${provider}`);
      } else {
        console.log('OAuth sign in initiated');
      }
    } catch (error) {
      console.error('OAuth sign in error:', error);
    }
  };

  // Provide the auth context to children
  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    signInWithProvider,
  };

  console.log('Auth provider value:', { 
    user: user?.id || null, 
    session: session?.access_token ? '[token available]' : null,
    isLoading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
