import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { GlobeIcon } from '../../lib/icons';
import type { Locale } from '../../types';

interface MenuStructure {
  home: { path: string; textKey: string };
  classes: {
    path: string;
    textKey: string;
    submenu?: Array<{
      path: string;
      textKey: string;
      submenu?: Array<{ path: string; textKey: string }>;
    }>;
  };
}

interface MobileNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  menuStructure: MenuStructure;
  locale: Locale;
  handleLanguageChange: (lang: Locale) => void;
  handleEnrollClick: () => void;
  languageNames: Record<Locale, string>;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  menuStructure,
  locale,
  handleLanguageChange,
  handleEnrollClick,
  languageNames,
}) => {
  const { t } = useI18n();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-undef
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);

  // Focus trap: Auto-focus first element and handle Escape key
  useEffect(() => {
    if (isMenuOpen) {
      // Focus first link when menu opens
      firstFocusableRef.current?.focus();

      // Handle Escape key to close menu
      // eslint-disable-next-line no-undef
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMenuOpen(false);
        }
      };

      // Trap focus within menu
      // eslint-disable-next-line no-undef
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
    }
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <div
      ref={menuRef}
      id="mobile-menu"
      className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 transition-transform duration-500 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation menu"
    >
      <div className="flex flex-col items-center justify-center h-full space-y-12 overflow-y-auto py-20">
        <nav className="flex flex-col items-center space-y-6">
          {/* Home */}
          <Link
            ref={firstFocusableRef}
            to={menuStructure.home.path}
            onClick={() => setIsMenuOpen(false)}
            className={`text-2xl font-bold transition-colors duration-300 ${
              location.pathname === menuStructure.home.path
                ? 'text-primary-accent'
                : 'text-neutral hover:text-white'
            }`}
          >
            {t(menuStructure.home.textKey)}
          </Link>

          {/* Classes */}
          <Link
            to={menuStructure.classes.path}
            onClick={() => setIsMenuOpen(false)}
            className={`text-2xl font-bold transition-colors duration-300 ${
              location.pathname === menuStructure.classes.path
                ? 'text-primary-accent'
                : 'text-neutral hover:text-white'
            }`}
          >
            {t(menuStructure.classes.textKey)}
          </Link>

          {/* Submenu items */}
          <div className="flex flex-col items-center space-y-4 pl-6">
            {menuStructure.classes.submenu?.map(item => (
              <div key={item.path} className="flex flex-col items-center space-y-3">
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-xl font-semibold transition-colors duration-300 ${
                    location.pathname === item.path
                      ? 'text-primary-accent'
                      : 'text-neutral hover:text-white'
                  }`}
                >
                  {t(item.textKey)}
                </Link>
                {/* Sub-submenu (Dancehall under Urban) */}
                {item.submenu && (
                  <div className="flex flex-col items-center space-y-2 pl-4">
                    {item.submenu.map(subitem => (
                      <Link
                        key={subitem.path}
                        to={subitem.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`text-lg font-medium transition-colors duration-300 ${
                          location.pathname === subitem.path
                            ? 'text-primary-accent'
                            : 'text-neutral hover:text-white'
                        }`}
                      >
                        {t(subitem.textKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Services Section */}
          <div className="text-2xl font-bold text-primary-accent">{t('navServices')}</div>

          <div className="flex flex-col items-center space-y-4 pl-6">
            <Link
              to={`/${locale}/alquiler-salas-baile-barcelona`}
              onClick={() => setIsMenuOpen(false)}
              className={`text-xl font-semibold transition-colors duration-300 ${
                location.pathname === `/${locale}/alquiler-salas-baile-barcelona`
                  ? 'text-primary-accent'
                  : 'text-neutral hover:text-white'
              }`}
            >
              {t('headerRoomRental')}
            </Link>

            <Link
              to={`/${locale}/estudio-grabacion-barcelona`}
              onClick={() => setIsMenuOpen(false)}
              className={`text-xl font-semibold transition-colors duration-300 ${
                location.pathname === `/${locale}/estudio-grabacion-barcelona`
                  ? 'text-primary-accent'
                  : 'text-neutral/80 hover:text-white'
              }`}
            >
              {t('headerRecordingStudio')}
            </Link>

            <Link
              to={`/${locale}/regala-baile`}
              onClick={() => setIsMenuOpen(false)}
              className={`text-xl font-semibold transition-colors duration-300 ${
                location.pathname === `/${locale}/regala-baile`
                  ? 'text-primary-accent'
                  : 'text-neutral/80 hover:text-white'
              }`}
            >
              {t('headerGiftDance')}
            </Link>

            <Link
              to={`/${locale}/clases-particulares-baile`}
              onClick={() => setIsMenuOpen(false)}
              className={`text-xl font-semibold transition-colors duration-300 ${
                location.pathname === `/${locale}/clases-particulares-baile`
                  ? 'text-primary-accent'
                  : 'text-neutral/80 hover:text-white'
              }`}
            >
              {t('navClasesParticulares')}
            </Link>

            <Link
              to={`/${locale}/merchandising`}
              onClick={() => setIsMenuOpen(false)}
              className={`text-xl font-semibold transition-colors duration-300 ${
                location.pathname === `/${locale}/merchandising`
                  ? 'text-primary-accent'
                  : 'text-neutral/80 hover:text-white'
              }`}
            >
              {t('headerMerchandising')}
            </Link>
          </div>

          {/* About Us Section with Subcategories */}
          <div className="text-2xl font-bold text-primary-accent">{t('navAboutUs')}</div>

          <div className="flex flex-col items-center space-y-4 pl-6">
            <Link
              to={`/${locale}/yunaisy-farray`}
              onClick={() => setIsMenuOpen(false)}
              className={`text-xl font-semibold transition-colors duration-300 ${
                location.pathname === `/${locale}/yunaisy-farray`
                  ? 'text-primary-accent'
                  : 'text-neutral/80 hover:text-white'
              }`}
            >
              {t('sitemapYunaisy')}
            </Link>

            <Link
              to={`/${locale}/sobre-nosotros`}
              onClick={() => setIsMenuOpen(false)}
              className={`text-xl font-semibold transition-colors duration-300 ${
                location.pathname === `/${locale}/sobre-nosotros`
                  ? 'text-primary-accent'
                  : 'text-neutral/80 hover:text-white'
              }`}
            >
              {t('headerAbout')}
            </Link>
          </div>

          {/* Contact and FAQ Links */}
          <Link
            to={`/${locale}/contacto`}
            onClick={() => setIsMenuOpen(false)}
            className={`text-2xl font-bold transition-colors duration-300 ${
              location.pathname === `/${locale}/contacto`
                ? 'text-primary-accent'
                : 'text-neutral hover:text-white'
            }`}
          >
            {t('headerContact')}
          </Link>

          <Link
            to={`/${locale}/preguntas-frecuentes`}
            onClick={() => setIsMenuOpen(false)}
            className={`text-2xl font-bold transition-colors duration-300 ${
              location.pathname === `/${locale}/preguntas-frecuentes`
                ? 'text-primary-accent'
                : 'text-neutral hover:text-white'
            }`}
          >
            {t('headerFAQ')}
          </Link>
        </nav>
        {/* Mobile Language Selection */}
        <div className="w-full max-w-xs">
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary-accent/20 border-b border-white/10">
              <GlobeIcon className="w-5 h-5 text-primary-accent" />
              <span className="text-sm font-bold text-white">Select Language</span>
            </div>
            <div className="p-2 space-y-1">
              {(['es', 'ca', 'en', 'fr'] as Locale[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => {
                    handleLanguageChange(lang);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 flex items-center justify-between ${
                    locale === lang
                      ? 'bg-primary-accent text-white shadow-lg'
                      : 'text-neutral hover:bg-white/10 hover:text-white'
                  }`}
                  aria-label={`Switch to ${languageNames[lang]}`}
                >
                  <span>{languageNames[lang]}</span>
                  <span className="text-sm opacity-70">{lang.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <Link
          to={`/${locale}#enroll`}
          onClick={() => {
            handleEnrollClick();
            setIsMenuOpen(false);
          }}
          className="bg-primary-accent text-white text-xl font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-white hover:text-primary-accent shadow-md hover:shadow-accent-glow animate-pulse-strong"
        >
          {t('enrollNow')}
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
