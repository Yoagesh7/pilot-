import { supabase } from '@/lib/supabase';
import { User } from '@/types';

export const authService = {
  /**
   * Register a new user with email and password via Supabase Auth
   */
  async register(email: string, password: string, fullName: string, role: string = 'Senior Counsel') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Ensure profile row exists
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        email: email,
        role: role,
      });
    }

    return data;
  },

  /**
   * Login user with email and password
   */
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Set auth cookie for middleware check
    if (data.session) {
      document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=604800; SameSite=Lax`;
    }

    return data;
  },

  /**
   * Logout user and clear cookies/session
   */
  async logout() {
    document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'supabase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  /**
   * Send password reset email
   */
  async resetPassword(email: string) {
    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/reset-password`
      : 'http://localhost:3000/reset-password';

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Update password for user (after reset link callback)
   */
  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Get current authenticated session user and profile data
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
      avatar: profile?.avatar || session.user.user_metadata?.avatar,
      role: profile?.role || session.user.user_metadata?.role || 'Senior Counsel',
      organization: 'LegalOS Counsel',
      createdAt: session.user.created_at,
    };
  },
};
