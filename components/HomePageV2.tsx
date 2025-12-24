import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import { HOMEPAGE_V2_CONFIG } from '../constants/homepage-v2-config';

// Import sections - Hero is critical, load immediately
import HeroV2 from './homev2/HeroV2';

// Lazy load below-the-fold sections for performance
const FounderSection = lazy(() => import('./homev2/FounderSection'));
const MethodSection = lazy(() => import('./homev2/MethodSection'));
const ComparisonSection = lazy(() => import('./homev2/ComparisonSection'));
const ClassesPreview = lazy(() => import('./homev2/ClassesPreview'));
const ServicesPreview = lazy(() => import('./homev2/ServicesPreview'));
const MiniFAQ = lazy(() => import('./homev2/MiniFAQ'));
const FinalCTAV2 = lazy(() => import('./homev2/FinalCTAV2'));

// Reuse existing components
const HowToGetHere = lazy(() => import('./HowToGetHere'));

/**
 * HomePageV2 - Nueva homepage con estrategia océano azul
 *
 * Arquitectura de secciones:
 * 1. Hero - Headline disruptivo + Social Proof + CTA
 * 2. Founder - Yunaisy como ancla de autoridad
 * 3. Method - Método Farray como diferenciador (Océano Azul)
 * 4. Comparison - "Nosotros vs Otros" visual
 * 5. Classes - Preview de categorías + CTA ver todas
 * 6. Services - Preview de servicios + CTA ver todos
 * 7. Mini FAQ - Objection buster (5 preguntas)
 * 8. Final CTA - Copy emotivo de cierre
 * 9. How To Get Here - Ubicación y transporte
 */
const HomePageV2: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const config = HOMEPAGE_V2_CONFIG;

  return (
    <>
      {/* SEO - noindex para página de test */}
      <Helmet>
        <title>{t(config.meta.titleKey)}</title>
        <meta name="description" content={t(config.meta.descriptionKey)} />
        {config.meta.noindex && <meta name="robots" content="noindex, nofollow" />}
        <link rel="canonical" href={`${baseUrl}/${locale}/test-home-v2`} />
        <meta property="og:title" content={t(config.meta.titleKey)} />
        <meta property="og:description" content={t(config.meta.descriptionKey)} />
        <meta property="og:url" content={`${baseUrl}/${locale}/test-home-v2`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-home.jpg`} />
      </Helmet>

      {/* 1. HERO - Above the fold critical */}
      <HeroV2 config={config.hero} />

      {/* Lazy loaded sections below the fold */}
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        {/* 2. FOUNDER SECTION - Yunaisy como autoridad */}
        <FounderSection config={config.founder} />

        {/* 3. METHOD SECTION - Océano azul */}
        <MethodSection config={config.method} />

        {/* 4. COMPARISON SECTION - Nosotros vs Otros */}
        <ComparisonSection config={config.comparison} />

        {/* 5. CLASSES PREVIEW - Categorías de clases */}
        <ClassesPreview />

        {/* 6. SERVICES PREVIEW - Servicios */}
        <ServicesPreview />

        {/* 7. MINI FAQ - Objection buster */}
        <MiniFAQ config={config.miniFaq} />

        {/* 8. FINAL CTA - Conversión */}
        <FinalCTAV2 config={config.finalCta} />

        {/* 9. HOW TO GET HERE - Ubicación */}
        <HowToGetHere />
      </Suspense>
    </>
  );
};

export default HomePageV2;
