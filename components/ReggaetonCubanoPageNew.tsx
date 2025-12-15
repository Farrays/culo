/**
 * Reggaeton Cubano Page - Using FullDanceClassTemplate
 * Migrated from ~900 lines to ~15 lines
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { REGGAETON_CUBANO_PAGE_CONFIG } from '../constants/reggaeton-cubano-config';

const ReggaetonCubanoPageNew: React.FC = () => {
  return <FullDanceClassTemplate config={REGGAETON_CUBANO_PAGE_CONFIG} />;
};

export default ReggaetonCubanoPageNew;
