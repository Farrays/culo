import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6" role="status" aria-live="polite">
        {/* Spinner animado */}
        <div className="relative w-16 h-16" aria-hidden="true">
          <div className="absolute inset-0 border-4 border-primary-accent/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary-accent rounded-full animate-spin"></div>
        </div>

        {/* Texto de carga */}
        <p className="text-neutral/75 text-sm font-medium animate-pulse">Cargando...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
