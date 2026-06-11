declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

/** GA4 Measurement ID from env (Vite exposes `VITE_*` variables only). */
export function getGaMeasurementId(): string | undefined {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  return id || undefined;
}

export function isGa4Enabled(): boolean {
  return Boolean(getGaMeasurementId());
}

/** Load gtag.js once; manual page views for SPA navigation. */
export function initGa4(): void {
  const measurementId = getGaMeasurementId();
  if (!measurementId || typeof window === 'undefined' || initialized) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  initialized = true;
}

export function trackGa4PageView(path: string): void {
  const measurementId = getGaMeasurementId();
  if (!measurementId || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: path,
    send_to: measurementId,
  });
}
