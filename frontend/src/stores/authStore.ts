import { create } from 'zustand';
import type { AuthState, User } from '../types';
import { authApi } from '../api/client';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('rss_token'),
  isAuthenticated: !!localStorage.getItem('rss_token'),

  login: async (username: string, password: string) => {
    const { token, user } = await authApi.login(username, password);
    localStorage.setItem('rss_token', token);
    set({ user: user as User, token, isAuthenticated: true });
  },

  register: async (username: string, password: string) => {
    const { token, user } = await authApi.register(username, password);
    localStorage.setItem('rss_token', token);
    set({ user: user as User, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('rss_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      const { user } = await authApi.me();
      set({ user: user as User, isAuthenticated: true });
    } catch {
      localStorage.removeItem('rss_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
