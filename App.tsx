import React, { useEffect, lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useParams,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider, useI18n } from './hooks/useI18n';
import type { Locale } from './types';
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
const DancehallPage = lazy(() => import('./components/DancehallPage'));
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
const RegalaBailePage = lazy(() => import('./components/RegalaBailePage'));
const AlquilerSalasPage = lazy(() => import('./components/AlquilerSalasPage'));
const ServiciosBailePage = lazy(() => import('./components/ServiciosBailePage'));
const EstudioGrabacionPage = lazy(() => import('./components/EstudioGrabacionPage'));
const FacilitiesPage = lazy(() => import('./components/FacilitiesPage'));
const TwerkPage = lazy(() => import('./components/TwerkPage'));
const AfrobeatPage = lazy(() => import('./components/AfrobeatPage'));

// Valid locales
const VALID_LOCALES: Locale[] = ['es', 'en', 'ca', 'fr'];

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

const AppContent: React.FC = () => {
  const { locale } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div className="bg-black text-neutral antialiased font-sans overflow-x-hidden">
      <ScrollToTop />
      <SEO />
      <SkipLink />
      <Header />
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
              path="/:locale/clases/afrobeat-barcelona"
              element={
                <>
                  <LocaleSync />
                  <AfrobeatPage />
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
              path="/:locale/clases/salsa-bachata-barcelona"
              element={
                <>
                  <LocaleSync />
                  <SalsaBachataPage />
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
              path="/:locale/contacto"
              element={
                <>
                  <LocaleSync />
                  <ContactPage />
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
            <Route
              path="/:locale/dancehall"
              element={<Navigate to={`/${locale}/clases/dancehall-barcelona`} replace />}
            />
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
              element={<Navigate to={`/${locale}/clases/afrobeat-barcelona`} replace />}
            />
            <Route
              path="/afrodance"
              element={<Navigate to={`/${locale}/clases/afrobeat-barcelona`} replace />}
            />
            <Route
              path="/clases/afrobeat-barcelona"
              element={<Navigate to={`/${locale}/clases/afrobeat-barcelona`} replace />}
            />

            {/* Catch-all for 404 - redirect to localized 404 page */}
            <Route path="*" element={<Navigate to={`/${locale}/404`} replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
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
