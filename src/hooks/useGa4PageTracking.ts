import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGa4, isGa4Enabled, trackGa4PageView } from '@/lib/ga4';

function buildPagePath(pathname: string, search: string): string {
  return `${pathname}${search}`;
}

export function useGa4PageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (!isGa4Enabled()) return;
    initGa4();
  }, []);

  useEffect(() => {
    if (!isGa4Enabled()) return;
    if (location.pathname.startsWith('/admin')) return;

    trackGa4PageView(buildPagePath(location.pathname, location.search));
  }, [location.pathname, location.search]);
}
