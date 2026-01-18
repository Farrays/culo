import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import { CookieSettingsButton } from './shared/CookieBanner';

// Schema.org Organization for SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'DanceSchool',
  '@id': 'https://www.farrayscenter.com/#organization',
  name: "Farray's International Dance Center",
  alternateName: "Farray's Center",
  url: 'https://www.farrayscenter.com',
  logo: 'https://www.farrayscenter.com/images/logo/img/logo-fidc_512.png',
  image: 'https://www.farrayscenter.com/images/logo/img/logo-fidc_512.png',
  description:
    'Academia de baile de élite en Barcelona, dirigida por Yunaisy Farray. Clases de Dancehall, Twerk, Salsa, Bachata y más de 25 estilos.',
  telephone: '+34622247085',
  email: 'info@farrayscenter.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Carrer d'Entença, 100, Local 1",
    addressLocality: 'Barcelona',
    postalCode: '08015',
    addressRegion: 'Cataluña',
    addressCountry: 'ES',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.380421,
    longitude: 2.148014,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday'],
      opens: '10:30',
      closes: '12:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday'],
      opens: '17:30',
      closes: '23:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday'],
      opens: '10:30',
      closes: '13:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday'],
      opens: '17:30',
      closes: '23:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Wednesday', 'Thursday', 'Friday'],
      opens: '17:30',
      closes: '23:00',
    },
  ],
  sameAs: [
    'https://www.instagram.com/farrays_centerbcn/',
    'https://www.tiktok.com/@farrays_centerbcn',
    'https://www.facebook.com/farrayscenter/',
    'https://www.youtube.com/@farraysinternationaldance',
  ],
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Credit Card',
  areaServed: {
    '@type': 'City',
    name: 'Barcelona',
  },
  founder: {
    '@type': 'Person',
    name: 'Yunaisy Farray',
    jobTitle: 'Directora y Fundadora',
  },
  memberOf: {
    '@type': 'Organization',
    name: 'CID-UNESCO',
    url: 'https://cid-world.org/',
  },
};

const SocialIcon: React.FC<{ href: string; ariaLabel: string; children: React.ReactNode }> = ({
  href,
  ariaLabel,
  children,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-neutral/75 hover:text-primary-accent transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-accent/50 rounded-lg p-1"
    aria-label={ariaLabel}
  >
    {children}
  </a>
);

const FooterLink: React.FC<{ to?: string; href?: string; textKey: string }> = ({
  to,
  href,
  textKey,
}) => {
  const { t } = useI18n();
  if (to) {
    return (
      <li>
        <Link
          to={to}
          className="hover:text-primary-accent transition-colors duration-200 focus:outline-none focus:text-primary-accent focus:underline"
        >
          {t(textKey)}
        </Link>
      </li>
    );
  }
  if (href) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary-accent transition-colors duration-200 focus:outline-none focus:text-primary-accent focus:underline"
        >
          {t(textKey)}
        </a>
      </li>
    );
  }
  return null;
};

const FooterSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="text-neutral/90">
    <h4 className="font-bold text-neutral text-base mb-4">{title}</h4>
    <ul className="space-y-2 text-sm">{children}</ul>
  </div>
);

// Google Maps URL
const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/Farray%E2%80%99s+International+Dance+Center/@41.380421,2.148014,17z';

const Footer: React.FC = () => {
  const { t, locale } = useI18n();

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      </Helmet>
      <footer
        className="bg-black border-t border-primary-dark/30 py-12"
        role="contentinfo"
        aria-label="Pie de página con información de contacto y enlaces"
      >
        <div className="container mx-auto px-6">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 xl:gap-6 text-center sm:text-left">
            {/* Logo & Social Media */}
            <div className="sm:col-span-2 lg:col-span-1 flex flex-col items-center sm:items-start space-y-4">
              <Link to={`/${locale}`}>
                <picture>
                  <source
                    type="image/webp"
                    srcSet="/images/logo/img/logo-fidc_256.webp 1x, /images/logo/img/logo-fidc_512.webp 2x"
                  />
                  <img
                    src="/images/logo/img/logo-fidc_256.png"
                    srcSet="/images/logo/img/logo-fidc_256.png 1x, /images/logo/img/logo-fidc_512.png 2x"
                    alt="Farray's International Dance Center"
                    width="256"
                    height="256"
                    loading="lazy"
                    className="w-40 h-40 sm:w-44 sm:h-44 md:w-44 md:h-44 lg:w-28 lg:h-28 xl:w-32 xl:h-32 opacity-70 hover:opacity-100 transition-opacity"
                  />
                </picture>
              </Link>
              <div className="flex space-x-3 mt-2">
                <SocialIcon
                  href="https://www.instagram.com/farrays_centerbcn/"
                  ariaLabel={t('followOnInstagram')}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.198-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
                  </svg>
                </SocialIcon>
                <SocialIcon
                  href="https://www.tiktok.com/@farrays_centerbcn"
                  ariaLabel={t('followOnTikTok')}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </SocialIcon>
                <SocialIcon
                  href="https://www.facebook.com/farrayscenter/"
                  ariaLabel={t('followOnFacebook')}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </SocialIcon>
                <SocialIcon
                  href="https://www.youtube.com/@farraysinternationaldance"
                  ariaLabel={t('followOnYoutube')}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9.75 15.625v-7.25L15.469 12 9.75 15.625z" />
                  </svg>
                </SocialIcon>
              </div>
              {/* CID-UNESCO Badge */}
              <a
                href="https://cid-world.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral/70 hover:text-primary-accent transition-colors mt-2"
              >
                {t('sitemapCID')}
              </a>
            </div>

            {/* Contact */}
            <div className="text-neutral/90 space-y-2 text-sm">
              <h4 className="font-bold text-neutral text-base mb-3">{t('footerContact')}</h4>
              <p className="text-neutral/70">
                {t('footerAddressValue')
                  .split('\n')
                  .map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
              </p>
              <p>
                <a
                  href={`tel:${t('footerPhoneValue')}`}
                  className="hover:text-primary-accent transition-colors"
                >
                  {t('footerPhoneValue')}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${t('footerEmailValue')}`}
                  className="hover:text-primary-accent transition-colors"
                >
                  {t('footerEmailValue')}
                </a>
              </p>
              {/* Google Maps Link */}
              <p className="pt-2">
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary-accent hover:text-primary-accent/80 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {t('footerViewMap')}
                </a>
              </p>
              <div className="pt-2">
                <p className="font-semibold text-neutral/80">{t('footerHoursTitle')}</p>
                <p className="text-neutral/60 text-xs">{t('footerPhoneHoursContent')}</p>
              </div>
            </div>

            {/* La Escuela */}
            <FooterSection title={t('footerSchoolTitle')}>
              <FooterLink to={`/${locale}/sobre-nosotros`} textKey="sitemapAbout" />
              <FooterLink
                to={`/${locale}/profesores-baile-barcelona`}
                textKey="sitemapProfesores"
              />
              <FooterLink
                to={`/${locale}/instalaciones-escuela-baile-barcelona`}
                textKey="sitemapInstalaciones"
              />
              <FooterLink to={`/${locale}/yunaisy-farray`} textKey="sitemapYunaisy" />
              <FooterLink to={`/${locale}/blog`} textKey="sitemapBlog" />
            </FooterSection>

            {/* Danzas Urbanas */}
            <FooterSection title={t('footerUrbanTitle')}>
              <FooterLink to={`/${locale}/clases/dancehall-barcelona`} textKey="sitemapDancehall" />
              <FooterLink to={`/${locale}/clases/twerk-barcelona`} textKey="sitemapTwerk" />
              <FooterLink
                to={`/${locale}/clases/hip-hop-reggaeton-barcelona`}
                textKey="sitemapHipHop"
              />
              <FooterLink to={`/${locale}/clases/afrobeats-barcelona`} textKey="sitemapAfrobeat" />
              <FooterLink to={`/${locale}/clases/heels-barcelona`} textKey="sitemapHeels" />
            </FooterSection>

            {/* Ritmos Latinos */}
            <FooterSection title={t('footerLatinoTitle')}>
              <FooterLink to={`/${locale}/clases/salsa-bachata-barcelona`} textKey="sitemapSalsa" />
              <FooterLink to={`/${locale}/clases/bachata-barcelona`} textKey="sitemapBachata" />
              <FooterLink
                to={`/${locale}/clases/salsa-cubana-barcelona`}
                textKey="sitemapSalsaCubana"
              />
              <FooterLink to={`/${locale}/clases/folklore-cubano`} textKey="sitemapFolklore" />
              <FooterLink to={`/${locale}/clases/timba-barcelona`} textKey="sitemapTimba" />
            </FooterSection>

            {/* Servicios */}
            <FooterSection title={t('footerServicesTitle')}>
              <FooterLink
                to={`/${locale}/horarios-clases-baile-barcelona`}
                textKey="sitemapHorarios"
              />
              <FooterLink
                to={`/${locale}/precios-clases-baile-barcelona`}
                textKey="sitemapPrecios"
              />
              <FooterLink
                to={`/${locale}/clases-particulares-baile`}
                textKey="sitemapParticulares"
              />
              <FooterLink
                to={`/${locale}/alquiler-salas-baile-barcelona`}
                textKey="sitemapAlquiler"
              />
              <FooterLink to={`/${locale}/regala-baile`} textKey="sitemapRegala" />
              <FooterLink to={`/${locale}/preguntas-frecuentes`} textKey="sitemapFAQ" />
            </FooterSection>
          </div>

          {/* Legal Links & Copyright */}
          <div className="text-center text-neutral/70 text-xs mt-12 pt-8 border-t border-neutral/10">
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 mb-4">
              <Link
                to={`/${locale}/aviso-legal`}
                className="hover:text-primary-accent transition-colors"
              >
                {t('sitemapLegal')}
              </Link>
              <Link
                to={`/${locale}/terminos-y-condiciones`}
                className="hover:text-primary-accent transition-colors"
              >
                {t('sitemapTerms')}
              </Link>
              <Link
                to={`/${locale}/politica-privacidad`}
                className="hover:text-primary-accent transition-colors"
              >
                {t('sitemapPrivacy')}
              </Link>
              <Link
                to={`/${locale}/politica-cookies`}
                className="hover:text-primary-accent transition-colors"
              >
                {t('sitemapCookies')}
              </Link>
              <CookieSettingsButton />
            </div>
            {t('footerCopyright')}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
