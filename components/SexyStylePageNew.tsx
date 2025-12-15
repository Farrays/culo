/**
 * Sexy Style Page - Using FullDanceClassTemplate
 * Migrated from ~900 lines to ~15 lines
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { SEXY_STYLE_PAGE_CONFIG } from '../constants/sexy-style-config';

const SexyStylePageNew: React.FC = () => {
  return <FullDanceClassTemplate config={SEXY_STYLE_PAGE_CONFIG} />;
};

export default SexyStylePageNew;
