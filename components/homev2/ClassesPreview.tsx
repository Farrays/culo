import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';
import { CATEGORIES } from '../../constants/categories';
import CategoryCard from '../home/CategoryCard';

/**
 * ClassesPreview - Preview de Clases
 *
 * Muestra las categorías principales de clases con CTA para ver todas.
 * Usa el estilo visual de CategoriesSection.
 */
const ClassesPreview: React.FC = () => {
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;

  // Mostrar solo las primeras 4 categorías (excluir "todas")
  const previewCategories = CATEGORIES.filter(cat => cat.key !== 'todas').slice(0, 4);

  return (
    <section id="classes-preview" className="py-12 md:py-16 bg-primary-dark/10">
      <div className="container mx-auto px-6 text-center">
        {/* Header */}
        <AnimateOnScroll>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-neutral holographic-text">
            {t('homev2_classes_title')}
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100}>
          <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12">
            {t('homev2_classes_subtitle')}
          </p>
        </AnimateOnScroll>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {previewCategories.map((category, index) => (
            <AnimateOnScroll key={category.key} delay={200 + index * 100}>
              <CategoryCard category={category} />
            </AnimateOnScroll>
          ))}
        </div>

        {/* CTA Ver Todas */}
        <AnimateOnScroll delay={600}>
          <Link
            to={`/${locale}/clases/baile-barcelona`}
            className="group inline-flex items-center gap-3 bg-primary-accent text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
          >
            <span>{t('homev2_classes_cta')}</span>
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ClassesPreview;
