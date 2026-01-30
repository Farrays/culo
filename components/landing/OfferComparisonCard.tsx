/**
 * OfferComparisonCard - Muestra dos opciones de prueba lado a lado
 *
 * Presenta las opciones de forma clara para facilitar la decision del usuario
 * sin usar tacticas de bait-and-switch.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, ClockIcon, FireIcon, SparklesIcon } from '../../lib/icons';
import type { ComparisonOffer, SingleOffer } from '../../constants/offers-config';
import { calculateSavings } from '../../constants/offers-config';
import type { LandingThemeClasses } from '../../constants/landing-themes';

interface OfferComparisonCardProps {
  offer: ComparisonOffer;
  theme: LandingThemeClasses;
  styleName: string;
  onSelectOffer: (offerType: 'single' | 'trialPack') => void;
}

const OfferComparisonCard: React.FC<OfferComparisonCardProps> = ({
  offer,
  theme,
  styleName,
  onSelectOffer,
}) => {
  const { t } = useTranslation(['pages', 'common']);

  const renderOfferCard = (
    offerData: SingleOffer,
    type: 'single' | 'trialPack',
    isRecommended: boolean
  ) => {
    const savings = calculateSavings(offerData);

    return (
      <div
        className={`relative flex flex-col h-full p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
          isRecommended
            ? `${theme.bgPrimaryLight} ${theme.borderPrimary} shadow-2xl ring-2 ${theme.ringPrimary}`
            : 'bg-black/40 border-white/20 hover:border-white/30 shadow-lg'
        }`}
      >
        {/* Badge recomendado */}
        {isRecommended && (
          <div
            className={`absolute -top-3.5 left-1/2 -translate-x-1/2 ${theme.bgPrimary} text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg`}
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            {t('offer_recommended_badge', { defaultValue: 'RECOMENDADO' })}
          </div>
        )}

        {/* Precio */}
        <div className="text-center mb-5 pt-2">
          <div className="text-neutral/50 text-sm line-through mb-1">
            {offerData.originalValue}€
          </div>
          <div
            className={`text-5xl sm:text-6xl font-black ${isRecommended ? theme.textPrimary : 'text-neutral'}`}
          >
            {offerData.price}€
          </div>
          {savings > 0 && (
            <div
              className={`inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-xs font-bold ${theme.bgPrimaryLight} ${theme.textPrimary}`}
            >
              {t('offer_save_percent', {
                percent: savings,
                defaultValue: `Ahorras ${savings}%`,
              })}
            </div>
          )}
        </div>

        {/* Titulo y descripcion */}
        <h3 className="text-lg sm:text-xl font-black text-neutral text-center mb-2">
          {t(offerData.translations.titleKey, { defaultValue: offerData.translations.titleKey })}
        </h3>
        <p className="text-neutral/60 text-sm text-center mb-5">
          {t(offerData.translations.descriptionKey, {
            styleName,
            defaultValue: offerData.translations.descriptionKey,
          })}
        </p>

        {/* Beneficios - flex-grow para igualar altura de tarjetas */}
        <ul className="space-y-2.5 mb-5 flex-grow">
          {offerData.translations.benefitsKeys.map((key, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-neutral/80">
              <CheckCircleIcon className={`w-5 h-5 ${theme.textPrimary} flex-shrink-0 mt-0.5`} />
              <span>{t(key, { styleName, defaultValue: key })}</span>
            </li>
          ))}
        </ul>

        {/* Info de validez (solo para trial-pack) */}
        {offerData.validityDays && (
          <div className="flex items-center justify-center gap-2 mb-5 text-sm text-neutral/50">
            <ClockIcon className="w-4 h-4" />
            <span>
              {t('offer_validity_days', {
                days: offerData.validityDays,
                defaultValue: `${offerData.validityDays} dias para usarlas`,
              })}
            </span>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={() => onSelectOffer(type)}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-base transition-all duration-300 ${
            isRecommended
              ? `${theme.bgPrimary} text-white hover:scale-[1.02] shadow-lg ${theme.shadowPrimary}`
              : `bg-white/10 text-neutral hover:bg-white/20 border border-white/20`
          }`}
        >
          {t(offerData.translations.ctaKey, { defaultValue: offerData.translations.ctaKey })}
        </button>

        {/* Oferta especial al inscribirse */}
        {offerData.enrollmentOffer && (
          <div
            className={`mt-5 p-4 rounded-xl ${theme.bgPrimaryLight} border ${theme.borderPrimaryLight}`}
          >
            <div className="flex items-start gap-3">
              <FireIcon className={`w-5 h-5 ${theme.textPrimary} flex-shrink-0 mt-0.5`} />
              <div>
                <p className={`text-sm font-bold ${theme.textPrimary}`}>
                  {t(offerData.enrollmentOffer.conditionKey, {
                    defaultValue: offerData.enrollmentOffer.conditionKey,
                  })}
                </p>
                <p className="text-sm text-neutral/70 mt-1">
                  {t(offerData.enrollmentOffer.benefitKey, {
                    defaultValue: offerData.enrollmentOffer.benefitKey,
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-neutral mb-3 holographic-text">
          {t(offer.translations.sectionTitleKey, {
            defaultValue: 'Elige tu experiencia de prueba',
          })}
        </h2>
        <p className="text-neutral/60 text-base">
          {t(offer.translations.sectionSubtitleKey, {
            defaultValue: 'Dos opciones sin compromiso para conocernos',
          })}
        </p>
      </div>

      {/* Comparison Cards - Mobile: recomendado primero */}
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-5 sm:gap-6">
        {/* En movil mostramos el recomendado primero */}
        <div className="sm:hidden">
          {renderOfferCard(offer.options.trialPack, 'trialPack', offer.recommended === 'trialPack')}
        </div>
        <div className="sm:hidden">
          {renderOfferCard(offer.options.single, 'single', offer.recommended === 'single')}
        </div>

        {/* En desktop mostramos en orden normal - flex-1 para igual ancho */}
        <div className="hidden sm:flex sm:flex-1">
          {renderOfferCard(offer.options.single, 'single', offer.recommended === 'single')}
        </div>
        <div className="hidden sm:flex sm:flex-1">
          {renderOfferCard(offer.options.trialPack, 'trialPack', offer.recommended === 'trialPack')}
        </div>
      </div>

      {/* Help text */}
      <p className="text-center text-neutral/40 text-sm mt-6">
        {t(offer.translations.comparisonHelpKey, {
          defaultValue: 'Ambas opciones incluyen todo lo necesario para tu primera experiencia',
        })}
      </p>

      {/* Disclaimer residentes */}
      <p className="text-center text-neutral/30 text-xs mt-3">
        {t('offer_residents_only', {
          defaultValue: 'Promoción válida solo para residentes',
        })}
      </p>
    </div>
  );
};

export default OfferComparisonCard;
