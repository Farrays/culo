import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useHLSVideo } from '../hooks/useHLSVideo';
import { HERO_VIDEO_CONFIG } from '../constants/hero-video-config';
import LeadCaptureModal from './shared/LeadCaptureModal';

const Hero: React.FC = () => {
  const { t } = useI18n();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const { videoRef, containerRef, isVideoPlaying, shouldShowVideo } = useHLSVideo({
    hlsUrl: HERO_VIDEO_CONFIG.hlsUrl,
    loadDelay: 150, // Wait for poster LCP
    respectReducedMotion: true,
    respectDataSaver: true,
  });

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-52 sm:pt-56 md:pt-56 lg:pt-44 xl:pt-48"
      aria-label="Hero section"
    >
      {/* Background with Video */}
      <div ref={containerRef} className="absolute inset-0 bg-black" aria-hidden="true">
        {/* Poster Image - Always rendered for LCP */}
        <img
          src={HERO_VIDEO_CONFIG.posterUrl}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isVideoPlaying ? 'opacity-0' : 'opacity-100'
          }`}
          fetchPriority="high"
          decoding="sync"
          loading="eager"
        />

        {/* Video - HLS streaming with lazy loading */}
        {shouldShowVideo && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isVideoPlaying ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />
        )}

        {/* Overlays for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black/20 to-black/40" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      <div className="relative z-10 text-center text-neutral px-4 sm:px-6">
        <h1
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-4 sm:mb-6 text-white"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
        >
          {t('heroTitle1')}
        </h1>
        <p
          className="text-xl sm:text-3xl md:text-4xl font-bold mb-4 text-white"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
        >
          {t('heroTitle2')}
        </p>
        <p className="text-xl md:text-2xl font-semibold text-neutral/90 mb-6 italic">
          {t('heroSubtitle')}
        </p>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-neutral/90 mb-8">
          {t('heroValue')}
        </p>

        {/* CTA Button */}
        <div className="flex flex-col items-center justify-center mb-10">
          <button
            onClick={() => setIsLeadModalOpen(true)}
            className="w-full sm:w-auto bg-primary-accent text-white font-bold text-sm xl:text-base py-2.5 xl:py-3 px-5 xl:px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
          >
            {t('puertasAbiertasCTA')}
            <svg
              className="w-4 h-4 ml-1.5 inline-block"
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
          </button>
          <p className="text-sm text-neutral/80 mt-3 text-center max-w-md">
            {t('puertasAbiertasSubtext')}
          </p>
        </div>

        {/* Trust Bar - Credibilidad instantánea (después del CTA) */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 max-w-4xl mx-auto">
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
            <span className="text-neutral/60 text-xs">(505+ reseñas)</span>
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
            <span className="text-neutral/80 text-xs">Socios Activos</span>
          </div>

          {/* Instalaciones */}
          <div className="flex items-center gap-2 bg-neutral/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-accent/30">
            <span className="text-primary-accent font-bold text-sm">700m²</span>
            <span className="text-neutral/80 text-xs">Instalaciones</span>
          </div>

          {/* Estilos */}
          <div className="flex items-center gap-2 bg-neutral/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-accent/30">
            <span className="text-primary-accent font-bold text-sm">+25</span>
            <span className="text-neutral/80 text-xs">Estilos</span>
          </div>

          {/* Años */}
          <div className="flex items-center gap-2 bg-neutral/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-accent/30">
            <span className="text-primary-accent font-bold text-sm">8 años</span>
            <span className="text-neutral/80 text-xs">en Barcelona</span>
          </div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </section>
  );
};

export default Hero;
