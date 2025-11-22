import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { ChevronDownIcon } from '../../lib/icons';
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

interface DesktopNavigationProps {
  menuStructure: MenuStructure;
  locale: Locale;
  isClassesDropdownOpen: boolean;
  setIsClassesDropdownOpen: (open: boolean) => void;
  isUrbanDropdownOpen: boolean;
  setIsUrbanDropdownOpen: (open: boolean) => void;
  isServicesDropdownOpen: boolean;
  setIsServicesDropdownOpen: (open: boolean) => void;
  isAboutUsDropdownOpen: boolean;
  setIsAboutUsDropdownOpen: (open: boolean) => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  menuStructure,
  locale,
  isClassesDropdownOpen,
  setIsClassesDropdownOpen,
  isUrbanDropdownOpen,
  setIsUrbanDropdownOpen,
  isServicesDropdownOpen,
  setIsServicesDropdownOpen,
  isAboutUsDropdownOpen,
  setIsAboutUsDropdownOpen,
}) => {
  const { t } = useI18n();
  const location = useLocation();

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
              onClick={() => setIsClassesDropdownOpen(!isClassesDropdownOpen)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsClassesDropdownOpen(!isClassesDropdownOpen);
                } else if (e.key === 'Escape') {
                  setIsClassesDropdownOpen(false);
                }
              }}
              className="ml-1 text-neutral/75 hover:text-white transition-colors"
              aria-expanded={isClassesDropdownOpen}
              aria-controls="classes-menu"
              aria-label={t('navClasses')}
            >
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-300 ${isClassesDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Dropdown Menu */}
          {isClassesDropdownOpen && (
            <div 
              id="classes-menu"
              role="menu"
              className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-primary-accent/10 overflow-hidden min-w-[280px] animate-fadeIn z-50"
            >
              {menuStructure.classes.submenu?.map(item => (
                <div key={item.path}>
                  {item.submenu ? (
                    // Urban Dances with sub-submenu
                    <div className="relative urban-dropdown">
                      <div className="flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200">
                        <Link
                          to={item.path}
                          className="flex-1"
                          onClick={() => setIsClassesDropdownOpen(false)}
                        >
                          {t(item.textKey)}
                        </Link>
                        <button
                          onClick={() => setIsUrbanDropdownOpen(!isUrbanDropdownOpen)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setIsUrbanDropdownOpen(!isUrbanDropdownOpen);
                            } else if (e.key === 'Escape') {
                              setIsUrbanDropdownOpen(false);
                              setIsClassesDropdownOpen(false);
                            }
                          }}
                          className="ml-2"
                          aria-expanded={isUrbanDropdownOpen}
                          aria-label={t('navDanzasUrbanas')}
                        >
                          <ChevronDownIcon
                            className={`w-4 h-4 transition-transform duration-300 ${isUrbanDropdownOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                      {isUrbanDropdownOpen && (
                        <div className="bg-black/80 border-t border-white/10">
                          {item.submenu.map(subitem => (
                            <Link
                              key={subitem.path}
                              to={subitem.path}
                              onClick={() => {
                                setIsClassesDropdownOpen(false);
                                setIsUrbanDropdownOpen(false);
                              }}
                              className="block px-8 py-3 text-sm font-medium text-neutral/80 hover:bg-white/10 hover:text-white transition-all duration-200"
                            >
                              {t(subitem.textKey)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular submenu item
                    <Link
                      to={item.path}
                      onClick={() => setIsClassesDropdownOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
                    >
                      {t(item.textKey)}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </li>

        {/* Services Dropdown */}
        <li className="relative services-dropdown">
          <button
            onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsServicesDropdownOpen(!isServicesDropdownOpen);
              } else if (e.key === 'Escape') {
                setIsServicesDropdownOpen(false);
              }
            }}
            className={`flex items-center transition-colors duration-300 ${
              location.pathname.includes('/alquiler-salas') ||
              location.pathname.includes('/merchandising') ||
              location.pathname.includes('/estudio-grabacion') ||
              location.pathname.includes('/regala-baile') ||
              location.pathname.includes('/clases-particulares')
                ? 'text-white'
                : 'text-neutral/75 hover:text-white'
            }`}
            aria-expanded={isServicesDropdownOpen}
            aria-label={t('navServices')}
          >
            {t('navServices')}
            <ChevronDownIcon
              className={`w-4 h-4 ml-1 transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isServicesDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-primary-accent/10 overflow-hidden min-w-[240px] animate-fadeIn z-50">
              <Link
                to={`/${locale}/alquiler-salas-baile-barcelona`}
                onClick={() => setIsServicesDropdownOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('headerRoomRental')}
              </Link>
              <Link
                to={`/${locale}/estudio-grabacion-barcelona`}
                onClick={() => setIsServicesDropdownOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('headerRecordingStudio')}
              </Link>
              <Link
                to={`/${locale}/regala-baile`}
                onClick={() => setIsServicesDropdownOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('headerGiftDance')}
              </Link>
              <Link
                to={`/${locale}/clases-particulares-baile`}
                onClick={() => setIsServicesDropdownOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('navClasesParticulares')}
              </Link>
              <Link
                to={`/${locale}/merchandising`}
                onClick={() => setIsServicesDropdownOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('headerMerchandising')}
              </Link>
            </div>
          )}
        </li>

        {/* About Us Dropdown */}
        <li className="relative aboutus-dropdown">
          <button
            onClick={() => setIsAboutUsDropdownOpen(!isAboutUsDropdownOpen)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsAboutUsDropdownOpen(!isAboutUsDropdownOpen);
              } else if (e.key === 'Escape') {
                setIsAboutUsDropdownOpen(false);
              }
            }}
            className={`flex items-center transition-colors duration-300 ${
              location.pathname.includes('/yunaisy-farray') ||
              location.pathname.includes('/sobre-nosotros')
                ? 'text-white'
                : 'text-neutral/75 hover:text-white'
            }`}
            aria-expanded={isAboutUsDropdownOpen}
            aria-label={t('navAboutUs')}
          >
            {t('navAboutUs')}
            <ChevronDownIcon
              className={`w-4 h-4 ml-1 transition-transform duration-300 ${isAboutUsDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isAboutUsDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-primary-accent/10 overflow-hidden min-w-[240px] animate-fadeIn z-50">
              <Link
                to={`/${locale}/yunaisy-farray`}
                onClick={() => setIsAboutUsDropdownOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('sitemapYunaisy')}
              </Link>
              <Link
                to={`/${locale}/sobre-nosotros`}
                onClick={() => setIsAboutUsDropdownOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-neutral/90 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t('headerAbout')}
              </Link>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default DesktopNavigation;
