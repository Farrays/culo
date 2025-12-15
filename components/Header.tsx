import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { debounce } from '../utils/debounce';
import { MenuIcon, XMarkIcon as CloseIcon } from '../lib/icons';
import DesktopNavigation from './header/DesktopNavigation';
import MobileNavigation from './header/MobileNavigation';
import LanguageSelector from './header/LanguageSelector';
import type { Locale } from '../types';
import { SUPPORTED_LOCALES } from '../types';

export type DropdownKey =
  | 'lang'
  | 'classes'
  | 'danza'
  | 'urban'
  | 'heels'
  | 'salsa'
  | 'services'
  | 'aboutUs';

const DROPDOWN_CLASS_MAP: Record<DropdownKey, string> = {
  lang: '.language-dropdown',
  classes: '.classes-dropdown',
  danza: '.danza-dropdown',
  urban: '.urban-dropdown',
  heels: '.heels-dropdown',
  salsa: '.salsa-dropdown',
  services: '.services-dropdown',
  aboutUs: '.aboutus-dropdown',
};

// Define parent-child relationships for nested dropdowns
const NESTED_DROPDOWNS: Record<DropdownKey, DropdownKey[]> = {
  classes: ['danza', 'urban', 'salsa', 'heels'],
  danza: [],
  urban: ['heels'],
  heels: [],
  salsa: [],
  services: [],
  aboutUs: [],
  lang: [],
};

const Header: React.FC = () => {
  const { t, locale } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<DropdownKey>>(new Set());

  const toggleDropdown = useCallback((key: DropdownKey) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        // Close this dropdown and all its children
        newSet.delete(key);
        NESTED_DROPDOWNS[key].forEach(child => newSet.delete(child));
      } else {
        // Close sibling dropdowns (same level) but keep parent open
        const isSubDropdown = ['danza', 'urban', 'salsa', 'heels'].includes(key);
        if (!isSubDropdown) {
          // Top-level dropdown: close all others
          newSet.clear();
        } else if (key === 'heels') {
          // heels is child of urban, keep urban and classes open
        } else {
          // Sub-dropdown: close siblings but keep 'classes' open
          ['danza', 'urban', 'salsa'].forEach(sibling => {
            if (sibling !== key) {
              newSet.delete(sibling as DropdownKey);
              // Also close heels if closing urban
              if (sibling === 'urban') newSet.delete('heels');
            }
          });
        }
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  const closeDropdown = useCallback((key: DropdownKey) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setOpenDropdowns(new Set());
  }, []);

  const isDropdownOpen = useCallback((key: DropdownKey) => openDropdowns.has(key), [openDropdowns]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const debouncedScroll = debounce(handleScroll, 100);

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (openDropdowns.size > 0) {
        // Check if click is inside any open dropdown
        let isInsideAnyDropdown = false;
        openDropdowns.forEach(key => {
          const dropdownClass = DROPDOWN_CLASS_MAP[key];
          if (target.closest(dropdownClass)) {
            isInsideAnyDropdown = true;
          }
        });

        if (!isInsideAnyDropdown) {
          setOpenDropdowns(new Set());
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdowns]);

  const getCurrentPath = (): string => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (
      pathParts.length > 0 &&
      pathParts[0] &&
      (SUPPORTED_LOCALES as readonly string[]).includes(pathParts[0])
    ) {
      pathParts.shift();
    }
    const path = pathParts.length > 0 ? `/${pathParts.join('/')}` : '/';
    const query = location.search;
    const hash = location.hash;
    return path + query + hash;
  };

  const handleLanguageChange = (lang: Locale) => {
    const currentPath = getCurrentPath();
    const newPath = `/${lang}${currentPath === '/' ? '' : currentPath}`;
    navigate(newPath);
    closeDropdown('lang');
  };

  const languageNames: Record<Locale, string> = {
    es: 'Español',
    ca: 'Català',
    en: 'English',
    fr: 'Français',
  };

  const handleEnrollClick = () => {
    if (location.pathname !== `/${locale}`) {
      setIsMenuOpen(false);
    }
  };

  const menuStructure = {
    home: { path: `/${locale}`, textKey: 'navHome' },
    classes: {
      path: `/${locale}/clases/baile-barcelona`,
      textKey: 'navClasses',
      submenu: [
        {
          path: `/${locale}/clases/danza-barcelona`,
          textKey: 'navDanza',
          submenu: [
            {
              path: `/${locale}/clases/afro-contemporaneo-barcelona`,
              textKey: 'navAfroContemporaneo',
            },
            { path: `/${locale}/clases/afro-jazz`, textKey: 'navAfroJazz' },
            { path: `/${locale}/clases/ballet-barcelona`, textKey: 'navBallet' },
            { path: `/${locale}/clases/contemporaneo-barcelona`, textKey: 'navContemporaneo' },
            { path: `/${locale}/clases/modern-jazz-barcelona`, textKey: 'navModernJazz' },
          ],
        },
        {
          path: `/${locale}/clases/danzas-urbanas-barcelona`,
          textKey: 'navDanzasUrbanas',
          submenu: [
            // Ordenado alfabéticamente - Heels tiene submenú con Femmology y Sexy Style
            { path: `/${locale}/clases/afrobeats-barcelona`, textKey: 'navAfrobeat' },
            { path: `/${locale}/clases/dancehall-barcelona`, textKey: 'navDancehall' },
            {
              path: `/${locale}/clases/heels-barcelona`,
              textKey: 'navHeels',
              submenu: [
                {
                  path: `/${locale}/clases/femmology`,
                  textKey: 'navFemmology',
                },
                { path: `/${locale}/clases/sexy-style-barcelona`, textKey: 'navSexyStyle' },
              ],
            },
            { path: `/${locale}/clases/hip-hop-barcelona`, textKey: 'navHipHop' },
            {
              path: `/${locale}/clases/hip-hop-reggaeton-barcelona`,
              textKey: 'navHipHopReggaeton',
            },
            { path: `/${locale}/clases/reggaeton-cubano-barcelona`, textKey: 'navReggaetonCubano' },
            { path: `/${locale}/clases/sexy-reggaeton-barcelona`, textKey: 'navSexyReggaeton' },
            { path: `/${locale}/clases/twerk-barcelona`, textKey: 'navTwerk' },
          ],
        },
        {
          path: `/${locale}/clases/salsa-bachata-barcelona`,
          textKey: 'navSalsaBachata',
          submenu: [
            { path: `/${locale}/clases/salsa-cubana-barcelona`, textKey: 'navSalsaCubana' },
            { path: `/${locale}/clases/salsa-lady-style-barcelona`, textKey: 'navSalsaLadyStyle' },
            { path: `/${locale}/clases/folklore-cubano`, textKey: 'navFolkloreCubano' },
          ],
        },
        { path: `/${locale}/clases/entrenamiento-bailarines-barcelona`, textKey: 'navPrepFisica' },
      ],
    },
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-md shadow-lg shadow-primary-accent/10'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 flex items-center relative">
          {/* Desktop Navigation */}
          <DesktopNavigation
            menuStructure={menuStructure}
            locale={locale}
            isDropdownOpen={isDropdownOpen}
            toggleDropdown={toggleDropdown}
            closeAllDropdowns={closeAllDropdowns}
          />

          {/* Centered Logo */}
          <Link
            to={`/${locale}`}
            aria-label="FIDC Home"
            className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-auto"
          >
            <picture>
              <source
                type="image/webp"
                srcSet="/images/logo/img/logo-fidc_256.webp 1x, /images/logo/img/logo-fidc_512.webp 2x"
              />
              <img
                src="/images/logo/img/logo-fidc_256.png"
                srcSet="/images/logo/img/logo-fidc_256.png 1x, /images/logo/img/logo-fidc_512.png 2x"
                alt="Farray's International Dance Center"
                width="256"
                height="256"
                className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 transition-transform duration-300 hover:scale-105"
              />
            </picture>
          </Link>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
            {/* Contact Link */}
            <Link
              to={`/${locale}/contacto`}
              className="transition-colors duration-300 text-sm font-medium text-neutral/75 hover:text-white"
            >
              {t('headerContact')}
            </Link>

            {/* FAQ Link */}
            <Link
              to={`/${locale}/preguntas-frecuentes`}
              className="transition-colors duration-300 text-sm font-medium text-neutral/75 hover:text-white"
            >
              {t('headerFAQ')}
            </Link>

            {/* Language Selector */}
            <LanguageSelector
              locale={locale}
              isOpen={isDropdownOpen('lang')}
              onToggle={() => toggleDropdown('lang')}
              handleLanguageChange={handleLanguageChange}
              languageNames={languageNames}
            />
          </div>

          {/* Enroll Button - Separated to be on far right */}
          <div className="hidden md:block ml-4">
            <Link
              to={`/${locale}#enroll`}
              onClick={handleEnrollClick}
              className="bg-primary-accent text-white font-bold text-lg py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow whitespace-nowrap"
            >
              {t('enrollNow')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="z-50 relative"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <CloseIcon className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNavigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        menuStructure={menuStructure}
        locale={locale}
        handleLanguageChange={handleLanguageChange}
        handleEnrollClick={handleEnrollClick}
        languageNames={languageNames}
      />
    </>
  );
};

export default Header;
