import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/authService';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  initAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,

  initAuth: async () => {
    try {
      set({ loading: true });

      // Get current active session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const user = await authService.getCurrentUser();
        set({
          session,
          user,
          isAuthenticated: !!user,
          loading: false,
        });

        // Set cookie for Next.js middleware
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=604800; SameSite=Lax`;
      } else {
        set({
          session: null,
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (event === 'SIGNED_IN' && newSession) {
          const user = await authService.getCurrentUser();
          set({ session: newSession, user, isAuthenticated: !!user, loading: false });
          document.cookie = `sb-access-token=${newSession.access_token}; path=/; max-age=604800; SameSite=Lax`;
        } else if (event === 'SIGNED_OUT') {
          document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          set({ session: null, user: null, isAuthenticated: false, loading: false });
        }
      });
    } catch (err) {
      console.error('[AuthStore] initAuth error:', err);
      set({ loading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session }),

  logout: async () => {
    await authService.logout();
    set({ user: null, session: null, isAuthenticated: false });
  },
}));
