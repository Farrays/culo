/**
 * Salsa Cubana Page - Using FullDanceClassTemplate
 * Migrated from ~900 lines to ~15 lines
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { SALSA_CUBANA_PAGE_CONFIG } from '../constants/salsa-cubana-config';

const SalsaCubanaPageNew: React.FC = () => {
  return <FullDanceClassTemplate config={SALSA_CUBANA_PAGE_CONFIG} />;
};

export default SalsaCubanaPageNew;
