/**
 * Contemporáneo Page - Using FullDanceClassTemplate
 * Migrated from ~900 lines to ~15 lines
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { CONTEMPORANEO_PAGE_CONFIG } from '../constants/contemporaneo-config';

const ContemporaneoPage: React.FC = () => {
  return <FullDanceClassTemplate config={CONTEMPORANEO_PAGE_CONFIG} />;
};

export default ContemporaneoPage;
