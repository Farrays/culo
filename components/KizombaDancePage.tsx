import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { KIZOMBA_PAGE_CONFIG } from '../constants/kizomba-config';

const KizombaDancePage: React.FC = () => {
  return <FullDanceClassTemplate config={KIZOMBA_PAGE_CONFIG} />;
};

export default KizombaDancePage;
