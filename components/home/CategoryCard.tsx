import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import type { CategoryCardProps } from '../../types/categories';

// CategoryCard Component
// Refactored: Direct link to pillar page (no modals)
// Design: Square cards with 3D effects and hover descriptions
// Verified: Vite + React + React Router v7 + useI18n hook
// Primary color: #c82260 (primary-accent from tailwind.config)

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { t, locale } = useI18n();

  // Get translations with fallback
  const title = t(`home_categories_${category.key}_title`) || category.key;
  const imageAlt = t(`home_categories_${category.key}_image_alt`) || `${title} class`;
  const intro = t(`home_categories_${category.key}_intro`) || '';
  const viewStylesText = t('home_categories_cta_view_styles') || 'Ver estilos';

  return (
    <Link
      to={`/${locale}${category.pillarSlug}`}
      className="block [perspective:1000px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 rounded-xl"
      aria-label={`${title} - ${viewStylesText}`}
    >
      <article className="group relative rounded-xl overflow-hidden shadow-lg h-80 bg-black text-white transition-all duration-500 ease-in-out [transform-style:preserve-3d] hover:shadow-accent-glow hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)]">
        {/* Background Image */}
        <img
          src={category.imageUrl}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 opacity-40 group-hover:opacity-60"
          loading={category.key === 'salsa_bachata' ? 'eager' : 'lazy'}
          decoding="async"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-accent rounded-xl transition-all duration-300 pointer-events-none"></div>

        {/* Content */}
        <div className="relative flex flex-col justify-end h-full p-6 text-left">
          <h3 className="text-3xl font-bold mt-2">{title}</h3>

          {/* Expandable Description + CTA Text - Always visible on mobile, hover on desktop */}
          <div className="h-28 md:h-0 md:group-hover:h-28 overflow-hidden transition-all duration-300 ease-in-out">
            <p className="text-neutral/90 text-sm mt-2 leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 md:delay-150">
              {intro}
            </p>
            <div className="mt-3 inline-block text-primary-accent font-bold text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 md:delay-150">
              {viewStylesText} →
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default CategoryCard;
