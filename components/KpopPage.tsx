/**
 * K-Pop Dance Page - Using FullDanceClassTemplate
 * Transactional page for K-Pop dance classes (waitlist mode)
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { KPOP_PAGE_CONFIG } from '../constants/kpop-config';

const KpopPage: React.FC = () => {
  return <FullDanceClassTemplate config={KPOP_PAGE_CONFIG} />;
};

export default KpopPage;
