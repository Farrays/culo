/**
 * ServiceWorkerStatus Component
 * Shows offline indicator and update notification
 */

import React, { memo } from 'react';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { useTranslation } from 'react-i18next';

/**
 * Offline indicator banner
 */
const OfflineBanner: React.FC = memo(() => {
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
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-black px-4 py-2 text-center text-sm font-medium animate-slideDown"
      role="alert"
      aria-live="assertive"
    >
      <span className="inline-flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
        {t('offline_mode') || 'Sin conexión - Mostrando datos guardados'}
      </span>
    </div>
  );
});
OfflineBanner.displayName = 'OfflineBanner';

/**
 * Update available notification
 */
const UpdateBanner: React.FC<{ onUpdate: () => void }> = memo(({ onUpdate }) => {
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
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-primary-dark border border-primary-accent/20 rounded-xl p-4 shadow-xl animate-slideDown"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-primary-accent/20 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-primary-accent"
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
        </div>
        <div className="flex-1">
          <p className="font-medium text-neutral text-sm">
            {t('update_available') || 'Nueva versión disponible'}
          </p>
          <p className="text-neutral/60 text-xs mt-1">
            {t('update_description') || 'Actualiza para obtener las últimas mejoras'}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onUpdate}
          className="flex-1 px-4 py-2 bg-primary-accent text-white text-sm font-medium rounded-lg hover:bg-primary-accent/90 transition-colors"
        >
          {t('update_now') || 'Actualizar ahora'}
        </button>
      </div>
    </div>
  );
});
UpdateBanner.displayName = 'UpdateBanner';

/**
 * Service Worker Status Container
 * Renders offline banner and update notification when needed
 */
export const ServiceWorkerStatus: React.FC = memo(() => {
  const { isOffline, hasUpdate, update, isSupported } = useServiceWorker();

  // Don't render anything if SW not supported
  if (!isSupported) return null;

  return (
    <>
      {isOffline && <OfflineBanner />}
      {hasUpdate && <UpdateBanner onUpdate={update} />}
    </>
  );
});
ServiceWorkerStatus.displayName = 'ServiceWorkerStatus';

export default ServiceWorkerStatus;
