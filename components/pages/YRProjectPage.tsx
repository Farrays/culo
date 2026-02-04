/**
 * YRProjectPage - Linktree-style page for Y&R (Yunaisy & Renier)
 *
 * Mobile-first, high-conversion design optimized for Instagram traffic.
 * No header/footer for clean, focused experience.
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
    label: 'Seguir en Instagram',
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
        group w-full flex items-center gap-4 px-6 py-4 rounded-2xl
        border transition-all duration-300
        [perspective:1000px] [transform-style:preserve-3d]
        hover:[transform:translateY(-4px)_rotateX(2deg)]
        hover:shadow-accent-glow
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black
        ${
          isPrimary
            ? 'bg-primary-accent border-primary-accent text-white animate-glow font-bold shadow-lg'
            : 'bg-black/50 backdrop-blur-md border-primary-dark/50 text-white hover:border-primary-accent/70 hover:bg-primary-dark/20'
        }
      `}
        aria-label={label}
      >
        <span className="w-8 h-8 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </span>
        <span className="flex-1 text-center font-semibold">{label}</span>
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
        <title>Y&R | Yunaisy & Renier - Artistas de Baile</title>
        <meta
          name="description"
          content="Contacta con Y&R (Yunaisy & Renier). Artistas de baile, shows y clases en Barcelona. WhatsApp e Instagram."
        />
        <meta name="robots" content="noindex, nofollow" />
        {/* OG Tags */}
        <meta property="og:title" content="Y&R | Yunaisy & Renier - Artistas de Baile" />
        <meta
          property="og:description"
          content="Contacta con Y&R. Artistas de baile, shows y clases en Barcelona."
        />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="/images/artists/yr-project/og.jpg" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Y&R | Yunaisy & Renier" />
        <meta
          name="twitter:description"
          content="Artistas de baile - Shows y clases en Barcelona"
        />
      </Helmet>

      <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          {/* Profile Section */}
          <AnimateOnScroll delay={0}>
            <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-6">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-accent to-primary-dark animate-pulse-strong opacity-60 blur-xl" />
              {/* Profile image */}
              <img
                src="/images/artists/yr-project/profile.webp"
                alt="Y&R | Yunaisy & Renier - Artistas de baile"
                className="relative w-full h-full rounded-full object-cover border-4 border-primary-accent/60 shadow-2xl"
                width={160}
                height={160}
                loading="eager"
              />
            </div>
          </AnimateOnScroll>

          {/* Name Section */}
          <AnimateOnScroll delay={100}>
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight holographic-text mb-2">
                Y&R
              </h1>
              <p className="text-lg sm:text-xl text-white/80 font-medium mb-1">Yunaisy & Renier</p>
              <p className="text-sm text-white/50">@yr.project</p>
            </div>
          </AnimateOnScroll>

          {/* Bio Section */}
          <AnimateOnScroll delay={150}>
            <p className="text-center text-white/70 text-sm sm:text-base mb-10 px-4">
              Artistas de baile urbano · Barcelona
            </p>
          </AnimateOnScroll>

          {/* Links Section */}
          <div className="space-y-4">
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
            <div className="mt-12 text-center">
              <p className="text-xs text-white/30">© {new Date().getFullYear()} Y&R Project</p>
            </div>
          </AnimateOnScroll>
        </div>
      </main>
    </>
  );
};

export default memo(YRProjectPage);
