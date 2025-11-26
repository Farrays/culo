import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { debounce } from '../utils/debounce';
import { MenuIcon, XMarkIcon as CloseIcon } from '../lib/icons';
import DesktopNavigation from './header/DesktopNavigation';
import MobileNavigation from './header/MobileNavigation';
import LanguageSelector from './header/LanguageSelector';
import type { Locale } from '../types';

const Header: React.FC = () => {
  const { t, locale } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isClassesDropdownOpen, setIsClassesDropdownOpen] = useState(false);
  const [isUrbanDropdownOpen, setIsUrbanDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isAboutUsDropdownOpen, setIsAboutUsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const debouncedScroll = debounce(handleScroll, 100);

    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-dropdown')) {
        setIsLangDropdownOpen(false);
      }
      if (!target.closest('.classes-dropdown')) {
        setIsClassesDropdownOpen(false);
      }
      if (!target.closest('.urban-dropdown')) {
        setIsUrbanDropdownOpen(false);
      }
      if (!target.closest('.services-dropdown')) {
        setIsServicesDropdownOpen(false);
      }
      if (!target.closest('.aboutus-dropdown')) {
        setIsAboutUsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentPath = (): string => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && pathParts[0] && ['es', 'en', 'ca', 'fr'].includes(pathParts[0])) {
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
    setIsLangDropdownOpen(false);
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
        { path: `/${locale}/clases/danza-barcelona`, textKey: 'navDanza' },
        {
          path: `/${locale}/clases/danzas-urbanas-barcelona`,
          textKey: 'navDanzasUrbanas',
          submenu: [
            { path: `/${locale}/clases/dancehall-barcelona`, textKey: 'navDancehall' },
            {
              path: `/${locale}/clases/hip-hop-reggaeton-barcelona`,
              textKey: 'navHipHopReggaeton',
            },
            { path: `/${locale}/clases/twerk-barcelona`, textKey: 'navTwerk' },
            { path: `/${locale}/clases/afrobeat-barcelona`, textKey: 'navAfrobeat' },
          ],
        },
        { path: `/${locale}/clases/salsa-bachata-barcelona`, textKey: 'navSalsaBachata' },
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
            isClassesDropdownOpen={isClassesDropdownOpen}
            setIsClassesDropdownOpen={setIsClassesDropdownOpen}
            isUrbanDropdownOpen={isUrbanDropdownOpen}
            setIsUrbanDropdownOpen={setIsUrbanDropdownOpen}
            isServicesDropdownOpen={isServicesDropdownOpen}
            setIsServicesDropdownOpen={setIsServicesDropdownOpen}
            isAboutUsDropdownOpen={isAboutUsDropdownOpen}
            setIsAboutUsDropdownOpen={setIsAboutUsDropdownOpen}
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
              isLangDropdownOpen={isLangDropdownOpen}
              setIsLangDropdownOpen={setIsLangDropdownOpen}
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
