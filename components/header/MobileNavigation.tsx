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
  languageNames: _languageNames,
}) => {
  const { t } = useI18n();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-undef
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);

  // Accordion states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
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
  }, [isMenuOpen, setIsMenuOpen]);

  // Accordion header component
  const AccordionHeader: React.FC<{
    label: string;
    isOpen: boolean;
    onClick: () => void;
    linkTo?: string;
    isPrimary?: boolean;
  }> = ({ label, isOpen, onClick, linkTo, isPrimary = false }) => (
    <div className={`flex items-center justify-between w-full ${isPrimary ? 'py-3' : 'py-2'}`}>
      {linkTo ? (
        <Link
          to={linkTo}
          onClick={() => setIsMenuOpen(false)}
          className={`flex-1 text-left font-semibold transition-colors duration-300 ${
            isPrimary ? 'text-lg' : 'text-base'
          } ${
            location.pathname === linkTo
              ? 'text-primary-accent'
              : 'text-white hover:text-primary-accent'
          }`}
        >
          {label}
        </Link>
      ) : (
        <span
          className={`flex-1 text-left font-semibold ${isPrimary ? 'text-lg' : 'text-base'} text-white`}
        >
          {label}
        </span>
      )}
      <button
        onClick={onClick}
        className="p-2 -mr-2 text-neutral/70 hover:text-white transition-colors"
        aria-expanded={isOpen}
        aria-label={isOpen ? `Collapse ${label}` : `Expand ${label}`}
      >
        <ChevronDownIcon
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );

  return (
    <div
      ref={menuRef}
      id="mobile-menu"
      className={`fixed inset-0 bg-black/98 backdrop-blur-xl z-40 transition-transform duration-300 ease-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation menu"
    >
      <div className="flex flex-col h-full overflow-y-auto pt-24 pb-8 px-6">
        <nav className="flex flex-col space-y-1">
          {/* Home */}
          <Link
            ref={firstFocusableRef}
            to={menuStructure.home.path}
            onClick={() => setIsMenuOpen(false)}
            className={`py-3 text-lg font-semibold transition-colors duration-300 ${
              location.pathname === menuStructure.home.path
                ? 'text-primary-accent'
                : 'text-white hover:text-primary-accent'
            }`}
          >
            {t(menuStructure.home.textKey)}
          </Link>

          {/* Divider */}
          <div className="border-b border-white/10 my-2" />

          {/* Classes Section - Accordion */}
          <div>
            <AccordionHeader
              label={t(menuStructure.classes.textKey)}
              isOpen={openSections['classes'] || false}
              onClick={() => toggleSection('classes')}
              linkTo={menuStructure.classes.path}
              isPrimary
            />

            {openSections['classes'] && (
              <div className="pl-4 space-y-1 border-l-2 border-primary-accent/30 ml-2">
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
                          <div className="pl-4 space-y-1 border-l-2 border-white/10 ml-2">
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
                                    <div className="pl-4 space-y-1 border-l-2 border-white/5 ml-2">
                                      {subitem.submenu.map(subsubitem => (
                                        <Link
                                          key={subsubitem.path}
                                          to={subsubitem.path}
                                          onClick={() => setIsMenuOpen(false)}
                                          className={`block py-2 text-sm font-medium transition-colors duration-300 ${
                                            location.pathname === subsubitem.path
                                              ? 'text-primary-accent'
                                              : 'text-neutral/70 hover:text-white'
                                          }`}
                                        >
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
                                  className={`block py-2 text-sm font-medium transition-colors duration-300 ${
                                    location.pathname === subitem.path
                                      ? 'text-primary-accent'
                                      : 'text-neutral/80 hover:text-white'
                                  }`}
                                >
                                  {t(subitem.textKey)}
                                </Link>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Simple link
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block py-2 text-base font-medium transition-colors duration-300 ${
                          location.pathname === item.path
                            ? 'text-primary-accent'
                            : 'text-neutral/90 hover:text-white'
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
          <div className="border-b border-white/10 my-2" />

          {/* Services Section - Accordion */}
          <div>
            <AccordionHeader
              label={t('navServices')}
              isOpen={openSections['services'] || false}
              onClick={() => toggleSection('services')}
              isPrimary
            />

            {openSections['services'] && (
              <div className="pl-4 space-y-1 border-l-2 border-primary-accent/30 ml-2">
                <Link
                  to={`/${locale}/alquiler-salas-baile-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors duration-300 ${
                    location.pathname === `/${locale}/alquiler-salas-baile-barcelona`
                      ? 'text-primary-accent'
                      : 'text-neutral/90 hover:text-white'
                  }`}
                >
                  {t('headerRoomRental')}
                </Link>

                <Link
                  to={`/${locale}/estudio-grabacion-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors duration-300 ${
                    location.pathname === `/${locale}/estudio-grabacion-barcelona`
                      ? 'text-primary-accent'
                      : 'text-neutral/90 hover:text-white'
                  }`}
                >
                  {t('headerRecordingStudio')}
                </Link>

                <Link
                  to={`/${locale}/regala-baile`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors duration-300 ${
                    location.pathname === `/${locale}/regala-baile`
                      ? 'text-primary-accent'
                      : 'text-neutral/90 hover:text-white'
                  }`}
                >
                  {t('headerGiftDance')}
                </Link>

                <Link
                  to={`/${locale}/clases-particulares-baile`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors duration-300 ${
                    location.pathname === `/${locale}/clases-particulares-baile`
                      ? 'text-primary-accent'
                      : 'text-neutral/90 hover:text-white'
                  }`}
                >
                  {t('navClasesParticulares')}
                </Link>

                <Link
                  to={`/${locale}/merchandising`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors duration-300 ${
                    location.pathname === `/${locale}/merchandising`
                      ? 'text-primary-accent'
                      : 'text-neutral/90 hover:text-white'
                  }`}
                >
                  {t('headerMerchandising')}
                </Link>

                <Link
                  to={`/${locale}/instalaciones-escuela-baile-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors duration-300 ${
                    location.pathname === `/${locale}/instalaciones-escuela-baile-barcelona`
                      ? 'text-primary-accent'
                      : 'text-neutral/90 hover:text-white'
                  }`}
                >
                  {t('navFacilities')}
                </Link>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-b border-white/10 my-2" />

          {/* About Us Section - Accordion */}
          <div>
            <AccordionHeader
              label={t('navAboutUs')}
              isOpen={openSections['about'] || false}
              onClick={() => toggleSection('about')}
              isPrimary
            />

            {openSections['about'] && (
              <div className="pl-4 space-y-1 border-l-2 border-primary-accent/30 ml-2">
                <Link
                  to={`/${locale}/sobre-nosotros`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors duration-300 ${
                    location.pathname === `/${locale}/sobre-nosotros`
                      ? 'text-primary-accent'
                      : 'text-neutral/90 hover:text-white'
                  }`}
                >
                  {t('headerAbout')}
                </Link>

                <Link
                  to={`/${locale}/yunaisy-farray`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors duration-300 ${
                    location.pathname === `/${locale}/yunaisy-farray`
                      ? 'text-primary-accent'
                      : 'text-neutral/90 hover:text-white'
                  }`}
                >
                  {t('navYunaisy')}
                </Link>

                <Link
                  to={`/${locale}/profesores-baile-barcelona`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors duration-300 ${
                    location.pathname === `/${locale}/profesores-baile-barcelona`
                      ? 'text-primary-accent'
                      : 'text-neutral/90 hover:text-white'
                  }`}
                >
                  {t('navProfesores')}
                </Link>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-b border-white/10 my-2" />

          {/* Direct Links */}
          <Link
            to={`/${locale}/blog`}
            onClick={() => setIsMenuOpen(false)}
            className={`py-3 text-lg font-semibold transition-colors duration-300 ${
              location.pathname.includes('/blog')
                ? 'text-primary-accent'
                : 'text-white hover:text-primary-accent'
            }`}
          >
            {t('navBlog')}
          </Link>

          {/* Divider */}
          <div className="border-b border-white/10 my-2" />

          {/* Quick Access Links */}
          <Link
            to={`/${locale}/horarios-clases-baile-barcelona`}
            onClick={() => setIsMenuOpen(false)}
            className={`py-3 text-lg font-semibold transition-colors duration-300 ${
              location.pathname === `/${locale}/horarios-clases-baile-barcelona`
                ? 'text-primary-accent'
                : 'text-white hover:text-primary-accent'
            }`}
          >
            {t('navSchedule')}
          </Link>

          <Link
            to={`/${locale}/precios-clases-baile-barcelona`}
            onClick={() => setIsMenuOpen(false)}
            className={`py-3 text-lg font-semibold transition-colors duration-300 ${
              location.pathname === `/${locale}/precios-clases-baile-barcelona`
                ? 'text-primary-accent'
                : 'text-white hover:text-primary-accent'
            }`}
          >
            {t('navPricing')}
          </Link>

          <Link
            to={`/${locale}/contacto`}
            onClick={() => setIsMenuOpen(false)}
            className={`py-3 text-lg font-semibold transition-colors duration-300 ${
              location.pathname === `/${locale}/contacto`
                ? 'text-primary-accent'
                : 'text-white hover:text-primary-accent'
            }`}
          >
            {t('headerContact')}
          </Link>
        </nav>

        {/* Bottom Section - Language & CTA */}
        <div className="mt-auto pt-6 space-y-4">
          {/* Language Selector */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-accent/10 border-b border-white/10">
              <GlobeIcon className="w-4 h-4 text-primary-accent" />
              <span className="text-xs font-semibold text-white/80">
                {t('headerLanguage') || 'Idioma'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 p-2">
              {SUPPORTED_LOCALES.map(lang => (
                <button
                  key={lang}
                  onClick={() => {
                    handleLanguageChange(lang);
                    setIsMenuOpen(false);
                  }}
                  className={`py-2 px-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                    locale === lang
                      ? 'bg-primary-accent text-white'
                      : 'text-neutral/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <Link
            to={`/${locale}#enroll`}
            onClick={() => {
              handleEnrollClick();
              setIsMenuOpen(false);
            }}
            className="block w-full text-center bg-primary-accent text-white text-lg font-bold py-4 rounded-full transition-all duration-300 hover:bg-white hover:text-primary-accent shadow-lg hover:shadow-accent-glow"
          >
            {t('enrollNow')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
