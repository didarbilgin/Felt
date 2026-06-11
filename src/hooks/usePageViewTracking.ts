import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsApi } from '@/lib/api/analytics';
import { getOrCreateVisitorId } from '@/lib/visitorId';

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

export function usePageViewTracking() {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (!isPublicPath(path)) return;
    if (lastTrackedPath.current === path) return;

    lastTrackedPath.current = path;
    const visitorId = getOrCreateVisitorId();
    analyticsApi.trackPageView(path, visitorId).catch(() => {
      // Non-blocking; analytics must not affect navigation.
    });
  }, [location.pathname]);
}
