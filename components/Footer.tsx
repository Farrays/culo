import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';

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
  return (
    <li>
      <a
        href={href || '#'}
        className="hover:text-primary-accent transition-colors duration-200 focus:outline-none focus:text-primary-accent focus:underline"
      >
        {t(textKey)}
      </a>
    </li>
  );
};

const Footer: React.FC = () => {
  const { t, locale } = useI18n();

  return (
    <footer
      className="bg-black border-t border-primary-dark/30 py-12"
      role="contentinfo"
      aria-label="Pie de página con información de contacto y enlaces"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-4">
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
                className="w-32 h-32 md:w-40 md:h-40 opacity-70"
              />
            </picture>
            <div className="flex space-x-4 mt-4">
              <SocialIcon
                href="https://www.facebook.com/farrayscenter/"
                ariaLabel={t('followOnFacebook')}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </SocialIcon>
              <SocialIcon
                href="https://www.instagram.com/farrays_centerbcn/"
                ariaLabel={t('followOnInstagram')}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.198-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"></path>
                </svg>
              </SocialIcon>
              <SocialIcon
                href="https://www.youtube.com/user/yunaisyfarray"
                ariaLabel={t('followOnYoutube')}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9.75 15.625v-7.25L15.469 12 9.75 15.625z"></path>
                </svg>
              </SocialIcon>
            </div>
          </div>
          <div className="text-neutral/90 space-y-2 text-sm">
            <h4 className="font-bold text-neutral text-lg mb-3">{t('footerContact')}</h4>
            <p>
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
              <strong>{t('footerPhone')}:</strong>{' '}
              <a
                href={`tel:${t('footerPhoneValue')}`}
                className="hover:text-primary-accent transition-colors"
              >
                {t('footerPhoneValue')}
              </a>
            </p>
            <p>
              <strong>{t('footerEmail')}:</strong>{' '}
              <a
                href={`mailto:${t('footerEmailValue')}`}
                className="hover:text-primary-accent transition-colors"
              >
                {t('footerEmailValue')}
              </a>
            </p>
            <div className="pt-2">
              <h5 className="font-bold text-neutral/90">{t('footerHoursTitle')}</h5>
              {t('footerHoursContent')
                .split('\n')
                .map((line, index) => (
                  <p key={index} className="text-neutral/70">
                    {line}
                  </p>
                ))}
            </div>
            <div className="pt-2">
              <h5 className="font-bold text-neutral/90">{t('footerPhoneHoursTitle')}</h5>
              <p className="text-neutral/70">{t('footerPhoneHoursContent')}</p>
            </div>
          </div>
          <div className="text-neutral/90">
            <h4 className="font-bold text-neutral text-lg mb-4">{t('footerSitemapTitle')}</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <ul className="space-y-2 text-sm">
                <FooterLink to={`/${locale}`} textKey="sitemapSchool" />
                <FooterLink to={`/${locale}/clases/baile-barcelona`} textKey="navClasses" />
                <FooterLink to={`/${locale}/clases/dancehall-barcelona`} textKey="navDancehall" />
                <FooterLink textKey="sitemapSocial" />
              </ul>
              <ul className="space-y-2 text-sm">
                <FooterLink textKey="sitemapFitness" />
                <FooterLink textKey="sitemapSchedule" />
                <FooterLink to={`/${locale}#faq`} textKey="sitemapFAQ" />
                <FooterLink to={`/${locale}/contacto`} textKey="sitemapContact" />
                <FooterLink href="https://www.cid-unesco.org" textKey="sitemapCID" />
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center text-neutral/50 text-xs mt-12 pt-8 border-t border-neutral/10">
          <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 mb-4">
            <a href="#" className="hover:text-primary-accent transition-colors">
              {t('sitemapLegal')}
            </a>
            <a href="#" className="hover:text-primary-accent transition-colors">
              {t('sitemapTerms')}
            </a>
            <a href="#" className="hover:text-primary-accent transition-colors">
              {t('sitemapPrivacy')}
            </a>
            <a href="#" className="hover:text-primary-accent transition-colors">
              {t('sitemapCookies')}
            </a>
          </div>
          {t('footerCopyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
