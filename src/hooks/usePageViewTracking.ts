import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsApi } from '@/lib/api/analytics';
import { getOrCreateVisitorId } from '@/lib/visitorId';

const SESSION_VISIT_KEY = 'felt_site_visit_tracked';

const PUBLIC_PATH_PREFIXES = [
  '/',
  '/about',
  '/research',
  '/programs',
  '/lab',
  '/events',
  '/community',
  '/blog',
  '/contact',
];

function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith('/admin')) return false;
  return PUBLIC_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || (prefix !== '/' && pathname.startsWith(`${prefix}/`))
  );
}

/** Count one site visit per browser session (not per SPA route change). */
export function usePageViewTracking() {
  const location = useLocation();

  useEffect(() => {
    if (!isPublicPath(location.pathname)) return;
    if (typeof sessionStorage === 'undefined') return;
    if (sessionStorage.getItem(SESSION_VISIT_KEY)) return;

    sessionStorage.setItem(SESSION_VISIT_KEY, '1');
    const visitorId = getOrCreateVisitorId();
    analyticsApi.trackSiteVisit(visitorId).catch(() => {
      // Non-blocking; analytics must not affect navigation.
    });
  }, [location.pathname]);
}
