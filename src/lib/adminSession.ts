import { ApiError } from '@/lib/ApiError';
import {
  AUTH_KEY,
  clearStoredAuth,
  getAuthToken,
  getLastActivityTimestamp,
  getRefreshToken,
  getStoredAuth,
  patchStoredAuth,
} from '@/lib/authStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/** Refresh access token when it expires within this window (ms) */
export const ACCESS_REFRESH_THRESHOLD_MS = 2 * 60 * 1000;

/** No activity for this long → session cleared */
export const IDLE_TIMEOUT_MS = 45 * 60 * 1000;

let refreshInFlight: Promise<void> | null = null;

let lastActivityThrottle = 0;
const ACTIVITY_THROTTLE_MS = 500;

function decodeJwtExpMs(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=')));
    if (typeof json.exp !== 'number') return null;
    return json.exp * 1000;
  } catch {
    return null;
  }
}

export function recordAdminActivity(): void {
  const now = Date.now();
  if (now - lastActivityThrottle < ACTIVITY_THROTTLE_MS) return;
  lastActivityThrottle = now;
  const s = getStoredAuth();
  if (!s?.isAuthenticated || !(s.accessToken || s.token)) return;
  patchStoredAuth({ lastActivity: now });
}

export function clearAuthAndRedirectToLogin(): void {
  clearStoredAuth();
  if (typeof window === 'undefined') return;
  if (!window.location.pathname.startsWith('/admin/login')) {
    window.location.assign('/admin/login');
  }
}

async function performRefresh(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token');
  }

  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new ApiError(res.status, err?.detail || 'Refresh failed');
  }

  const data = (await res.json()) as { access_token: string };
  patchStoredAuth({
    accessToken: data.access_token,
    token: data.access_token,
    lastActivity: Date.now(),
  });
}

function refreshAccessTokenSerialized(): Promise<void> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      await performRefresh();
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

function shouldSkipAuthPrep(path: string): boolean {
  return path.startsWith('/api/auth/login') || path.startsWith('/api/auth/refresh');
}

/**
 * Idle check + proactive access token refresh before authenticated API calls.
 * Skips login/refresh paths and when no access token is stored.
 */
export async function prepareAdminAuthBeforeRequest(path: string): Promise<void> {
  if (shouldSkipAuthPrep(path)) return;

  const access = getAuthToken();
  if (!access) return;

  const last = getLastActivityTimestamp();
  if (Date.now() - last >= IDLE_TIMEOUT_MS) {
    clearAuthAndRedirectToLogin();
    throw new ApiError(401, 'Oturum hareketsizlik nedeniyle sonlandı');
  }

  const expMs = decodeJwtExpMs(access);
  const refreshToken = getRefreshToken();
  const msToExpiry = expMs != null ? expMs - Date.now() : ACCESS_REFRESH_THRESHOLD_MS + 1;

  const needsRefresh = expMs == null || msToExpiry < ACCESS_REFRESH_THRESHOLD_MS;

  if (needsRefresh) {
    if (!refreshToken) {
      clearAuthAndRedirectToLogin();
      throw new ApiError(401, 'Oturum yenilenemedi; lütfen tekrar giriş yapın');
    }
    try {
      await refreshAccessTokenSerialized();
    } catch (e) {
      clearAuthAndRedirectToLogin();
      if (e instanceof ApiError) throw e;
      throw new ApiError(401, 'Oturum yenilenemedi');
    }
  }
}

/** Attach to window while admin UI is mounted */
export function attachAdminActivityListeners(): () => void {
  const onActivity = () => recordAdminActivity();
  const opts: AddEventListenerOptions = { passive: true };
  for (const ev of ['mousemove', 'keydown', 'click', 'scroll'] as const) {
    window.addEventListener(ev, onActivity, opts);
  }
  recordAdminActivity();
  return () => {
    for (const ev of ['mousemove', 'keydown', 'click', 'scroll'] as const) {
      window.removeEventListener(ev, onActivity);
    }
  };
}
