/**
 * Test page for PaidClassSelector component
 * Route: /:locale/test-paid-selector
 *
 * DELETE THIS FILE after testing is complete
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PaidClassSelector } from '../components/booking/PaidClassSelector';

const TestPaidSelector: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Clase de Bienvenida | Farray&apos;s Center Barcelona</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="bg-black min-h-screen py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-neutral mb-4">
              Clase Especial de Bienvenida
            </h1>
            <p className="text-neutral/70 text-lg max-w-2xl mx-auto mb-6">
              Elige tu estilo, selecciona la clase que más te guste y ven a conocernos. Solo para
              nuevos estudiantes residentes.
            </p>

            {/* Pricing pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/10 rounded-full px-6 py-3 border border-white/20">
                <span className="text-2xl font-black text-primary-accent">10€</span>
                <span className="text-neutral/70 ml-2">1 clase (30 días)</span>
              </div>
              <div className="bg-primary-accent/20 rounded-full px-6 py-3 border border-primary-accent">
                <span className="text-2xl font-black text-primary-accent">20€</span>
                <span className="text-neutral/70 ml-2">3 clases (7 días)</span>
                <span className="ml-2 text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold">
                  MEJOR VALOR
                </span>
              </div>
            </div>
          </div>

          {/* PaidClassSelector */}
          <PaidClassSelector showSocialProof={true} />

          {/* Conditions */}
          <div className="max-w-2xl mx-auto mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-neutral mb-4">Condiciones</h3>
            <ul className="text-neutral/70 text-sm space-y-2">
              <li>• Solo para nuevos estudiantes</li>
              <li>• Solo para residentes</li>
              <li>• 1 clase: 30 días para usarla</li>
              <li>• Pack 3 clases: 7 días para usarlas (deben ser horarios diferentes)</li>
              <li>• Promoción válida 1 vez por persona hasta el 28 de febrero de 2026</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

export default TestPaidSelector;
