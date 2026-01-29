/**
 * OfferTestLanding - Landing de TEST para visualizar el componente OfferComparisonCard
 *
 * SOLO PARA TESTING - Eliminar despues de aprobar el diseno
 *
 * Acceder en: /es/offer-test
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OfferComparisonCard from '../OfferComparisonCard';
import {
  OFFER_COMPARISON,
  ACTIVE_OFFER,
  isComparisonOffer,
} from '../../../constants/offers-config';
import {
  THEME_ROSE,
  THEME_EMERALD,
  THEME_AMBER,
  THEME_VIOLET,
  THEME_CYAN,
} from '../../../constants/landing-themes';
import type { LandingThemeClasses } from '../../../constants/landing-themes';

// Temas disponibles para probar
const THEMES: { name: string; theme: LandingThemeClasses }[] = [
  { name: 'Rose (Dancehall)', theme: THEME_ROSE },
  { name: 'Emerald (Salsa)', theme: THEME_EMERALD },
  { name: 'Amber (Hip-Hop)', theme: THEME_AMBER },
  { name: 'Violet (Ballet)', theme: THEME_VIOLET },
  { name: 'Cyan (Contemporaneo)', theme: THEME_CYAN },
];

const OfferTestLanding: React.FC = () => {
  useTranslation(['pages', 'common']);
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<'single' | 'trialPack' | null>(null);

  // Default to first theme if index out of bounds
  const currentTheme = THEMES[selectedThemeIndex]?.theme ?? THEME_ROSE;

  const handleOfferSelect = (offerType: 'single' | 'trialPack') => {
    setSelectedOffer(offerType);
    // En produccion aqui abririas el modal
    window.alert(
      `Seleccionaste: ${offerType === 'single' ? '1 clase por 10€' : 'Pack 3 clases por 20€'}`
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white`}>
      {/* Header de control para testing */}
      <div className="bg-black/80 border-b border-white/10 p-4 sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-white">TEST: OfferComparisonCard</h1>
              <p className="text-xs text-neutral/60">
                Pagina de prueba para visualizar el componente de ofertas
              </p>
            </div>

            {/* Selector de tema */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-neutral/80">Tema:</label>
              <select
                value={selectedThemeIndex}
                onChange={e => setSelectedThemeIndex(Number(e.target.value))}
                className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
              >
                {THEMES.map((t, i) => (
                  <option key={i} value={i}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Hero simulado */}
        <div className="text-center mb-12">
          <span
            className={`inline-block ${currentTheme.bgPrimaryLight} ${currentTheme.textPrimary} text-xs font-bold px-4 py-1.5 rounded-full mb-4`}
          >
            CLASE DE PRUEBA
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 holographic-text">
            Clases de Dancehall en Barcelona
          </h1>
          <p className="text-neutral/70 text-lg max-w-2xl mx-auto">
            Descubre el autentico Dancehall jamaicano en Farray&apos;s International Dance Center
          </p>
        </div>

        {/* Video placeholder */}
        <div className="max-w-2xl mx-auto mb-12">
          <div
            className={`aspect-[9/16] sm:aspect-video bg-black/50 rounded-2xl border ${currentTheme.borderPrimary} flex items-center justify-center`}
          >
            <p className="text-neutral/40 text-sm">[Aqui iria el video de Bunny Stream]</p>
          </div>
        </div>

        {/* COMPONENTE A TESTEAR: OfferComparisonCard */}
        <div className="max-w-3xl mx-auto">
          {isComparisonOffer(OFFER_COMPARISON) && (
            <OfferComparisonCard
              offer={OFFER_COMPARISON}
              theme={currentTheme}
              styleName="Dancehall"
              onSelectOffer={handleOfferSelect}
            />
          )}
        </div>

        {/* Info de debug */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-black/50 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-3">Debug Info:</h3>
            <ul className="text-xs text-neutral/60 space-y-1">
              <li>
                <strong>ACTIVE_OFFER:</strong>{' '}
                {isComparisonOffer(ACTIVE_OFFER) ? 'COMPARISON' : ACTIVE_OFFER.type}
              </li>
              <li>
                <strong>Tema actual:</strong> {THEMES[selectedThemeIndex]?.name}
              </li>
              <li>
                <strong>Oferta seleccionada:</strong> {selectedOffer || 'Ninguna'}
              </li>
              <li>
                <strong>Recomendada:</strong> {OFFER_COMPARISON.recommended}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/50 border-t border-white/10 py-4 mt-12">
        <p className="text-center text-xs text-neutral/40">
          Esta es una pagina de TEST. No incluir en produccion.
        </p>
      </div>
    </div>
  );
};

export default OfferTestLanding;
