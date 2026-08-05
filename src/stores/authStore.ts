import { create } from 'zustand';
import { User } from '@/types';
import { INITIAL_USER } from '@/utils/mockData';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  activeOrganization: string;
  setOrganization: (org: string) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  loginOAuth: (provider: 'Google' | 'Microsoft') => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: INITIAL_USER,
  token: 'mock-jwt-token-legalos-2026',
  isAuthenticated: true,
  activeOrganization: 'Acme Global Legal Ops',

  setOrganization: (org) => set({ activeOrganization: org }),

  login: async (email, _pass) => {
    await new Promise((r) => setTimeout(r, 600)); // smooth async delay
    const user: User = {
      ...INITIAL_USER,
      email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('legalos_jwt_token', 'mock-jwt-token-legalos-2026');
    }
    set({ user, isAuthenticated: true, token: 'mock-jwt-token-legalos-2026' });
    return true;
  },

  loginOAuth: async (provider) => {
    await new Promise((r) => setTimeout(r, 800));
    const user: User = {
      ...INITIAL_USER,
      name: provider === 'Google' ? 'Google Legal User' : 'Enterprise MS User',
      email: provider === 'Google' ? 'legal.user@gmail.com' : 'legal.user@microsoft.com',
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('legalos_jwt_token', `oauth-${provider.toLowerCase()}-token`);
    }
    set({ user, isAuthenticated: true, token: `oauth-${provider.toLowerCase()}-token` });
    return true;
  },

  register: async (name, email, _pass) => {
    await new Promise((r) => setTimeout(r, 800));
    const user: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: 'Senior Counsel',
      organization: 'Acme Global Legal Ops',
      createdAt: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    };
    set({ user, isAuthenticated: true, token: 'mock-registered-jwt-token' });
    return true;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('legalos_jwt_token');
    }
    set({ user: null, isAuthenticated: false, token: null });
  }
}));
