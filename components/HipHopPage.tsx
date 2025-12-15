/**
 * Hip Hop Page - Using FullDanceClassTemplate
 * Migrated from ~900 lines to ~15 lines
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { HIPHOP_PAGE_CONFIG } from '../constants/hip-hop-config';

const HipHopPage: React.FC = () => {
  return <FullDanceClassTemplate config={HIPHOP_PAGE_CONFIG} />;
};

export default HipHopPage;
