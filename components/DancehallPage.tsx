/**
 * Dancehall Page - Using FullDanceClassTemplate
 *
 * This page has been migrated from ~990 lines to ~15 lines using the shared template.
 * All configuration is centralized in constants/dancehall-config.ts
 *
 * Original file: DancehallPage.tsx (990 lines)
 * New file: DancehallPageNew.tsx (15 lines) - 98% reduction!
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { DANCEHALL_PAGE_CONFIG } from '../constants/dancehall-config';

const DancehallPageNew: React.FC = () => {
  return <FullDanceClassTemplate config={DANCEHALL_PAGE_CONFIG} />;
};

export default DancehallPageNew;
