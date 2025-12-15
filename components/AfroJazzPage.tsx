/**
 * Afro Jazz Page - Using FullDanceClassTemplate
 * Migrated from ~900 lines to ~15 lines
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { AFRO_JAZZ_PAGE_CONFIG } from '../constants/afro-jazz-config';

const AfroJazzPage: React.FC = () => {
  return <FullDanceClassTemplate config={AFRO_JAZZ_PAGE_CONFIG} />;
};

export default AfroJazzPage;
