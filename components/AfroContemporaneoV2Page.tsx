/**
 * Afro Contemporáneo V2 Page - EXPERIMENTAL
 * ==========================================
 * Página de prueba para ver el template V2 con datos reales
 * Ruta: /test/afro-contemporaneo-v2
 *
 * NO USAR EN PRODUCCIÓN - Solo para pruebas visuales
 */
import React from 'react';
import FullDanceClassTemplateV2 from './templates/FullDanceClassTemplateV2';
import { AFRO_CONTEMPORANEO_V2_CONFIG } from '../constants/afro-contemporaneo-v2-config';

const AfroContemporaneoV2Page: React.FC = () => {
  return <FullDanceClassTemplateV2 config={AFRO_CONTEMPORANEO_V2_CONFIG} />;
};

export default AfroContemporaneoV2Page;
