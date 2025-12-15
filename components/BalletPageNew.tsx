/**
 * Ballet Page - Using FullDanceClassTemplate
 * Migrated from ~900 lines to ~15 lines
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { BALLET_PAGE_CONFIG } from '../constants/ballet-config';

const BalletPageNew: React.FC = () => {
  return <FullDanceClassTemplate config={BALLET_PAGE_CONFIG} />;
};

export default BalletPageNew;
