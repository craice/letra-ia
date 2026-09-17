// Thin wrapper over GA4. `gtag` only exists on the published site (see index.html),
// so everywhere else these calls do nothing. Never pass personal data here:
// the player name typed on the certificate must not leave the browser.
type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Params = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}

export function trackScreen(name: string, params: Params = {}): void {
  track('screen_view', { screen_name: name, ...params });
}
