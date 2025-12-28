import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../../hooks/useI18n';
import { CATEGORIES } from '../../constants/categories';

// CategoriesSchemaMarkup Component
// Injects ItemList Schema for SEO (verified: no Organization Schema exists in home)
// Uses react-helmet-async to inject into <head>

const CategoriesSchemaMarkup: React.FC = () => {
  const { t } = useI18n();
  const siteUrl = 'https://www.farrayscenter.com';

  // Schema Strategy (verified in section 0.3):
  // - Organization Schema: DOES NOT EXIST in page (verified)
  // - ItemList Schema: ADDED HERE (6 dance categories)

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Clases de Baile en Barcelona',
    description: 'Categorías de clases de baile disponibles en Farrays Dance Academy',
    numberOfItems: CATEGORIES.length,
    itemListElement: CATEGORIES.map((category, index) => {
      const title = t(`home_categories_${category.key}_title`) || category.key;
      const intro = t(`home_categories_${category.key}_intro`) || '';

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Course',
          '@id': `${siteUrl}${category.pillarSlug}`,
          name: title,
          description: intro,
          url: `${siteUrl}${category.pillarSlug}`,
          provider: {
            '@type': 'Organization',
            name: "Farray's Dance Academy",
            url: siteUrl,
          },
        },
      };
    }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};

export default CategoriesSchemaMarkup;
