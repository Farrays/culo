/**
 * Modern Jazz Page - Using FullDanceClassTemplate
 * Migrated from ~900 lines to ~15 lines
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { MODERN_JAZZ_PAGE_CONFIG } from '../constants/modern-jazz-config';

const ModernJazzPage: React.FC = () => {
  return <FullDanceClassTemplate config={MODERN_JAZZ_PAGE_CONFIG} />;
};

export default ModernJazzPage;
