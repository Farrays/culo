/**
 * Twerk Page - Using FullDanceClassTemplate
 * Migrated from ~900 lines to ~15 lines
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { TWERK_PAGE_CONFIG } from '../constants/twerk-config';

const TwerkPage: React.FC = () => {
  return <FullDanceClassTemplate config={TWERK_PAGE_CONFIG} />;
};

export default TwerkPage;
