/**
 * ExpandableContent Component
 * ============================
 * Componente que muestra contenido resumido con opción de expandir.
 *
 * IMPORTANTE PARA SEO:
 * - Todo el contenido está en el DOM desde el inicio
 * - Google indexa el contenido completo
 * - Solo se oculta visualmente con CSS (max-height + overflow)
 * - NO usa display:none ni visibility:hidden (que Google ignora)
 */
import React, { useState, useRef, useEffect } from 'react';

interface ExpandableContentProps {
  /** Contenido que siempre es visible */
  visibleContent: React.ReactNode;
  /** Contenido que se muestra al expandir */
  expandableContent: React.ReactNode;
  /** Texto del botón para expandir */
  expandLabel?: string;
  /** Texto del botón para colapsar */
  collapseLabel?: string;
  /** Clase CSS adicional para el contenedor */
  className?: string;
  /** Si empieza expandido */
  defaultExpanded?: boolean;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({
  visibleContent,
  expandableContent,
  expandLabel = 'Leer más',
  collapseLabel = 'Ver menos',
  className = '',
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto');
  const contentRef = useRef<HTMLDivElement>(null);

  // Medir altura del contenido para animación suave
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expandableContent]);

  return (
    <div className={className}>
      {/* Contenido siempre visible */}
      {visibleContent}

      {/* Contenido expandible - SIEMPRE en el DOM para SEO */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : '0px',
          opacity: isExpanded ? 1 : 0,
        }}
        // aria-hidden para accesibilidad cuando está colapsado
        aria-hidden={!isExpanded}
      >
        <div className="pt-4">{expandableContent}</div>
      </div>

      {/* Botón expandir/colapsar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 inline-flex items-center gap-2 text-primary-accent hover:text-primary-accent/80 font-semibold transition-colors group"
        aria-expanded={isExpanded}
      >
        <span>{isExpanded ? collapseLabel : expandLabel}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
};

export default ExpandableContent;
