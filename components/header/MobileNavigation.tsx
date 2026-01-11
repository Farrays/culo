import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { GlobeIcon, ChevronDownIcon } from '../../lib/icons';
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
  const { t } = useI18n();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Accordion states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Scroll indicator state
  const [canScrollDown, setCanScrollDown] = useState(true);

  // Swipe to close state
  const [swipeOffset, setSwipeOffset] = useState(0);
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

  // Swipe to close: detect swipe right gesture
  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const SWIPE_THRESHOLD = 100; // px to trigger close

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartX.current = touch.clientX;
      isSwiping.current = true;
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!isSwiping.current) return;
      const touch = e.touches[0];
      if (!touch) return;
      const currentX = touch.clientX;
      const diff = currentX - touchStartX.current;
      // Only allow swipe to right (positive diff)
      if (diff > 0) {
        setSwipeOffset(diff);
      }
    };

    const handleTouchEnd = () => {
      if (swipeOffset > SWIPE_THRESHOLD) {
        triggerHaptic();
        setIsMenuOpen(false);
      }
      setSwipeOffset(0);
      isSwiping.current = false;
    };

    menu.addEventListener('touchstart', handleTouchStart, { passive: true });
    menu.addEventListener('touchmove', handleTouchMove, { passive: true });
    menu.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      menu.removeEventListener('touchstart', handleTouchStart);
      menu.removeEventListener('touchmove', handleTouchMove);
      menu.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMenuOpen, swipeOffset, setIsMenuOpen]);

  // Accordion header component - Enterprise styling
  const AccordionHeader: React.FC<{
    label: string;
    isOpen: boolean;
    onClick: () => void;
    linkTo?: string;
    isPrimary?: boolean;
  }> = ({ label, isOpen, onClick, linkTo, isPrimary = false }) => (
    <div
      className={`flex items-center justify-between w-full ${isPrimary ? 'py-4 px-4 rounded-xl hover:bg-white/5 transition-all duration-300' : 'py-3 px-3'}`}
    >
      {linkTo ? (
        <Link
          to={linkTo}
          onClick={() => setIsMenuOpen(false)}
          className={`flex-1 flex items-center gap-3 text-left font-bold tracking-wide transition-all duration-300 ${
            isPrimary ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
          } ${
            location.pathname === linkTo
              ? 'text-primary-accent'
              : 'text-white hover:text-primary-accent'
          }`}
        >
          {isPrimary && (
            <span
              className={`w-2 h-2 rounded-full ${location.pathname === linkTo ? 'bg-primary-accent' : 'bg-white/30'}`}
            />
          )}
          {label}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={`flex-1 flex items-center gap-3 text-left font-bold tracking-wide cursor-pointer ${isPrimary ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} text-white hover:text-primary-accent transition-all duration-300`}
        >
          {isPrimary && <span className="w-2 h-2 rounded-full bg-white/30" />}
          {label}
        </button>
      )}
      <button
        onClick={onClick}
        className={`p-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 ${isOpen ? 'bg-white/10' : ''}`}
        aria-expanded={isOpen}
        aria-label={isOpen ? `Collapse ${label}` : `Expand ${label}`}
      >
        <ChevronDownIcon
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );

  return (
    <div
      ref={menuRef}
      id="mobile-menu"
      className={`fixed inset-0 bg-gradient-to-b from-black via-black/98 to-black/95 backdrop-blur-xl z-[60] ease-out transform lg:hidden ${
        swipeOffset > 0 ? '' : 'transition-all duration-400'
      } ${isMenuOpen ? 'opacity-100' : 'translate-x-full opacity-0'}`}
      style={{
        transform: isMenuOpen ? `translateX(${swipeOffset}px)` : 'translateX(100%)',
        opacity: isMenuOpen ? Math.max(0.3, 1 - swipeOffset / 300) : 0,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation menu"
    >
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-accent via-brand-500 to-primary-accent" />

      <div
        ref={scrollContainerRef}
        className="flex flex-col h-full overflow-y-auto pt-44 sm:pt-48 pb-8 px-6 sm:px-8"
      >
        {/* Language Selector - Top */}
        <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-accent/20 to-brand-500/20 border-b border-white/10">
            <GlobeIcon className="w-5 h-5 text-primary-accent" />
            <span className="text-sm font-bold text-white/90 tracking-wide">
              {t('headerLanguage') || 'Idioma'}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 p-3">
            {SUPPORTED_LOCALES.map(lang => (
              <button
                key={lang}
                onClick={() => {
                  triggerHaptic();
                  handleLanguageChange(lang);
                }}
                className={`py-3 px-3 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 ${
                  locale === lang
                    ? 'bg-gradient-to-r from-primary-accent to-brand-500 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <nav className="flex flex-col space-y-2">
          {/* 1. Inicio */}
          <Link
            ref={firstFocusableRef}
            to={menuStructure.home.path}
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-3 py-4 px-4 text-lg sm:text-xl font-bold tracking-wide transition-all duration-300 rounded-xl ${
              location.pathname === menuStructure.home.path
                ? 'text-white bg-primary-accent/20 border-l-4 border-primary-accent'
                : 'text-white hover:text-white hover:bg-white/5'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${location.pathname === menuStructure.home.path ? 'bg-primary-accent' : 'bg-white/30'}`}
            />
            {t(menuStructure.home.textKey)}
          </Link>

          {/* Divider */}
          <div className="border-b border-white/10 my-3" />

          {/* 2. Quiénes Somos - Accordion */}
          <div>
            <AccordionHeader
              label={t('navAboutUs')}
              isOpen={openSections['about'] || false}
              onClick={() => toggleSection('about')}
              isPrimary
            />

            {openSections['about'] && (
              <div className="ml-6 pl-4 space-y-1 border-l-2 border-primary-accent/40 animate-slideDown">
                <Link
                  to={`/${locale}/sobre-nosotros`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-3 px-3 text-base sm:text-lg font-medium rounded-lg transition-all duration-300 ${
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
                  className={`flex items-center gap-2 py-3 px-3 text-base sm:text-lg font-medium rounded-lg transition-all duration-300 ${
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
                  className={`flex items-center gap-2 py-3 px-3 text-base sm:text-lg font-medium rounded-lg transition-all duration-300 ${
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
                  className={`flex items-center gap-2 py-3 px-3 text-base sm:text-lg font-medium rounded-lg transition-all duration-300 ${
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
                  className={`flex items-center gap-2 py-3 px-3 text-base sm:text-lg font-medium rounded-lg transition-all duration-300 ${
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
          <div className="border-b border-white/10 my-3" />

          {/* 3. Clases de Baile - Accordion */}
          <div>
            <AccordionHeader
              label={t(menuStructure.classes.textKey)}
              isOpen={openSections['classes'] || false}
              onClick={() => toggleSection('classes')}
              linkTo={menuStructure.classes.path}
              isPrimary
            />

            {openSections['classes'] && (
              <div className="ml-6 pl-4 space-y-1 border-l-2 border-primary-accent/40 animate-slideDown">
                {menuStructure.classes.submenu?.map(item => (
                  <div key={item.path}>
                    {item.submenu ? (
                      // Nested accordion for Urban Dances
                      <div>
                        <AccordionHeader
                          label={t(item.textKey)}
                          isOpen={openSections[item.textKey] || false}
                          onClick={() => toggleSection(item.textKey)}
                          linkTo={item.path}
                        />
                        {openSections[item.textKey] && (
                          <div className="ml-4 pl-3 space-y-1 border-l-2 border-white/20 animate-slideDown">
                            {item.submenu.map(subitem =>
                              subitem.submenu ? (
                                // Third level - Heels with Femmology & Sexy Style
                                <div key={subitem.path}>
                                  <AccordionHeader
                                    label={t(subitem.textKey)}
                                    isOpen={openSections[subitem.textKey] || false}
                                    onClick={() => toggleSection(subitem.textKey)}
                                    linkTo={subitem.path}
                                  />
                                  {openSections[subitem.textKey] && (
                                    <div className="ml-4 pl-3 space-y-1 border-l-2 border-white/10 animate-slideDown">
                                      {subitem.submenu.map(subsubitem => (
                                        <Link
                                          key={subsubitem.path}
                                          to={subsubitem.path}
                                          onClick={() => setIsMenuOpen(false)}
                                          className={`flex items-center gap-2 py-2.5 px-2 text-sm sm:text-base font-medium rounded-lg transition-all duration-300 ${
                                            location.pathname === subsubitem.path
                                              ? 'text-primary-accent bg-primary-accent/10'
                                              : 'text-white/70 hover:text-white hover:bg-white/5'
                                          }`}
                                        >
                                          <span className="w-1 h-1 rounded-full bg-primary-accent/40" />
                                          {t(subsubitem.textKey)}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <Link
                                  key={subitem.path}
                                  to={subitem.path}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={`flex items-center gap-2 py-2.5 px-2 text-sm sm:text-base font-medium rounded-lg transition-all duration-300 ${
                                    location.pathname === subitem.path
                                      ? 'text-primary-accent bg-primary-accent/10'
                                      : 'text-white/70 hover:text-white hover:bg-white/5'
                                  }`}
                                >
                                  <span className="w-1 h-1 rounded-full bg-primary-accent/40" />
                                  {t(subitem.textKey)}
                                </Link>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Simple link (Baile de Mañanas, Horarios, Precios) - same style as Salsa & Bachata
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex-1 flex items-center gap-3 py-3 px-3 text-base sm:text-lg font-bold tracking-wide transition-all duration-300 ${
                          location.pathname === item.path
                            ? 'text-primary-accent'
                            : 'text-white hover:text-primary-accent'
                        }`}
                      >
                        {t(item.textKey)}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-b border-white/10 my-3" />

          {/* 4. Servicios - Accordion */}
          <div>
            <AccordionHeader
              label={t('navServices')}
              isOpen={openSections['services'] || false}
              onClick={() => toggleSection('services')}
              isPrimary
            />

            {openSections['services'] && (
              <div className="ml-6 pl-4 space-y-1 border-l-2 border-primary-accent/40 animate-slideDown">
                <Link
                  to={`/${locale}/clases-particulares-baile`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-3 px-3 text-base sm:text-lg font-medium rounded-lg transition-all duration-300 ${
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
                  className={`flex items-center gap-2 py-3 px-3 text-base sm:text-lg font-medium rounded-lg transition-all duration-300 ${
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
                  className={`flex items-center gap-2 py-3 px-3 text-base sm:text-lg font-medium rounded-lg transition-all duration-300 ${
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
                  className={`flex items-center gap-2 py-3 px-3 text-base sm:text-lg font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === `/${locale}/regala-baile`
                      ? 'text-primary-accent bg-primary-accent/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent/50" />
                  {t('headerGiftDance')}
                </Link>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-b border-white/10 my-3" />

          {/* 7. Blog */}
          <Link
            to={`/${locale}/blog`}
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-3 py-4 px-4 text-lg sm:text-xl font-bold tracking-wide transition-all duration-300 rounded-xl ${
              location.pathname.includes('/blog')
                ? 'text-white bg-primary-accent/20 border-l-4 border-primary-accent'
                : 'text-white hover:text-white hover:bg-white/5'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${location.pathname.includes('/blog') ? 'bg-primary-accent' : 'bg-white/30'}`}
            />
            {t('navBlog')}
          </Link>

          {/* 8. Contacto */}
          <Link
            to={`/${locale}/contacto`}
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-3 py-4 px-4 text-lg sm:text-xl font-bold tracking-wide transition-all duration-300 rounded-xl ${
              location.pathname === `/${locale}/contacto`
                ? 'text-white bg-primary-accent/20 border-l-4 border-primary-accent'
                : 'text-white hover:text-white hover:bg-white/5'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${location.pathname === `/${locale}/contacto` ? 'bg-primary-accent' : 'bg-white/30'}`}
            />
            {t('headerContact')}
          </Link>
        </nav>

        {/* Bottom Section - CTA - Enterprise styling */}
        <div className="mt-auto pt-8">
          {/* CTA Button - Enterprise */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onOpenLeadModal();
            }}
            className="block w-full text-center bg-gradient-to-r from-primary-accent to-brand-500 text-white text-lg sm:text-xl font-bold py-5 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-accent-glow animate-glow"
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
