import { Component, ErrorInfo, ReactNode } from 'react';
import { captureException } from '../utils/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // In production: send to Sentry, in development: log to console
    captureException(error, { componentStack: errorInfo.componentStack });
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
          <div className="max-w-md text-center" role="alert" aria-live="assertive">
            <h1 className="text-4xl font-bold text-primary-accent mb-4">Oops! Algo salió mal</h1>
            <p className="text-neutral/90 mb-6">Lo sentimos, ha ocurrido un error inesperado.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-accent text-white px-6 py-3 rounded-lg hover:bg-primary-accent/90 transition font-bold"
            >
              Recargar página
            </button>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left bg-neutral/5 p-4 rounded">
                <summary className="cursor-pointer text-sm">
                  Detalles del error (solo en desarrollo)
                </summary>
                <pre className="text-xs mt-2 overflow-auto">{this.state.error.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
