/**
 * SALSA SIMPLE LANDING - Minimalista (2026 Style)
 * RUTA: /:locale/salsa-test
 */

import React from 'react';
import SimpleSaleLanding from '../SimpleSaleLanding';
import { SALSA_SIMPLE_CONFIG } from '../../../constants/salsa-simple-config';

const SalsaSimpleLanding: React.FC = () => {
  return <SimpleSaleLanding config={SALSA_SIMPLE_CONFIG} />;
};

export default SalsaSimpleLanding;
