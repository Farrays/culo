/**
 * =============================================================================
 * SALSA VENTA DIRECTA LANDING PAGE
 * =============================================================================
 *
 * Landing de venta directa para cursos de Salsa.
 * Usa el componente DirectSaleLanding (estilo Hormozi/Brunson).
 * Colores corporativos de Farray's (tema brand).
 *
 * RUTA: /:locale/salsa-curso
 */

import React from 'react';
import DirectSaleLanding from '../DirectSaleLanding';
import { SALSA_VENTA_DIRECTA_CONFIG } from '../../../constants/salsa-venta-directa-landing-config';

const SalsaVentaDirectaLanding: React.FC = () => {
  return <DirectSaleLanding config={SALSA_VENTA_DIRECTA_CONFIG} />;
};

export default SalsaVentaDirectaLanding;
