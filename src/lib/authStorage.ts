export const AUTH_KEY = 'felt_admin_auth';

/** Persisted admin session (localStorage) */
export interface StoredAdminAuth {
  email: string;
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
  /** Mirrors accessToken for backward compatibility */
  token?: string;
  lastActivity?: number;
}

function parseStored(): StoredAdminAuth | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAdminAuth;
  } catch {
    return null;
  }
}

export function getStoredAuth(): StoredAdminAuth | null {
  return parseStored();
}

export function getAuthToken(): string | null {
  const s = parseStored();
  return s?.accessToken ?? s?.token ?? null;
}

export function getRefreshToken(): string | null {
  const s = parseStored();
  return s?.refreshToken ?? null;
}

export function getLastActivityTimestamp(): number {
  const s = parseStored();
  if (typeof s?.lastActivity === 'number') return s.lastActivity;
  if (s?.isAuthenticated && (s.accessToken || s.token)) {
    const now = Date.now();
    patchStoredAuth({ lastActivity: now });
    return now;
  }
  return Date.now();
}

export function saveAdminAuth(data: StoredAdminAuth): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function patchStoredAuth(partial: Partial<StoredAdminAuth>): void {
  const cur = parseStored();
  if (!cur) return;
  saveAdminAuth({ ...cur, ...partial });
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}
