/**
 * TrustBarHero - Credibility indicators section
 * Placed right after the Hero for instant social proof
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

const TrustBarHero: React.FC = () => {
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

  return (
    <section
      className="bg-black py-6 border-b border-primary-dark/30"
      aria-label={t('trustbar_ariaLabel')}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 max-w-5xl mx-auto">
          {/* Rating Google */}
          <div className="flex items-center gap-2 bg-neutral/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-accent/30">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-neutral font-bold text-sm">4.9/5</span>
            <span className="text-neutral/60 text-xs">(509+ {t('trustbar_reviews')})</span>
          </div>

          {/* CID-UNESCO */}
          <div className="flex items-center gap-2 bg-neutral/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-accent/30">
            <svg
              className="w-4 h-4 text-primary-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <span className="text-neutral text-sm font-medium">CID-UNESCO</span>
          </div>

          {/* Socios Activos */}
          <div className="flex items-center gap-2 bg-neutral/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-accent/30">
            <span className="text-primary-accent font-bold text-sm">1,500+</span>
            <span className="text-neutral/80 text-xs">{t('trustbar_members')}</span>
          </div>

          {/* Instalaciones */}
          <div className="flex items-center gap-2 bg-neutral/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-accent/30">
            <span className="text-primary-accent font-bold text-sm">700m²</span>
            <span className="text-neutral/80 text-xs">{t('trustbar_facilities')}</span>
          </div>

          {/* Estilos */}
          <div className="flex items-center gap-2 bg-neutral/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-accent/30">
            <span className="text-primary-accent font-bold text-sm">+25</span>
            <span className="text-neutral/80 text-xs">{t('trustbar_styles')}</span>
          </div>

          {/* Años */}
          <div className="flex items-center gap-2 bg-neutral/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-accent/30">
            <span className="text-primary-accent font-bold text-sm">8 {t('trustbar_years')}</span>
            <span className="text-neutral/80 text-xs">{t('trustbar_inBarcelona')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBarHero;
