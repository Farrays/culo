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
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import { preloadNamespaces } from './i18n/preloadNamespaces';
import type { Locale } from './types';
import { SUPPORTED_LOCALES } from './types';
import { sendCAPIPageView } from './utils/analytics';
import ErrorBoundary from './components/ErrorBoundary';
import SEO from './components/SEO';
import Header from './components/Header';
import SkipLink from './components/SkipLink';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import NotFoundPage from './components/NotFoundPage';
import BackToTop from './components/BackToTop';
import ServiceWorkerStatus from './components/ServiceWorkerStatus';

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
const UbicacionPage = lazy(() => import('./components/UbicacionPage'));
const EstudioGrabacionPage = lazy(() => import('./components/EstudioGrabacionPage'));
const FacilitiesPage = lazy(() => import('./components/FacilitiesPage'));
const HeelsBarcelonaPage = lazy(() => import('./components/HeelsBarcelonaPage'));
const SalsaLadyStylePage = lazy(() => import('./components/SalsaLadyStylePage'));
const BachataLadyStylePage = lazy(() => import('./components/BachataLadyStylePage'));
const BachataPage = lazy(() => import('./components/BachataPage'));
const TeamBuildingPage = lazy(() => import('./components/TeamBuildingPage'));

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
const KpopPage = lazy(() => import('./components/KpopPage'));
const CommercialDancePage = lazy(() => import('./components/CommercialDancePage'));
const KizombaDancePage = lazy(() => import('./components/KizombaDancePage'));
const SalsaCubanaPage = lazy(() => import('./components/SalsaCubanaPage'));
const FolkloreCubanoPage = lazy(() => import('./components/FolkloreCubanoPage'));
const TimbaPage = lazy(() => import('./components/TimbaPage'));
const StretchingPage = lazy(() => import('./components/StretchingPage'));
const BumBumPage = lazy(() => import('./components/BumBumPage'));
const CuerpoFitPage = lazy(() => import('./components/CuerpoFitPage'));
const BaileMananasPage = lazy(() => import('./components/BaileMananasPage'));
const FullBodyCardioPage = lazy(() => import('./components/FullBodyCardioPage'));
const CalendarPage = lazy(() => import('./components/CalendarPage'));
const HomePageV2 = lazy(() => import('./components/HomePageV2'));

// ===== LANDING PAGES (Lazy-loaded for code splitting) =====
// Each landing bundles its own config for optimal chunk splitting
const DancehallLanding = lazy(() => import('./components/landing/pages/DancehallLanding'));
const TwerkLanding = lazy(() => import('./components/landing/pages/TwerkLanding'));
const SexyReggaetonLanding = lazy(() => import('./components/landing/pages/SexyReggaetonLanding'));
const SexyStyleLanding = lazy(() => import('./components/landing/pages/SexyStyleLanding'));
const HipHopReggaetonLanding = lazy(
  () => import('./components/landing/pages/HipHopReggaetonLanding')
);
const ContemporaneoLanding = lazy(() => import('./components/landing/pages/ContemporaneoLanding'));
const FemmologyLanding = lazy(() => import('./components/landing/pages/FemmologyLanding'));
const BachataLanding = lazy(() => import('./components/landing/pages/BachataLanding'));
const HipHopLanding = lazy(() => import('./components/landing/pages/HipHopLanding'));
const AfrobeatsLanding = lazy(() => import('./components/landing/pages/AfrobeatsLanding'));
const AfroJazzLanding = lazy(() => import('./components/landing/pages/AfroJazzLanding'));
const SalsaCubanaLanding = lazy(() => import('./components/landing/pages/SalsaCubanaLanding'));
const BalletLanding = lazy(() => import('./components/landing/pages/BalletLanding'));
const AfroContemporaneoLanding = lazy(
  () => import('./components/landing/pages/AfroContemporaneoLanding')
);
const ClaseBienvenidaLanding = lazy(
  () => import('./components/landing/pages/ClaseBienvenidaLanding')
);
const BachataVentaDirectaLanding = lazy(
  () => import('./components/landing/pages/BachataVentaDirectaLanding')
);
const SalsaVentaDirectaLanding = lazy(
  () => import('./components/landing/pages/SalsaVentaDirectaLanding')
);
const ReynierLanding = lazy(() => import('./components/landing/pages/ReynierLanding'));
// TEST: Pagina de prueba para el nuevo sistema de ofertas
const OfferTestLanding = lazy(() => import('./components/landing/pages/OfferTestLanding'));
const SalsaSimpleLanding = lazy(() => import('./components/landing/pages/SalsaSimpleLanding'));
// TEST: Pagina de prueba para PaidClassSelector (clases de pago 10€/20€)
const TestPaidSelector = lazy(() => import('./pages/TestPaidSelector'));
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

// ===== BOOKING PAGE =====
const BookingPage = lazy(() => import('./components/pages/BookingPage'));
const MyBookingPage = lazy(() => import('./components/pages/MyBookingPage'));

// ===== FICHAJE PAGE (PWA interna para profesores) =====
const FichajePage = lazy(() => import('./components/fichaje/FichajePage'));
const ResumenFirmaPage = lazy(() => import('./components/fichaje/ResumenFirmaPage'));

// ===== ADMIN FICHAJES (Dashboard de gestión de fichajes) =====
const FichajesAdminPage = lazy(() => import('./components/admin/FichajesAdminPage'));

// ===== ADMIN RESERVAS (Dashboard de reservas de prueba) =====
const BookingsCalendarPage = lazy(() => import('./components/admin/BookingsCalendarPage'));

// ===== FEEDBACK PAGES =====
const FeedbackGraciasPage = lazy(() => import('./components/FeedbackGraciasPage'));
const FeedbackComentarioPage = lazy(() => import('./components/FeedbackComentarioPage'));

// ===== ASISTENCIA PAGE =====
const AsistenciaConfirmadaPage = lazy(() => import('./components/AsistenciaConfirmadaPage'));

// ===== HAZTE SOCIO PAGE (Landing pura - sin header/footer) =====
const HazteSocioPage = lazy(() => import('./components/pages/HazteSocioPage'));

// ===== Y&R PROJECT PAGE (Linktree-style - sin header/footer) =====
const YRProjectPage = lazy(() => import('./components/pages/YRProjectPage'));

// ===== LEGAL PAGES =====
const TermsConditionsPage = lazy(() => import('./components/TermsConditionsPage'));
const LegalNoticePage = lazy(() => import('./components/LegalNoticePage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const CookiePolicyPage = lazy(() => import('./components/CookiePolicyPage'));

// ===== COOKIE CONSENT =====
// CookieBanner lazy loaded for LCP optimization
const CookieBanner = lazy(() => import('./components/shared/CookieBanner'));

// ===== EXIT INTENT MODAL (Lazy loaded for LCP optimization) =====
const ExitIntentModal = lazy(() => import('./components/ExitIntentModal'));

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

/**
 * MetaCAPIPageView: Sends PageView events to Meta CAPI on each route change.
 * This matches the pixel PageView fired by GTM, closing the CAPI coverage gap.
 * Uses sendBeacon (non-blocking, zero performance impact).
 */
const MetaCAPIPageView: React.FC = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip internal/admin pages that shouldn't be tracked
    const path = location.pathname;
    if (
      path.includes('/fichaje') ||
      path.includes('/admin/') ||
      path.includes('/yr-project') ||
      path.includes('/404')
    ) {
      return;
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Delay first PageView slightly to allow Meta cookies (_fbp, _fbc) to be set by GTM
      const timer = setTimeout(() => {
        sendCAPIPageView();
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }

    // On SPA navigation, fire immediately
    sendCAPIPageView();
    return undefined;
  }, [location.pathname]);

  return null;
};

// Component to sync URL locale with i18n context and validate
const LocaleSync: React.FC = () => {
  const { locale: urlLocale } = useParams<{ locale: Locale }>();
  const currentLocale: Locale = i18n.language as Locale;
  const navigate = useNavigate();

  useEffect(() => {
    if (urlLocale) {
      if (VALID_LOCALES.includes(urlLocale as Locale)) {
        // Only update if the locale from the URL is different
        if (urlLocale !== currentLocale) {
          i18n.changeLanguage(urlLocale);
        }
      } else {
        // If the locale in the URL is invalid, redirect to the current valid locale's equivalent page
        navigate(`/${currentLocale}`, { replace: true });
      }
    }
  }, [urlLocale, currentLocale, navigate]);

  return null;
};

// ===== EXIT INTENT CONFIGURATION =====
// Paths where exit intent modal should NOT appear (legal, informational pages, landing pages)
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
  '/servicios-baile-barcelona',
  '/estudio-grabacion-barcelona',
  '/instalaciones-escuela-baile-barcelona',
  '/merchandise',
  '/test',
  '/404',
  // Landing pages (have their own exit intent)
  '/dancehall',
  '/twerk',
  '/sexy-reggaeton',
  '/sexy-style',
  '/hip-hop-reggaeton',
  '/contemporaneo',
  '/femmology',
  '/bachata',
  '/hip-hop',
  '/afrobeats',
  '/afro-jazz',
  '/salsa-cubana',
  '/ballet',
  '/afro-contemporaneo',
  '/clase-bienvenida',
  '/profesor-reynier',
  '/bachata-curso',
  '/salsa-curso',
  '/salsa-test',
  '/hazte-socio',
  '/yr-project',
];

// Promotion configuration - easy to update
const EXIT_INTENT_PROMO_CONFIG = {
  enabled: false, // Set to true to enable the exit intent modal
  endDate: new Date('2026-01-31T23:59:59'),
  discountPercent: 50,
  delay: 5000, // 5 seconds before activating detection
  cookieExpiry: 7, // Show again after 7 days
};

const AppContent: React.FC = () => {
  const locale: Locale = i18n.language as Locale;
  const location = useLocation();

  // Check if current route is a landing page (no header/footer)
  // Exclude /clases/ paths which should always have header/footer
  const isPromoLanding =
    !location.pathname.includes('/clases/') &&
    (location.pathname.endsWith('/dancehall') ||
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
      location.pathname.endsWith('/afro-contemporaneo') ||
      location.pathname.endsWith('/clase-bienvenida') ||
      location.pathname.endsWith('/profesor-reynier') ||
      location.pathname.endsWith('/bachata-curso') ||
      location.pathname.endsWith('/salsa-curso') ||
      location.pathname.endsWith('/salsa-test'));

  // Legal pages without header/footer (accessed from landing modal links)
  const isMinimalLegalPage = location.pathname.includes('/politica-privacidad');

  // Booking page without header/footer (clean funnel experience)
  const isBookingPage =
    location.pathname.includes('/reservas') ||
    location.pathname.includes('/mi-reserva') ||
    location.pathname.includes('/feedback-gracias') ||
    location.pathname.includes('/feedback-comentario') ||
    location.pathname.includes('/asistencia-confirmada') ||
    location.pathname.includes('/fichaje') ||
    location.pathname.includes('/admin/fichajes');

  // Hazte socio page without header/footer (landing pura for maximum conversion)
  const isHazteSocioPage = location.pathname.includes('/hazte-socio');

  // Y&R Project page without header/footer (Linktree-style artist page)
  const isYRProjectPage = location.pathname.includes('/yr-project');

  // Combined check for hiding header/footer
  const hideHeaderFooter =
    isPromoLanding || isMinimalLegalPage || isBookingPage || isHazteSocioPage || isYRProjectPage;

  // Determine if exit intent modal should show on current page
  const shouldShowExitIntent = useMemo(() => {
    // Check if modal is enabled
    if (!EXIT_INTENT_PROMO_CONFIG.enabled) return false;

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

  // Preload namespaces for the current route (lazy loading optimization)
  useEffect(() => {
    const pathWithoutLocale = location.pathname.replace(/^\/(es|en|ca|fr)/, '') || '/';
    preloadNamespaces(pathWithoutLocale);
  }, [location.pathname]);

  return (
    <div className="bg-black text-neutral antialiased font-sans overflow-x-hidden">
      <ScrollToTop />
      <MetaCAPIPageView />
      <SEO />
      {!hideHeaderFooter && (
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
              path="/:locale/clases/kpop-dance-barcelona"
              element={
                <>
                  <LocaleSync />
                  <KpopPage />
                </>
              }
            />
            <Route
              path="/:locale/clases/commercial-dance-barcelona"
              element={
                <>
                  <LocaleSync />
                  <CommercialDancePage />
                </>
              }
            />
            <Route
              path="/:locale/clases/kizomba-barcelona"
              element={
                <>
                  <LocaleSync />
                  <KizombaDancePage />
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
              path="/:locale/team-building-barcelona"
              element={
                <>
                  <LocaleSync />
                  <TeamBuildingPage />
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
              path="/:locale/reservas"
              element={
                <>
                  <LocaleSync />
                  <BookingPage />
                </>
              }
            />

            {/* ===== HAZTE SOCIO (Landing pura - sin header/footer) ===== */}
            <Route
              path="/:locale/hazte-socio"
              element={
                <>
                  <LocaleSync />
                  <HazteSocioPage />
                </>
              }
            />

            {/* ===== Y&R PROJECT (Linktree-style artist page - sin header/footer) ===== */}
            <Route path="/yr-project" element={<YRProjectPage />} />

            {/* ===== FICHAJE (PWA interna para profesores - sin header/footer) ===== */}
            <Route
              path="/:locale/fichaje"
              element={
                <>
                  <LocaleSync />
                  <FichajePage />
                </>
              }
            />

            {/* ===== RESUMEN FIRMA (Firma digital de resumen mensual) ===== */}
            {/* Support both /fichaje/resumen?token=xxx and /fichaje/resumen/:token */}
            <Route
              path="/:locale/fichaje/resumen"
              element={
                <>
                  <LocaleSync />
                  <ResumenFirmaPage />
                </>
              }
            />
            <Route
              path="/:locale/fichaje/resumen/:token"
              element={
                <>
                  <LocaleSync />
                  <ResumenFirmaPage />
                </>
              }
            />

            {/* ===== ADMIN FICHAJES (Dashboard de gestión - sin header/footer) ===== */}
            <Route
              path="/:locale/admin/fichajes"
              element={
                <>
                  <LocaleSync />
                  <FichajesAdminPage />
                </>
              }
            />

            {/* ===== ADMIN RESERVAS (Dashboard reservas de prueba - sin header/footer) ===== */}
            <Route
              path="/:locale/admin/reservas"
              element={
                <>
                  <LocaleSync />
                  <BookingsCalendarPage />
                </>
              }
            />

            <Route
              path="/:locale/mi-reserva"
              element={
                <>
                  <LocaleSync />
                  <MyBookingPage />
                </>
              }
            />

            <Route
              path="/:locale/feedback-gracias"
              element={
                <>
                  <LocaleSync />
                  <FeedbackGraciasPage />
                </>
              }
            />

            <Route
              path="/:locale/feedback-comentario"
              element={
                <>
                  <LocaleSync />
                  <FeedbackComentarioPage />
                </>
              }
            />

            <Route
              path="/:locale/asistencia-confirmada"
              element={
                <>
                  <LocaleSync />
                  <AsistenciaConfirmadaPage />
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
              path="/:locale/servicios-baile-barcelona"
              element={
                <>
                  <LocaleSync />
                  <ServiciosBailePage />
                </>
              }
            />

            <Route
              path="/:locale/como-llegar-escuela-baile-barcelona"
              element={
                <>
                  <LocaleSync />
                  <UbicacionPage />
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
              path="/:locale/offer-test"
              element={
                <>
                  <LocaleSync />
                  <OfferTestLanding />
                </>
              }
            />
            <Route
              path="/:locale/test-paid-selector"
              element={
                <>
                  <LocaleSync />
                  <TestPaidSelector />
                </>
              }
            />

            {/* ===== LANDING PAGES (Lazy-loaded with code splitting) ===== */}
            <Route
              path="/:locale/dancehall"
              element={
                <>
                  <LocaleSync />
                  <DancehallLanding />
                </>
              }
            />
            <Route
              path="/:locale/twerk"
              element={
                <>
                  <LocaleSync />
                  <TwerkLanding />
                </>
              }
            />
            <Route
              path="/:locale/sexy-reggaeton"
              element={
                <>
                  <LocaleSync />
                  <SexyReggaetonLanding />
                </>
              }
            />
            <Route
              path="/:locale/sexy-style"
              element={
                <>
                  <LocaleSync />
                  <SexyStyleLanding />
                </>
              }
            />
            <Route
              path="/:locale/hip-hop-reggaeton"
              element={
                <>
                  <LocaleSync />
                  <HipHopReggaetonLanding />
                </>
              }
            />
            <Route
              path="/:locale/contemporaneo"
              element={
                <>
                  <LocaleSync />
                  <ContemporaneoLanding />
                </>
              }
            />
            <Route
              path="/:locale/femmology"
              element={
                <>
                  <LocaleSync />
                  <FemmologyLanding />
                </>
              }
            />
            <Route
              path="/:locale/bachata"
              element={
                <>
                  <LocaleSync />
                  <BachataLanding />
                </>
              }
            />
            <Route
              path="/:locale/bachata-curso"
              element={
                <>
                  <LocaleSync />
                  <BachataVentaDirectaLanding />
                </>
              }
            />
            <Route
              path="/:locale/salsa-curso"
              element={
                <>
                  <LocaleSync />
                  <SalsaVentaDirectaLanding />
                </>
              }
            />
            <Route
              path="/:locale/salsa-test"
              element={
                <>
                  <LocaleSync />
                  <SalsaSimpleLanding />
                </>
              }
            />
            <Route
              path="/:locale/hip-hop"
              element={
                <>
                  <LocaleSync />
                  <HipHopLanding />
                </>
              }
            />
            <Route
              path="/:locale/afrobeats"
              element={
                <>
                  <LocaleSync />
                  <AfrobeatsLanding />
                </>
              }
            />
            <Route
              path="/:locale/afro-jazz"
              element={
                <>
                  <LocaleSync />
                  <AfroJazzLanding />
                </>
              }
            />
            <Route
              path="/:locale/salsa-cubana"
              element={
                <>
                  <LocaleSync />
                  <SalsaCubanaLanding />
                </>
              }
            />
            <Route
              path="/:locale/ballet"
              element={
                <>
                  <LocaleSync />
                  <BalletLanding />
                </>
              }
            />
            <Route
              path="/:locale/afro-contemporaneo"
              element={
                <>
                  <LocaleSync />
                  <AfroContemporaneoLanding />
                </>
              }
            />
            <Route
              path="/:locale/clase-bienvenida"
              element={
                <>
                  <LocaleSync />
                  <ClaseBienvenidaLanding />
                </>
              }
            />
            <Route
              path="/:locale/profesor-reynier"
              element={
                <>
                  <LocaleSync />
                  <ReynierLanding />
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
      {!hideHeaderFooter && (
        <>
          <Footer />
          <BackToTop />
        </>
      )}
      {/* Exit Intent Modal - Only on conversion pages (Lazy loaded) */}
      {shouldShowExitIntent && (
        <Suspense fallback={null}>
          <ExitIntentModal
            delay={EXIT_INTENT_PROMO_CONFIG.delay}
            cookieExpiry={EXIT_INTENT_PROMO_CONFIG.cookieExpiry}
            promoEndDate={EXIT_INTENT_PROMO_CONFIG.endDate}
            discountPercent={EXIT_INTENT_PROMO_CONFIG.discountPercent}
          />
        </Suspense>
      )}
      <Suspense fallback={null}>
        <CookieBanner />
      </Suspense>
      <ServiceWorkerStatus />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </I18nextProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
