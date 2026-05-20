import { AdminUser } from '@/lib/types';
import { apiRequest } from '@/lib/api/client';
import {
  clearStoredAuth,
  getStoredAuth,
  saveAdminAuth,
} from '@/lib/authStorage';
import { recordAdminActivity } from '@/lib/adminSession';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

interface MeResponse {
  email: string;
  role: string;
}


export const authApi = {
  login: async (email: string, password: string): Promise<AdminUser> => {
    const data = await apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const now = Date.now();
    saveAdminAuth({
      email,
      isAuthenticated: true,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      token: data.access_token,
      lastActivity: now,
    });

    return authApi.getCurrentUser()!;
  },

  logout: async (): Promise<void> => {
    clearStoredAuth();
  },

  getCurrentUser: (): AdminUser | null => {
    const parsed = getStoredAuth();
    if (!parsed?.isAuthenticated) return null;

    return {
      email: parsed.email,
      isAuthenticated: true,
      token: parsed.accessToken ?? parsed.token,
      accessToken: parsed.accessToken ?? parsed.token,
      refreshToken: parsed.refreshToken,
      lastActivity: parsed.lastActivity,
    };
  },

  isAuthenticated: (): boolean => {
    const user = authApi.getCurrentUser();
    return Boolean(user?.isAuthenticated && (user.accessToken || user.token));
  },

  /** Call after meaningful admin interaction (optional; window listeners also update). */
  touchActivity: (): void => {
    recordAdminActivity();
  },

  me: async (): Promise<MeResponse> => {
    return apiRequest<MeResponse>('/api/auth/me', { method: 'GET' });
  },
};
