import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '../../constants/categories';
import CategoryCard from './CategoryCard';
import CategoriesSchemaMarkup from './CategoriesSchemaMarkup';
import AnimateOnScroll from '../AnimateOnScroll';

// CategoriesSection Component
// Main wrapper component for categories cards (direct links to pillar pages)
// Refactored: No modals - direct navigation to pillar pages
// Verified: Vite + React + React Router v7 + useI18n hook
// Design: Matches Classes.tsx style with same background, animations, and 3D effects

const CIDLogo: React.FC = () => (
  <div className="w-24 h-24 bg-neutral/10 border-2 border-primary-accent/50 rounded-full flex items-center justify-center p-2 backdrop-blur-sm">
    <svg viewBox="0 0 100 100" className="w-full h-full text-primary-accent">
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="50" y="55" textAnchor="middle" fontSize="24" fill="currentColor" fontWeight="bold">
        CID
      </text>
      <text x="50" y="75" textAnchor="middle" fontSize="12" fill="currentColor">
        UNESCO
      </text>
    </svg>
  </div>
);

const CategoriesSection: React.FC = () => {
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;

  const sectionTitle = t('home_categories_section_title') || 'Encuentra tu estilo de baile';
  const sectionDescription =
    t('home_categories_section_description') ||
    'Explora nuestras categorías y descubre la clase perfecta para ti';
  const viewAllClassesText =
    t('home_categories_cta_view_all_classes') || 'Ver Todas Las Clases De Baile';

  return (
    <section id="categories" className="py-12 md:py-16 bg-primary-dark/10">
      <div className="container mx-auto px-6 text-center">
        {/* Section Header */}
        <AnimateOnScroll>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-neutral holographic-text">
            {sectionTitle}
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={200}>
          <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12">{sectionDescription}</p>
        </AnimateOnScroll>

        {/* Cards Grid - Flexbox for centering incomplete rows */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {CATEGORIES.map((category, index) => (
            <AnimateOnScroll
              key={category.key}
              delay={index * 100}
              className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
            >
              <CategoryCard category={category} />
            </AnimateOnScroll>
          ))}
        </div>

        {/* CID-UNESCO Logo */}
        <AnimateOnScroll>
          <div className="flex flex-col items-center mt-16 gap-8">
            <CIDLogo />
            <Link
              to={`/${locale}/clases/baile-barcelona`}
              className="inline-block bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
            >
              {viewAllClassesText}
            </Link>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Schema Markup */}
      <CategoriesSchemaMarkup />
    </section>
  );
};

export default CategoriesSection;
