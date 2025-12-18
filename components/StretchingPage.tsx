import React from 'react';
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { STRETCHING_PAGE_CONFIG } from '../constants/stretching-config';

/**
 * Stretching Page - Clases de Stretching y Estiramientos en Barcelona
 *
 * SEO Keywords:
 * - stretching en barcelona
 * - estiramientos en barcelona
 * - clases de estiramientos
 * - clases de estiramientos en barcelona
 * - flexi
 * - flexibilidad
 * - backbending
 *
 * Uses FullDanceClassTemplate with configuration from stretching-config.ts
 */
const StretchingPage: React.FC = () => {
  return <FullDanceClassTemplate config={STRETCHING_PAGE_CONFIG} />;
};

export default StretchingPage;
