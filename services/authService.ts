import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const ADMIN_SESSION_KEY = 'cleanUpBrosAdminSession';
const ADMIN_EMAIL_KEY = 'cleanUpBrosAdminEmail';

export interface AuthResult {
  success: boolean;
  email?: string;
  error?: string;
}

// Sign in with Supabase Auth
export const signInWithSupabase = async (email: string, password: string): Promise<AuthResult> => {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Store session in localStorage
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      localStorage.setItem(ADMIN_EMAIL_KEY, email);
      return { success: true, email };
    }

    return { success: false, error: 'Login failed' };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Sign up with Supabase Auth
export const signUpWithSupabase = async (email: string, password: string): Promise<AuthResult> => {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Supabase signup error:', error);
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Add user to admin_users table
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: data.user.id,
          email: email,
        });

      if (insertError) {
        console.error('Failed to create admin user record:', insertError);
      }

      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      localStorage.setItem(ADMIN_EMAIL_KEY, email);
      return { success: true, email };
    }

    return { success: false, error: 'Signup failed' };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Main sign in function - Supabase only (PRODUCTION READY)
export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  // SECURITY: Only use Supabase authentication
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase not configured! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    return {
      success: false,
      error: 'Authentication service not configured. Please contact support.'
    };
  }

  return await signInWithSupabase(email, password);
};

// Sign out
export const signOut = async (): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    await supabase.auth.signOut();
  }

  localStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(ADMIN_EMAIL_KEY);
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
};

// Get current user email
export const getCurrentUserEmail = (): string | null => {
  return localStorage.getItem(ADMIN_EMAIL_KEY);
};

// Check Supabase session on app load
export const checkSupabaseSession = async (): Promise<AuthResult | null> => {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      localStorage.setItem(ADMIN_EMAIL_KEY, session.user.email || '');
      return { success: true, email: session.user.email || '' };
    }
  } catch (error) {
    console.error('Session check error:', error);
  }

  return null;
};
