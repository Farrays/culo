import React from 'react';
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { FULL_BODY_CARDIO_PAGE_CONFIG } from '../constants/full-body-cardio-config';

/**
 * Cuerpo Fit Page - Cardio Dance Fitness en Barcelona
 *
 * SEO Keywords:
 * - cuerpo fit barcelona
 * - entrenamiento full body barcelona
 * - cardio dance barcelona
 * - clases fitness barcelona
 * - quemar calorías bailando
 * - fitness dance barcelona
 * - ejercicios full body barcelona
 * - clases de cardio para principiantes barcelona
 * - perder peso bailando barcelona
 *
 * Uses FullDanceClassTemplate with configuration from full-body-cardio-config.ts
 */
const FullBodyCardioPage: React.FC = () => {
  return <FullDanceClassTemplate config={FULL_BODY_CARDIO_PAGE_CONFIG} />;
};

export default FullBodyCardioPage;
