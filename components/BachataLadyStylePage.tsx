/**
 * Bachata Lady Style Page
 *
 * This page uses the LadyStyleTemplate with the Bachata Lady Style configuration.
 * All content is driven by the BACHATA_LADY_STYLE_CONFIG configuration file.
 */
import LadyStyleTemplate from './templates/LadyStyleTemplate';
import { BACHATA_LADY_STYLE_CONFIG } from '../constants/bachata-lady-style-config';

const BachataLadyStylePage: React.FC = () => {
  return <LadyStyleTemplate config={BACHATA_LADY_STYLE_CONFIG} />;
};

export default BachataLadyStylePage;
