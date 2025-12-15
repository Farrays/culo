/**
 * Salsa Lady Style Page - Using FullDanceClassTemplate
 *
 * Migrated from 967 lines to ~15 lines using the unified template.
 * All configuration is in constants/salsa-lady-style-config.ts
 */
import React from 'react';
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { SALSA_LADY_STYLE_PAGE_CONFIG } from '../constants/salsa-lady-style-config';

const SalsaLadyStylePage: React.FC = () => {
  return <FullDanceClassTemplate config={SALSA_LADY_STYLE_PAGE_CONFIG} />;
};

export default SalsaLadyStylePage;
