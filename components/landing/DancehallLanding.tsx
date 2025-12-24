import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import DancehallLeadModal from './DancehallLeadModal';

// ============================================================================
// COUNTDOWN TIMER COMPONENT
// ============================================================================

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Infinite rolling countdown: resets every 2 weeks from base date
const COUNTDOWN_BASE_DATE = new Date('2025-01-06T23:59:59');
const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

const getNextOfferDate = (): Date => {
  const now = new Date();
  const baseTime = COUNTDOWN_BASE_DATE.getTime();

  // If we're before the base date, return it
  if (now.getTime() < baseTime) {
    return COUNTDOWN_BASE_DATE;
  }

  // Calculate how many 2-week periods have passed
  const timeSinceBase = now.getTime() - baseTime;
  const periodsPassed = Math.floor(timeSinceBase / TWO_WEEKS_MS);

  // Next deadline = base + ((periods + 1) * 2 weeks)
  const nextDeadline = new Date(baseTime + (periodsPassed + 1) * TWO_WEEKS_MS);

  return nextDeadline;
};

const CountdownTimer: React.FC = () => {
  const { t } = useI18n();

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
  }, []);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [calculateTimeLeft]);

  const timeUnits = useMemo(
    () => [
      { value: timeLeft.days, label: t('dhLandingCountdownDays') },
      { value: timeLeft.hours, label: t('dhLandingCountdownHours') },
      { value: timeLeft.minutes, label: t('dhLandingCountdownMinutes') },
      { value: timeLeft.seconds, label: t('dhLandingCountdownSeconds') },
    ],
    [timeLeft, t]
  );

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {timeUnits.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black/60 border border-rose-500/40 rounded-lg flex items-center justify-center">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-rose-400 tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-neutral/60 mt-1 uppercase tracking-wide">
              {unit.label}
            </span>
          </div>
          {index < timeUnits.length - 1 && (
            <span className="text-rose-400/60 text-lg sm:text-xl font-bold mb-4">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ============================================================================
// EXIT INTENT POPUP COMPONENT
// ============================================================================

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onReserveDancehall: () => void;
  locale: string;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({
  isOpen,
  onClose,
  onReserveDancehall,
  locale,
}) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  const handleReserveDancehall = () => {
    onClose();
    onReserveDancehall();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Popup */}
      <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-neutral/50 hover:text-neutral transition-colors rounded-full hover:bg-white/10 z-10"
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

        {/* Content */}
        <div className="p-6 sm:p-8 text-center">
          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-black text-neutral mb-3">
            {t('dhExitIntent_title')}
          </h3>

          {/* Description */}
          <p className="text-neutral/70 text-sm sm:text-base mb-6 leading-relaxed">
            {t('dhExitIntent_description')}
          </p>

          {/* CTA Buttons - 3 options */}
          <div className="space-y-3">
            {/* Primary: See all classes */}
            <Link
              to={`/${locale}/clases`}
              className="block w-full py-3.5 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-rose-500/30"
            >
              {t('dhExitIntent_ctaExplore')}
            </Link>

            {/* Secondary: Reserve Dancehall anyway */}
            <button
              onClick={handleReserveDancehall}
              className="block w-full py-3 px-6 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-semibold rounded-xl transition-all border border-rose-500/30 hover:border-rose-500/50"
            >
              {t('dhExitIntent_ctaDancehall')}
            </button>

            {/* Tertiary: Close */}
            <button
              onClick={onClose}
              className="block w-full py-2.5 px-6 text-neutral/50 hover:text-neutral/70 text-sm font-medium transition-colors"
            >
              {t('dhExitIntent_ctaClose')}
            </button>
          </div>

          {/* Subtle hint */}
          <p className="text-neutral/40 text-xs mt-4">{t('dhExitIntent_hint')}</p>
        </div>
      </div>
    </div>
  );
};

import AnimateOnScroll from '../AnimateOnScroll';
import AnimatedCounter from '../AnimatedCounter';
import {
  BoltIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  GlobeIcon,
  StarIcon,
  UsersIcon,
  ClockIcon,
  MapPinIcon,
} from '../../lib/icons';
import {
  DANCEHALL_VALUE_STACK,
  DANCEHALL_WHY_FARRAYS,
  DANCEHALL_OBJECTION_FAQS,
  DANCEHALL_TESTIMONIALS,
  DANCEHALL_LANDING_SCHEDULE,
} from '../../constants/dancehall-landing-config';
import { SOCIAL_PROOF } from '../../constants/shared';

// ============================================================================
// LOGOS DATA
// ============================================================================

const LOGOS = [
  { src: '/images/cid-unesco-logo.webp', alt: 'CID UNESCO', label: 'CID UNESCO' },
  { src: '/images/Street-Dance-2.webp', alt: 'Street Dance 2', label: 'Street Dance 2' },
  {
    src: '/images/the-dancer-espectaculo-baile-cuadrada.webp',
    alt: 'The Dancer',
    label: 'The Dancer',
  },
  { src: '/images/telecinco-logo.webp', alt: 'Telecinco', label: 'Telecinco' },
];

// ============================================================================
// COMPONENT
// ============================================================================

const DancehallLanding: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExitPopupOpen, setIsExitPopupOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);
  const baseUrl = 'https://www.farrayscenter.com';

  // Track PageView on mount
  useEffect(() => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, []);

  // Exit Intent Detection - Desktop (mouse leave) + Mobile (scroll up)
  useEffect(() => {
    // Check if already shown this session
    const alreadyShown = sessionStorage.getItem('dh_exit_intent_shown');
    if (alreadyShown) {
      setHasShownExitIntent(true);
      return;
    }

    // Shared function to trigger exit intent
    const triggerExitIntent = (source: 'desktop' | 'mobile') => {
      if (hasShownExitIntent || isModalOpen || isExitPopupOpen) return;

      setHasShownExitIntent(true);
      sessionStorage.setItem('dh_exit_intent_shown', 'true');

      // Track exit intent event
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'ExitIntentTriggered', {
          content_name: 'Dancehall Landing',
          trigger_source: source,
        });
      }

      // Show exit intent popup
      setIsExitPopupOpen(true);
    };

    // DESKTOP: Mouse leaves viewport from top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        triggerExitIntent('desktop');
      }
    };

    // MOBILE: Scroll up detection
    let lastScrollY = window.scrollY;
    let maxScrollY = 0;
    let scrollUpDistance = 0;
    const SCROLL_THRESHOLD = 0.3; // User must have scrolled 30% of page
    const SCROLL_UP_TRIGGER = 150; // Pixels scrolled up rapidly to trigger

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = maxScrollY / pageHeight;

      // Track max scroll position
      if (currentScrollY > maxScrollY) {
        maxScrollY = currentScrollY;
        scrollUpDistance = 0; // Reset scroll up distance when scrolling down
      }

      // Detect scroll up
      if (currentScrollY < lastScrollY) {
        scrollUpDistance += lastScrollY - currentScrollY;

        // Trigger if: scrolled down 30%+ AND scrolled up 150px+ rapidly
        if (scrollPercentage >= SCROLL_THRESHOLD && scrollUpDistance >= SCROLL_UP_TRIGGER) {
          triggerExitIntent('mobile');
        }
      } else {
        scrollUpDistance = 0; // Reset when scrolling down
      }

      lastScrollY = currentScrollY;
    };

    // Add listeners with delay (avoid false positives on page load)
    const timeoutId = window.setTimeout(() => {
      // Desktop: mouse leave
      document.addEventListener('mouseleave', handleMouseLeave);
      // Mobile: scroll detection (passive for performance)
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 5000); // 5 seconds delay

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShownExitIntent, isModalOpen, isExitPopupOpen]);

  const openModal = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', {
        content_name: 'Dancehall Free Welcome Class',
        content_category: 'Dance Class',
        value: '0',
        currency: 'EUR',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleLangChange = (newLocale: string) => {
    setLocale(newLocale as 'es' | 'en' | 'ca' | 'fr');
    setShowLangMenu(false);
  };

  // Calculate total value
  const totalValue = DANCEHALL_VALUE_STACK.reduce((sum, item) => sum + item.price, 0);

  const languages = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'ca', label: 'CA' },
    { code: 'fr', label: 'FR' },
  ];

  return (
    <>
      {/* SEO Meta Tags - noindex for ads landing */}
      <Helmet>
        <title>{t('dhLandingPageTitle')}</title>
        <meta name="description" content={t('dhLandingPageDescription')} />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta property="og:title" content={t('dhLandingPageTitle')} />
        <meta property="og:description" content={t('dhLandingPageDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/${locale}/dancehall`} />
        <meta
          property="og:image"
          content={`${baseUrl}/images/classes/dancehall/img/dancehall-classes-barcelona-01_1920.webp`}
        />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1080" />
        <link rel="canonical" href={`${baseUrl}/${locale}/dancehall`} />
      </Helmet>

      <main className="bg-black">
        {/* ================================================================
            LANGUAGE SELECTOR - Fixed top right
        ================================================================ */}
        <div className="fixed top-4 right-4 z-50">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20 hover:border-rose-500/50 transition-all duration-300"
            >
              <GlobeIcon className="w-4 h-4 text-rose-400" />
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
                        ? 'text-rose-400 bg-rose-500/10'
                        : 'text-neutral hover:text-rose-400 hover:bg-white/5'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================================================================
            HERO SECTION - Mobile First
        ================================================================ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Photo Background */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/classes/dancehall/img/dancehall-classes-barcelona-01_960.webp"
              alt="Clases de Dancehall en Barcelona"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlays */}
            <div className="absolute inset-0 bg-black/65" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center py-16 sm:py-20">
            <AnimateOnScroll>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 mb-8 sm:mb-10 rounded-full bg-rose-500/20 border border-rose-500/40 backdrop-blur-md">
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-full w-full bg-rose-500"></span>
                </span>
                <span className="text-rose-300 text-xs sm:text-sm font-semibold tracking-wide uppercase">
                  {t('dhLandingBadge')}
                </span>
              </div>

              {/* Main Headline */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.95] mb-8 sm:mb-10 holographic-text px-2"
                style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
              >
                {t('dhLandingHeadline')}
              </h1>

              {/* Subheadline */}
              <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl text-neutral/90 mb-10 sm:mb-12 leading-relaxed px-2">
                {t('dhLandingSubheadline')}
              </p>

              {/* Urgency Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-rose-500/30 border border-rose-400/50 animate-pulse">
                <span className="text-rose-300 text-sm sm:text-base font-bold flex items-center gap-1">
                  <BoltIcon className="w-4 h-4 text-rose-300" />
                  {t('dhLandingUrgencyBadge')}
                </span>
              </div>

              {/* CTA Button */}
              <div>
                <button
                  onClick={openModal}
                  className="w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px] min-h-[48px] sm:min-h-[52px] bg-rose-600 text-white font-bold text-base sm:text-lg py-3 sm:py-3.5 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-rose-500/50 animate-glow active:scale-95"
                >
                  {t('dhLandingCTA')}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-neutral/50 mt-4 sm:mt-5">
                {t('dhLandingTrustText')}
              </p>
            </AnimateOnScroll>

            {/* Trust Bar - Simple inline format */}
            <div className="mt-12 sm:mt-14 flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1 text-neutral/70 text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <StarIcon className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-neutral font-bold">4.9</span>
                <span>(508+)</span>
              </span>
              <span className="text-neutral/40">·</span>
              <span className="flex items-center gap-1">
                <UsersIcon className="w-3.5 h-3.5 text-rose-400" />
                <span>{t('dhLandingTrustActiveStudents')}</span>
              </span>
              <span className="text-neutral/40">·</span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-3.5 h-3.5 text-rose-400" />
                <span>{t('dhLandingTrustYearsExp')}</span>
              </span>
              <span className="text-neutral/40">·</span>
              <span className="flex items-center gap-1">
                <MapPinIcon className="w-3.5 h-3.5 text-rose-400" />
                <span>{t('dhLandingTrustLocationShort')}</span>
              </span>
            </div>
          </div>
        </section>

        {/* ================================================================
            VIDEO SECTION - Placeholder
        ================================================================ */}
        <section className="py-12 sm:py-16 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <AnimateOnScroll>
                {/* TODO: Replace with actual Vimeo/YouTube embed when video is ready */}
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-rose-500/30 bg-black/60 shadow-xl shadow-rose-500/10">
                  {/* Placeholder overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-rose-900/20 via-black/60 to-pink-900/20">
                    {/* Play button placeholder */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600/80 flex items-center justify-center mb-4 shadow-lg shadow-rose-500/30">
                      <svg
                        className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-neutral/70 text-sm sm:text-base font-medium">
                      {t('dhLandingVideoPlaceholder')}
                    </p>
                  </div>
                  {/* Background image placeholder */}
                  <img
                    src="/images/classes/dancehall/img/dancehall-classes-barcelona-01_960.webp"
                    alt="Clases de Dancehall en Barcelona"
                    className="w-full h-full object-cover opacity-30"
                  />
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ================================================================
            JAMAICA EXPERIENCE - Premium Section
        ================================================================ */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <AnimateOnScroll>
                <div className="relative bg-gradient-to-br from-rose-900/20 via-black/80 to-pink-900/20 rounded-2xl p-6 sm:p-8 md:p-10 border border-rose-500/30 shadow-2xl shadow-rose-500/10">
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-rose-500/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />

                  <div className="relative text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral mb-4 sm:mb-6 holographic-text">
                      {t('dhLandingExperienceTitle')}
                    </h2>
                    <p className="text-neutral/80 text-sm sm:text-base md:text-lg leading-relaxed">
                      {t('dhLandingExperienceDesc')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ================================================================
            VALUE STACK SECTION
        ================================================================ */}
        <section className="py-12 sm:py-16 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <AnimateOnScroll>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral text-center mb-8 sm:mb-10 holographic-text">
                  {t('dhLandingValueTitle')}
                </h2>
              </AnimateOnScroll>

              {/* Value items */}
              <div className="space-y-2 sm:space-y-3 mb-8 sm:mb-10">
                {DANCEHALL_VALUE_STACK.map((item, index) => (
                  <AnimateOnScroll key={item.key} delay={index * 80}>
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-black/50 backdrop-blur-md rounded-xl border border-rose-500/20 hover:border-rose-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10">
                      <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 flex-shrink-0" />
                      <span className="text-neutral text-sm sm:text-base flex-1">
                        {t(item.key)}
                      </span>
                      <span
                        className={`text-sm sm:text-base ${item.price > 0 ? 'text-rose-400 font-bold' : 'text-rose-300'}`}
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
                <div className="bg-gradient-to-r from-rose-900/30 to-pink-900/30 rounded-2xl p-4 sm:p-6 border border-rose-500/30 mb-6 sm:mb-8 shadow-xl shadow-rose-500/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral/60 text-xs sm:text-sm">
                        {t('dhLandingValueTotal')}
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-neutral line-through">
                        {totalValue}€
                      </p>
                    </div>
                    <div className="text-2xl sm:text-3xl text-rose-400/50">→</div>
                    <div className="text-right">
                      <p className="text-neutral/60 text-xs sm:text-sm">
                        {t('dhLandingValueYourPrice')}
                      </p>
                      <p className="text-3xl sm:text-4xl font-black text-rose-400 holographic-text">
                        {t('dhLandingValueFree')}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Premium Offer Card */}
              <AnimateOnScroll>
                <div className="relative bg-gradient-to-r from-rose-900/20 to-pink-900/20 rounded-xl p-4 sm:p-5 border border-rose-500/30 mb-6 sm:mb-8 shadow-lg overflow-hidden">
                  {/* Premium badge */}
                  <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-bl-lg">
                    {t('dhLandingExclusiveBadge')}
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400"
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
                      <p className="text-rose-400 font-bold text-sm sm:text-base mb-1">
                        {t('dhLandingOfferTitle')}
                      </p>
                      <p className="text-neutral/70 text-xs sm:text-sm leading-relaxed">
                        {t('dhLandingOfferDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Countdown Timer */}
              <AnimateOnScroll>
                <div className="text-center mb-8 sm:mb-10">
                  <p className="text-neutral/80 text-sm sm:text-base font-semibold mb-4">
                    {t('dhLandingCountdownTitle')}
                  </p>
                  <CountdownTimer />
                  <p className="text-neutral/50 text-xs sm:text-sm mt-3">
                    {t('dhLandingCountdownExpires')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* CTA */}
              <div className="text-center">
                <button
                  onClick={openModal}
                  className="w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px] min-h-[48px] sm:min-h-[52px] bg-rose-600 text-white font-bold text-base sm:text-lg py-3 sm:py-3.5 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-rose-500/50 animate-glow active:scale-95"
                >
                  {t('dhLandingCTA')}
                </button>
                <p className="text-xs sm:text-sm text-neutral/50 mt-3 sm:mt-4">
                  {t('dhLandingTrustText')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SCHEDULE SECTION
        ================================================================ */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral text-center mb-2 sm:mb-3 holographic-text">
                {t('dhLandingScheduleTitle')}
              </h2>
              <p className="text-neutral/60 text-center text-sm sm:text-base mb-8 sm:mb-10">
                {t('dhLandingScheduleSubtitle')}
              </p>
            </AnimateOnScroll>

            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {DANCEHALL_LANDING_SCHEDULE.map((schedule, index) => (
                <AnimateOnScroll key={schedule.id} delay={index * 60}>
                  <div className="p-3 sm:p-4 bg-black/50 backdrop-blur-md rounded-xl border border-rose-500/20 hover:border-rose-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-neutral font-semibold text-sm sm:text-base">
                        {t(schedule.dayKey)}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] sm:text-xs rounded-full bg-rose-500/20 text-rose-400">
                        {t(schedule.levelKey)}
                      </span>
                    </div>
                    <p className="text-neutral/80 text-xs sm:text-sm font-medium">
                      {schedule.className}
                    </p>
                    <p className="text-neutral/60 text-xs sm:text-sm">
                      {schedule.time} · {schedule.teacher}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Single CTA after schedule */}
            <AnimateOnScroll>
              <div className="text-center mt-8 sm:mt-10">
                <button
                  onClick={openModal}
                  className="w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px] min-h-[48px] sm:min-h-[52px] bg-rose-600 text-white font-bold text-base sm:text-lg py-3 sm:py-3.5 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-rose-500/50 animate-glow active:scale-95"
                >
                  {t('dhLandingCTA')}
                </button>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-full w-full bg-rose-500"></span>
                </span>
                <p className="text-rose-400 font-medium text-xs sm:text-sm">
                  {t('dhLandingLimitedSpots')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            WHY FARRAY'S - Premium Cards with 3D Hover
        ================================================================ */}
        <section className="py-12 sm:py-16 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral text-center mb-8 sm:mb-10 holographic-text">
                {t('dhLandingWhyFarraysTitle')}
              </h2>
            </AnimateOnScroll>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-5xl mx-auto">
              {DANCEHALL_WHY_FARRAYS.map((item, index) => (
                <AnimateOnScroll
                  key={item.titleKey}
                  delay={index * 80}
                  className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] [perspective:1000px]"
                >
                  <div className="group h-full p-4 sm:p-5 bg-black/40 rounded-xl border border-rose-500/20 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(3deg)] hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-500/30 transition-colors shadow-lg shadow-rose-500/10">
                        <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
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
                  { value: 8, suffix: '+', label: 'dhLandingStatYears' },
                  { value: 1500, suffix: '+', label: 'dhLandingStatActive' },
                  { value: 15000, suffix: '+', label: 'dhLandingStatSatisfied' },
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

            {/* Logos - Has podido vernos en */}
            <AnimateOnScroll>
              <div className="mt-12 sm:mt-16">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral text-center mb-6 sm:mb-8 holographic-text">
                  {t('dhLandingLogosTitle')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
                  {LOGOS.map((logo, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-rose-500/20 transition-all duration-500 [perspective:1000px] [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)] hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/20"
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

                {/* Festivales text */}
                <p className="text-center text-sm sm:text-base mt-6 sm:mt-8 font-bold holographic-text">
                  {t('dhLandingFestivalsText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            TESTIMONIALS
        ================================================================ */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral mb-3 sm:mb-4 holographic-text">
                  {t('dhLandingTestimonialsTitle')}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  {/* Google Logo */}
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
                      className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-neutral/70 text-xs sm:text-sm ml-1">
                    {SOCIAL_PROOF.reviewCount} {t('dhLandingReviewsLabel')}
                  </span>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Showcase Image */}
            <AnimateOnScroll>
              <div className="max-w-md mx-auto mb-8 sm:mb-10">
                <div className="rounded-2xl overflow-hidden border border-rose-500/30 shadow-xl shadow-rose-500/10">
                  <img
                    src="/images/classes/dancehall/img/dancehall-dance-students-02_960.webp"
                    alt="Alumnas de Dancehall en Barcelona"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </AnimateOnScroll>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {DANCEHALL_TESTIMONIALS.map((testimonial, index) => (
                <AnimateOnScroll
                  key={testimonial.id}
                  delay={index * 100}
                  className="[perspective:1000px]"
                >
                  <div className="group h-full p-4 sm:p-5 bg-black/40 rounded-xl border border-white/10 hover:border-rose-500/30 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.25rem)_scale(1.01)] hover:shadow-lg hover:shadow-rose-500/10">
                    <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400"
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

        {/* ================================================================
            FAQ - Objection Busters
        ================================================================ */}
        <section className="py-12 sm:py-16 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral text-center mb-8 sm:mb-10 holographic-text">
                {t('dhLandingFaqTitle')}
              </h2>
            </AnimateOnScroll>

            <div className="max-w-2xl mx-auto space-y-2 sm:space-y-3">
              {DANCEHALL_OBJECTION_FAQS.map(faq => (
                <AnimateOnScroll key={faq.id}>
                  <div className="bg-black/40 rounded-xl border border-white/10 overflow-hidden hover:border-rose-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-neutral font-semibold text-sm sm:text-base pr-4">
                        {t(faq.questionKey)}
                      </span>
                      <ChevronDownIcon
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-rose-400 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openFaq === faq.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                      }`}
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

        {/* ================================================================
            FINAL CTA
        ================================================================ */}
        <section className="py-16 sm:py-20 md:py-28 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 via-black to-pink-900/30" />
          <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-neutral mb-4 sm:mb-6 holographic-text leading-tight">
                  {t('dhLandingFinalCTATitle')}
                </h2>
                <p className="text-neutral/70 text-base sm:text-lg mb-8 sm:mb-10">
                  {t('dhLandingFinalCTADesc')}
                </p>

                <button
                  onClick={openModal}
                  className="w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px] min-h-[48px] sm:min-h-[52px] bg-rose-600 text-white font-bold text-base sm:text-lg py-3 sm:py-3.5 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-rose-500/50 animate-glow active:scale-95 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative">{t('dhLandingCTA')}</span>
                </button>

                <p className="text-neutral/50 text-xs sm:text-sm mt-4 sm:mt-6">
                  {t('dhLandingFinalTrust')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            FOOTER - Legal Links
        ================================================================ */}
        <footer className="py-6 sm:py-8 border-t border-white/10 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center">
              <p className="text-neutral/60 text-xs sm:text-sm mb-3 sm:mb-4">
                Farray&apos;s International Dance Center © {new Date().getFullYear()} -{' '}
                {t('dhLandingFooterRights')}
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <Link
                  to={`/${locale}/aviso-legal`}
                  className="text-neutral/50 hover:text-rose-400 transition-colors"
                >
                  {t('dhLandingFooterLegal')}
                </Link>
                <span className="text-neutral/30">|</span>
                <Link
                  to={`/${locale}/politica-privacidad`}
                  className="text-neutral/50 hover:text-rose-400 transition-colors"
                >
                  {t('dhLandingFooterPrivacy')}
                </Link>
                <span className="text-neutral/30">|</span>
                <Link
                  to={`/${locale}/terminos-condiciones`}
                  className="text-neutral/50 hover:text-rose-400 transition-colors"
                >
                  {t('dhLandingFooterTerms')}
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Dancehall Lead Capture Modal */}
      <DancehallLeadModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Exit Intent Popup - Alternative styles */}
      <ExitIntentPopup
        isOpen={isExitPopupOpen}
        onClose={() => setIsExitPopupOpen(false)}
        onReserveDancehall={openModal}
        locale={locale}
      />
    </>
  );
};

export default DancehallLanding;
