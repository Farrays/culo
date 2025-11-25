// Type definitions for Google Analytics gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Sentry?: any;
  }
}

export {};
