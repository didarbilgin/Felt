import { AdminUser } from '../types';

const AUTH_KEY = 'felt_admin_auth';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const authApi = {
  login: async (email: string, password: string): Promise<AdminUser> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'Giriş başarısız.');
    }

    const data = await response.json();

    const user: AdminUser = {
      email,
      isAuthenticated: true,
      token: data.access_token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      lastActivity: Date.now(),
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser: (): AdminUser | null => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored) as AdminUser;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    const user = authApi.getCurrentUser();
    return Boolean(user?.isAuthenticated && (user.accessToken || user.token));
  },
};
