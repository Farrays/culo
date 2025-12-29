import { useI18n } from '../../hooks/useI18n';
import AnimateOnScroll from '../AnimateOnScroll';
import { HOMEPAGE_V2_CONFIG } from '../../constants/homepage-v2-config';
import { Link } from 'react-router-dom';

interface ComparisonSectionProps {
  config: typeof HOMEPAGE_V2_CONFIG.comparison;
}

// Iconos para cada criterio de comparación
const ComparisonIcons: Record<string, React.FC<{ className?: string }>> = {
  methodology: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  progress: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    </svg>
  ),
  teachers: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
      />
    </svg>
  ),
  facilities: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6"
      />
    </svg>
  ),
  attention: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  ),
  flexibility: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

/**
 * ComparisonSection - "Nosotros vs Otros" VISUAL
 *
 * Diseño visual con cards animadas que muestran la diferencia
 * entre academias típicas y Farray&apos;s Center.
 * Usa el estilo visual coherente con WhyFIDC.
 */
const ComparisonSection: React.FC<ComparisonSectionProps> = ({ config }) => {
  const { t, locale } = useI18n();

  const iconKeys = [
    'methodology',
    'progress',
    'teachers',
    'facilities',
    'attention',
    'flexibility',
  ];

  return (
    <section id="comparison-section" className="py-12 md:py-16 bg-primary-dark/10">
      <div className="container mx-auto px-6">
        {/* Header */}
        <AnimateOnScroll>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t(config.titleKey)}
            </h2>
            <p className="text-lg text-neutral/90">{t(config.subtitleKey)}</p>
          </div>
        </AnimateOnScroll>

        {/* Visual Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Lado izquierdo: Otros */}
          <AnimateOnScroll delay={100}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-black/80 backdrop-blur-md border border-red-500/30 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral/70">Academia Típica</h3>
                </div>
                <ul className="space-y-6">
                  {config.rows.map((row, index) => {
                    const iconKey = iconKeys[index] ?? 'methodology';
                    const IconComponent = ComparisonIcons[iconKey];
                    return (
                      <li key={row.labelKey} className="flex items-start gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                          {IconComponent && <IconComponent className="w-5 h-5 text-red-400/70" />}
                        </div>
                        <div>
                          <p className="text-neutral/50 text-sm mb-1">{t(row.labelKey)}</p>
                          <p className="text-neutral/70">{t(row.othersKey)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Lado derecho: Nosotros */}
          <AnimateOnScroll delay={200}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-accent/30 to-green-500/30 rounded-3xl blur-xl opacity-70" />
              <div className="relative bg-black/80 backdrop-blur-md border border-primary-accent/50 rounded-2xl p-8 shadow-accent-glow">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-primary-accent/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral holographic-text">
                    Farray&apos;s Center
                  </h3>
                </div>
                <ul className="space-y-6">
                  {config.rows.map((row, index) => {
                    const iconKey = iconKeys[index] ?? 'methodology';
                    const IconComponent = ComparisonIcons[iconKey];
                    return (
                      <li key={row.labelKey} className="flex items-start gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-primary-accent/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary-accent/30 transition-all duration-300">
                          {IconComponent && (
                            <IconComponent className="w-5 h-5 text-primary-accent" />
                          )}
                        </div>
                        <div>
                          <p className="text-neutral/50 text-sm mb-1">{t(row.labelKey)}</p>
                          <p className="text-neutral font-medium">{t(row.usKey)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Disclaimer */}
        <AnimateOnScroll delay={300}>
          <p className="text-center text-neutral/40 text-sm italic mb-12">
            {t(config.disclaimerKey)}
          </p>
        </AnimateOnScroll>

        {/* CTA */}
        <AnimateOnScroll delay={400}>
          <div className="text-center">
            <Link
              to={`/${locale}/instalaciones-escuela-baile-barcelona`}
              className="inline-block bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
            >
              {t(config.ctaTextKey)}
            </Link>
            <p className="mt-4 text-neutral/50 text-sm">{t(config.ctaSubtextKey)}</p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ComparisonSection;
