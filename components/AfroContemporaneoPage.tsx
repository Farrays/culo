/**
 * Afro Contemporáneo Page - Using FullDanceClassTemplate
 * Migrated from ~900 lines to ~15 lines
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { AFRO_CONTEMPORANEO_PAGE_CONFIG } from '../constants/afro-contemporaneo-config';

const AfroContemporaneoPageNew: React.FC = () => {
  return <FullDanceClassTemplate config={AFRO_CONTEMPORANEO_PAGE_CONFIG} />;
};

export default AfroContemporaneoPageNew;
