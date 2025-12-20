/**
 * Bachata Sensual Barcelona Page
 * ================================
 * Página de clases de bachata sensual usando el template moderno.
 * URL: /clases/bachata-barcelona
 *
 * Keywords objetivo: "bachata sensual barcelona", "clases bachata barcelona"
 * (No canibaliza página legacy que posiciona para "bachata social", "bachata fusion")
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { BACHATA_PAGE_CONFIG } from '../constants/bachata-config';

const BachataPage: React.FC = () => {
  return <FullDanceClassTemplate config={BACHATA_PAGE_CONFIG} />;
};

export default BachataPage;
