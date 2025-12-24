import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { useCookieConsent, CookiePreferences } from '../../hooks/useCookieConsent';
import { initializeAnalytics } from '../../utils/analytics';
import { XMarkIcon } from '../../lib/icons';

// ============================================================================
// TYPES
// ============================================================================

interface CookieCategory {
  id: keyof Omit<CookiePreferences, 'essential'>;
  titleKey: string;
  descriptionKey: string;
  required?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'analytics',
    titleKey: 'cookies_category_analytics',
    descriptionKey: 'cookies_category_analytics_desc',
  },
  {
    id: 'marketing',
    titleKey: 'cookies_category_marketing',
    descriptionKey: 'cookies_category_marketing_desc',
  },
  {
    id: 'functional',
    titleKey: 'cookies_category_functional',
    descriptionKey: 'cookies_category_functional_desc',
  },
];

// ============================================================================
// TOGGLE COMPONENT
// ============================================================================

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = memo(function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
        border-2 border-transparent transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${checked ? 'bg-primary-accent' : 'bg-neutral/30'}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full
          bg-white shadow ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
});

// ============================================================================
// SETTINGS MODAL COMPONENT
// ============================================================================

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: Omit<CookiePreferences, 'essential'>) => void;
  initialPreferences?: CookiePreferences | null;
}

const SettingsModal: React.FC<SettingsModalProps> = memo(function SettingsModal({
  isOpen,
  onClose,
  onSave,
  initialPreferences,
}) {
  const { t, locale } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);

  const [preferences, setPreferences] = useState({
    analytics: initialPreferences?.analytics ?? false,
    marketing: initialPreferences?.marketing ?? false,
    functional: initialPreferences?.functional ?? false,
  });

  // Reset preferences when modal opens
  useEffect(() => {
    if (isOpen) {
      setPreferences({
        analytics: initialPreferences?.analytics ?? false,
        marketing: initialPreferences?.marketing ?? false,
        functional: initialPreferences?.functional ?? false,
      });
    }
  }, [isOpen, initialPreferences]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleToggle = useCallback((id: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [id]: value }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(preferences);
  }, [preferences, onSave]);

  const handleAcceptAll = useCallback(() => {
    onSave({ analytics: true, marketing: true, functional: true });
  }, [onSave]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-settings-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-black border border-primary-accent/30 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-neutral/20 px-6 py-4 flex items-center justify-between">
          <h2 id="cookie-settings-title" className="text-xl font-bold text-neutral">
            {t('cookies_settings_title')}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral/70 hover:text-neutral transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-accent"
            aria-label={t('close')}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Essential cookies (always on) */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral/10">
            <div className="flex-1">
              <h3 className="font-semibold text-neutral">{t('cookies_category_essential')}</h3>
              <p className="text-sm text-neutral/70 mt-1">{t('cookies_category_essential_desc')}</p>
            </div>
            <ToggleSwitch
              checked={true}
              onChange={() => {}}
              disabled={true}
              label={t('cookies_category_essential')}
            />
          </div>

          {/* Other categories */}
          {COOKIE_CATEGORIES.map(category => (
            <div
              key={category.id}
              className="flex items-start justify-between gap-4 pb-4 border-b border-neutral/10 last:border-b-0"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-neutral">{t(category.titleKey)}</h3>
                <p className="text-sm text-neutral/70 mt-1">{t(category.descriptionKey)}</p>
              </div>
              <ToggleSwitch
                checked={preferences[category.id]}
                onChange={value => handleToggle(category.id, value)}
                label={t(category.titleKey)}
              />
            </div>
          ))}

          {/* Link to cookie policy */}
          <p className="text-sm text-neutral/60">
            {t('cookies_more_info')}{' '}
            <Link
              to={`/${locale}/politica-cookies`}
              className="text-primary-accent hover:underline"
              onClick={onClose}
            >
              {t('cookies_policy_link')}
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-black border-t border-neutral/20 px-6 py-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 border border-neutral/50 text-neutral rounded-full font-semibold hover:bg-neutral/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent"
          >
            {t('cookies_save_preferences')}
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-6 py-3 bg-primary-accent text-white rounded-full font-semibold hover:bg-primary-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black"
          >
            {t('cookies_accept_all')}
          </button>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// MAIN BANNER COMPONENT
// ============================================================================

const CookieBanner: React.FC = memo(function CookieBanner() {
  const { t, locale } = useI18n();
  const {
    preferences,
    hasConsented,
    isLoading,
    acceptAll,
    rejectAll,
    savePreferences,
    showBanner,
  } = useCookieConsent();

  const [showSettings, setShowSettings] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animate banner entrance
  useEffect(() => {
    if (showBanner && !isLoading) {
      // Small delay for entrance animation
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
    setIsVisible(false);
    return undefined;
  }, [showBanner, isLoading]);

  // Initialize analytics if user already consented (on page load)
  useEffect(() => {
    if (hasConsented && !isLoading) {
      initializeAnalytics();
    }
  }, [hasConsented, isLoading]);

  const handleAcceptAll = useCallback(() => {
    acceptAll();
    initializeAnalytics();
  }, [acceptAll]);

  const handleRejectAll = useCallback(() => {
    rejectAll();
  }, [rejectAll]);

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const handleSavePreferences = useCallback(
    (prefs: Omit<CookiePreferences, 'essential'>) => {
      savePreferences(prefs);
      setShowSettings(false);
      initializeAnalytics();
    },
    [savePreferences]
  );

  // Don't render if loading or already consented (unless settings modal is open)
  if (isLoading) return null;
  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Main Banner */}
      {showBanner && (
        <div
          className={`
            fixed bottom-0 left-0 right-0 z-50
            bg-black/95 backdrop-blur-md border-t border-primary-accent/30
            transform transition-transform duration-300 ease-out
            ${isVisible ? 'translate-y-0' : 'translate-y-full'}
          `}
          role="dialog"
          aria-modal="false"
          aria-label={t('cookies_banner_title')}
        >
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
              {/* Text */}
              <div className="flex-1 text-neutral">
                <h3 className="font-bold text-lg mb-1">{t('cookies_banner_title')}</h3>
                <p className="text-sm text-neutral/80">
                  {t('cookies_banner_description')}{' '}
                  <Link
                    to={`/${locale}/politica-cookies`}
                    className="text-primary-accent hover:underline"
                  >
                    {t('cookies_policy_link')}
                  </Link>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={handleOpenSettings}
                  className="px-5 py-2.5 border border-neutral/50 text-neutral text-sm rounded-full font-medium hover:bg-neutral/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent"
                >
                  {t('cookies_configure')}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-5 py-2.5 border border-neutral/50 text-neutral text-sm rounded-full font-medium hover:bg-neutral/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent"
                >
                  {t('cookies_reject_all')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2.5 bg-primary-accent text-white text-sm rounded-full font-semibold hover:bg-primary-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black"
                >
                  {t('cookies_accept_all')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={handleCloseSettings}
        onSave={handleSavePreferences}
        initialPreferences={preferences}
      />
    </>
  );
});

// ============================================================================
// EXPORTS
// ============================================================================

export default CookieBanner;

// Export a button component to reopen cookie settings from Footer
export const CookieSettingsButton: React.FC<{ className?: string }> = memo(
  function CookieSettingsButton({ className = '' }) {
    const { t } = useI18n();
    const [showSettings, setShowSettings] = useState(false);
    const { preferences, savePreferences } = useCookieConsent();

    const handleClick = useCallback(() => {
      setShowSettings(true);
    }, []);

    const handleClose = useCallback(() => {
      setShowSettings(false);
    }, []);

    const handleSave = useCallback(
      (prefs: Omit<CookiePreferences, 'essential'>) => {
        savePreferences(prefs);
        setShowSettings(false);
        initializeAnalytics();
      },
      [savePreferences]
    );

    return (
      <>
        <button
          onClick={handleClick}
          className={`hover:text-primary-accent transition-colors ${className}`}
        >
          {t('cookies_settings')}
        </button>

        <SettingsModal
          isOpen={showSettings}
          onClose={handleClose}
          onSave={handleSave}
          initialPreferences={preferences}
        />
      </>
    );
  }
);
