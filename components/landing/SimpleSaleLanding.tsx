/**
 * =============================================================================
 * SIMPLE SALE LANDING - Minimalista (2026 Style)
 * =============================================================================
 *
 * Landing de venta directa ULTRA-SIMPLE.
 *
 * Principio: Si no cabe en una frase, no está listo.
 * - Qué problema resuelves
 * - Para quién
 * - Qué debe hacer después
 *
 * Estructura:
 * 1. Hero: Problema + Promesa + CTA
 * 2. Prueba social mínima (confianza)
 * 3. Oferta clara (precio)
 * 4. CTA final
 *
 * Eso es todo. Sin distracciones.
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { StarIcon, CheckCircleIcon } from '../../lib/icons';
import type { LandingThemeClasses } from '../../constants/landing-themes';

// =============================================================================
// CONFIG TYPE - Súper simple
// =============================================================================

export interface SimpleSaleConfig {
  id: string;
  slug: string;

  // Tema
  theme: {
    classes: LandingThemeClasses;
  };

  // La frase central
  core: {
    /** El problema que resuelves (1 línea) */
    problem: string;
    /** Para quién es (1 línea) */
    audience: string;
    /** La promesa/solución (headline) */
    promise: string;
    /** Subheadline corto */
    subheadline: string;
  };

  // Imagen
  heroImage: string;
  heroImageAlt: string;

  // Oferta
  pricing: {
    firstMonth: number;
    normalPrice: number;
    savings: number;
  };

  // Social proof mínimo
  socialProof: {
    rating: number;
    reviewCount: number;
    studentCount: string;
  };

  // 3 beneficios máximo
  benefits: string[];

  // CTA
  ctaText: string;
  ctaUrl: string;

  // Garantía (1 línea)
  guarantee: string;

  // Contacto
  whatsapp: string;
}

interface SimpleSaleLandingProps {
  config: SimpleSaleConfig;
}

// =============================================================================
// COMPONENT
// =============================================================================

const SimpleSaleLanding: React.FC<SimpleSaleLandingProps> = ({ config }) => {
  useTranslation();
  const theme = config.theme.classes;
  const [isHovering, setIsHovering] = useState(false);

  const handleCTA = () => {
    window.open(config.ctaUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Helmet>
        <title>{config.core.promise} | Farray&apos;s Center</title>
        <meta name="description" content={config.core.subheadline} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="bg-black min-h-screen">
        {/* ============================================================= */}
        {/* HERO: Problema + Promesa + CTA (Above the fold - TODO aquí) */}
        {/* ============================================================= */}
        <section className="relative min-h-screen flex items-center">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src={config.heroImage}
              alt={config.heroImageAlt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 py-20">
            <div className="max-w-2xl">
              {/* Problema (pequeño, para contexto) */}
              <p className="text-neutral/60 text-sm md:text-base mb-4">{config.core.problem}</p>

              {/* Promesa (headline grande) */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral leading-tight mb-6">
                {config.core.promise}
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-neutral/80 mb-8">{config.core.subheadline}</p>

              {/* 3 Beneficios - bullets simples */}
              <div className="flex flex-col gap-3 mb-10">
                {config.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircleIcon className={`w-5 h-5 ${theme.textPrimary} flex-shrink-0`} />
                    <span className="text-neutral">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Precio + CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                {/* Precio */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl md:text-5xl font-black ${theme.textPrimary}`}>
                      {config.pricing.firstMonth}€
                    </span>
                    <span className="text-neutral/50 line-through text-xl">
                      {config.pricing.normalPrice}€
                    </span>
                  </div>
                  <p className="text-neutral/60 text-sm">
                    primer mes · luego {config.pricing.normalPrice}€/mes
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={handleCTA}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className={`
                    ${theme.bgPrimary} text-white font-bold text-lg
                    py-4 px-10 rounded-full
                    transition-all duration-300
                    ${isHovering ? 'scale-105 shadow-2xl' : ''}
                    ${theme.shadowPrimary}
                  `}
                >
                  {config.ctaText}
                </button>
              </div>

              {/* Garantía (1 línea) */}
              <p className="text-neutral/50 text-sm">{config.guarantee}</p>
            </div>
          </div>

          {/* Social proof flotante (esquina) */}
          <div className="absolute bottom-8 right-8 hidden md:block">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(config.socialProof.rating) ? theme.textPrimary : 'text-neutral/30'}`}
                  />
                ))}
                <span className="text-neutral font-bold ml-1">{config.socialProof.rating}</span>
              </div>
              <p className="text-neutral/60 text-xs">
                {config.socialProof.reviewCount}+ reseñas · {config.socialProof.studentCount}{' '}
                alumnos
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* SOCIAL PROOF MOBILE (solo móvil) */}
        {/* ============================================================= */}
        <section className="md:hidden py-6 bg-black border-y border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(config.socialProof.rating) ? theme.textPrimary : 'text-neutral/30'}`}
                  />
                ))}
                <span className="text-neutral font-bold ml-1">{config.socialProof.rating}</span>
              </div>
              <span className="text-neutral/40">·</span>
              <span className="text-neutral/60 text-sm">
                {config.socialProof.studentCount} alumnos
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* CTA FINAL (simple, sin distracciones) */}
        {/* ============================================================= */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral mb-6">
              ¿Listo/a para empezar?
            </h2>

            <button
              onClick={handleCTA}
              className={`
                ${theme.bgPrimary} text-white font-bold text-lg
                py-4 px-12 rounded-full
                transition-all duration-300 hover:scale-105
                ${theme.shadowPrimary} shadow-2xl
              `}
            >
              {config.ctaText}
            </button>

            <p className="text-neutral/50 text-sm mt-6">
              ¿Dudas?{' '}
              <a
                href={`https://wa.me/${config.whatsapp.replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme.textPrimary} hover:underline`}
              >
                Escríbenos por WhatsApp
              </a>
            </p>
          </div>
        </section>

        {/* Footer mínimo */}
        <footer className="py-4 border-t border-white/10">
          <p className="text-neutral/40 text-xs text-center">
            Farray&apos;s Center © {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </>
  );
};

export default SimpleSaleLanding;
