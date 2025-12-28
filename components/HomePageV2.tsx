import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import { HOMEPAGE_V2_CONFIG } from '../constants/homepage-v2-config';

// Import sections - Hero is critical, load immediately
import HeroV2 from './homev2/HeroV2';

// Lazy load below-the-fold sections for performance
const TrustBar = lazy(() => import('./homev2/TrustBar'));
const ProblemSolutionSection = lazy(() => import('./homev2/ProblemSolutionSection'));
const MethodSection = lazy(() => import('./homev2/MethodSection'));
const ComparisonSection = lazy(() => import('./homev2/ComparisonSection'));
const ClassesPreview = lazy(() => import('./homev2/ClassesPreview'));
const InstructorsSection = lazy(() => import('./homev2/InstructorsSection'));
const VideoTestimonialsSection = lazy(() => import('./homev2/VideoTestimonialsSection'));
const IrresistibleOfferSection = lazy(() => import('./homev2/IrresistibleOfferSection'));
const MiniFAQ = lazy(() => import('./homev2/MiniFAQ'));
const FinalCTAV2 = lazy(() => import('./homev2/FinalCTAV2'));
const HowToGetHere = lazy(() => import('./HowToGetHere'));
const StickyMobileCTA = lazy(() => import('./homev2/StickyMobileCTA'));

/**
 * HomePageV2 - Homepage de Alta Conversión
 *
 * Arquitectura de 12 secciones optimizada para conversión:
 *
 * 1.  Hero - Video background + CTA prominente + Urgencia
 * 2.  TrustBar - Credibilidad instantánea (CID-UNESCO, estudiantes, etc.)
 * 3.  ProblemSolution (PAS) - Conexión emocional con el dolor
 * 4.  MethodSection - Método Farray® (3 pilares: Aprender, Disfrutar, Pertenecer)
 * 5.  ComparisonSection - "Nosotros vs Otros" visual
 * 6.  ClassesPreview - Estilos de baile con grid visual
 * 7.  InstructorsSection - Instructores estrella (carrusel)
 * 8.  VideoTestimonialsSection - Social proof máximo (videos + Google reviews)
 * 9.  IrresistibleOfferSection - Oferta con urgencia y escasez
 * 10. MiniFAQ - 5 preguntas críticas (objection buster)
 * 11. FinalCTAV2 - CTA final emocional
 * 12. HowToGetHere - Ubicación + contacto
 *
 * + StickyMobileCTA - CTA fijo en móvil (aparece después del hero)
 *
 * Basado en análisis de:
 * - Broadway Dance Center (NYC)
 * - Steezy Studio (Online)
 * - Pineapple Dance Studios (Londres)
 * - DNCR Academy (Online)
 * - Millennium Dance Complex (LA)
 *
 * Principios aplicados:
 * - AIDA (Attention, Interest, Desire, Action)
 * - PAS (Problem, Agitation, Solution)
 * - Social Proof, Scarcity, Urgency, Risk Reversal
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
        {/* 2. TRUST BAR - Credibilidad instantánea */}
        <div id="trust-bar">
          <TrustBar />
        </div>

        {/* 3. PROBLEM-SOLUTION (PAS) - Conexión emocional */}
        <ProblemSolutionSection />

        {/* 4. METHOD SECTION - Método Farray® (3 pilares) */}
        <MethodSection config={config.method} />

        {/* 5. COMPARISON SECTION - Nosotros vs Otros */}
        <ComparisonSection config={config.comparison} />

        {/* 6. CLASSES PREVIEW - Estilos de baile */}
        <ClassesPreview />

        {/* 7. INSTRUCTORS SECTION - Instructores estrella */}
        <InstructorsSection />

        {/* 8. VIDEO TESTIMONIALS - Social proof máximo */}
        <VideoTestimonialsSection />

        {/* 9. IRRESISTIBLE OFFER - Urgencia y escasez */}
        <IrresistibleOfferSection />

        {/* 10. MINI FAQ - Objection buster */}
        <MiniFAQ config={config.miniFaq} />

        {/* 11. FINAL CTA - Cierre emocional */}
        <FinalCTAV2 config={config.finalCta} />

        {/* 12. HOW TO GET HERE - Ubicación */}
        <HowToGetHere />

        {/* STICKY MOBILE CTA - Aparece después del hero */}
        <StickyMobileCTA />
      </Suspense>
    </>
  );
};

export default HomePageV2;
