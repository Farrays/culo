/**
 * BookingErrorBoundary Component
 * Catches JavaScript errors in the booking widget and displays a fallback UI
 * Prevents the entire app from crashing due to widget errors
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

// Generate unique error ID for tracking
function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Functional component for the fallback UI (uses i18n hook)
interface ErrorFallbackProps {
  errorId: string | null;
  onRetry: () => void;
}

function ErrorFallbackUI({ errorId, onRetry }: ErrorFallbackProps) {
  const { t } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);

  return (
    <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      <div className="text-center py-8">
        {/* Error icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error message */}
        <h3 className="text-xl font-bold text-neutral mb-2">{t('booking_error_boundary_title')}</h3>
        <p className="text-neutral/60 mb-6 max-w-md mx-auto">
          {t('booking_error_boundary_message')}
        </p>

        {/* Error ID for support */}
        {errorId && (
          <p className="text-xs text-neutral/40 mb-4">
            {t('booking_error_boundary_error_id')}: {errorId}
          </p>
        )}

        {/* Retry button */}
        <button
          type="button"
          onClick={onRetry}
          className="
            px-6 py-3 bg-primary-accent text-white font-bold rounded-xl
            transition-all duration-300
            hover:shadow-accent-glow hover:scale-[1.02]
            flex items-center gap-2 mx-auto
          "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {t('booking_error_boundary_retry')}
        </button>

        {/* Alternative contact */}
        <p className="mt-6 text-sm text-neutral/50">
          {t('booking_error_boundary_help')}{' '}
          <a
            href="https://wa.me/34666555444"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-accent hover:underline"
          >
            {t('booking_error_boundary_contact')}
          </a>
        </p>
      </div>
    </div>
  );
}

export class BookingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('BookingWidget Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
    }

    // Call optional error handler (e.g., for Sentry)
    this.props.onError?.(error, errorInfo);

    // Push to dataLayer for analytics
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'booking_widget_crash',
        error_message: error.message,
        error_id: this.state.errorId,
        error_stack: error.stack?.slice(0, 500),
      });
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
    this.props.onRetry?.();
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI with i18n support
      return <ErrorFallbackUI errorId={this.state.errorId} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

export default BookingErrorBoundary;
