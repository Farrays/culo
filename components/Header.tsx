import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { debounce } from '../utils/debounce';
import { MenuIcon, XMarkIcon as CloseIcon, ChevronDownIcon } from '../lib/icons';
import MobileNavigation from './header/MobileNavigation';
import LanguageSelector from './header/LanguageSelector';
import LeadCaptureModal from './shared/LeadCaptureModal';
import type { Locale } from '../types';
import { SUPPORTED_LOCALES } from '../types';

export type DropdownKey =
  | 'lang'
  | 'classes'
  | 'danza'
  | 'urban'
  | 'heels'
  | 'salsa'
  | 'prepfisica'
  | 'services'
  | 'aboutUs';

const DROPDOWN_CLASS_MAP: Record<DropdownKey, string> = {
  lang: '.language-dropdown',
  classes: '.classes-dropdown',
  danza: '.danza-dropdown',
  urban: '.urban-dropdown',
  heels: '.heels-dropdown',
  salsa: '.salsa-dropdown',
  prepfisica: '.prepfisica-dropdown',
  services: '.services-dropdown',
  aboutUs: '.aboutus-dropdown',
};

// Define parent-child relationships for nested dropdowns
const NESTED_DROPDOWNS: Record<DropdownKey, DropdownKey[]> = {
  classes: ['danza', 'urban', 'salsa', 'heels', 'prepfisica'],
  danza: [],
  urban: ['heels'],
  heels: [],
  salsa: [],
  prepfisica: [],
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
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const toggleDropdown = useCallback((key: DropdownKey) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        // Close this dropdown and all its children
        newSet.delete(key);
        NESTED_DROPDOWNS[key].forEach(child => newSet.delete(child));
      } else {
        // Close sibling dropdowns (same level) but keep parent open
        const isSubDropdown = ['danza', 'urban', 'salsa', 'heels', 'prepfisica'].includes(key);
        if (!isSubDropdown) {
          // Top-level dropdown: close all others
          newSet.clear();
        } else if (key === 'heels') {
          // heels is child of urban, keep urban and classes open
        } else {
          // Sub-dropdown: close siblings but keep 'classes' open
          ['danza', 'urban', 'salsa', 'prepfisica'].forEach(sibling => {
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
            { path: `/${locale}/clases/bachata-barcelona`, textKey: 'navBachataSensual' },
            {
              path: `/${locale}/clases/bachata-lady-style-barcelona`,
              textKey: 'navBachataLadyStyle',
            },
            { path: `/${locale}/clases/timba-barcelona`, textKey: 'navTimba' },
            { path: `/${locale}/clases/folklore-cubano`, textKey: 'navFolkloreCubano' },
          ],
        },
        {
          path: `/${locale}/clases/entrenamiento-bailarines-barcelona`,
          textKey: 'navPrepFisica',
          submenu: [
            {
              path: `/${locale}/clases/acondicionamiento-fisico-bailarines`,
              textKey: 'navBodyConditioning',
            },
            { path: `/${locale}/clases/cuerpo-fit`, textKey: 'navCuerpoFit' },
            { path: `/${locale}/clases/ejercicios-gluteos-barcelona`, textKey: 'navBumBum' },
            { path: `/${locale}/clases/stretching-barcelona`, textKey: 'navStretching' },
          ],
        },
        { path: `/${locale}/clases/baile-mananas`, textKey: 'navBaileMananas' },
      ],
    },
    services: {
      path: `/${locale}/servicios-baile`,
      textKey: 'navServices',
      submenu: [
        { path: `/${locale}/clases-particulares-baile`, textKey: 'navClasesParticulares' },
        { path: `/${locale}/alquiler-salas-baile-barcelona`, textKey: 'navAlquilerSalas' },
        { path: `/${locale}/estudio-grabacion-barcelona`, textKey: 'navEstudioGrabacion' },
        { path: `/${locale}/regala-baile`, textKey: 'navRegalaBaile' },
      ],
    },
    aboutUs: {
      path: `/${locale}/sobre-nosotros`,
      textKey: 'navAboutUs',
      submenu: [
        { path: `/${locale}/yunaisy-farray`, textKey: 'navYunaisy' },
        { path: `/${locale}/profesores-baile-barcelona`, textKey: 'navProfesores' },
        { path: `/${locale}/instalaciones-escuela-baile-barcelona`, textKey: 'navInstalaciones' },
        { path: `/${locale}/preguntas-frecuentes`, textKey: 'navFAQ' },
      ],
    },
    blog: { path: `/${locale}/blog`, textKey: 'navBlog' },
  };

  return (
    <>
      {/* Skip to Content Link - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-primary-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        {t('skipToMainContent')}
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-md shadow-lg shadow-primary-accent/10'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 md:py-4">
          {/* Top Row: Logo + Nav + CTA */}
          <div className="flex items-center justify-between">
            {/* Logo - Left aligned, bigger */}
            <Link to={`/${locale}`} aria-label="FIDC Home" className="flex-shrink-0">
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
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 transition-transform duration-300 hover:scale-105"
                />
              </picture>
            </Link>

            {/* Desktop Navigation - Simplified order */}
            <nav
              className="hidden lg:flex items-center space-x-6 text-sm font-medium"
              aria-label="Main navigation"
            >
              {/* Inicio */}
              <Link
                to={`/${locale}`}
                className={`transition-colors duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent ${
                  location.pathname === `/${locale}` || location.pathname === `/${locale}/`
                    ? 'text-white'
                    : 'text-neutral/75 hover:text-white'
                }`}
              >
                {t('navHome')}
              </Link>

              {/* Quiénes Somos - Dropdown */}
              <div className="relative aboutus-dropdown">
                <button
                  onClick={() => toggleDropdown('aboutUs')}
                  className={`flex items-center transition-colors duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent ${
                    location.pathname.includes('/sobre-nosotros') ||
                    location.pathname.includes('/yunaisy-farray') ||
                    location.pathname.includes('/profesores-baile')
                      ? 'text-white'
                      : 'text-neutral/75 hover:text-white'
                  }`}
                  aria-expanded={isDropdownOpen('aboutUs')}
                >
                  {t('navAboutUs')}
                  <ChevronDownIcon
                    className={`w-4 h-4 ml-1 transition-transform duration-300 ${isDropdownOpen('aboutUs') ? 'rotate-180' : ''}`}
                  />
                </button>
                {isDropdownOpen('aboutUs') && (
                  <div className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl min-w-[200px] py-2 z-50">
                    <Link
                      to={`/${locale}/sobre-nosotros`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('headerAbout')}
                    </Link>
                    <Link
                      to={`/${locale}/yunaisy-farray`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('navYunaisy')}
                    </Link>
                    <Link
                      to={`/${locale}/profesores-baile-barcelona`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('navProfesores')}
                    </Link>
                    <Link
                      to={`/${locale}/instalaciones-escuela-baile-barcelona`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('navFacilities')}
                    </Link>
                    <Link
                      to={`/${locale}/preguntas-frecuentes`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('navFAQ')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Clases de Baile - Dropdown */}
              <div className="relative classes-dropdown">
                <button
                  onClick={() => toggleDropdown('classes')}
                  className={`flex items-center transition-colors duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent ${
                    location.pathname.includes('/clases')
                      ? 'text-white'
                      : 'text-neutral/75 hover:text-white'
                  }`}
                  aria-expanded={isDropdownOpen('classes')}
                >
                  {t('navClasses')}
                  <ChevronDownIcon
                    className={`w-4 h-4 ml-1 transition-transform duration-300 ${isDropdownOpen('classes') ? 'rotate-180' : ''}`}
                  />
                </button>
                {isDropdownOpen('classes') && (
                  <div className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl min-w-[220px] py-2 z-50">
                    <Link
                      to={`/${locale}/clases/baile-barcelona`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white font-semibold"
                    >
                      {t('navAllClasses')}
                    </Link>
                    <div className="border-t border-white/10 my-1"></div>
                    <Link
                      to={`/${locale}/clases/danza-barcelona`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('navDanza')}
                    </Link>
                    <Link
                      to={`/${locale}/clases/danzas-urbanas-barcelona`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('navDanzasUrbanas')}
                    </Link>
                    <Link
                      to={`/${locale}/clases/salsa-bachata-barcelona`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('navSalsaBachata')}
                    </Link>
                    <Link
                      to={`/${locale}/clases/entrenamiento-bailarines-barcelona`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('navPrepFisica')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Horarios */}
              <Link
                to={`/${locale}/horarios-clases-baile-barcelona`}
                className={`transition-colors duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent ${
                  location.pathname.includes('/horarios')
                    ? 'text-white'
                    : 'text-neutral/75 hover:text-white'
                }`}
              >
                {t('navSchedule')}
              </Link>

              {/* Cuotas (Precios) */}
              <Link
                to={`/${locale}/precios-clases-baile-barcelona`}
                className={`transition-colors duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent ${
                  location.pathname.includes('/precios')
                    ? 'text-white'
                    : 'text-neutral/75 hover:text-white'
                }`}
              >
                {t('navPricing')}
              </Link>

              {/* Servicios - Dropdown */}
              <div className="relative services-dropdown">
                <button
                  onClick={() => toggleDropdown('services')}
                  className={`flex items-center transition-colors duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent ${
                    location.pathname.includes('/alquiler-salas') ||
                    location.pathname.includes('/estudio-grabacion') ||
                    location.pathname.includes('/regala-baile') ||
                    location.pathname.includes('/clases-particulares')
                      ? 'text-white'
                      : 'text-neutral/75 hover:text-white'
                  }`}
                  aria-expanded={isDropdownOpen('services')}
                >
                  {t('navServices')}
                  <ChevronDownIcon
                    className={`w-4 h-4 ml-1 transition-transform duration-300 ${isDropdownOpen('services') ? 'rotate-180' : ''}`}
                  />
                </button>
                {isDropdownOpen('services') && (
                  <div className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl min-w-[200px] py-2 z-50">
                    <Link
                      to={`/${locale}/clases-particulares-baile`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('navClasesParticulares')}
                    </Link>
                    <Link
                      to={`/${locale}/alquiler-salas-baile-barcelona`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('headerRoomRental')}
                    </Link>
                    <Link
                      to={`/${locale}/estudio-grabacion-barcelona`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('headerRecordingStudio')}
                    </Link>
                    <Link
                      to={`/${locale}/regala-baile`}
                      onClick={closeAllDropdowns}
                      className="block px-4 py-2 text-sm text-neutral/90 hover:bg-white/10 hover:text-white"
                    >
                      {t('headerGiftDance')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Blog */}
              <Link
                to={`/${locale}/blog`}
                className={`transition-colors duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent ${
                  location.pathname.includes('/blog')
                    ? 'text-white'
                    : 'text-neutral/75 hover:text-white'
                }`}
              >
                {t('navBlog')}
              </Link>

              {/* Contacto */}
              <Link
                to={`/${locale}/contacto`}
                className={`transition-colors duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent ${
                  location.pathname.includes('/contacto')
                    ? 'text-white'
                    : 'text-neutral/75 hover:text-white'
                }`}
              >
                {t('headerContact')}
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <button
                onClick={() => setIsLeadModalOpen(true)}
                className="bg-primary-accent text-white font-bold text-base py-2.5 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {t('enrollNow')}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden ml-auto">
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

          {/* Language Selector - Centered below nav (desktop only) */}
          <div className="hidden lg:flex justify-center mt-2">
            <LanguageSelector
              locale={locale}
              isOpen={isDropdownOpen('lang')}
              onToggle={() => toggleDropdown('lang')}
              handleLanguageChange={handleLanguageChange}
              languageNames={languageNames}
            />
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
        onOpenLeadModal={() => setIsLeadModalOpen(true)}
        languageNames={languageNames}
      />

      {/* Lead Capture Modal */}
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </>
  );
};

export default Header;
