import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  updateUserProfile: (fullName: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check for remembered session on app start
  useEffect(() => {
    const rememberedSession = localStorage.getItem('remembered_session');
    if (rememberedSession) {
      try {
        const sessionData = JSON.parse(rememberedSession);
        const expiryTime = sessionData.expiryTime;
        
        // Check if remembered session is still valid (30 days)
        if (Date.now() < expiryTime) {
          setUser(sessionData.user);
          setSession(sessionData.session);
        } else {
          // Clean up expired remembered session
          localStorage.removeItem('remembered_session');
        }
      } catch (error) {
        console.error('Error parsing remembered session:', error);
        localStorage.removeItem('remembered_session');
      }
    }
  }, []);

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl === 'https://placeholder.supabase.co' || 
        supabaseAnonKey === 'placeholder-key') {
      console.warn('Supabase not configured. Authentication features will be limited.');
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      // Check for hardcoded admin login
      if (email === 'admin@demo.com' && password === 'admin') {
        // Create a mock user object for the hardcoded admin
        const mockAdminUser = {
          id: 'admin-demo-user',
          email: 'admin@demo.com',
          user_metadata: {
            full_name: 'Demo Admin'
          },
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString()
        };
        
        setUser(mockAdminUser as any);
        setSession({ user: mockAdminUser, access_token: 'demo-token' } as any);
        
        // Handle remember me for demo admin
        if (rememberMe) {
          const rememberedData = {
            user: mockAdminUser,
            session: { user: mockAdminUser, access_token: 'demo-token' },
            expiryTime: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
          };
          localStorage.setItem('remembered_session', JSON.stringify(rememberedData));
        }
        
        toast.success('Signed in successfully!');
        return;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Handle remember me for Supabase users
      if (rememberMe && data.user && data.session) {
        const rememberedData = {
          user: data.user,
          session: data.session,
          expiryTime: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
        };
        localStorage.setItem('remembered_session', JSON.stringify(rememberedData));
      }
      
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/signin`,
          data: fullName ? { full_name: fullName } : undefined,
        },
      });
      
      if (error) throw error;
      toast.success('Please check your email for confirmation link!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear remembered session
      localStorage.removeItem('remembered_session');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Facebook');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/signin`,
        },
      });
      
      if (error) throw error;
      toast.success('Confirmation email sent! Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send confirmation email');
      throw error;
    }
  };

  const updateUserProfile = async (fullName: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (error) throw error;
      
      // Update local user state immediately
      if (data.user) {
        setUser(data.user);
      }
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      toast.success('Password updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        signInWithFacebook,
        resetPassword,
        resendConfirmationEmail,
        updateUserProfile,
        updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};