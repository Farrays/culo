// Type definitions for Google Analytics gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    Sentry?: {
      captureMessage: (message: string, options?: Record<string, unknown>) => void;
      captureException: (error: Error, options?: Record<string, unknown>) => void;
    };
  }
}

export {};
