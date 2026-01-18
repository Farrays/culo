/**
 * CSRF Token Hook
 * Provides CSRF token management for form submissions
 *
 * Usage:
 * 1. Backend must provide GET /api/csrf endpoint that returns { token: string }
 * 2. Backend must validate X-CSRF-Token header on POST requests
 */

import { useState, useEffect, useCallback } from 'react';

interface CsrfState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Token cache to avoid multiple fetches
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

// Token validity duration (15 minutes)
const TOKEN_VALIDITY_MS = 15 * 60 * 1000;

/**
 * Check if token is still valid
 */
function isTokenValid(): boolean {
  if (!cachedToken || !tokenExpiry) return false;
  return Date.now() < tokenExpiry;
}

interface UseCsrfTokenReturn {
  token: string | null;
  loading: boolean;
  error: string | null;
  fetchToken: () => Promise<string | null>;
  refreshToken: () => Promise<string | null>;
  getHeaders: () => Record<string, string>;
}

/**
 * Hook to manage CSRF token
 */
export function useCsrfToken(): UseCsrfTokenReturn {
  const [state, setState] = useState<CsrfState>({
    token: isTokenValid() ? cachedToken : null,
    loading: false,
    error: null,
  });

  const fetchToken = useCallback(async () => {
    // Return cached token if still valid
    if (isTokenValid() && cachedToken) {
      setState({ token: cachedToken, loading: false, error: null });
      return cachedToken;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/csrf', {
        method: 'GET',
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }

      const data = await response.json();
      const token = data.token;

      // Cache the token
      cachedToken = token;
      tokenExpiry = Date.now() + TOKEN_VALIDITY_MS;

      setState({ token, loading: false, error: null });
      return token;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setState({ token: null, loading: false, error });
      return null;
    }
  }, []);

  // Fetch token on mount if not cached
  useEffect(() => {
    if (!isTokenValid()) {
      fetchToken();
    }
  }, [fetchToken]);

  /**
   * Get headers with CSRF token for fetch requests
   */
  const getCsrfHeaders = useCallback((): Record<string, string> => {
    if (!state.token) {
      return {};
    }
    return {
      'X-CSRF-Token': state.token,
    };
  }, [state.token]);

  /**
   * Refresh token (useful after submission or on error)
   */
  const refreshToken = useCallback(() => {
    cachedToken = null;
    tokenExpiry = null;
    return fetchToken();
  }, [fetchToken]);

  return {
    token: state.token,
    loading: state.loading,
    error: state.error,
    getCsrfHeaders,
    refreshToken,
    fetchToken,
  };
}

/**
 * Get CSRF token synchronously (from cache only)
 * Returns null if no valid token cached
 */
export function getCachedCsrfToken(): string | null {
  return isTokenValid() ? cachedToken : null;
}
