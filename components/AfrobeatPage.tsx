/**
 * Afrobeat Page - Using FullDanceClassTemplate
 * Migrated from ~900 lines to ~15 lines
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { AFROBEAT_PAGE_CONFIG } from '../constants/afrobeat-config';

const AfrobeatPageNew: React.FC = () => {
  return <FullDanceClassTemplate config={AFROBEAT_PAGE_CONFIG} />;
};

export default AfrobeatPageNew;
