import React, { useEffect, useRef, lazy, Suspense, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useParams,
  Navigate,
  useNavigate,
  useNavigationType,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider, useI18n } from './hooks/useI18n';
import type { Locale } from './types';
import { SUPPORTED_LOCALES } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import SEO from './components/SEO';
import Header from './components/Header';
import SkipLink from './components/SkipLink';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import NotFoundPage from './components/NotFoundPage';
import BackToTop from './components/BackToTop';

// Code splitting: Lazy load secondary pages to reduce initial bundle size
const DanceClassesPage = lazy(() => import('./components/DanceClassesPage'));
const DanzaBarcelonaPage = lazy(() => import('./components/DanzaBarcelonaPage'));
const DanzasUrbanasBarcelonaPage = lazy(() => import('./components/DanzasUrbanasBarcelonaPage'));
const PreparacionFisicaBailarinesPage = lazy(
  () => import('./components/PreparacionFisicaBailarinesPage')
);
const SalsaBachataPage = lazy(() => import('./components/SalsaBachataPage'));
const ClasesParticularesPage = lazy(() => import('./components/ClasesParticularesPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const MerchandisingPage = lazy(() => import('./components/MerchandisingPage'));
const FAQPage = lazy(() => import('./components/FAQPage'));
const YunaisyFarrayPage = lazy(() => import('./components/YunaisyFarrayPage'));
const MetodoFarrayPage = lazy(() => import('./components/MetodoFarrayPage'));
const RegalaBailePage = lazy(() => import('./components/RegalaBailePage'));
const AlquilerSalasPage = lazy(() => import('./components/AlquilerSalasPage'));
const ServiciosBailePage = lazy(() => import('./components/ServiciosBailePage'));
const EstudioGrabacionPage = lazy(() => import('./components/EstudioGrabacionPage'));
const FacilitiesPage = lazy(() => import('./components/FacilitiesPage'));
const HeelsBarcelonaPage = lazy(() => import('./components/HeelsBarcelonaPage'));
const SalsaLadyStylePage = lazy(() => import('./components/SalsaLadyStylePage'));
const SalsaLadyStylePageV2 = lazy(() => import('./components/SalsaLadyStylePageV2'));
const BachataLadyStylePage = lazy(() => import('./components/BachataLadyStylePage'));
const BachataPage = lazy(() => import('./components/BachataPage'));

// ===== DANCE CLASS PAGES USING UNIFIED TEMPLATE =====
// Migrated from ~900 lines each to ~15 lines using FullDanceClassTemplate
const DancehallPage = lazy(() => import('./components/DancehallPage'));
const TwerkPage = lazy(() => import('./components/TwerkPage'));
const AfrobeatPage = lazy(() => import('./components/AfrobeatPage'));
const HipHopReggaetonPage = lazy(() => import('./components/HipHopReggaetonPage'));
const SexyReggaetonPage = lazy(() => import('./components/SexyReggaetonPage'));
const ReggaetonCubanoPage = lazy(() => import('./components/ReggaetonCubanoPage'));
const FemmologyPage = lazy(() => import('./components/FemmologyPage'));
const SexyStylePage = lazy(() => import('./components/SexyStylePage'));
const ModernJazzPage = lazy(() => import('./components/ModernJazzPage'));
const BalletPage = lazy(() => import('./components/BalletPage'));
const ContemporaneoPage = lazy(() => import('./components/ContemporaneoPage'));
const AfroContemporaneoPage = lazy(() => import('./components/AfroContemporaneoPage'));
const AfroJazzPage = lazy(() => import('./components/AfroJazzPage'));
const HipHopPage = lazy(() => import('./components/HipHopPage'));
const SalsaCubanaPage = lazy(() => import('./components/SalsaCubanaPage'));
const FolkloreCubanoPage = lazy(() => import('./components/FolkloreCubanoPage'));
const TimbaPage = lazy(() => import('./components/TimbaPage'));
const StretchingPage = lazy(() => import('./components/StretchingPage'));
const BumBumPage = lazy(() => import('./components/BumBumPage'));
const CuerpoFitPage = lazy(() => import('./components/CuerpoFitPage'));
const BaileMananasPage = lazy(() => import('./components/BaileMananasPage'));
const FullBodyCardioPage = lazy(() => import('./components/FullBodyCardioPage'));
const TestClassPage = lazy(() => import('./components/TestClassPage'));
const AfroContemporaneoV2Page = lazy(() => import('./components/AfroContemporaneoV2Page'));
const CalendarPage = lazy(() => import('./components/CalendarPage'));
const HomePageV2 = lazy(() => import('./components/HomePageV2'));

// ===== LANDING PAGES =====
// NOTE: Import normal (not lazy) to avoid loading issues on landing pages
import GenericDanceLanding from './components/landing/GenericDanceLanding';
import { DANCEHALL_LANDING_CONFIG } from './constants/dancehall-landing-config';
import { TWERK_LANDING_CONFIG } from './constants/twerk-landing-config';
import { SEXY_REGGAETON_LANDING_CONFIG } from './constants/sexy-reggaeton-landing-config';
import { SEXY_STYLE_LANDING_CONFIG } from './constants/sexy-style-landing-config';
import { HIP_HOP_REGGAETON_LANDING_CONFIG } from './constants/hip-hop-reggaeton-landing-config';
import { CONTEMPORANEO_LANDING_CONFIG } from './constants/contemporaneo-landing-config';
import { FEMMOLOGY_LANDING_CONFIG } from './constants/femmology-landing-config';
import { BACHATA_LANDING_CONFIG } from './constants/bachata-landing-config';
import { HIP_HOP_LANDING_CONFIG } from './constants/hip-hop-landing-config';
import { AFROBEATS_LANDING_CONFIG } from './constants/afrobeats-landing-config';
import { AFRO_JAZZ_LANDING_CONFIG } from './constants/afro-jazz-landing-config';
import { SALSA_CUBANA_LANDING_CONFIG } from './constants/salsa-cubana-landing-config';
import { BALLET_LANDING_CONFIG } from './constants/ballet-landing-config';
import { AFRO_CONTEMPORANEO_LANDING_CONFIG } from './constants/afro-contemporaneo-landing-config';
const PreciosPage = lazy(() => import('./components/PreciosPage'));
const HorariosPreciosPage = lazy(() => import('./components/HorariosPreciosPage'));
const HorariosPageV2 = lazy(() => import('./components/HorariosPageV2'));

// ===== BLOG PAGES =====
const BlogListPage = lazy(() => import('./components/pages/BlogListPage'));
const BlogArticlePage = lazy(() => import('./components/pages/BlogArticlePage'));

// ===== INFO PAGES =====
const ProfesoresBaileBarcelonaPage = lazy(
  () => import('./components/pages/ProfesoresBaileBarcelonaPage')
);

// ===== LEGAL PAGES =====
const TermsConditionsPage = lazy(() => import('./components/TermsConditionsPage'));
const LegalNoticePage = lazy(() => import('./components/LegalNoticePage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const CookiePolicyPage = lazy(() => import('./components/CookiePolicyPage'));

// ===== COOKIE CONSENT =====
import CookieBanner from './components/shared/CookieBanner';

// ===== EXIT INTENT MODAL =====
import ExitIntentModal from './components/ExitIntentModal';

// Valid locales - use centralized constant from types.ts
const VALID_LOCALES = SUPPORTED_LOCALES;

const ScrollToTop: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPathRef = useRef<string>('');

  useEffect(() => {
    // Extract path without locale prefix (e.g., /es/clases -> /clases)
    const getPathWithoutLocale = (pathname: string): string => {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length > 0 && VALID_LOCALES.includes(parts[0] as Locale)) {
        return '/' + parts.slice(1).join('/');
      }
      return pathname;
    };

    const currentPath = getPathWithoutLocale(location.pathname);
    const prevPath = prevPathRef.current;

    // Only scroll to top on PUSH navigation (clicking links) to a different page
    // Don't scroll on POP (back/forward/refresh) - let browser restore scroll position
    // Don't scroll when only locale changes (same path)
    if (navigationType === 'PUSH' && prevPath && prevPath !== currentPath) {
      window.scrollTo(0, 0);
    }

    prevPathRef.current = currentPath;
  }, [location.pathname, navigationType]);

  return null;
};

// Component to sync URL locale with i18n context and validate
const LocaleSync: React.FC = () => {
  const { locale: urlLocale } = useParams<{ locale: Locale }>();
  const { setLocale, locale: currentLocale } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    if (urlLocale) {
      if (VALID_LOCALES.includes(urlLocale as Locale)) {
        // Only update if the locale from the URL is different
        if (urlLocale !== currentLocale) {
          setLocale(urlLocale as Locale);
        }
      } else {
        // If the locale in the URL is invalid, redirect to the current valid locale's equivalent page
        navigate(`/${currentLocale}`, { replace: true });
      }
    }
  }, [urlLocale, currentLocale, setLocale, navigate]);

  return null;
};

// ===== EXIT INTENT CONFIGURATION =====
// Paths where exit intent modal should NOT appear (legal, informational pages)
const EXIT_INTENT_EXCLUDED_PATHS = [
  '/terminos-y-condiciones',
  '/aviso-legal',
  '/politica-privacidad',
  '/politica-cookies',
  '/blog',
  '/sobre-nosotros',
  '/metodofarray',
  '/yunaisy-farray',
  '/profesores-baile-barcelona',
  '/preguntas-frecuentes',
  '/alquiler-salas-baile-barcelona',
  '/servicios-baile',
  '/estudio-grabacion-barcelona',
  '/instalaciones-escuela-baile-barcelona',
  '/merchandise',
  '/test',
  '/404',
];

// Promotion configuration - easy to update
const EXIT_INTENT_PROMO_CONFIG = {
  endDate: new Date('2025-01-31T23:59:59'),
  discountPercent: 50,
  delay: 5000, // 5 seconds before activating detection
  cookieExpiry: 7, // Show again after 7 days
};

const AppContent: React.FC = () => {
  const { locale } = useI18n();
  const location = useLocation();

  // Check if current route is a landing page (no header/footer)
  const isPromoLanding =
    location.pathname.endsWith('/dancehall') ||
    location.pathname.endsWith('/twerk') ||
    location.pathname.endsWith('/sexy-reggaeton') ||
    location.pathname.endsWith('/sexy-style') ||
    location.pathname.endsWith('/hip-hop-reggaeton') ||
    location.pathname.endsWith('/contemporaneo') ||
    location.pathname.endsWith('/femmology') ||
    location.pathname.endsWith('/bachata') ||
    location.pathname.endsWith('/hip-hop') ||
    location.pathname.endsWith('/afrobeats') ||
    location.pathname.endsWith('/afro-jazz') ||
    location.pathname.endsWith('/salsa-cubana') ||
    location.pathname.endsWith('/ballet') ||
    location.pathname.endsWith('/afro-contemporaneo');

  // Determine if exit intent modal should show on current page
  const shouldShowExitIntent = useMemo(() => {
    // Remove locale prefix to get the base path
    const pathWithoutLocale = location.pathname.replace(/^\/(es|en|ca|fr)/, '') || '/';

    // Check if current path matches any excluded path
    return !EXIT_INTENT_EXCLUDED_PATHS.some(
      excluded => pathWithoutLocale === excluded || pathWithoutLocale.startsWith(excluded + '/')
    );
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div className="bg-black text-neutral antialiased font-sans overflow-x-hidden">
      <ScrollToTop />
      <SEO />
      {!isPromoLanding && (
        <>
          <SkipLink />
          <Header />
        </>
      )}
      <main id="main-content">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Redirect root to default locale */}
            <Route path="/" element={<Navigate to={`/${locale}`} replace />} />

            {/* Locale-based routes */}
            <Route
              path="/:locale"
              element={
                <>
                  <LocaleSync />
                  <HomePage />
                </>
              }
            />
            {/* Test Homepage V2 - Nueva versión con océano azul */}
            <Route
              path="/:locale/test-home-v2"
              element={
                <>
                  <LocaleSync />
                  <HomePageV2 />
                </>
              }
            />
            <Route
              path="/:locale/clases/baile-barcelona"
              element={
                <>
                  <LocaleSync />
                  <DanceClassesPage />
                </>
              }
            />
            {/* Redirect old /clases route to new /clases/baile-barcelona */}
            <Route
              path="/:locale/clases"
              element={<Navigate to={`/${locale}/clases/baile-barcelona`} replace />}
            />

            <Route
              path="/:locale/clases/dancehall-barcelona"
              element={
                <>
                  <LocaleSync />
                  <DancehallPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/twerk-barcelona"
              element={
                <>
                  <LocaleSync />
                  <TwerkPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/afrobeats-barcelona"
              element={
                <>
                  <LocaleSync />
                  <AfrobeatPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/hip-hop-reggaeton-barcelona"
              element={
                <>
                  <LocaleSync />
                  <HipHopReggaetonPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/sexy-reggaeton-barcelona"
              element={
                <>
                  <LocaleSync />
                  <SexyReggaetonPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/reggaeton-cubano-barcelona"
              element={
                <>
                  <LocaleSync />
                  <ReggaetonCubanoPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/danza-barcelona"
              element={
                <>
                  <LocaleSync />
                  <DanzaBarcelonaPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/heels-barcelona"
              element={
                <>
                  <LocaleSync />
                  <HeelsBarcelonaPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/femmology"
              element={
                <>
                  <LocaleSync />
                  <FemmologyPage />
                </>
              }
            />
            {/* Redirect old Femmology URL to new one */}
            <Route
              path="/:locale/clases/femmology-sexy-style-en-barcelona"
              element={<Navigate to={`/${locale}/clases/femmology`} replace />}
            />

            <Route
              path="/:locale/clases/sexy-style-barcelona"
              element={
                <>
                  <LocaleSync />
                  <SexyStylePage />
                </>
              }
            />

            <Route
              path="/:locale/clases/modern-jazz-barcelona"
              element={
                <>
                  <LocaleSync />
                  <ModernJazzPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/ballet-barcelona"
              element={
                <>
                  <LocaleSync />
                  <BalletPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/contemporaneo-barcelona"
              element={
                <>
                  <LocaleSync />
                  <ContemporaneoPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/afro-contemporaneo-barcelona"
              element={
                <>
                  <LocaleSync />
                  <AfroContemporaneoPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/afro-jazz"
              element={
                <>
                  <LocaleSync />
                  <AfroJazzPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/salsa-bachata-barcelona"
              element={
                <>
                  <LocaleSync />
                  <SalsaBachataPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/salsa-cubana-barcelona"
              element={
                <>
                  <LocaleSync />
                  <SalsaCubanaPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/salsa-lady-style-barcelona"
              element={
                <>
                  <LocaleSync />
                  <SalsaLadyStylePage />
                </>
              }
            />

            {/* V2 Alternative - for A/B testing comparison */}
            <Route
              path="/:locale/clases/salsa-lady-style-v2"
              element={
                <>
                  <LocaleSync />
                  <SalsaLadyStylePageV2 />
                </>
              }
            />

            <Route
              path="/:locale/clases/bachata-lady-style-barcelona"
              element={
                <>
                  <LocaleSync />
                  <BachataLadyStylePage />
                </>
              }
            />

            <Route
              path="/:locale/clases/bachata-barcelona"
              element={
                <>
                  <LocaleSync />
                  <BachataPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/folklore-cubano"
              element={
                <>
                  <LocaleSync />
                  <FolkloreCubanoPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/timba-barcelona"
              element={
                <>
                  <LocaleSync />
                  <TimbaPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/danzas-urbanas-barcelona"
              element={
                <>
                  <LocaleSync />
                  <DanzasUrbanasBarcelonaPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/entrenamiento-bailarines-barcelona"
              element={
                <>
                  <LocaleSync />
                  <PreparacionFisicaBailarinesPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/stretching-barcelona"
              element={
                <>
                  <LocaleSync />
                  <StretchingPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/ejercicios-gluteos-barcelona"
              element={
                <>
                  <LocaleSync />
                  <BumBumPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/acondicionamiento-fisico-bailarines"
              element={
                <>
                  <LocaleSync />
                  <CuerpoFitPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/baile-mananas"
              element={
                <>
                  <LocaleSync />
                  <BaileMananasPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/cuerpo-fit"
              element={
                <>
                  <LocaleSync />
                  <FullBodyCardioPage />
                </>
              }
            />

            <Route
              path="/:locale/clases/hip-hop-barcelona"
              element={
                <>
                  <LocaleSync />
                  <HipHopPage />
                </>
              }
            />

            <Route
              path="/:locale/clases-particulares-baile"
              element={
                <>
                  <LocaleSync />
                  <ClasesParticularesPage />
                </>
              }
            />

            <Route
              path="/:locale/sobre-nosotros"
              element={
                <>
                  <LocaleSync />
                  <AboutPage />
                </>
              }
            />

            <Route
              path="/:locale/profesores-baile-barcelona"
              element={
                <>
                  <LocaleSync />
                  <ProfesoresBaileBarcelonaPage />
                </>
              }
            />

            <Route
              path="/:locale/contacto"
              element={
                <>
                  <LocaleSync />
                  <ContactPage />
                </>
              }
            />

            <Route
              path="/:locale/terminos-y-condiciones"
              element={
                <>
                  <LocaleSync />
                  <TermsConditionsPage />
                </>
              }
            />

            <Route
              path="/:locale/aviso-legal"
              element={
                <>
                  <LocaleSync />
                  <LegalNoticePage />
                </>
              }
            />

            <Route
              path="/:locale/politica-privacidad"
              element={
                <>
                  <LocaleSync />
                  <PrivacyPolicyPage />
                </>
              }
            />

            <Route
              path="/:locale/politica-cookies"
              element={
                <>
                  <LocaleSync />
                  <CookiePolicyPage />
                </>
              }
            />

            <Route
              path="/:locale/merchandising"
              element={
                <>
                  <LocaleSync />
                  <MerchandisingPage />
                </>
              }
            />

            <Route
              path="/:locale/yunaisy-farray"
              element={
                <>
                  <LocaleSync />
                  <YunaisyFarrayPage />
                </>
              }
            />

            <Route
              path="/:locale/metodo-farray"
              element={
                <>
                  <LocaleSync />
                  <MetodoFarrayPage />
                </>
              }
            />

            <Route
              path="/:locale/regala-baile"
              element={
                <>
                  <LocaleSync />
                  <RegalaBailePage />
                </>
              }
            />

            <Route
              path="/:locale/preguntas-frecuentes"
              element={
                <>
                  <LocaleSync />
                  <FAQPage />
                </>
              }
            />

            <Route
              path="/:locale/alquiler-salas-baile-barcelona"
              element={
                <>
                  <LocaleSync />
                  <AlquilerSalasPage />
                </>
              }
            />

            <Route
              path="/:locale/servicios-baile"
              element={
                <>
                  <LocaleSync />
                  <ServiciosBailePage />
                </>
              }
            />

            <Route
              path="/:locale/estudio-grabacion-barcelona"
              element={
                <>
                  <LocaleSync />
                  <EstudioGrabacionPage />
                </>
              }
            />

            <Route
              path="/:locale/instalaciones-escuela-baile-barcelona"
              element={
                <>
                  <LocaleSync />
                  <FacilitiesPage />
                </>
              }
            />

            <Route
              path="/:locale/calendario"
              element={
                <>
                  <LocaleSync />
                  <CalendarPage />
                </>
              }
            />

            <Route
              path="/:locale/precios-clases-baile-barcelona"
              element={
                <>
                  <LocaleSync />
                  <PreciosPage />
                </>
              }
            />

            {/* Horarios y Precios detallados */}
            <Route
              path="/:locale/horarios-precios"
              element={
                <>
                  <LocaleSync />
                  <HorariosPreciosPage />
                </>
              }
            />

            {/* Horarios Enterprise Page */}
            <Route
              path="/:locale/horarios-clases-baile-barcelona"
              element={
                <>
                  <LocaleSync />
                  <HorariosPageV2 />
                </>
              }
            />

            {/* ===== TEST/EXPERIMENTAL ROUTES ===== */}
            <Route
              path="/:locale/test/clase-experimental"
              element={
                <>
                  <LocaleSync />
                  <TestClassPage />
                </>
              }
            />
            <Route
              path="/:locale/test/afro-contemporaneo-v2"
              element={
                <>
                  <LocaleSync />
                  <AfroContemporaneoV2Page />
                </>
              }
            />

            {/* ===== DANCEHALL LANDING ===== */}
            <Route
              path="/:locale/dancehall"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={DANCEHALL_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== TWERK LANDING ===== */}
            <Route
              path="/:locale/twerk"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={TWERK_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== SEXY REGGAETON LANDING ===== */}
            <Route
              path="/:locale/sexy-reggaeton"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={SEXY_REGGAETON_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== SEXY STYLE LANDING ===== */}
            <Route
              path="/:locale/sexy-style"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={SEXY_STYLE_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== HIP HOP REGGAETON LANDING ===== */}
            <Route
              path="/:locale/hip-hop-reggaeton"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={HIP_HOP_REGGAETON_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== CONTEMPORANEO LANDING ===== */}
            <Route
              path="/:locale/contemporaneo"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={CONTEMPORANEO_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== FEMMOLOGY LANDING ===== */}
            <Route
              path="/:locale/femmology"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={FEMMOLOGY_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== BACHATA SENSUAL LANDING ===== */}
            <Route
              path="/:locale/bachata"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={BACHATA_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== HIP HOP LANDING ===== */}
            <Route
              path="/:locale/hip-hop"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={HIP_HOP_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== AFROBEATS LANDING ===== */}
            <Route
              path="/:locale/afrobeats"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={AFROBEATS_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== AFRO JAZZ LANDING ===== */}
            <Route
              path="/:locale/afro-jazz"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={AFRO_JAZZ_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== SALSA CUBANA LANDING ===== */}
            <Route
              path="/:locale/salsa-cubana"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={SALSA_CUBANA_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== BALLET LANDING ===== */}
            <Route
              path="/:locale/ballet"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={BALLET_LANDING_CONFIG} />
                </>
              }
            />
            <Route
              path="/:locale/afro-contemporaneo"
              element={
                <>
                  <LocaleSync />
                  <GenericDanceLanding config={AFRO_CONTEMPORANEO_LANDING_CONFIG} />
                </>
              }
            />

            {/* ===== BLOG ROUTES ===== */}
            <Route
              path="/:locale/blog"
              element={
                <>
                  <LocaleSync />
                  <BlogListPage />
                </>
              }
            />
            <Route
              path="/:locale/blog/:category"
              element={
                <>
                  <LocaleSync />
                  <BlogListPage />
                </>
              }
            />
            <Route
              path="/:locale/blog/:category/:slug"
              element={
                <>
                  <LocaleSync />
                  <BlogArticlePage />
                </>
              }
            />

            {/* 404 pages - localized */}
            <Route
              path="/:locale/404"
              element={
                <>
                  <LocaleSync />
                  <NotFoundPage />
                </>
              }
            />

            {/* Redirects from old URLs to new SEO-friendly URLs */}
            {/* NOTE: /:locale/dancehall is now a landing page (line ~845), not a redirect */}
            <Route
              path="/:locale/clases/dancehall-v2"
              element={<Navigate to={`/${locale}/clases/dancehall-barcelona`} replace />}
            />
            <Route
              path="/:locale/clases/dancehall-v3"
              element={<Navigate to={`/${locale}/clases/dancehall-barcelona`} replace />}
            />

            {/* Legacy routes without locale - redirect to current locale */}
            <Route
              path="/clases"
              element={<Navigate to={`/${locale}/clases/baile-barcelona`} replace />}
            />
            <Route
              path="/dancehall"
              element={<Navigate to={`/${locale}/clases/dancehall-barcelona`} replace />}
            />
            <Route
              path="/clases/dancehall-barcelona"
              element={<Navigate to={`/${locale}/clases/dancehall-barcelona`} replace />}
            />
            <Route
              path="/clases/dancehall-v2"
              element={<Navigate to={`/${locale}/clases/dancehall-barcelona`} replace />}
            />
            <Route
              path="/clases/dancehall-v3"
              element={<Navigate to={`/${locale}/clases/dancehall-barcelona`} replace />}
            />
            <Route
              path="/twerk"
              element={<Navigate to={`/${locale}/clases/twerk-barcelona`} replace />}
            />
            <Route
              path="/clases/twerk-barcelona"
              element={<Navigate to={`/${locale}/clases/twerk-barcelona`} replace />}
            />
            <Route
              path="/afrobeat"
              element={<Navigate to={`/${locale}/clases/afrobeats-barcelona`} replace />}
            />
            <Route
              path="/afrodance"
              element={<Navigate to={`/${locale}/clases/afrobeats-barcelona`} replace />}
            />
            <Route
              path="/clases/afrobeats-barcelona"
              element={<Navigate to={`/${locale}/clases/afrobeats-barcelona`} replace />}
            />
            {/* Legacy redirect for old URL */}
            <Route
              path="/clases/afrobeat-barcelona"
              element={<Navigate to={`/${locale}/clases/afrobeats-barcelona`} replace />}
            />
            <Route
              path="/hip-hop-reggaeton"
              element={<Navigate to={`/${locale}/clases/hip-hop-reggaeton-barcelona`} replace />}
            />
            <Route
              path="/clases/hip-hop-reggaeton-barcelona"
              element={<Navigate to={`/${locale}/clases/hip-hop-reggaeton-barcelona`} replace />}
            />
            <Route
              path="/sexy-reggaeton"
              element={<Navigate to={`/${locale}/clases/sexy-reggaeton-barcelona`} replace />}
            />
            <Route
              path="/clases/sexy-reggaeton-barcelona"
              element={<Navigate to={`/${locale}/clases/sexy-reggaeton-barcelona`} replace />}
            />
            <Route
              path="/reggaeton-cubano"
              element={<Navigate to={`/${locale}/clases/reggaeton-cubano-barcelona`} replace />}
            />
            <Route
              path="/clases/reggaeton-cubano-barcelona"
              element={<Navigate to={`/${locale}/clases/reggaeton-cubano-barcelona`} replace />}
            />
            <Route
              path="/reparto"
              element={<Navigate to={`/${locale}/clases/reggaeton-cubano-barcelona`} replace />}
            />
            <Route
              path="/cubaton"
              element={<Navigate to={`/${locale}/clases/reggaeton-cubano-barcelona`} replace />}
            />

            {/* Catch-all for 404 - redirect to localized 404 page */}
            <Route path="*" element={<Navigate to={`/${locale}/404`} replace />} />
          </Routes>
        </Suspense>
      </main>
      {!isPromoLanding && (
        <>
          <Footer />
          <BackToTop />
        </>
      )}
      {/* Exit Intent Modal - Only on conversion pages */}
      {shouldShowExitIntent && (
        <ExitIntentModal
          delay={EXIT_INTENT_PROMO_CONFIG.delay}
          cookieExpiry={EXIT_INTENT_PROMO_CONFIG.cookieExpiry}
          promoEndDate={EXIT_INTENT_PROMO_CONFIG.endDate}
          discountPercent={EXIT_INTENT_PROMO_CONFIG.discountPercent}
        />
      )}
      <CookieBanner />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <I18nProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </I18nProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
