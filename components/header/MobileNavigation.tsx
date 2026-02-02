import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlobeIcon, ChevronDownIcon, XMarkIcon, UserIcon } from '../../lib/icons';
import type { Locale } from '../../types';
import { SUPPORTED_LOCALES } from '../../types';

interface SubSubMenuItem {
  path: string;
  textKey: string;
  submenu?: Array<{ path: string; textKey: string }>;
}

interface MenuStructure {
  home: { path: string; textKey: string };
  classes: {
    path: string;
    textKey: string;
    submenu?: Array<{
      path: string;
      textKey: string;
      submenu?: SubSubMenuItem[];
    }>;
  };
}

interface MobileNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  menuStructure: MenuStructure;
  locale: Locale;
  handleLanguageChange: (lang: Locale) => void;
  onOpenLeadModal: () => void;
  languageNames: Record<Locale, string>;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  menuStructure,
  locale,
  handleLanguageChange,
  onOpenLeadModal,
  languageNames: _languageNames,
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
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Accordion states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Scroll indicator state
  const [canScrollDown, setCanScrollDown] = useState(true);

  // Swipe to close state
  const touchStartX = useRef(0);
  const isSwiping = useRef(false);

  // Haptic feedback helper (enterprise touch)
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Very subtle 10ms vibration
    }
  };

  const toggleSection = (section: string) => {
    triggerHaptic();
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Focus trap: Auto-focus first element and handle Escape key
  useEffect(() => {
    if (!isMenuOpen) {
      // Reset accordion states when menu closes
      setOpenSections({});
      return;
    }

    // Focus first link when menu opens
    firstFocusableRef.current?.focus();

    // Handle Escape key to close menu

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    // Trap focus within menu

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll(
          'a[href], button:not([disabled])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTabKey);

    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, setIsMenuOpen]);

  // Scroll indicator: detect if user can scroll down
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isMenuOpen) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 20);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => container.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  // Swipe to close: detect swipe right gesture (only horizontal, not interfering with scroll)
  const swipeOffsetRef = useRef(0);
  const touchStartY = useRef(0);
  const swipeDecided = useRef(false);
  const isHorizontalSwipe = useRef(false);

  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const SWIPE_THRESHOLD = 60; // px to trigger close (reduced for easier swipe)
    const DIRECTION_THRESHOLD = 8; // px to determine swipe direction

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      isSwiping.current = true;
      swipeDecided.current = false;
      isHorizontalSwipe.current = false;
      swipeOffsetRef.current = 0;
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!isSwiping.current) return;
      const touch = e.touches[0];
      if (!touch) return;

      const diffX = touch.clientX - touchStartX.current;
      const diffY = touch.clientY - touchStartY.current;

      // Decide direction once on first significant movement
      if (!swipeDecided.current) {
        const absDiffX = Math.abs(diffX);
        const absDiffY = Math.abs(diffY);

        if (absDiffX > DIRECTION_THRESHOLD || absDiffY > DIRECTION_THRESHOLD) {
          swipeDecided.current = true;
          // Horizontal if X movement is greater than Y movement
          isHorizontalSwipe.current = absDiffX > absDiffY && diffX > 0;
        }
      }

      // Track horizontal swipe to the right
      if (isHorizontalSwipe.current && diffX > 0) {
        swipeOffsetRef.current = diffX;
      }
    };

    const handleTouchEnd = () => {
      if (isHorizontalSwipe.current && swipeOffsetRef.current > SWIPE_THRESHOLD) {
        triggerHaptic();
        setIsMenuOpen(false);
      }
      swipeOffsetRef.current = 0;
      isSwiping.current = false;
      swipeDecided.current = false;
      isHorizontalSwipe.current = false;
    };

    menu.addEventListener('touchstart', handleTouchStart, { passive: true });
    menu.addEventListener('touchmove', handleTouchMove, { passive: true });
    menu.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      menu.removeEventListener('touchstart', handleTouchStart);
      menu.removeEventListener('touchmove', handleTouchMove);
      menu.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  // Accordion header component - Enterprise styling
  const AccordionHeader: React.FC<{
    label: string;
    isOpen: boolean;
    onClick: () => void;
    linkTo?: string;
    isPrimary?: boolean;
  }> = ({ label, isOpen, onClick, linkTo, isPrimary = false }) => (
    <div
      className={`flex items-center justify-between w-full ${isPrimary ? 'py-4 px-4 rounded-xl hover:bg-white/5 transition-all duration-300' : 'py-2.5 px-3'}`}
    >
      {linkTo ? (
        <Link
          to={linkTo}
          onClick={() => setIsMenuOpen(false)}
          className={`flex-1 flex items-center gap-2 text-left font-bold tracking-wide transition-all duration-300 ${
            isPrimary ? 'text-lg' : 'text-base'
          } ${
            location.pathname === linkTo
              ? 'text-primary-accent'
              : 'text-white hover:text-primary-accent'
          }`}
        >
          {isPrimary && (
            <span
              className={`w-1.5 h-1.5 rounded-full ${location.pathname === linkTo ? 'bg-primary-accent' : 'bg-white/30'}`}
            />
          )}
          {label}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={`flex-1 flex items-center gap-2 text-left font-bold tracking-wide cursor-pointer ${isPrimary ? 'text-lg' : 'text-base'} text-white hover:text-primary-accent transition-all duration-300`}
        >
          {isPrimary && <span className="w-1.5 h-1.5 rounded-full bg-white/30" />}
          {label}
        </button>
      )}
      <button
        onClick={onClick}
        className={`p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 ${isOpen ? 'bg-white/10' : ''}`}
        aria-expanded={isOpen}
        aria-label={isOpen ? `Collapse ${label}` : `Expand ${label}`}
      >
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );

  // Don't render if menu is closed (cleaner than CSS hiding)
  if (!isMenuOpen) return null;

  return (
    <div
      ref={menuRef}
      id="mobile-menu"
      className="fixed inset-0 bg-black z-[100] lg:hidden flex flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation menu"
    >
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-accent via-brand-500 to-primary-accent" />

      {/* Header with language selector and close button */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        {/* Language Selector - Enterprise compact design */}
        <div className="flex items-center gap-1.5">
          <GlobeIcon className="w-4 h-4 text-white/60" />
          <div className="flex items-center bg-white/10 rounded-full p-0.5">
            {SUPPORTED_LOCALES.map(lang => (
              <button
                key={lang}
                onClick={() => {
                  triggerHaptic();
                  handleLanguageChange(lang);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  locale === lang
                    ? 'bg-primary-accent text-white shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Close button - vibrant like desktop */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="p-2.5 rounded-full bg-gradient-to-r from-primary-accent to-brand-500 text-white shadow-lg shadow-primary-accent/30 hover:shadow-accent-glow transition-all duration-300"
          aria-label="Close menu"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain py-4 px-6"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <nav className="flex flex-col space-y-3">
          {/* 1. Inicio */}
          <Link
            ref={firstFocusableRef}
            to={menuStructure.home.path}
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-3 py-4 px-4 text-lg font-bold tracking-wide transition-all duration-300 rounded-xl ${
              location.pathname === menuStructure.home.path
                ? 'text-white bg-primary-accent/20 border-l-4 border-primary-accent'
                : 'text-white hover:text-white hover:bg-white/5'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${location.pathname === menuStructure.home.path ? 'bg-primary-accent' : 'bg-white/30'}`}
            />
            {t(menuStructure.home.textKey)}
          </Link>

          {/* Divider */}
          <div className="border-b border-white/10 my-2" />

          {/* 2. Quiénes Somos - Accordion */}
          <div>
            <AccordionHeader
              label={t('navAboutUs')}
              isOpen={openSections['about'] || false}
              onClick={() => toggleSection('about')}
              isPrimary
            />

            {openSections['about'] && (
              <div className="ml-4 pl-3 space-y-2 border-l-2 border-primary-accent/40 animate-slideDown">
                <Link
                  to={`/${locale}/sobre-nosotros`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/sobre-nosotros`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('headerAbout')}
                </Link>

                <Link
                  to={`/${locale}/yunaisy-farray`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/yunaisy-farray`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navYunaisy')}
                </Link>

                <Link
                  to={`/${locale}/profesores-baile-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/profesores-baile-barcelona`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navProfesores')}
                </Link>

                <Link
                  to={`/${locale}/instalaciones-escuela-baile-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/instalaciones-escuela-baile-barcelona`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navFacilities')}
                </Link>

                <Link
                  to={`/${locale}/preguntas-frecuentes`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/preguntas-frecuentes`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navFAQ')}
                </Link>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-b border-white/10 my-2" />

          {/* 3. Clases de Baile - Accordion simplificado */}
          <div>
            <AccordionHeader
              label={t(menuStructure.classes.textKey)}
              isOpen={openSections['classes'] || false}
              onClick={() => toggleSection('classes')}
              isPrimary
            />

            {openSections['classes'] && (
              <div className="ml-4 pl-3 space-y-2 border-l-2 border-primary-accent/40 animate-slideDown">
                {/* Ver Todas las Clases - primera opción en rojo */}
                <Link
                  to={menuStructure.classes.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2.5 px-3 text-base font-bold text-primary-accent"
                >
                  <span className="w-2 h-2 rounded-full bg-primary-accent" />
                  {t('navAllClasses')}
                </Link>

                {/* Categorías - links simples a hubs */}
                <Link
                  to={`/${locale}/clases/danza-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/clases/danza-barcelona`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navDanza')}
                </Link>
                <Link
                  to={`/${locale}/clases/danzas-urbanas-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/clases/danzas-urbanas-barcelona`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navDanzasUrbanas')}
                </Link>
                <Link
                  to={`/${locale}/clases/salsa-bachata-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/clases/salsa-bachata-barcelona`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navSalsaBachata')}
                </Link>
                <Link
                  to={`/${locale}/clases/entrenamiento-bailarines-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/clases/entrenamiento-bailarines-barcelona`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navPrepFisica')}
                </Link>

                {/* Otros enlaces */}
                <Link
                  to={`/${locale}/clases/baile-mananas`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/clases/baile-mananas`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navBaileMananas')}
                </Link>
                <Link
                  to={`/${locale}/horarios-clases-baile-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/horarios-clases-baile-barcelona`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navSchedule')}
                </Link>
                <Link
                  to={`/${locale}/precios-clases-baile-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/precios-clases-baile-barcelona`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navPricing')}
                </Link>
                <Link
                  to={`/${locale}/calendario`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/calendario`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navCalendar')}
                </Link>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-b border-white/10 my-2" />

          {/* 4. Servicios - Accordion */}
          <div>
            <AccordionHeader
              label={t('navServices')}
              isOpen={openSections['services'] || false}
              onClick={() => toggleSection('services')}
              isPrimary
            />

            {openSections['services'] && (
              <div className="ml-4 pl-3 space-y-2 border-l-2 border-primary-accent/40 animate-slideDown">
                <Link
                  to={`/${locale}/clases-particulares-baile`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/clases-particulares-baile`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navClasesParticulares')}
                </Link>

                <Link
                  to={`/${locale}/alquiler-salas-baile-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/alquiler-salas-baile-barcelona`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('headerRoomRental')}
                </Link>

                <Link
                  to={`/${locale}/estudio-grabacion-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/estudio-grabacion-barcelona`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('headerRecordingStudio')}
                </Link>

                <Link
                  to={`/${locale}/regala-baile`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/regala-baile`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('headerGiftDance')}
                </Link>

                <Link
                  to={`/${locale}/team-building-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2.5 px-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/team-building-barcelona`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('navTeamBuilding')}
                </Link>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-b border-white/10 my-2" />

          {/* 7. Blog */}
          <Link
            to={`/${locale}/blog`}
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-3 py-4 px-4 text-lg font-bold tracking-wide transition-all duration-300 rounded-xl ${
              location.pathname.includes('/blog')
                ? 'text-white bg-primary-accent/20 border-l-4 border-primary-accent'
                : 'text-white hover:text-white hover:bg-white/5'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${location.pathname.includes('/blog') ? 'bg-primary-accent' : 'bg-white/30'}`}
            />
            {t('navBlog')}
          </Link>

          {/* 8. Contacto */}
          <Link
            to={`/${locale}/contacto`}
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-3 py-4 px-4 text-lg font-bold tracking-wide transition-all duration-300 rounded-xl ${
              location.pathname === `/${locale}/contacto`
                ? 'text-white bg-primary-accent/20 border-l-4 border-primary-accent'
                : 'text-white hover:text-white hover:bg-white/5'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${location.pathname === `/${locale}/contacto` ? 'bg-primary-accent' : 'bg-white/30'}`}
            />
            {t('headerContact')}
          </Link>
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-8 space-y-4">
          {/* Área de Socio - Link externo */}
          <a
            href="https://momence.com/sign-in?hostId=36148"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-3 px-4 text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-full transition-all duration-300"
          >
            <UserIcon className="w-5 h-5" />
            <span className="font-semibold">{t('header_member_area')}</span>
            <svg
              className="w-4 h-4 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          {/* CTA Button */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onOpenLeadModal();
            }}
            className="block w-full text-center bg-gradient-to-r from-primary-accent to-brand-500 text-white text-lg font-bold py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-accent-glow animate-pulse-slow"
          >
            {t('enrollNow')}
          </button>
        </div>
      </div>

      {/* Scroll indicator - shows gradient when more content below */}
      {canScrollDown && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10 transition-opacity duration-300" />
      )}
    </div>
  );
};

export default MobileNavigation;
