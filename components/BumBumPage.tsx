import React from 'react';
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { BUM_BUM_PAGE_CONFIG } from '../constants/bum-bum-config';

/**
 * Bum Bum Glúteos Maravillosos Page - Clases de Ejercicios de Glúteos en Barcelona
 *
 * SEO Keywords:
 * - ejercicios de glúteos
 * - ejercicios gluteos barcelona
 * - tonificar glúteos
 * - aumentar glúteos
 * - glúteos firmes
 * - hip thrust
 * - clases de glúteos barcelona
 * - entrenamiento glúteos
 * - fortalecer glúteos
 * - bum bum gluteos maravillosos
 *
 * Uses FullDanceClassTemplate with configuration from bum-bum-config.ts
 */
const BumBumPage: React.FC = () => {
  return <FullDanceClassTemplate config={BUM_BUM_PAGE_CONFIG} />;
};

export default BumBumPage;
