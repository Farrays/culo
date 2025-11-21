import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry error tracking
 * Only enabled in production with a valid DSN
 */
export const initSentry = (): void => {
  // Get DSN from environment variable
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  // Only initialize in production and if DSN is configured
  if (import.meta.env.PROD && dsn) {
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
      // Performance Monitoring
      tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE
        ? parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE)
        : 0.2, // Capture 20% of transactions by default
      // Session Replay
      replaysSessionSampleRate: import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE
        ? parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE)
        : 0.1, // Sample 10% of sessions
      replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
      // Filter out non-critical errors
      beforeSend(event, hint) {
        // Don't send development errors
        if (import.meta.env.DEV) return null;

        // Filter out known non-critical errors
        const error = hint.originalException;
        if (error instanceof Error) {
          if (error.message.includes('ResizeObserver')) return null;
          if (error.message.includes('Non-Error promise rejection')) return null;
          if (error.message.includes('ChunkLoadError')) return null;
        }

        return event;
      },
    });

    // Log successful initialization in development
    if (import.meta.env.DEV) {
      console.warn('✅ Sentry initialized successfully');
    }
  } else if (!dsn && import.meta.env.PROD) {
    console.warn('⚠️ Sentry DSN not configured. Error tracking disabled.');
  }
};

/**
 * Capture exception manually
 */
export const captureException = (error: Error, context?: Record<string, unknown>): void => {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('Error captured:', error, context);
  }
};

/**
 * Set user context for error tracking
 */
export const setUser = (user: { id?: string; email?: string; username?: string }): void => {
  Sentry.setUser(user);
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (message: string, data?: Record<string, unknown>): void => {
  Sentry.addBreadcrumb({
    message,
    data,
    level: 'info',
  });
};
