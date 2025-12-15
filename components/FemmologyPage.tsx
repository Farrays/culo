/**
 * Femmology Page - Using FullDanceClassTemplate
 * Migrated from ~900 lines to ~15 lines
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { FEMMOLOGY_PAGE_CONFIG } from '../constants/femmology-config';

const FemmologyPageNew: React.FC = () => {
  return <FullDanceClassTemplate config={FEMMOLOGY_PAGE_CONFIG} />;
};

export default FemmologyPageNew;
