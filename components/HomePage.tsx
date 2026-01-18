import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import { HOMEPAGE_V2_CONFIG } from '../constants/homepage-v2-config';
import Hero from './Hero';
import HappinessStory from './HappinessStory';
import About from './About';
// import Classes from './Classes'; // Componente no encontrado - usando ClassesPreview en su lugar
import ClassesPreview from './homev2/ClassesPreview';
import WhyFIDC from './WhyFIDC';
import FinalCTA from './FinalCTA';

// Lazy load components below the fold for better initial page load performance
const NovedadesCarousel = lazy(() => import('./novedades/NovedadesCarousel'));
const Services = lazy(() => import('./Services'));
const Teachers = lazy(() => import('./Teachers'));
const ReviewsSection = lazy(() => import('./reviews/ReviewsSection'));
const FAQSection = lazy(() => import('./FAQSection'));
const HowToGetHere = lazy(() => import('./HowToGetHere'));
const CalendarWidget = lazy(() => import('./CalendarWidget'));
const ComparisonSection = lazy(() => import('./homev2/ComparisonSection'));

const HomePage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';

  const homeFaqs = [
    { id: 'home-1', question: t('homeFaqQ1'), answer: t('homeFaqA1') },
    { id: 'home-2', question: t('homeFaqQ2'), answer: t('homeFaqA2') },
    { id: 'home-3', question: t('homeFaqQ3'), answer: t('homeFaqA3') },
    { id: 'home-4', question: t('homeFaqQ4'), answer: t('homeFaqA4') },
    { id: 'home-5', question: t('homeFaqQ5'), answer: t('homeFaqA5') },
    { id: 'home-6', question: t('homeFaqQ6'), answer: t('homeFaqA6') },
    { id: 'home-7', question: t('homeFaqQ7'), answer: t('homeFaqA7') },
    { id: 'home-8', question: t('homeFaqQ8'), answer: t('homeFaqA8') },
  ];

  return (
    <>
      <Helmet>
        <title>{t('pageTitle')}</title>
        <meta name="description" content={t('metaDescription')} />
        <link rel="canonical" href={`${baseUrl}/${locale}`} />
        <meta property="og:title" content={t('pageTitle')} />
        <meta property="og:description" content={t('metaDescription')} />
        <meta property="og:url" content={`${baseUrl}/${locale}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-home.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('pageTitle')} />
        <meta name="twitter:description" content={t('metaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-home.jpg`} />
      </Helmet>

      <Hero />
      <Suspense fallback={<div className="min-h-[400px]" />}>
        <NovedadesCarousel />
      </Suspense>
      <HappinessStory />
      <About />
      <ClassesPreview />
      <WhyFIDC />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ComparisonSection config={HOMEPAGE_V2_CONFIG.comparison} />
        <Services />
        <Teachers />
        <CalendarWidget />
        <ReviewsSection
          category="general"
          limit={6}
          showGoogleBadge={true}
          layout="grid"
          showCategory={true}
        />
        <FAQSection title={t('faqTitle')} faqs={homeFaqs} pageUrl={`${baseUrl}/${locale}`} />
        <FinalCTA />
        <HowToGetHere />
      </Suspense>
    </>
  );
};

export default HomePage;
