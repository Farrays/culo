/**
 * =============================================================================
 * GENERIC DANCE LANDING PAGE COMPONENT
 * =============================================================================
 *
 * Componente reutilizable para landing pages de captación de leads.
 * Recibe una configuración (LandingConfig) y renderiza toda la página.
 *
 * USO:
 * import { SALSA_LANDING_CONFIG } from './constants/salsa-landing-config';
 * <GenericDanceLanding config={SALSA_LANDING_CONFIG} />
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES, type Locale } from '../../types';
import GenericLeadModal from './GenericLeadModal';
import AnimateOnScroll from '../AnimateOnScroll';
import BunnyEmbed from '../BunnyEmbed';
import AnimatedCounter from '../AnimatedCounter';
import ScheduleWidget from './ScheduleWidget';
import {
  BoltIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  FlameIcon,
  GlobeIcon,
  StarIcon,
  UsersIcon,
  ClockIcon,
  MapPinIcon,
} from '../../lib/icons';
import { SOCIAL_PROOF } from '../../constants/shared';
import type { LandingConfig, LandingScheduleItem } from '../../constants/landing-template-config';
import type { LandingThemeClasses } from '../../constants/landing-themes';

// =============================================================================
// TYPES
// =============================================================================

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface GenericDanceLandingProps {
  config: LandingConfig;
}

// =============================================================================
// COUNTDOWN TIMER COMPONENT
// =============================================================================

interface CountdownTimerProps {
  baseDate: string;
  intervalDays: number;
  prefix: string;
  theme: LandingThemeClasses;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  baseDate,
  intervalDays,
  prefix,
  theme,
}) => {
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

  const intervalMs = intervalDays * 24 * 60 * 60 * 1000;
  const baseDateObj = useMemo(() => new Date(baseDate), [baseDate]);

  const getNextOfferDate = useCallback((): Date => {
    const now = new Date();
    const baseTime = baseDateObj.getTime();

    // If intervalDays is 0, it's a fixed date (no recurrence)
    if (intervalDays === 0) {
      return baseDateObj;
    }

    if (now.getTime() < baseTime) {
      return baseDateObj;
    }

    const timeSinceBase = now.getTime() - baseTime;
    const periodsPassed = Math.floor(timeSinceBase / intervalMs);
    const nextDeadline = new Date(baseTime + (periodsPassed + 1) * intervalMs);

    return nextDeadline;
  }, [baseDateObj, intervalMs, intervalDays]);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date();
    const targetDate = getNextOfferDate();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [getNextOfferDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [calculateTimeLeft]);

  const timeUnits = useMemo(
    () => [
      { value: timeLeft.days, label: t(`${prefix}CountdownDays`) },
      { value: timeLeft.hours, label: t(`${prefix}CountdownHours`) },
      { value: timeLeft.minutes, label: t(`${prefix}CountdownMinutes`) },
      { value: timeLeft.seconds, label: t(`${prefix}CountdownSeconds`) },
    ],
    [timeLeft, t, prefix]
  );

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {timeUnits.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black/60 ${theme.borderPrimaryLight} border rounded-lg flex items-center justify-center`}
            >
              <span
                className={`text-lg sm:text-xl md:text-2xl font-black ${theme.textPrimary} tabular-nums`}
              >
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-neutral/60 mt-1 uppercase tracking-wide">
              {unit.label}
            </span>
          </div>
          {index < timeUnits.length - 1 && (
            <span className={`${theme.textPrimary} opacity-60 text-lg sm:text-xl font-bold mb-4`}>
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// =============================================================================
// EXIT INTENT POPUP COMPONENT
// =============================================================================

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  prefix: string;
  theme: LandingThemeClasses;
  styleName: string;
  bookingWidget?: { styleFilter: string };
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({
  isOpen,
  onClose,
  locale,
  prefix,
  theme,
  styleName,
  bookingWidget,
}) => {
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

  if (!isOpen) return null;

  // Extract base prefix for exit intent keys (dhLanding -> dh)
  const exitPrefix = prefix.replace('Landing', '');

  // Build booking URLs
  const bookingBaseUrl = `/${locale}/reservas`;
  const bookingStyleUrl = bookingWidget
    ? `${bookingBaseUrl}?style=${bookingWidget.styleFilter}&locked=true`
    : bookingBaseUrl;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-neutral/70 hover:text-neutral transition-colors rounded-full hover:bg-white/10 z-10"
          aria-label={t('close')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-black text-neutral mb-3">
            {t(`${exitPrefix}ExitIntent_title`)}
          </h3>

          <p className="text-neutral/70 text-sm sm:text-base mb-6 leading-relaxed">
            {t(`${exitPrefix}ExitIntent_description`)}
          </p>

          <div className="space-y-3">
            {/* Primary CTA: Style-specific booking */}
            <Link
              to={bookingStyleUrl}
              onClick={onClose}
              className={`block w-full py-3.5 px-6 ${theme.bgPrimary} ${theme.bgPrimaryHover} text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] text-center`}
            >
              {t(`${exitPrefix}ExitIntent_ctaDancehall`).replace('Dancehall', styleName)}
            </Link>

            {/* Secondary CTA: See all classes */}
            <Link
              to={bookingBaseUrl}
              onClick={onClose}
              className={`block w-full py-3 px-6 ${theme.bgPrimaryLight} ${theme.textPrimary} font-semibold rounded-xl transition-all ${theme.borderPrimary} border text-center`}
            >
              {t(`${exitPrefix}ExitIntent_ctaExplore`)}
            </Link>

            <button
              onClick={onClose}
              className="block w-full py-2.5 px-6 text-neutral/70 hover:text-neutral/70 text-sm font-medium transition-colors"
            >
              {t(`${exitPrefix}ExitIntent_ctaClose`)}
            </button>
          </div>

          <p className="text-neutral/40 text-xs mt-4">{t(`${exitPrefix}ExitIntent_hint`)}</p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const GenericDanceLanding: React.FC<GenericDanceLandingProps> = ({ config }) => {
  const { t, i18n } = useTranslation([
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
  const locale = i18n.language;
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<LandingScheduleItem | null>(
    null
  );
  const [isExitPopupOpen, setIsExitPopupOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);
  const programmaticScrollRef = useRef(false);
  const baseUrl = 'https://www.farrayscenter.com';

  const { images, logos, translationPrefix: prefix } = config;
  const theme = config.theme.classes;

  // NOTE: PageView tracking is handled by GTM (fires on All Pages)
  // Removed direct fbq('track', 'PageView') call to avoid duplicate events

  // Exit Intent Detection
  useEffect(() => {
    // Guard: only run on client-side
    if (typeof window === 'undefined') return;

    const storageKey = `${config.id}_exit_intent_shown`;

    // Check if navigated from another exit intent (skip showing exit intent)
    const urlParams = new window.URLSearchParams(location.search);
    const fromExitIntent = urlParams.get('fromExitIntent') === 'true';

    if (fromExitIntent) {
      setHasShownExitIntent(true);
      // Clean up the URL parameter without triggering a re-render loop
      navigate(location.pathname, { replace: true });
      return;
    }

    // Check if already shown (with sessionStorage protection)
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(storageKey) === 'true';
    } catch {
      // sessionStorage not available
    }

    if (alreadyShown) {
      setHasShownExitIntent(true);
      return;
    }

    const triggerExitIntent = (source: 'desktop' | 'mobile') => {
      if (hasShownExitIntent || isModalOpen || isExitPopupOpen) return;

      setHasShownExitIntent(true);

      try {
        sessionStorage.setItem(storageKey, 'true');
      } catch {
        // sessionStorage not available
      }

      try {
        if (typeof window.fbq === 'function') {
          window.fbq('trackCustom', 'ExitIntentTriggered', {
            content_name: `${config.estiloValue} Landing`,
            trigger_source: source,
          });
        }
      } catch {
        // FB Pixel not available
      }

      setIsExitPopupOpen(true);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        triggerExitIntent('desktop');
      }
    };

    let lastScrollY = window.scrollY || 0;
    let maxScrollY = 0;
    let scrollUpDistance = 0;
    const SCROLL_THRESHOLD = 0.3;
    const SCROLL_UP_TRIGGER = 150;

    const handleScroll = () => {
      // Skip exit intent during programmatic scroll (e.g. CTA scroll-to-schedule)
      if (programmaticScrollRef.current) return;

      const currentScrollY = window.scrollY || 0;
      const windowHeight = window.innerHeight || 1;
      const pageHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollPercentage = maxScrollY / pageHeight;

      if (currentScrollY > maxScrollY) {
        maxScrollY = currentScrollY;
        scrollUpDistance = 0;
      }

      if (currentScrollY < lastScrollY) {
        scrollUpDistance += lastScrollY - currentScrollY;

        if (scrollPercentage >= SCROLL_THRESHOLD && scrollUpDistance >= SCROLL_UP_TRIGGER) {
          triggerExitIntent('mobile');
        }
      } else {
        scrollUpDistance = 0;
      }

      lastScrollY = currentScrollY;
    };

    const timeoutId = window.setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    hasShownExitIntent,
    isModalOpen,
    isExitPopupOpen,
    config.id,
    config.estiloValue,
    location.search,
    location.pathname,
    navigate,
  ]);

  const openModal = (scheduleItem?: LandingScheduleItem) => {
    try {
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', {
          content_name: `${config.estiloValue} Free Welcome Class`,
          content_category: 'Dance Class',
          value: '0',
          currency: 'EUR',
        });
      }
    } catch {
      // FB Pixel not available
    }
    setSelectedScheduleItem(scheduleItem ?? null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedScheduleItem(null);
  };

  const scrollToSchedule = () => {
    const el = document.getElementById('schedule-section');
    if (el) {
      programmaticScrollRef.current = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Re-enable exit intent after scroll animation completes
      setTimeout(() => {
        programmaticScrollRef.current = false;
      }, 1500);
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  // Get current path without locale prefix
  const getCurrentPath = useCallback((): string => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (
      pathParts.length > 0 &&
      pathParts[0] &&
      (SUPPORTED_LOCALES as readonly string[]).includes(pathParts[0])
    ) {
      pathParts.shift();
    }
    return pathParts.length > 0 ? `/${pathParts.join('/')}` : '/';
  }, [location.pathname]);

  const handleLangChange = useCallback(
    (newLocale: string) => {
      const currentPath = getCurrentPath();
      const newPath = `/${newLocale}${currentPath === '/' ? '' : currentPath}`;
      navigate(newPath);
      setShowLangMenu(false);
    },
    [getCurrentPath, navigate]
  );

  const totalValue = config.valueStack.reduce((sum, item) => sum + item.price, 0);

  const languages: { code: Locale; label: string }[] = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'ca', label: 'CA' },
    { code: 'fr', label: 'FR' },
  ];

  return (
    <>
      <Helmet>
        <title>{config.estiloValue} | Farray&apos;s International Dance Center</title>
        <meta name="description" content={t(`${prefix}PageDescription`)} />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta property="og:title" content={t(`${prefix}PageTitle`)} />
        <meta property="og:description" content={t(`${prefix}PageDescription`)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/${locale}/${config.slug}`} />
        <meta property="og:image" content={`${baseUrl}${images.hero}`} />
        <link rel="canonical" href={`${baseUrl}/${locale}/${config.slug}`} />
        {/* Preload video thumbnail for faster LCP (only when not autoplay) */}
        {config.video && !config.video.autoplay && config.video.thumbnailUrl && (
          <link rel="preload" as="image" href={config.video.thumbnailUrl} fetchPriority="high" />
        )}
      </Helmet>

      <main className="bg-black">
        {/* Language Selector */}
        <div className="fixed top-4 right-4 z-50">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20 ${theme.borderPrimaryHover} transition-all duration-300`}
            >
              <GlobeIcon className={`w-4 h-4 ${theme.textPrimary}`} />
              <span className="text-neutral text-sm font-medium uppercase">{locale}</span>
              <ChevronDownIcon
                className={`w-4 h-4 text-neutral/60 transition-transform ${showLangMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {showLangMenu && (
              <div className="absolute top-full right-0 mt-2 py-2 bg-black/90 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl min-w-[80px]">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      locale === lang.code
                        ? `${theme.textPrimary} ${theme.bgPrimaryLight}`
                        : 'text-neutral hover:bg-white/5'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={images.hero}
              alt={images.heroAlt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/65" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center py-16 sm:py-20">
            {/* Hero content without AnimateOnScroll - always visible on page load */}
            <div>
              <div
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 mb-8 sm:mb-10 rounded-full ${theme.bgPrimaryLight} ${theme.borderPrimary} border backdrop-blur-md`}
              >
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.bgPrimary} opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-full w-full ${theme.bgPrimary}`}
                  ></span>
                </span>
                <span
                  className={`${theme.textPrimaryLight} text-xs sm:text-sm font-semibold tracking-wide uppercase`}
                >
                  {t(`${prefix}Badge`)}
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.95] mb-8 sm:mb-10 holographic-text px-2"
                style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
              >
                {t(`${prefix}Headline`)}
              </h1>

              <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl text-neutral/90 mb-10 sm:mb-12 leading-relaxed px-2">
                {t(`${prefix}Subheadline`)}
              </p>

              <div
                className={`inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full ${theme.bgPrimaryLight} ${theme.borderPrimary} border animate-pulse`}
              >
                <span
                  className={`${theme.textPrimaryLight} text-sm sm:text-base font-bold flex items-center gap-1`}
                >
                  <BoltIcon className={`w-4 h-4 ${theme.textPrimaryLight}`} />
                  {t(`${prefix}UrgencyBadge`)}
                </span>
              </div>

              <div>
                <button
                  onClick={scrollToSchedule}
                  className={`w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px] min-h-[48px] sm:min-h-[52px] ${theme.bgPrimary} text-white font-bold text-base sm:text-lg py-3 sm:py-3.5 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl ${theme.shadowPrimary} animate-glow active:scale-95`}
                >
                  {t(`${prefix}CTA`)}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-neutral/70 mt-4 sm:mt-5">
                {t(`${prefix}TrustText`)}
              </p>
            </div>

            {/* Trust Bar - First */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1 text-neutral/70 text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <StarIcon className={`w-3.5 h-3.5 ${theme.textPrimary}`} />
                <span className="text-neutral font-bold">4.9</span>
                <span>(508+)</span>
              </span>
              <span className="text-neutral/40">·</span>
              <span className="flex items-center gap-1">
                <UsersIcon className={`w-3.5 h-3.5 ${theme.textPrimary}`} />
                <span>{t(`${prefix}TrustActiveStudents`)}</span>
              </span>
              <span className="text-neutral/40">·</span>
              <span className="flex items-center gap-1">
                <ClockIcon className={`w-3.5 h-3.5 ${theme.textPrimary}`} />
                <span>{t(`${prefix}TrustYearsExp`)}</span>
              </span>
              <span className="text-neutral/40">·</span>
              <span className="flex items-center gap-1">
                <MapPinIcon className={`w-3.5 h-3.5 ${theme.textPrimary}`} />
                <span>{t(`${prefix}TrustLocationShort`)}</span>
              </span>
            </div>

            {/* Hero Stats - Static values (AnimatedCounter doesn't work well for above-the-fold elements) */}
            <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
              {/* 60 Minutes */}
              <div className="text-center">
                <div className="mb-1 sm:mb-2 flex justify-center">
                  <ClockIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.textPrimary}`} />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black mb-0.5 sm:mb-1 holographic-text">
                  60
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-neutral/80 font-semibold">
                  {t('classMinutes')}
                </div>
              </div>

              {/* 400 Calories */}
              <div className="text-center">
                <div className="mb-1 sm:mb-2 flex justify-center">
                  <FlameIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.textPrimary}`} />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black mb-0.5 sm:mb-1 holographic-text">
                  400
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-neutral/80 font-semibold">
                  {t('caloriesBurned')}
                </div>
              </div>

              {/* 100% Fun */}
              <div className="text-center">
                <div className="mb-1 sm:mb-2 flex justify-center">
                  <StarIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.textPrimary}`} />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black mb-0.5 sm:mb-1 holographic-text">
                  100%
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-neutral/80 font-semibold">
                  {t('funGuaranteed')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE STACK SECTION */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              {/* Video integrado en la sección */}
              {config.video && (
                <div className="mb-8 sm:mb-10">
                  <BunnyEmbed
                    videoId={config.video.bunnyVideoId}
                    libraryId={config.video.bunnyLibraryId}
                    title={t(`${prefix}VideoTitle`)}
                    aspectRatio={config.video.aspectRatio || '16:9'}
                    thumbnailUrl={config.video.thumbnailUrl}
                    autoplay={config.video.autoplay}
                    priority={true}
                  />
                </div>
              )}

              <AnimateOnScroll>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral text-center mb-8 sm:mb-10 holographic-text">
                  {t(`${prefix}ValueTitle`)}
                </h2>
              </AnimateOnScroll>

              <div className="space-y-2 sm:space-y-3 mb-8 sm:mb-10">
                {config.valueStack.map((item, index) => (
                  <AnimateOnScroll key={item.key} delay={index * 80}>
                    <div
                      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-black/50 backdrop-blur-md rounded-xl ${theme.borderPrimaryLight} border ${theme.borderPrimaryHover} transition-all duration-300`}
                    >
                      <CheckCircleIcon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.textPrimary} flex-shrink-0`}
                      />
                      <span className="text-neutral text-sm sm:text-base flex-1">
                        {t(item.key)}
                      </span>
                      <span
                        className={`text-sm sm:text-base ${item.price > 0 ? `${theme.textPrimary} font-bold` : theme.textPrimaryLight}`}
                      >
                        {item.price > 0
                          ? t(item.priceKey).replace('{price}', item.price.toString())
                          : t(item.priceKey)}
                      </span>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>

              {/* Price comparison */}
              <AnimateOnScroll>
                <div
                  className={`bg-gradient-to-r ${theme.bgPrimaryDark} ${theme.bgAccentLight} rounded-2xl p-4 sm:p-6 ${theme.borderPrimary} border mb-6 sm:mb-8 shadow-xl`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral/60 text-xs sm:text-sm">
                        {t(`${prefix}ValueTotal`)}
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-neutral line-through">
                        {totalValue}€
                      </p>
                    </div>
                    <div className={`text-2xl sm:text-3xl ${theme.textPrimary} opacity-50`}>→</div>
                    <div className="text-right">
                      <p className="text-neutral/60 text-xs sm:text-sm">
                        {t(`${prefix}ValueYourPrice`)}
                      </p>
                      <p
                        className={`text-3xl sm:text-4xl font-black ${theme.textPrimary} holographic-text`}
                      >
                        {t(`${prefix}ValueFree`)}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Exclusive Offer Card */}
              <AnimateOnScroll>
                <div
                  className={`relative bg-gradient-to-r ${theme.bgPrimaryDark} ${theme.bgAccentLight} rounded-xl p-4 sm:p-5 ${theme.borderPrimary} border mb-6 sm:mb-8 shadow-lg overflow-hidden`}
                >
                  <div
                    className={`absolute -top-1 -right-1 ${theme.bgPrimary} text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-bl-lg`}
                  >
                    {t(`${prefix}ExclusiveBadge`)}
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${theme.bgPrimaryLight} flex items-center justify-center flex-shrink-0`}
                    >
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.textPrimary}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className={`${theme.textPrimary} font-bold text-sm sm:text-base mb-1`}>
                        {t(`${prefix}OfferTitle`)}
                      </p>
                      <p className="text-neutral/70 text-xs sm:text-sm leading-relaxed">
                        {t(`${prefix}OfferDesc`)}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Countdown Timer */}
              <AnimateOnScroll>
                <div className="text-center mb-8 sm:mb-10">
                  <p className="text-neutral/80 text-sm sm:text-base font-semibold mb-4">
                    {t(`${prefix}CountdownTitle`)}
                  </p>
                  <CountdownTimer
                    baseDate={config.countdown.baseDate}
                    intervalDays={config.countdown.intervalDays}
                    prefix={prefix}
                    theme={theme}
                  />
                  <p className="text-neutral/70 text-xs sm:text-sm mt-3">
                    {t(`${prefix}CountdownExpires`)}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* CTA */}
              <div className="text-center">
                <button
                  onClick={scrollToSchedule}
                  className={`w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px] min-h-[48px] sm:min-h-[52px] ${theme.bgPrimary} text-white font-bold text-base sm:text-lg py-3 sm:py-3.5 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl ${theme.shadowPrimary} animate-glow active:scale-95`}
                >
                  {t(`${prefix}CTA`)}
                </button>
                <p className="text-xs sm:text-sm text-neutral/70 mt-3 sm:mt-4">
                  {t(`${prefix}TrustText`)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FULL SCHEDULE WIDGET (Jornada Puertas Abiertas) */}
        {config.showFullSchedule && (
          <ScheduleWidget theme={config.theme} showFilters={true} translationPrefix={prefix} />
        )}

        {/* SCHEDULE SECTION (only if not showing full schedule) */}
        {!config.showFullSchedule && (
          <section id="schedule-section" className="py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral text-center mb-2 sm:mb-3 holographic-text">
                  {t(`${prefix}ScheduleTitle`)}
                </h2>
                <p className="text-neutral/60 text-center text-sm sm:text-base mb-8 sm:mb-10">
                  {t(`${prefix}ScheduleSubtitle`)}
                </p>
              </AnimateOnScroll>

              <div className="max-w-xl mx-auto space-y-2 sm:space-y-3">
                {config.schedule.map((schedule, index) => {
                  const isClickable = !!config.bookingWidget;
                  const CardWrapper = isClickable ? 'button' : 'div';

                  return (
                    <AnimateOnScroll key={schedule.id} delay={index * 60}>
                      <CardWrapper
                        {...(isClickable
                          ? {
                              type: 'button' as const,
                              onClick: () => openModal(schedule),
                              'aria-label': `${t('common:scheduleBookBtn')} ${schedule.className} - ${t(schedule.dayKey)} ${schedule.time.split(' - ')[0]}`,
                            }
                          : {})}
                        className={`w-full flex items-center justify-between p-3 sm:p-4 bg-black/50 backdrop-blur-md rounded-xl ${theme.borderPrimaryLight} border transition-all duration-300 ${
                          isClickable
                            ? `${theme.borderPrimaryHover} hover:scale-[1.02] hover:bg-black/70 cursor-pointer group active:scale-[0.98]`
                            : `${theme.borderPrimaryHover}`
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="text-center min-w-[70px] sm:min-w-[80px]">
                            <span className="text-neutral font-bold text-sm sm:text-base block">
                              {t(schedule.dayKey)}
                            </span>
                            <span className="text-neutral/60 text-xs sm:text-sm">
                              {schedule.time.split(' - ')[0]}
                            </span>
                          </div>
                          <div className={`w-px h-8 ${theme.bgPrimaryLight}`} />
                          <div className="text-left">
                            <p className="text-neutral font-semibold text-sm sm:text-base">
                              {schedule.className} {t(schedule.levelKey)}
                            </p>
                            <p className="text-neutral/60 text-xs sm:text-sm">{schedule.teacher}</p>
                          </div>
                        </div>
                        {isClickable && (
                          <span
                            className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full ${theme.bgPrimary} text-white font-semibold whitespace-nowrap transition-all duration-300 group-hover:shadow-lg ${theme.shadowPrimary}`}
                          >
                            {t('common:scheduleBookBtn')}
                          </span>
                        )}
                      </CardWrapper>
                    </AnimateOnScroll>
                  );
                })}
              </div>

              <AnimateOnScroll>
                <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
                  <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.bgPrimary} opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-full w-full ${theme.bgPrimary}`}
                    ></span>
                  </span>
                  <p className={`${theme.textPrimary} font-medium text-xs sm:text-sm`}>
                    {t(`${prefix}LimitedSpots`)}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}

        {/* WHY FARRAY'S SECTION */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral text-center mb-8 sm:mb-10 holographic-text">
                {t(`${prefix}WhyFarraysTitle`)}
              </h2>
            </AnimateOnScroll>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-5xl mx-auto">
              {config.whyUs.map((item, index) => (
                <AnimateOnScroll
                  key={item.titleKey}
                  delay={index * 80}
                  className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] [perspective:1000px]"
                >
                  <div
                    className={`group h-full p-4 sm:p-5 bg-black/40 rounded-xl ${theme.borderPrimaryLight} border transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(3deg)] ${theme.borderPrimaryHover}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${theme.bgPrimaryLight} flex items-center justify-center flex-shrink-0 transition-colors shadow-lg`}
                      >
                        <CheckCircleIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.textPrimary}`} />
                      </div>
                      <div>
                        <h3 className="text-neutral font-bold text-sm sm:text-base mb-1">
                          {t(item.titleKey)}
                        </h3>
                        <p className="text-neutral/70 text-xs sm:text-sm leading-relaxed">
                          {t(item.descKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Stats bar */}
            <AnimateOnScroll>
              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 mt-10 sm:mt-12">
                {[
                  { value: config.stats.years, suffix: '+', label: `${prefix}StatYears` },
                  { value: config.stats.activeStudents, suffix: '+', label: `${prefix}StatActive` },
                  {
                    value: config.stats.satisfiedStudents,
                    suffix: '+',
                    label: `${prefix}StatSatisfied`,
                  },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      className="text-2xl sm:text-3xl md:text-4xl font-black holographic-text"
                    />
                    <p className="text-xs sm:text-sm text-neutral/70 mt-1">{t(stat.label)}</p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            {/* Logos */}
            <AnimateOnScroll>
              <div className="mt-12 sm:mt-16">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral text-center mb-6 sm:mb-8 holographic-text">
                  {t(`${prefix}LogosTitle`)}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
                  {logos.map((logo, idx) => (
                    <div
                      key={idx}
                      className={`group flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-black/40 backdrop-blur-sm rounded-xl ${theme.borderPrimaryLight} border transition-all duration-500 [perspective:1000px] [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)] ${theme.borderPrimaryHover}`}
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center overflow-hidden rounded-lg">
                        <img
                          src={logo.src}
                          alt={logo.alt}
                          width="64"
                          height="64"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-neutral/90 font-bold text-xs sm:text-sm text-center">
                        {logo.label}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-center text-sm sm:text-base mt-6 sm:mt-8 font-bold holographic-text">
                  {t(`${prefix}FestivalsText`)}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral mb-3 sm:mb-4 holographic-text">
                  {t(`${prefix}TestimonialsTitle`)}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.textPrimary}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-neutral/70 text-xs sm:text-sm ml-1">
                    {SOCIAL_PROOF.reviewCount} {t(`${prefix}ReviewsLabel`)}
                  </span>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Showcase Image */}
            <AnimateOnScroll>
              <div className="max-w-md mx-auto mb-8 sm:mb-10">
                <div
                  className={`rounded-2xl overflow-hidden ${theme.borderPrimary} border shadow-xl`}
                >
                  <img
                    src={images.showcase}
                    alt={images.showcaseAlt}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </AnimateOnScroll>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {config.testimonials.map((testimonial, index) => (
                <AnimateOnScroll
                  key={testimonial.id}
                  delay={index * 100}
                  className="[perspective:1000px]"
                >
                  <div
                    className={`group h-full p-4 sm:p-5 bg-black/40 rounded-xl border border-white/10 ${theme.borderPrimaryHover} transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.25rem)_scale(1.01)]`}
                  >
                    <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${theme.textPrimary}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-neutral/80 text-xs sm:text-sm italic mb-2 sm:mb-3">
                      &ldquo;{t(testimonial.quote)}&rdquo;
                    </p>
                    <p className="text-neutral font-semibold text-xs sm:text-sm">
                      {testimonial.name}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral text-center mb-8 sm:mb-10 holographic-text">
                {t(`${prefix}FaqTitle`)}
              </h2>
            </AnimateOnScroll>

            <div className="max-w-2xl mx-auto space-y-2 sm:space-y-3">
              {config.faqs.map(faq => (
                <AnimateOnScroll key={faq.id}>
                  <div
                    className={`bg-black/40 rounded-xl border border-white/10 overflow-hidden ${theme.borderPrimaryHover} transition-all duration-300`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-neutral font-semibold text-sm sm:text-base pr-4">
                        {t(faq.questionKey)}
                      </span>
                      <ChevronDownIcon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.textPrimary} flex-shrink-0 transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openFaq === faq.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <p className="px-4 sm:px-5 pb-3 sm:pb-4 text-neutral/70 text-xs sm:text-sm leading-relaxed">
                        {t(faq.answerKey)}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-12 md:py-16 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${config.theme.classes.gradient}`} />

          <div className="relative z-10 container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-neutral mb-4 sm:mb-6 holographic-text leading-tight">
                  {t(`${prefix}FinalCTATitle`)}
                </h2>
                <p className="text-neutral/70 text-base sm:text-lg mb-4">
                  {t(`${prefix}FinalCTADesc`)}
                </p>
                <p
                  className={`${theme.textPrimary} text-sm sm:text-base font-medium mb-8 sm:mb-10`}
                >
                  {t(`${prefix}FinalCTAExtra`)}
                </p>

                <button
                  onClick={scrollToSchedule}
                  className={`w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px] min-h-[48px] sm:min-h-[52px] ${theme.bgPrimary} text-white font-bold text-base sm:text-lg py-3 sm:py-3.5 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl ${theme.shadowPrimary} animate-glow active:scale-95 relative overflow-hidden group`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative">{t(`${prefix}CTA`)}</span>
                </button>

                <p className="text-neutral/70 text-xs sm:text-sm mt-4 sm:mt-6">
                  {t(`${prefix}FinalTrust`)}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-6 sm:py-8 border-t border-white/10 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="text-neutral/60 text-xs sm:text-sm text-center">
              Farray&apos;s International Dance Center © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </main>

      {/* Lead Capture Modal */}
      <GenericLeadModal
        isOpen={isModalOpen}
        onClose={closeModal}
        config={config}
        selectedScheduleItem={selectedScheduleItem}
      />

      {/* Exit Intent Popup */}
      <ExitIntentPopup
        isOpen={isExitPopupOpen}
        onClose={() => setIsExitPopupOpen(false)}
        locale={locale}
        prefix={prefix}
        theme={theme}
        styleName={config.estiloValue}
        bookingWidget={config.bookingWidget}
      />
    </>
  );
};

export default GenericDanceLanding;
