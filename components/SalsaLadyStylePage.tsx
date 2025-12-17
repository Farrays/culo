/**
 * Salsa Lady Style Page
 *
 * This page uses the LadyStyleTemplate with the Salsa Lady Style configuration.
 * All content is driven by the SALSA_LADY_STYLE_CONFIG configuration file.
 */
import LadyStyleTemplate from './templates/LadyStyleTemplate';
import { SALSA_LADY_STYLE_CONFIG } from '../constants/salsa-lady-style-config';

const SalsaLadyStylePage: React.FC = () => {
  return <LadyStyleTemplate config={SALSA_LADY_STYLE_CONFIG} />;
};

export default SalsaLadyStylePage;
