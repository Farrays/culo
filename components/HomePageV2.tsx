import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import { HOMEPAGE_V2_CONFIG } from '../constants/homepage-v2-config';
import ProblemSolutionSection from './homev2/ProblemSolutionSection';
import MethodSection from './homev2/MethodSection';

/**
 * HomePageV2 - Template minimalista
 *
 * Solo 2 secciones:
 * 1. ProblemSolution (PAS) - "¿Te Suena Familiar?"
 * 2. MethodSection - Método Farray® (3 pilares)
 */
const HomePageV2: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const config = HOMEPAGE_V2_CONFIG;

  return (
    <>
      <Helmet>
        <title>{t(config.meta.titleKey)}</title>
        <meta name="description" content={t(config.meta.descriptionKey)} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${baseUrl}/${locale}/test-home-v2`} />
      </Helmet>

      {/* 1. PROBLEM-SOLUTION (PAS) - ¿Te Suena Familiar? */}
      <ProblemSolutionSection />

      {/* 2. METHOD SECTION - Método Farray® (3 pilares) */}
      <MethodSection config={config.method} />
    </>
  );
};

export default HomePageV2;
