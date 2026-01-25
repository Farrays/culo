import { useTranslation } from 'react-i18next';

/**
 * StatsBar - Barra de estadísticas elegante y minimalista
 *
 * Muestra credenciales clave de forma sutil justo debajo del hero.
 * Diseño limpio sin iconos, solo tipografía.
 */
const StatsBar: React.FC = () => {
  const { t } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);

  const stats = [
    {
      value: '4.9/5',
      label: t('statsbar_reviews'),
      highlight: true,
    },
    {
      value: 'CID-UNESCO',
      label: t('statsbar_certified'),
    },
    {
      value: '1,500+',
      label: t('statsbar_members'),
    },
    {
      value: '700m²',
      label: t('statsbar_space'),
    },
    {
      value: '+25',
      label: t('statsbar_styles'),
    },
    {
      value: '8 años',
      label: t('statsbar_years'),
    },
  ];

  return (
    <section className="py-4 md:py-6 bg-black/40 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-2">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center px-3 md:px-4 group">
              <span
                className={`text-lg md:text-xl font-bold tracking-tight ${
                  stat.highlight
                    ? 'text-primary-accent'
                    : 'text-neutral group-hover:text-primary-accent transition-colors duration-300'
                }`}
              >
                {stat.value}
              </span>
              <span className="text-[10px] md:text-xs text-neutral/60 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
