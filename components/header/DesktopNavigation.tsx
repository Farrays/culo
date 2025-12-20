import React, { useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { ChevronDownIcon } from '../../lib/icons';
import type { Locale } from '../../types';
import type { DropdownKey } from '../Header';

/**
 * Hook for keyboard navigation within dropdown menus.
 * Handles ArrowUp, ArrowDown, Home, End, and Escape keys.
 */
const useDropdownKeyboardNav = (
  containerRef: React.RefObject<HTMLElement | null>,
  onClose: () => void
) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const focusableItems = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      const items = Array.from(focusableItems);
      const currentIndex = items.findIndex(item => item === document.activeElement);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < items.length - 1) {
            items[currentIndex + 1]?.focus();
          } else {
            items[0]?.focus(); // Wrap to first
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            items[currentIndex - 1]?.focus();
          } else {
            items[items.length - 1]?.focus(); // Wrap to last
          }
          break;
        case 'Home':
          e.preventDefault();
          items[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [containerRef, onClose]
  );

  return handleKeyDown;
};

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

interface DesktopNavigationProps {
  menuStructure: MenuStructure;
  locale: Locale;
  isDropdownOpen: (key: DropdownKey) => boolean;
  toggleDropdown: (key: DropdownKey) => void;
  closeAllDropdowns: () => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  menuStructure,
  locale,
  isDropdownOpen,
  toggleDropdown,
  closeAllDropdowns,
}) => {
  const { t } = useI18n();
  const location = useLocation();

  // Refs for dropdown containers (keyboard navigation)
  const classesMenuRef = useRef<HTMLDivElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const aboutUsMenuRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation handlers
  const handleClassesKeyDown = useDropdownKeyboardNav(classesMenuRef, closeAllDropdowns);
  const handleServicesKeyDown = useDropdownKeyboardNav(servicesMenuRef, closeAllDropdowns);
  const handleAboutUsKeyDown = useDropdownKeyboardNav(aboutUsMenuRef, closeAllDropdowns);

  // Map textKey to DropdownKey for submenus
  const getSubDropdownKey = (textKey: string): DropdownKey => {
    switch (textKey) {
      case 'navDanza':
        return 'danza';
      case 'navDanzasUrbanas':
        return 'urban';
      case 'navSalsaBachata':
        return 'salsa';
      case 'navPrepFisica':
        return 'prepfisica';
      default:
        return 'classes';
    }
  };

  // Map textKey to CSS class for click-outside detection
  const getDropdownClass = (textKey: string): string => {
    switch (textKey) {
      case 'navDanza':
        return 'danza-dropdown';
      case 'navDanzasUrbanas':
        return 'urban-dropdown';
      case 'navSalsaBachata':
        return 'salsa-dropdown';
      case 'navPrepFisica':
        return 'prepfisica-dropdown';
      default:
        return '';
    }
  };

  return (
    <nav className="hidden md:block flex-1" aria-label="Main navigation">
      <ul className="flex items-center space-x-8 text-sm font-medium">
        {/* Home */}
        <li>
          <Link
            to={menuStructure.home.path}
            className={`transition-colors duration-300 ${
              location.pathname === menuStructure.home.path
                ? 'text-white'
                : 'text-neutral/75 hover:text-white'
            }`}
            aria-current={location.pathname === menuStructure.home.path ? 'page' : undefined}
          >
            {t(menuStructure.home.textKey)}
          </Link>
        </li>

        {/* Classes Dropdown */}
        <li className="relative classes-dropdown">
          <div className="flex items-center">
            <Link
              to={menuStructure.classes.path}
              className={`transition-colors duration-300 ${
                location.pathname.startsWith(`/${locale}/clases`)
                  ? 'text-white'
                  : 'text-neutral/75 hover:text-white'
              }`}
            >
              {t(menuStructure.classes.textKey)}
            </Link>
            <button
              onClick={() => toggleDropdown('classes')}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleDropdown('classes');
                } else if (e.key === 'Escape') {
                  closeAllDropdowns();
                }
              }}
              className="ml-1 text-neutral/75 hover:text-white transition-colors"
              aria-expanded={isDropdownOpen('classes')}
              aria-controls="classes-menu"
              aria-label={t('navClasses')}
            >
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen('classes') ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen('classes') && (
            <div
              ref={classesMenuRef}
              id="classes-menu"
              role="menu"
              onKeyDown={handleClassesKeyDown}
              className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-primary-accent/10 overflow-hidden min-w-[280px] animate-fadeIn z-50"
            >
              {menuStructure.classes.submenu?.map(item => {
                const subDropdownKey = getSubDropdownKey(item.textKey);
                const dropdownClass = getDropdownClass(item.textKey);
                const hasSubmenu = item.submenu && item.submenu.length > 0;

                return (
                  <div key={item.path}>
                    {hasSubmenu ? (
                      // Item with sub-submenu (Danza, Urban, Salsa)
                      <div className={`relative ${dropdownClass}`}>
                        <div className="flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200">
                          <Link to={item.path} className="flex-1" onClick={closeAllDropdowns}>
                            {t(item.textKey)}
                          </Link>
                          <button
                            onClick={() => toggleDropdown(subDropdownKey)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleDropdown(subDropdownKey);
                              } else if (e.key === 'Escape') {
                                closeAllDropdowns();
                              }
                            }}
                            className="ml-2"
                            aria-expanded={isDropdownOpen(subDropdownKey)}
                            aria-label={t(item.textKey)}
                          >
                            <ChevronDownIcon
                              className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen(subDropdownKey) ? 'rotate-180' : ''}`}
                            />
                          </button>
                        </div>
                        {isDropdownOpen(subDropdownKey) && (
                          <div className="bg-black/80 border-t border-white/10">
                            {item.submenu?.map(subitem =>
                              subitem.submenu ? (
                                // Item with sub-submenu (e.g., Heels with Femmology & Sexy Style)
                                <div key={subitem.path} className="relative heels-dropdown">
                                  <div className="flex items-center justify-between px-8 py-3 text-sm font-medium text-neutral/80 hover:bg-white/10 hover:text-white transition-all duration-200">
                                    <Link
                                      to={subitem.path}
                                      className="flex-1"
                                      onClick={closeAllDropdowns}
                                    >
                                      {t(subitem.textKey)}
                                    </Link>
                                    <button
                                      onClick={() => toggleDropdown('heels')}
                                      className="ml-2"
                                      aria-expanded={isDropdownOpen('heels')}
                                    >
                                      <ChevronDownIcon
                                        className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen('heels') ? 'rotate-180' : ''}`}
                                      />
                                    </button>
                                  </div>
                                  {isDropdownOpen('heels') && (
                                    <div className="bg-black/90 border-t border-white/5">
                                      {subitem.submenu.map(subsubitem => (
                                        <Link
                                          key={subsubitem.path}
                                          to={subsubitem.path}
                                          onClick={closeAllDropdowns}
                                          className="block px-12 py-2 text-sm font-medium text-neutral/70 hover:bg-white/10 hover:text-white transition-all duration-200"
                                        >
                                          {t(subsubitem.textKey)}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                // Regular subitem
                                <Link
                                  key={subitem.path}
                                  to={subitem.path}
                                  onClick={closeAllDropdowns}
                                  className="block px-8 py-3 text-sm font-medium text-neutral/80 hover:bg-white/10 hover:text-white transition-all duration-200"
                                >
                                  {t(subitem.textKey)}
                                </Link>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular submenu item (Prep Física)
                      <Link
                        to={item.path}
                        onClick={closeAllDropdowns}
                        className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
                      >
                        {t(item.textKey)}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </li>

        {/* Services Dropdown */}
        <li className="relative services-dropdown">
          <button
            onClick={() => toggleDropdown('services')}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown('services');
              } else if (e.key === 'Escape') {
                closeAllDropdowns();
              }
            }}
            className={`flex items-center transition-colors duration-300 ${
              location.pathname.includes('/alquiler-salas') ||
              location.pathname.includes('/merchandising') ||
              location.pathname.includes('/estudio-grabacion') ||
              location.pathname.includes('/regala-baile') ||
              location.pathname.includes('/clases-particulares') ||
              location.pathname.includes('/instalaciones')
                ? 'text-white'
                : 'text-neutral/75 hover:text-white'
            }`}
            aria-expanded={isDropdownOpen('services')}
            aria-label={t('navServices')}
          >
            {t('navServices')}
            <ChevronDownIcon
              className={`w-4 h-4 ml-1 transition-transform duration-300 ${isDropdownOpen('services') ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen('services') && (
            <div
              ref={servicesMenuRef}
              role="menu"
              onKeyDown={handleServicesKeyDown}
              className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-primary-accent/10 overflow-hidden min-w-[240px] animate-fadeIn z-50"
            >
              <Link
                to={`/${locale}/alquiler-salas-baile-barcelona`}
                onClick={closeAllDropdowns}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('headerRoomRental')}
              </Link>
              <Link
                to={`/${locale}/estudio-grabacion-barcelona`}
                onClick={closeAllDropdowns}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('headerRecordingStudio')}
              </Link>
              <Link
                to={`/${locale}/regala-baile`}
                onClick={closeAllDropdowns}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('headerGiftDance')}
              </Link>
              <Link
                to={`/${locale}/clases-particulares-baile`}
                onClick={closeAllDropdowns}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('navClasesParticulares')}
              </Link>
              <Link
                to={`/${locale}/merchandising`}
                onClick={closeAllDropdowns}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('headerMerchandising')}
              </Link>
              <Link
                to={`/${locale}/instalaciones-escuela-baile-barcelona`}
                onClick={closeAllDropdowns}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('navFacilities')}
              </Link>
            </div>
          )}
        </li>

        {/* About Us Dropdown */}
        <li className="relative aboutus-dropdown">
          <button
            onClick={() => toggleDropdown('aboutUs')}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown('aboutUs');
              } else if (e.key === 'Escape') {
                closeAllDropdowns();
              }
            }}
            className={`flex items-center transition-colors duration-300 ${
              location.pathname.includes('/yunaisy-farray') ||
              location.pathname.includes('/sobre-nosotros') ||
              location.pathname.includes('/profesores-baile')
                ? 'text-white'
                : 'text-neutral/75 hover:text-white'
            }`}
            aria-expanded={isDropdownOpen('aboutUs')}
            aria-label={t('navAboutUs')}
          >
            {t('navAboutUs')}
            <ChevronDownIcon
              className={`w-4 h-4 ml-1 transition-transform duration-300 ${isDropdownOpen('aboutUs') ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen('aboutUs') && (
            <div
              ref={aboutUsMenuRef}
              role="menu"
              onKeyDown={handleAboutUsKeyDown}
              className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-primary-accent/10 overflow-hidden min-w-[240px] animate-fadeIn z-50"
            >
              <Link
                to={`/${locale}/sobre-nosotros`}
                onClick={closeAllDropdowns}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('headerAbout')}
              </Link>
              <Link
                to={`/${locale}/yunaisy-farray`}
                onClick={closeAllDropdowns}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('navYunaisy')}
              </Link>
              <Link
                to={`/${locale}/profesores-baile-barcelona`}
                onClick={closeAllDropdowns}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('navProfesores')}
              </Link>
            </div>
          )}
        </li>

        {/* Blog Link */}
        <li>
          <Link
            to={`/${locale}/blog`}
            className={`transition-colors duration-300 ${
              location.pathname.includes('/blog')
                ? 'text-white'
                : 'text-neutral/75 hover:text-white'
            }`}
          >
            {t('navBlog')}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default DesktopNavigation;
