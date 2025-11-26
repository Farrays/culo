import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';

interface Product {
  id: number;
  name: { es: string; en: string; ca: string; fr: string };
  description: { es: string; en: string; ca: string; fr: string };
  price: string;
  image: string;
  category: 'clothing' | 'accessories' | 'bags';
}

const products: Product[] = [
  {
    id: 1,
    name: {
      es: 'Camiseta FIDC Logo',
      en: 'FIDC Logo T-Shirt',
      ca: 'Samarreta FIDC Logo',
      fr: 'T-Shirt Logo FIDC',
    },
    description: {
      es: "Camiseta de algodón 100% con el logo de Farray's International Dance Center",
      en: "100% cotton t-shirt with Farray's International Dance Center logo",
      ca: "Samarreta de cotó 100% amb el logo de Farray's International Dance Center",
      fr: "T-shirt en coton 100% avec le logo Farray's International Dance Center",
    },
    price: '€25',
    image: '/images/merchandising/tshirt-placeholder.jpg',
    category: 'clothing',
  },
  {
    id: 2,
    name: {
      es: 'Sudadera con Capucha FIDC',
      en: 'FIDC Hoodie',
      ca: 'Dessuadora amb Caputxa FIDC',
      fr: 'Sweat à Capuche FIDC',
    },
    description: {
      es: 'Sudadera premium con capucha y logo bordado',
      en: 'Premium hoodie with embroidered logo',
      ca: 'Dessuadora premium amb caputxa i logo brodat',
      fr: 'Sweat premium avec logo brodé',
    },
    price: '€45',
    image: '/images/merchandising/hoodie-placeholder.jpg',
    category: 'clothing',
  },
  {
    id: 3,
    name: {
      es: 'Bolsa de Deporte FIDC',
      en: 'FIDC Sport Bag',
      ca: "Bossa d'Esport FIDC",
      fr: 'Sac de Sport FIDC',
    },
    description: {
      es: 'Bolsa espaciosa perfecta para tus clases de baile',
      en: 'Spacious bag perfect for your dance classes',
      ca: 'Bossa espaiosa perfecta per les teves classes de ball',
      fr: 'Sac spacieux parfait pour vos cours de danse',
    },
    price: '€35',
    image: '/images/merchandising/bag-placeholder.jpg',
    category: 'bags',
  },
  {
    id: 4,
    name: {
      es: 'Gorra FIDC',
      en: 'FIDC Cap',
      ca: 'Gorra FIDC',
      fr: 'Casquette FIDC',
    },
    description: {
      es: 'Gorra ajustable con logo bordado',
      en: 'Adjustable cap with embroidered logo',
      ca: 'Gorra ajustable amb logo brodat',
      fr: 'Casquette ajustable avec logo brodé',
    },
    price: '€20',
    image: '/images/merchandising/cap-placeholder.jpg',
    category: 'accessories',
  },
  {
    id: 5,
    name: {
      es: 'Botella de Agua FIDC',
      en: 'FIDC Water Bottle',
      ca: "Ampolla d'Aigua FIDC",
      fr: "Bouteille d'Eau FIDC",
    },
    description: {
      es: 'Botella térmica de acero inoxidable 500ml',
      en: 'Stainless steel thermal bottle 500ml',
      ca: "Ampolla tèrmica d'acer inoxidable 500ml",
      fr: 'Bouteille thermique en acier inoxydable 500ml',
    },
    price: '€18',
    image: '/images/merchandising/bottle-placeholder.jpg',
    category: 'accessories',
  },
  {
    id: 6,
    name: {
      es: 'Toalla de Baile FIDC',
      en: 'FIDC Dance Towel',
      ca: 'Tovallola de Ball FIDC',
      fr: 'Serviette de Danse FIDC',
    },
    description: {
      es: 'Toalla de microfibra absorbente con logo',
      en: 'Absorbent microfiber towel with logo',
      ca: 'Tovallola de microfibra absorbent amb logo',
      fr: 'Serviette microfibre absorbante avec logo',
    },
    price: '€15',
    image: '/images/merchandising/towel-placeholder.jpg',
    category: 'accessories',
  },
];

const MerchandisingPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('navHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('breadcrumb_services'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('headerMerchandising'),
        item: `${baseUrl}/${locale}/merchandising`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('navHome'), url: `/${locale}` },
    { name: t('breadcrumb_services'), url: `/${locale}` },
    { name: t('headerMerchandising'), url: `/${locale}/merchandising`, isActive: true },
  ];

  return (
    <>
      <Helmet>
        <title>{t('merchandising_page_title')} | Farray&apos;s Center</title>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <meta name="description" content={t('merchandising_page_description')} />
        <link rel="canonical" href={`${baseUrl}/${locale}/merchandising`} />
        <meta
          property="og:title"
          content={`${t('merchandising_page_title')} | Farray&apos;s Center`}
        />
        <meta property="og:description" content={t('merchandising_page_description')} />
        <meta property="og:url" content={`${baseUrl}/${locale}/merchandising`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section
          id="merchandising-hero"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            {/* H1 + Intro */}
            <AnimateOnScroll>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text">
                {t('merchandising_hero_title')}
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                {t('merchandising_hero_subtitle')}
              </p>
            </AnimateOnScroll>

            {/* CTA Buttons */}
            <AnimateOnScroll delay={200}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}/contacto`}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('merchandising_contact_us')}
                  <svg
                    className="w-5 h-5 ml-2"
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
                <Link
                  to={`/${locale}#enroll`}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                >
                  {t('heroCTA1')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('merchandising_products_title')}
                </h2>
                <p className="text-lg text-neutral/90 max-w-3xl mx-auto">
                  {t('merchandising_products_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {products.map((product, index) => (
                <AnimateOnScroll key={product.id} delay={index * 100}>
                  <div className="flex flex-col h-full bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-2">
                    {/* Product Image */}
                    <div className="relative w-full h-64 bg-gradient-to-br from-primary-dark/30 to-black overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl opacity-20">🎨</div>
                      </div>
                      {/* Placeholder for actual product image */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <span className="text-xs text-primary-accent font-bold uppercase tracking-wider">
                          {t(`merchandising_category_${product.category}`)}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col flex-grow p-6">
                      <h3 className="text-2xl font-bold text-neutral mb-3">
                        {product.name[locale]}
                      </h3>
                      <p className="text-neutral/90 mb-4 flex-grow">
                        {product.description[locale]}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-primary-dark/30">
                        <span className="text-3xl font-black text-primary-accent">
                          {product.price}
                        </span>
                        <button className="px-6 py-2 bg-primary-accent text-white font-semibold rounded-full transition-all duration-300 hover:bg-primary-accent/90 hover:shadow-accent-glow">
                          {t('merchandising_add_to_cart')}
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section - Conversion Optimized */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background with stars */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text">
                  {t('merchandising_info_title')}
                </h2>
                <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-4">
                  {t('merchandising_info_text')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}/contacto`}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('merchandising_contact_us')}
                  <svg
                    className="w-5 h-5 ml-2"
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
                <Link
                  to={`/${locale}#enroll`}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                >
                  {t('heroCTA1')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default MerchandisingPage;
