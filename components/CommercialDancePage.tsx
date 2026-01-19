/**
 * Commercial Dance Page - Using FullDanceClassTemplate
 * Transactional page for Commercial Dance classes (waitlist mode)
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { COMMERCIAL_PAGE_CONFIG } from '../constants/commercial-config';

const CommercialDancePage: React.FC = () => {
  return <FullDanceClassTemplate config={COMMERCIAL_PAGE_CONFIG} />;
};

export default CommercialDancePage;
