/**
 * TestClassPage - EXPERIMENTAL
 * =============================
 * Página de prueba para el template V2
 * Ruta: /test/clase-experimental
 *
 * NO USAR EN PRODUCCIÓN - Solo para pruebas visuales
 */
import React from 'react';
import FullDanceClassTemplateV2 from './templates/FullDanceClassTemplateV2';
import { TEST_CLASS_PAGE_CONFIG } from '../constants/test-class-config';

const TestClassPage: React.FC = () => {
  return <FullDanceClassTemplateV2 config={TEST_CLASS_PAGE_CONFIG} />;
};

export default TestClassPage;
