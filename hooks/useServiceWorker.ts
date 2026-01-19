/**
 * useServiceWorker Hook
 * Manages Service Worker registration and communication
 *
 * Features:
 * - Auto-registration on mount
 * - Update notification
 * - Cache management
 * - Offline detection
 */

import { useEffect, useState, useCallback, useRef } from 'react';

interface ServiceWorkerState {
  /** Whether SW is supported and registered */
  isSupported: boolean;
  /** Whether SW is active and ready */
  isReady: boolean;
  /** Whether there's an update available */
  hasUpdate: boolean;
  /** Whether user is offline */
  isOffline: boolean;
  /** Registration object */
  registration: ServiceWorkerRegistration | null;
}

interface UseServiceWorkerReturn extends ServiceWorkerState {
  /** Force update to new SW version */
  update: () => void;
  /** Clear all caches */
  clearCache: () => void;
  /** Manually cache data */
  cacheData: (url: string, data: unknown) => void;
}

/**
 * Service Worker management hook
 */
export function useServiceWorker(): UseServiceWorkerReturn {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
    isReady: false,
    hasUpdate: false,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    registration: null,
  });

  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  /**
   * Register Service Worker
   */
  useEffect(() => {
    if (!state.isSupported) return;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        registrationRef.current = registration;
        setState(prev => ({
          ...prev,
          registration,
          isReady: !!registration.active,
        }));

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                setState(prev => ({ ...prev, hasUpdate: true }));
              }
            });
          }
        });

        // Listen for controlling SW change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setState(prev => ({ ...prev, isReady: true }));
        });

        // Successfully registered
      } catch (error) {
        console.error('[useServiceWorker] Registration failed:', error);
      }
    };

    registerSW();
  }, [state.isSupported]);

  /**
   * Listen for online/offline events
   */
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOffline: true }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Listen for messages from Service Worker
   */
  useEffect(() => {
    if (!state.isSupported) return;

    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data as { type: string; url?: string };

      // Handle SW messages silently in production
      // Could dispatch custom events for UI updates if needed
      if (type === 'REVALIDATING' || type === 'CACHE_UPDATED') {
        // Cache events handled silently
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, [state.isSupported]);

  /**
   * Force update to new Service Worker version
   */
  const update = useCallback(() => {
    if (!registrationRef.current?.waiting) return;

    // Tell waiting SW to skip waiting and activate
    registrationRef.current.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Reload page to get new version
    window.location.reload();
  }, []);

  /**
   * Clear all caches
   */
  const clearCache = useCallback(() => {
    if (!navigator.serviceWorker.controller) return;

    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
  }, []);

  /**
   * Manually cache data (e.g., prefetched classes)
   */
  const cacheData = useCallback((url: string, data: unknown) => {
    if (!navigator.serviceWorker.controller) return;

    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_CLASSES',
      url,
      data,
    });
  }, []);

  return {
    ...state,
    update,
    clearCache,
    cacheData,
  };
}

export default useServiceWorker;
