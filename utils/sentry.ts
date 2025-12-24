/**
 * Initialize Sentry error tracking (lazy loaded)
 * Only enabled in production with a valid DSN
 * Loads Sentry asynchronously to avoid blocking initial render
 */
export const initSentry = (): void => {
  // Get DSN from environment variable
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  // Only initialize in production and if DSN is configured
  if (import.meta.env.PROD && dsn) {
    // Use requestIdleCallback to load Sentry when browser is idle
    const loadSentry = () => {
      import('@sentry/react').then(Sentry => {
        Sentry.init({
          dsn,
          environment: import.meta.env.MODE || 'production',
          release: import.meta.env.VITE_APP_VERSION || 'unknown',
          integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
              maskAllText: true,
              blockAllMedia: true,
            }),
          ],
          tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE
            ? parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE)
            : 0.2,
          replaysSessionSampleRate: import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE
            ? parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE)
            : 0.1,
          replaysOnErrorSampleRate: 1.0,
          beforeSend(event, hint) {
            if (import.meta.env.DEV) return null;
            const error = hint.originalException;
            if (error instanceof Error) {
              if (error.message.includes('ResizeObserver')) return null;
              if (error.message.includes('Non-Error promise rejection')) return null;
              if (error.message.includes('ChunkLoadError')) return null;
            }
            return event;
          },
        });
        // Store reference globally for web-vitals integration
        window.Sentry = Sentry;
      });
    };

    // Load when browser is idle, or after 2s as fallback
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(loadSentry, { timeout: 2000 });
    } else {
      setTimeout(loadSentry, 2000);
    }
  }
};

/**
 * Capture exception manually (works with lazy-loaded Sentry)
 */
export const captureException = (error: Error, context?: Record<string, unknown>): void => {
  if (import.meta.env.PROD && window.Sentry) {
    window.Sentry.captureException(error, { extra: context });
  } else if (import.meta.env.DEV) {
    console.error('Error captured:', error, context);
  }
};

/**
 * Set user context for error tracking
 */
export const setUser = (user: { id?: string; email?: string; username?: string }): void => {
  if (window.Sentry) {
    window.Sentry.setUser(user);
  }
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (message: string, data?: Record<string, unknown>): void => {
  if (window.Sentry) {
    window.Sentry.addBreadcrumb({
      message,
      data,
      level: 'info',
    });
  }
};
