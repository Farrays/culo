/**
 * =============================================================================
 * BACHATA VENTA DIRECTA LANDING PAGE (Test)
 * =============================================================================
 *
 * Landing de TEST para venta directa de cursos de Bachata.
 * Usa el componente DirectSaleLanding (estilo Hormozi/Brunson).
 *
 * RUTA: /:locale/bachata-curso
 */

import React from 'react';
import DirectSaleLanding from '../DirectSaleLanding';
import { BACHATA_VENTA_DIRECTA_CONFIG } from '../../../constants/bachata-venta-directa-landing-config';

const BachataVentaDirectaLanding: React.FC = () => {
  return <DirectSaleLanding config={BACHATA_VENTA_DIRECTA_CONFIG} />;
};

export default BachataVentaDirectaLanding;
