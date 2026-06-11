import { ApiError } from '@/lib/ApiError';
import { getAuthToken } from '@/lib/authStorage';
import { prepareAdminAuthBeforeRequest } from '@/lib/adminSession';
import { buildApiUrl } from '@/lib/api/config';

export { getApiBaseUrl, buildApiUrl } from '@/lib/api/config';

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

  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    const detail = err?.detail;
    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? JSON.stringify(detail)
          : detail != null
            ? JSON.stringify(detail)
            : `İstek başarısız (${response.status})`;
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
