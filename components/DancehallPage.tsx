/**
 * Dancehall Page - Using FullDanceClassTemplate
 *
 * Migrated from ~990 lines to ~15 lines using the shared template (98% reduction).
 * All configuration is centralized in constants/dancehall-config.ts
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { DANCEHALL_PAGE_CONFIG } from '../constants/dancehall-config';

const DancehallPage: React.FC = () => {
  return <FullDanceClassTemplate config={DANCEHALL_PAGE_CONFIG} />;
};

export default DancehallPage;
