import { create } from 'zustand';
import type { AuthState, User } from '../types';
import { authApi } from '../api/client';

// La autenticación se desactiva cuando el frontend se publica sin backend
// (p. ej. GitHub Pages), entrando en "modo lectura" con un usuario invitado.
// Se activa en el build con VITE_DISABLE_AUTH=true (ver .github/workflows)
// o se detecta en tiempo de ejecución cuando se sirve desde GitHub Pages.
export const authDisabled =
  import.meta.env.VITE_DISABLE_AUTH === 'true' ||
  (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io'));

const GUEST_USER: User = { id: 0, username: 'VISITANTE', role: 'user' };

export const useAuthStore = create<AuthState>((set) => ({
  user: authDisabled ? GUEST_USER : null,
  token: null,
  isAuthenticated: authDisabled ? true : !!localStorage.getItem('rss_token'),

  login: async (username: string, password: string) => {
    if (authDisabled) {
      set({ user: GUEST_USER, token: null, isAuthenticated: true });
      return;
    }
    const { token, user } = await authApi.login(username, password);
    localStorage.setItem('rss_token', token);
    set({ user: user as User, token, isAuthenticated: true });
  },

  register: async (username: string, password: string) => {
    if (authDisabled) {
      set({ user: GUEST_USER, token: null, isAuthenticated: true });
      return;
    }
    const { token, user } = await authApi.register(username, password);
    localStorage.setItem('rss_token', token);
    set({ user: user as User, token, isAuthenticated: true });
  },

  logout: () => {
    if (authDisabled) return;
    localStorage.removeItem('rss_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    if (authDisabled) return;
    try {
      const { user } = await authApi.me();
      set({ user: user as User, isAuthenticated: true });
    } catch {
      localStorage.removeItem('rss_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
