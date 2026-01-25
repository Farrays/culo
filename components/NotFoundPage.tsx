import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';

const NotFoundPage: React.FC = () => {
  const { t, locale } = useI18n();

  // Popular pages for quick navigation
  const popularPages = [
    { label: t('notFound_dancehall'), path: `/${locale}/clases/dancehall-barcelona` },
    { label: t('notFound_salsaBachata'), path: `/${locale}/clases/salsa-bachata-barcelona` },
    { label: t('notFound_urbanDances'), path: `/${locale}/clases/danzas-urbanas-barcelona` },
    { label: t('notFound_heels'), path: `/${locale}/clases/heels-barcelona` },
    { label: t('notFound_teachers'), path: `/${locale}/profesores-baile-barcelona` },
    { label: t('notFound_schedule'), path: `/${locale}/horarios-clases-baile` },
    { label: t('notFound_prices'), path: `/${locale}/precios-clases-baile` },
    { label: t('notFound_contact'), path: `/${locale}/contacto` },
  ];

  return (
    <>
      <Helmet>
        <title>{t('notFound_seo_title')}</title>
        <meta name="description" content={t('notFound_seo_description')} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-black text-neutral flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-4xl">
          {/* 404 Number with animation */}
          <div className="relative mb-8">
            <h1 className="text-[180px] sm:text-[220px] font-extrabold text-primary-accent holographic-text leading-none opacity-20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                  {t('notFound_title')}
                </h2>
                <p className="text-xl sm:text-2xl text-neutral/90 mb-2">{t('notFound_subtitle')}</p>
              </div>
            </div>
          </div>

          <p className="text-neutral/75 mb-12 text-lg max-w-2xl mx-auto">
            {t('notFound_description')}
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to={`/${locale}`}
              className="bg-primary-accent text-white font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-white hover:text-primary-accent shadow-lg hover:shadow-accent-glow transform hover:scale-105"
            >
              {t('notFound_backHome')}
            </Link>
            <Link
              to={`/${locale}/clases`}
              className="bg-transparent border-2 border-primary-accent text-primary-accent font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white transform hover:scale-105"
            >
              {t('notFound_classes')}
            </Link>
          </div>

          {/* Popular Pages Grid */}
          <div className="bg-gradient-to-b from-primary-dark/20 to-transparent p-8 rounded-2xl border border-primary-accent/10">
            <h3 className="text-xl font-bold text-white mb-6">{t('notFound_popularPages')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {popularPages.map((page, index) => (
                <Link
                  key={index}
                  to={page.path}
                  className="group bg-black/40 hover:bg-primary-accent/10 border border-neutral/10 hover:border-primary-accent/50 rounded-lg p-4 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="text-neutral/75 group-hover:text-primary-accent transition-colors text-sm font-medium block text-center">
                    {page.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <p className="mt-12 text-neutral/60 text-sm">
            {t('notFound_helpText')}{' '}
            <Link to={`/${locale}/contacto`} className="text-primary-accent hover:underline">
              {t('notFound_contactLink')}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
