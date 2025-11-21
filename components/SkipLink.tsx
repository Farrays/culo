import React from 'react';
import { useI18n } from '../hooks/useI18n';

const SkipLink: React.FC = () => {
  const { t } = useI18n();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary-accent focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-accent/50 focus:font-bold"
    >
      {t('skipToMainContent') || 'Skip to main content'}
    </a>
  );
};

export default SkipLink;
