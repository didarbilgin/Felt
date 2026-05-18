import { ApiError } from '@/lib/ApiError';
import { getAuthToken } from '@/lib/authStorage';
import { prepareAdminAuthBeforeRequest } from '@/lib/adminSession';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export { ApiError } from '@/lib/ApiError';
export { AUTH_KEY, getStoredAuth, getAuthToken } from '@/lib/authStorage';

export const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  await prepareAdminAuthBeforeRequest(path);

  const headers = new Headers(init?.headers || {});
  const token = getAuthToken();

  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new ApiError(response.status, err?.detail || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
