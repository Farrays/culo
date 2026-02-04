/**
 * YRProjectPage - Cinematic Linktree-style page for Y&R (Yunaisy & Reynier)
 *
 * Cuban International Dancers - Premium artistic design with hero image background.
 * Mobile-first, high-conversion design optimized for Instagram traffic.
 */

import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import AnimateOnScroll from '../AnimateOnScroll';
import { InstagramIcon, WhatsAppIcon } from '../../lib/icons';

// Link configuration
const LINKS = [
  {
    id: 'whatsapp',
    href: 'https://wa.me/34697692642?text=Hola%20Y%26R%2C%20quiero%20informaci%C3%B3n',
    label: 'Contactar por WhatsApp',
    icon: WhatsAppIcon,
    isPrimary: true,
  },
  {
    id: 'instagram',
    href: 'https://www.instagram.com/yr.project/',
    label: '@yr.project',
    icon: InstagramIcon,
    isPrimary: false,
  },
];

// Arrow icon for link buttons
const ArrowRightIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// Link button component
interface LinkButtonProps {
  href: string;
  icon: React.FC<{ className?: string }>;
  label: string;
  isPrimary?: boolean;
  delay: number;
}

const LinkButton: React.FC<LinkButtonProps> = memo(
  ({ href, icon: Icon, label, isPrimary = false, delay }) => (
    <AnimateOnScroll delay={delay}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`
        group w-full flex items-center gap-4 px-6 py-4 rounded-xl
        border transition-all duration-300
        hover:scale-[1.02] hover:shadow-2xl
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black
        ${
          isPrimary
            ? 'bg-white text-black border-white font-bold shadow-[0_0_30px_rgba(255,255,255,0.3)]'
            : 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/40'
        }
      `}
        aria-label={label}
      >
        <span className="w-8 h-8 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </span>
        <span className="flex-1 text-center font-semibold tracking-wide">{label}</span>
        <span className="w-6 h-6 flex items-center justify-center shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
          <ArrowRightIcon className="w-5 h-5" />
        </span>
      </a>
    </AnimateOnScroll>
  )
);

LinkButton.displayName = 'LinkButton';

const YRProjectPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Y&R | Yunaisy & Reynier - Cuban International Dancers</title>
        <meta
          name="description"
          content="Y&R - Yunaisy & Reynier. Cuban International Dancers. Shows, masterclasses & performances worldwide."
        />
        <meta name="robots" content="noindex, nofollow" />
        {/* OG Tags */}
        <meta property="og:title" content="Y&R | Yunaisy & Reynier" />
        <meta
          property="og:description"
          content="Cuban International Dancers. Shows, masterclasses & performances worldwide."
        />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="/images/artists/yr-project/hero.jpg" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Y&R | Yunaisy & Reynier" />
        <meta name="twitter:description" content="Cuban International Dancers" />
      </Helmet>

      <main className="relative min-h-screen overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <picture>
            <source srcSet="/images/artists/yr-project/hero.avif" type="image/avif" />
            <source srcSet="/images/artists/yr-project/hero.webp" type="image/webp" />
            <img
              src="/images/artists/yr-project/hero.jpeg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </picture>
          {/* Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
          {/* Vignette Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-end px-4 pb-8 sm:pb-12 pt-[50vh]">
          <div className="w-full max-w-md mx-auto">
            {/* Logo/Name Section */}
            <AnimateOnScroll delay={0}>
              <div className="text-center mb-8">
                {/* Main Title */}
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white mb-3 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                  <span
                    className="inline-block"
                    style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}
                  >
                    Y&R
                  </span>
                </h1>

                {/* Names */}
                <p className="text-xl sm:text-2xl text-white/90 font-light tracking-[0.2em] uppercase mb-4">
                  Yunaisy & Reynier
                </p>

                {/* Tagline */}
                <div className="flex items-center justify-center gap-3 text-white/60 text-sm tracking-widest uppercase">
                  <span className="w-8 h-px bg-white/40" />
                  <span>Cuban International Dancers</span>
                  <span className="w-8 h-px bg-white/40" />
                </div>
              </div>
            </AnimateOnScroll>

            {/* Links Section */}
            <div className="space-y-3 mb-8">
              {LINKS.map((link, index) => (
                <LinkButton
                  key={link.id}
                  href={link.href}
                  icon={link.icon}
                  label={link.label}
                  isPrimary={link.isPrimary}
                  delay={200 + index * 100}
                />
              ))}
            </div>

            {/* Footer */}
            <AnimateOnScroll delay={500}>
              <div className="text-center">
                <p className="text-xs text-white/30 tracking-wider">
                  © {new Date().getFullYear()} Y&R Project
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </main>
    </>
  );
};

export default memo(YRProjectPage);
