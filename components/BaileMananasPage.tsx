import React from 'react';
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { BAILE_MANANAS_PAGE_CONFIG } from '../constants/baile-mananas-config';

/**
 * Clases de Baile por las Mañanas en Barcelona
 *
 * Landing page for morning dance classes (10:00-13:00)
 * Aggregates multiple dance styles available in the morning schedule.
 *
 * SEO Keywords:
 * - clases de baile por las mañanas en barcelona
 * - clases baile mañanas barcelona
 * - escuela baile horario mañana
 * - academia baile turnos mañana
 * - baile matinal barcelona
 *
 * Uses FullDanceClassTemplate with configuration from baile-mananas-config.ts
 */
const BaileMananasPage: React.FC = () => {
  return <FullDanceClassTemplate config={BAILE_MANANAS_PAGE_CONFIG} />;
};

export default BaileMananasPage;
