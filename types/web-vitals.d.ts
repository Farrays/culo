// Type definitions for Google Analytics gtag and Meta Pixel
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'js' | 'config' | 'consent' | 'set',
      targetOrAction: string | Date,
      params?: Record<string, unknown>
    ) => void;
    fbq?: (
      command: 'track' | 'trackCustom' | 'init',
      event: string,
      params?: Record<string, unknown>
    ) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Sentry?: any;
  }
}

export {};
