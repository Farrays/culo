import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';

const NotFoundPage: React.FC = () => {
  const { t, locale } = useI18n();

  return (
    <div className="min-h-screen bg-black text-neutral flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-extrabold text-primary-accent holographic-text mb-6">404</h1>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('notFound_title')}</h2>
        <p className="text-lg sm:text-xl text-neutral/90 mb-2">{t('notFound_subtitle')}</p>
        <p className="text-neutral/75 mb-12">{t('notFound_description')}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to={`/${locale}`}
            className="bg-primary-accent text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:bg-white hover:text-primary-accent shadow-md hover:shadow-accent-glow"
          >
            {t('notFound_backHome')}
          </Link>
          <Link
            to={`/${locale}/clases`}
            className="bg-transparent border-2 border-primary-accent text-primary-accent font-bold py-3 px-8 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
          >
            {t('notFound_classes')}
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap gap-6 justify-center text-neutral/75">
          <Link
            to={`/${locale}/clases/dancehall-barcelona`}
            className="hover:text-primary-accent transition-colors"
          >
            {t('notFound_dancehall')}
          </Link>
          <Link
            to={`/${locale}/clases/salsa-bachata-barcelona`}
            className="hover:text-primary-accent transition-colors"
          >
            {t('notFound_salsaBachata')}
          </Link>
          <Link
            to={`/${locale}/clases/danzas-urbanas-barcelona`}
            className="hover:text-primary-accent transition-colors"
          >
            {t('notFound_urbanDances')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
