/**
 * Folklore Cubano Page - Using FullDanceClassTemplate
 *
 * Page for Cuban Folklore classes focusing on Afro-Cuban dances to the Orishas.
 * All configuration is centralized in constants/folklore-cubano-config.ts
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { FOLKLORE_CUBANO_PAGE_CONFIG } from '../constants/folklore-cubano-config';

const FolkloreCubanoPage: React.FC = () => {
  return <FullDanceClassTemplate config={FOLKLORE_CUBANO_PAGE_CONFIG} />;
};

export default FolkloreCubanoPage;
