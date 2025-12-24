import React from 'react';
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { CUERPO_FIT_PAGE_CONFIG } from '../constants/cuerpo-fit-config';

/**
 * Body Conditioning Page - Acondicionamiento Físico para Bailarines en Barcelona
 *
 * SEO Keywords:
 * - acondicionamiento físico para bailarines
 * - body conditioning barcelona
 * - preparación física danza
 * - entrenamiento funcional bailarines
 * - fuerza y flexibilidad para bailar
 *
 * Uses FullDanceClassTemplate with configuration from cuerpo-fit-config.ts
 */
const CuerpoFitPage: React.FC = () => {
  return <FullDanceClassTemplate config={CUERPO_FIT_PAGE_CONFIG} />;
};

export default CuerpoFitPage;
