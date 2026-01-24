/**
 * ============================================================================
 * TEMPLATE ENTERPRISE V2.0 - ARTÍCULO DE BLOG SEO/GEO OPTIMIZADO
 * ============================================================================
 * Actualizado: Enero 2026
 * Basado en: Best practices 2025-2026 para AI Search, GEO, E-E-A-T
 *
 * Este template sirve como referencia para crear artículos de blog
 * optimizados para:
 * - Google Search (SEO tradicional)
 * - Google AI Overviews / SGE (Search Generative Experience)
 * - ChatGPT web search citations (GEO)
 * - Claude/Anthropic search citations
 * - Perplexity AI citations
 * - Voice search (speakable)
 * - Featured Snippets & People Also Ask
 *
 * ============================================================================
 * MÉTRICAS OBJETIVO 2026
 * ============================================================================
 *
 * ┌─────────────────────┬──────────────────────────────────────────┐
 * │ Métrica             │ Valor Recomendado                        │
 * ├─────────────────────┼──────────────────────────────────────────┤
 * │ Word Count          │ 2,000-3,000 palabras (mínimo 1,500)      │
 * │ Reading Time        │ 8-15 minutos                             │
 * │ FAQs                │ 5-8 preguntas (People Also Ask)          │
 * │ References          │ 3-6 fuentes verificables (E-E-A-T)       │
 * │ Images              │ 2-4 imágenes optimizadas                 │
 * │ Internal Links      │ 3-5 (relatedClasses + relatedArticles)   │
 * │ H2 Headings         │ 5-8 secciones principales                │
 * │ Summary Bullets     │ 3-4 puntos clave (GEO critical)          │
 * │ Stats Frequency     │ 1 stat cada 150-200 palabras (GEO 2026)  │
 * │ Answer Capsules     │ 2-4 (72% AI citation rate)               │
 * └─────────────────────┴──────────────────────────────────────────┘
 *
 * ============================================================================
 * CORE WEB VITALS 2026 (OBLIGATORIO)
 * ============================================================================
 *
 * Fuente: https://www.neoseo.co.uk/core-web-vitals-2026/
 *
 * ┌─────────────────────┬──────────────────────────────────────────┐
 * │ Métrica             │ Umbral "Good"                            │
 * ├─────────────────────┼──────────────────────────────────────────┤
 * │ LCP (Largest        │ ≤ 2.5 segundos                           │
 * │ Contentful Paint)   │ Mide: velocidad de carga                 │
 * ├─────────────────────┼──────────────────────────────────────────┤
 * │ INP (Interaction    │ ≤ 200 milisegundos                       │
 * │ to Next Paint)      │ Mide: responsividad (reemplazó FID)      │
 * ├─────────────────────┼──────────────────────────────────────────┤
 * │ CLS (Cumulative     │ ≤ 0.1                                    │
 * │ Layout Shift)       │ Mide: estabilidad visual                 │
 * └─────────────────────┴──────────────────────────────────────────┘
 *
 * IMPACTO EN RANKING:
 * - Core Web Vitals son factor de desempate crítico
 * - Google usa mobile-first indexing (mobile scores = rankings)
 * - En 2026, AMP ya NO proporciona ventajas de ranking
 *
 * ============================================================================
 * E-E-A-T 2026 - AUTHOR SCHEMA COMPLETO
 * ============================================================================
 *
 * Los motores de búsqueda (Google + AI) priorizan contenido con:
 * - Experience: Experiencia demostrable del autor
 * - Expertise: Credenciales y conocimiento verificable
 * - Authoritativeness: Reconocimiento en el campo
 * - Trustworthiness: Fuentes verificables y transparencia
 *
 * REQUISITOS AUTHOR SCHEMA (OBLIGATORIO):
 * - name: Nombre completo del autor
 * - jobTitle: Puesto profesional
 * - sameAs: Links a LinkedIn, Instagram, Twitter (mínimo 2)
 * - worksFor: Organización donde trabaja
 * - credentials: Certificaciones relevantes
 * - description: Bio de 50-100 palabras
 *
 * ============================================================================
 * GEO OPTIMIZATION 2026 - AI CITABILITY FACTORS
 * ============================================================================
 *
 * Fuente: https://www.frase.io/blog/faq-schema-ai-search-geo-aeo
 *
 * ESTADÍSTICAS CLAVE:
 * - FAQ schema tiene 3.2x más probabilidad de aparecer en AI Overviews
 * - AI-referred sessions aumentaron 527% en 2025
 * - Páginas con structured data son más fáciles de parsear por AI
 *
 * FACTORES DE CITABILIDAD AI (ordenados por impacto):
 *
 * 1. ANSWER CAPSULES (72% citation rate - #1 predictor)
 *    - Pregunta directa + Respuesta concisa + Fuente
 *    - Máximo 40-60 palabras por respuesta
 *
 * 2. FRECUENCIA DE ESTADÍSTICAS (+40% citabilidad)
 *    - ANTES: 1 stat cada 500-700 palabras
 *    - AHORA: 1 stat cada 150-200 palabras
 *
 * 3. STRUCTURED DATA
 *    - FAQPage, HowTo, Article, LocalBusiness
 *    - JSON-LD preferido sobre microdata
 *    - Validar en Google Rich Results Test
 *
 * 4. CONTENT FRESHNESS
 *    - dateModified actualizado con cada edición
 *    - "Last updated" visible en UI
 *    - Política de revisión cada 30-90 días
 *
 * 5. PILLAR/CLUSTER STRATEGY
 *    - Pillar pages con +30% tráfico orgánico
 *    - Clusters mantienen rankings 2.5x más tiempo
 *
 * ============================================================================
 * GOOGLE DISCOVER OPTIMIZATION (NUEVO 2026)
 * ============================================================================
 *
 * Google Discover es una fuente MASIVA de tráfico móvil.
 * Para aparecer en Discover necesitas:
 *
 * REQUISITOS TÉCNICOS:
 * [ ] Meta tag: <meta name="robots" content="max-image-preview:large">
 * [ ] Imágenes de mínimo 1200px de ancho
 * [ ] Mobile load time < 2 segundos
 * [ ] HTTPS obligatorio
 *
 * REQUISITOS DE CONTENIDO:
 * [ ] Títulos que generen curiosidad (sin clickbait)
 * [ ] Imágenes originales y de alta calidad
 * [ ] E-E-A-T signals fuertes (author bio, credentials)
 * [ ] Contenido evergreen con actualizaciones frecuentes
 *
 * NOTA: El meta tag max-image-preview:large se añade automáticamente
 * en el componente BlogSchemas.tsx
 *
 * ============================================================================
 * HREFLANG STRATEGY (4 IDIOMAS: ES, CA, EN, FR)
 * ============================================================================
 *
 * Fuente: https://www.weglot.com/guides/hreflang-tag
 *
 * Para sitios multiidioma, hreflang es CRÍTICO para:
 * - Evitar contenido duplicado entre idiomas
 * - Mostrar la versión correcta en cada país
 * - Mejorar rankings en cada mercado
 *
 * REGLAS OBLIGATORIAS:
 * 1. Cada página DEBE tener hreflang para TODOS los idiomas
 * 2. Cada página DEBE incluir hreflang a sí misma (self-referencing)
 * 3. DEBE existir x-default para usuarios sin match
 * 4. URLs limpias (/es/, /ca/, /en/, /fr/) - NO usar ?lang=
 *
 * EJEMPLO CORRECTO:
 * <link rel="alternate" hreflang="es" href="https://farrays.com/es/blog/articulo" />
 * <link rel="alternate" hreflang="ca" href="https://farrays.com/ca/blog/articulo" />
 * <link rel="alternate" hreflang="en" href="https://farrays.com/en/blog/articulo" />
 * <link rel="alternate" hreflang="fr" href="https://farrays.com/fr/blog/articulo" />
 * <link rel="alternate" hreflang="x-default" href="https://farrays.com/es/blog/articulo" />
 *
 * ERRORES COMUNES (evitar):
 * - 31% de sitios fallan en bidireccionalidad
 * - 16% olvidan self-referencing
 * - Conflicto entre canonical y hreflang
 *
 * NOTA: Hreflang se genera automáticamente en el componente
 * basándose en el slug del artículo y los 4 idiomas disponibles.
 *
 * ============================================================================
 * READABILITY / NIVEL DE LECTURA
 * ============================================================================
 *
 * Aunque Flesch Score NO es factor directo de ranking, afecta:
 * - Dwell time (tiempo en página)
 * - Bounce rate
 * - Featured Snippets (prefieren Grade 6-9)
 * - Voice Search (prefiere oraciones cortas)
 *
 * GUIDELINES DE ESCRITURA:
 * [ ] Oraciones de 15-20 palabras máximo
 * [ ] Párrafos de 2-3 oraciones
 * [ ] Voz activa sobre pasiva
 * [ ] Vocabulario accesible (evitar jerga innecesaria)
 * [ ] Una idea principal por párrafo
 *
 * NIVEL OBJETIVO:
 * - Featured Snippets: Grade 6-9 (ESO)
 * - Artículos técnicos: Grade 10-12 (Bachillerato)
 * - Contenido general: Grade 8 ideal
 *
 * HERRAMIENTAS DE VALIDACIÓN:
 * - Hemingway Editor: https://hemingwayapp.com/
 * - Readable.com: https://readable.com/
 *
 * ============================================================================
 * SEMANTIC HTML5 STRUCTURE
 * ============================================================================
 *
 * La estructura semántica correcta mejora:
 * - Accessibility (screen readers)
 * - SEO (Google entiende mejor el contenido)
 * - AI parsing (LLMs extraen mejor el contenido)
 *
 * ESTRUCTURA CORRECTA DE UN ARTÍCULO:
 *
 * <main> (único por página)
 *   <article>
 *     <header>
 *       <h1>Título del artículo</h1>
 *       <p>Metadata (fecha, autor, tiempo lectura)</p>
 *     </header>
 *     <section id="intro">
 *       <p>Introducción...</p>
 *     </section>
 *     <section id="seccion-1" aria-labelledby="heading-1">
 *       <h2 id="heading-1">Sección 1</h2>
 *       <p>Contenido...</p>
 *     </section>
 *     <!-- más secciones -->
 *     <aside> <!-- contenido relacionado -->
 *       <h3>Artículos relacionados</h3>
 *     </aside>
 *     <footer>
 *       <p>Referencias, autor bio</p>
 *     </footer>
 *   </article>
 * </main>
 *
 * REGLAS:
 * - Solo UN <main> por página
 * - Jerarquía de headings: h1 > h2 > h3 (nunca saltar niveles)
 * - Usar aria-labelledby cuando hay múltiples <section>
 * - <header> y <footer> solo tienen landmark role si NO están anidados
 *
 * ============================================================================
 * WCAG 2.2 ACCESSIBILITY CHECKLIST (NUEVO 2026)
 * ============================================================================
 *
 * NIVEL A (OBLIGATORIO):
 * [ ] Alt text descriptivo en TODAS las imágenes
 * [ ] Headings en orden jerárquico (H1 → H2 → H3)
 * [ ] Links con texto descriptivo (no "click aquí")
 * [ ] Color no es único indicador de información
 * [ ] Formularios con labels asociados
 *
 * NIVEL AA (RECOMENDADO):
 * [ ] Contraste de color mínimo 4.5:1 (texto normal)
 * [ ] Contraste de color mínimo 3:1 (texto grande)
 * [ ] Focus visible con outline de 2px mínimo
 * [ ] Target size mínimo 24x24px (touch targets)
 * [ ] Skip links para navegación por teclado
 * [ ] ARIA labels donde sea necesario
 *
 * NIVEL AAA (OPCIONAL):
 * [ ] Contraste 7:1 para texto normal
 * [ ] No hay límites de tiempo
 * [ ] Navegación consistente
 *
 * HERRAMIENTAS DE VALIDACIÓN:
 * - axe DevTools: https://www.deque.com/axe/
 * - WAVE: https://wave.webaim.org/
 * - Lighthouse Accessibility audit
 *
 * ============================================================================
 * PILLAR/CLUSTER CONTENT STRATEGY
 * ============================================================================
 *
 * Fuente: https://searchengineland.com/guide/topic-clusters
 *
 * ESTRUCTURA:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │                      PILLAR PAGE                                │
 * │           (Guía completa del tema principal)                    │
 * │           2,500-4,000 palabras                                  │
 * └───────────────────────┬──────────────────────────────────────────┘
 *                         │
 *        ┌────────────────┼────────────────┐
 *        │                │                │
 *        ▼                ▼                ▼
 * ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
 * │  CLUSTER 1   │ │  CLUSTER 2   │ │  CLUSTER 3   │
 * │ (Subtema A)  │ │ (Subtema B)  │ │ (Subtema C)  │
 * │ 1,500-2,500  │ │ 1,500-2,500  │ │ 1,500-2,500  │
 * └──────────────┘ └──────────────┘ └──────────────┘
 *
 * REGLAS DE LINKING:
 * - Cada cluster page → link a pillar page
 * - Pillar page → link a todos los cluster pages
 * - Cross-link entre clusters donde sea relevante
 * - Anchor text descriptivo (no "click aquí")
 *
 * EJEMPLO PARA FARRAY'S:
 * - Pillar: "Guía Completa de Baile en Barcelona 2026"
 * - Cluster 1: "Clases de Salsa en Barcelona"
 * - Cluster 2: "Clases de Bachata en Barcelona"
 * - Cluster 3: "Beneficios del Baile para la Salud"
 *
 * ============================================================================
 * AI PLATFORM OPTIMIZATION (NUEVO 2026)
 * ============================================================================
 *
 * GOOGLE AI OVERVIEWS:
 * - Aparecen en ~15% de búsquedas (y creciendo)
 * - CTR baja 4x cuando hay AI summary
 * - Prioriza contenido con E-E-A-T y structured data
 *
 * CHATGPT SEARCH:
 * - Usa structured data para determinar qué mostrar
 * - Prefiere respuestas directas y concisas
 * - Cita fuentes con fecha reciente (dateModified)
 *
 * PERPLEXITY AI:
 * - Favorece contenido con múltiples fuentes citadas
 * - Prefiere datos numéricos verificables
 * - Valora profundidad de coverage
 *
 * CLAUDE WEB SEARCH:
 * - Similar a ChatGPT en preferencias
 * - Valora coherencia y estructura lógica
 *
 * OPTIMIZACIONES COMUNES:
 * 1. Respuestas directas en primeros 40-60 palabras
 * 2. Stats con fuente cada 150-200 palabras
 * 3. FAQ schema con 5-8 preguntas
 * 4. Answer capsules para preguntas comunes
 * 5. Tablas para comparaciones
 * 6. dateModified actualizado
 *
 * ============================================================================
 * CHECKLIST PRE-ESCRITURA (ACTUALIZADO 2026)
 * ============================================================================
 *
 * [ ] 1. KEYWORD RESEARCH
 *     - Keyword principal identificada
 *     - 3-5 keywords secundarias (LSI)
 *     - 5-8 preguntas de "People Also Ask"
 *     - Volumen de búsqueda verificado
 *     - Análisis de AI Overviews para la query
 *
 * [ ] 2. INTENT MAPPING
 *     - Tipo de intent: Informacional / Transaccional / Navegacional
 *     - Competencia analizada (top 5 resultados)
 *     - Content gap identificado
 *     - AI citation analysis (¿qué citan ChatGPT/Perplexity?)
 *
 * [ ] 3. ESTRUCTURA
 *     - Título optimizado (60-70 chars, keyword al inicio)
 *     - Meta description (150-160 chars, CTA incluido)
 *     - H2s mapeados a keyword clusters
 *     - Stats planned cada 150-200 palabras
 *
 * [ ] 4. E-E-A-T PLANNING
 *     - Autor asignado con credentials completas
 *     - Referencias académicas/institucionales identificadas
 *     - Datos verificables preparados
 *     - Author schema fields completados
 *
 * [ ] 5. PILLAR/CLUSTER MAPPING
 *     - ¿Es pillar page o cluster page?
 *     - Links bidireccionales planeados
 *     - Cross-links a clusters relacionados
 *
 * ============================================================================
 * CHECKLIST POST-ESCRITURA (ACTUALIZADO 2026)
 * ============================================================================
 *
 * [ ] 1. SEO ON-PAGE
 *     - Keyword en título, H1, primera oración
 *     - Keywords LSI distribuidas naturalmente
 *     - Alt text de imágenes con keywords
 *     - Internal links a 3+ clases relacionadas
 *
 * [ ] 2. GEO OPTIMIZATION
 *     - Summary box con 3-4 bullets citables
 *     - Respuestas directas en primeros párrafos (40-60 palabras)
 *     - Stats con fuente cada 150-200 palabras
 *     - speakableSelectors configurados
 *     - Answer capsules para preguntas clave (2-4)
 *
 * [ ] 3. FEATURED SNIPPETS
 *     - Definiciones en formato "X es Y que Z"
 *     - Listas numeradas para "pasos" o "mejores"
 *     - Tablas comparativas donde aplique
 *
 * [ ] 4. ACCESSIBILITY (WCAG 2.2)
 *     - Alt text en todas las imágenes
 *     - Headings en orden jerárquico
 *     - Contraste de color 4.5:1 mínimo
 *     - Focus visible 2px+
 *     - Touch targets 24x24px mínimo
 *
 * [ ] 5. CORE WEB VITALS
 *     - Imágenes en WebP/AVIF con srcSet
 *     - Lazy loading en imágenes below-fold
 *     - width/height definidos (evita CLS)
 *     - INP < 200ms verificado
 *
 * [ ] 6. STRUCTURED DATA
 *     - Article schema con author completo
 *     - FAQPage schema
 *     - LocalBusiness schema (si aplica)
 *     - Validado en Rich Results Test
 *
 * [ ] 7. CONTENT FRESHNESS
 *     - dateModified actualizado
 *     - "Last updated" visible en UI
 *     - Próxima revisión agendada (30-90 días)
 *
 * [ ] 8. TECHNICAL
 *     - IDs únicos en todas las secciones
 *     - Traducciones en 4 idiomas
 *     - Rutas en prerender.mjs
 *
 * ============================================================================
 * PATRONES POR TIPO DE ARTÍCULO
 * ============================================================================
 *
 * TUTORIAL (Cómo aprender X):
 * Intro → Definición → Pasos (H2 cada uno) → Errores comunes → Tips → CTA → FAQ → Referencias
 * Schema adicional: howToSchema (enabled: true)
 * Stats: cada 150 palabras en secciones de pasos
 *
 * COMPARATIVO (X vs Y):
 * Intro → Contexto A → Contexto B → Tabla comparativa → Análisis → Recomendación → FAQ → Referencias
 * Sección clave: comparison-table
 * Answer capsules: "¿Cuál es mejor para X?" por cada perfil
 *
 * LISTICLE (N Beneficios de X):
 * Intro → Beneficio 1-N (H2 cada uno) → Estadística cada 3-4 → Imagen cada 3-4 → Conclusión → FAQ → Referencias
 * Secciones clave: statistic, image intercalados
 * Stats: mínimo 5-7 a lo largo del artículo
 *
 * HISTORIA/CULTURA:
 * Intro → Orígenes → Evolución → Quotes de expertos → Barcelona hoy → CTA → FAQ → Referencias (mínimo 5)
 * Secciones clave: quote, image históricas
 * Answer capsules: timeline events
 *
 * LOCAL (Barcelona):
 * Intro → Overview local → Opciones/Precios → Comparativa → Tips locales → FAQ local → Referencias
 * Schema adicional: LocalBusiness
 * Answer capsules: preguntas de precio y ubicación
 *
 * ============================================================================
 * FÓRMULAS DE TÍTULOS QUE FUNCIONAN
 * ============================================================================
 *
 * Tutorial:
 * - "Cómo [verbo] [objeto] en [tiempo] - Guía [año]"
 * - "Aprende [habilidad] desde Cero: [N] Pasos Fáciles"
 *
 * Comparativo:
 * - "[A] vs [B]: ¿Cuál Elegir? Comparativa [año]"
 * - "Diferencias entre [A] y [B] - Guía Completa"
 *
 * Listicle:
 * - "[N] Beneficios de [actividad] (Respaldados por Ciencia)"
 * - "Los [N] Mejores [categoría] en [ubicación] [año]"
 *
 * Historia:
 * - "Historia de [tema]: Orígenes, Evolución y Actualidad"
 * - "[Tema]: De [origen] a [actualidad] - Historia Completa"
 *
 * Local (Barcelona):
 * - "Clases de [estilo] en Barcelona: Guía Definitiva [año]"
 * - "[Estilo] Barcelona: Dónde Aprender + Precios [año]"
 *
 * ============================================================================
 * OPTIMIZACIÓN GEO - AI CITABILITY (2026 UPDATE)
 * ============================================================================
 *
 * Los motores de búsqueda AI (ChatGPT, Claude, Google SGE, Perplexity) prefieren:
 *
 * 1. ANSWER CAPSULES (72% AI citation rate - #1 predictor)
 *    Usar type: 'answer-capsule' para respuestas directas a preguntas comunes
 *    Formato: Pregunta → Respuesta (1-2 oraciones, 40-60 palabras) → Fuente verificable
 *    FRECUENCIA: 2-4 por artículo
 *
 * 2. RESPUESTAS DIRECTAS EN INTRO (40-60 palabras)
 *    Malo:  "En este artículo exploraremos los beneficios..."
 *    Bueno: "Bailar salsa quema 400+ calorías por hora, mejora la
 *           memoria un 76%, y reduce el estrés. Aquí te explicamos
 *           cómo estos beneficios están respaldados por ciencia."
 *
 * 3. FRECUENCIA DE ESTADÍSTICAS (ACTUALIZADO 2026)
 *    ANTES: 1 stat cada 500-700 palabras
 *    AHORA: 1 stat cada 150-200 palabras (+40% citabilidad)
 *    Siempre con fuente verificable
 *
 * 4. DATOS CON CITATION SCHEMA (GEO-optimized)
 *    Usar summaryStats con citation completa:
 *    {
 *      value: '400',
 *      labelKey: 'calorías/hora',
 *      citation: {
 *        source: 'Harvard Health Publishing',
 *        url: 'https://...',
 *        year: '2023',
 *        authors: 'Harvard Staff',
 *        doi: '10.xxxx/xxxxx' // opcional
 *      }
 *    }
 *
 * 5. DEFINICIONES CLARAS con DefinedTerm schema
 *    Usar type: 'definition' para conceptos clave:
 *    "La salsa cubana es un estilo de baile que se caracteriza por..."
 *
 * 6. LISTAS NUMERADAS PARA PASOS
 *    Usar type: 'numbered-list' para procesos secuenciales
 *    Los AI prefieren extraer listas sobre párrafos densos
 *
 * 7. TABLAS PARA COMPARACIONES
 *    comparison-table es altamente citable por AI
 *    Incluir headers claros y datos verificables
 *
 * 8. TESTIMONIALS con Review Schema
 *    Usar type: 'testimonial' para social proof con schema.org/Review
 *    Incluir rating, fecha, y reviewOf
 *
 * TIPOS DE SECCIÓN DISPONIBLES:
 * - heading          : Títulos H2/H3
 * - paragraph        : Texto normal
 * - list             : Lista con bullets
 * - numbered-list    : Lista numerada (ideal para pasos)
 * - image            : Imagen con caption
 * - video            : Video embed (YouTube)
 * - definition       : Definición para featured snippets
 * - statistic        : Estadística destacada (USAR FRECUENTEMENTE)
 * - quote            : Cita de experto
 * - callout          : Info/Tip/Warning/CTA boxes
 * - comparison-table : Tabla comparativa
 * - references       : Sección de referencias E-E-A-T
 * - answer-capsule   : Respuesta directa para GEO (crítico)
 * - testimonial      : Review con schema (E-E-A-T)
 *
 * ============================================================================
 * FAQs - PEOPLE ALSO ASK OPTIMIZATION
 * ============================================================================
 *
 * FÓRMULAS DE PREGUNTAS QUE RANKEAN:
 *
 * Qué/Cuál:
 * - "¿Qué es [concepto]?"
 * - "¿Cuál es la diferencia entre [A] y [B]?"
 * - "¿Cuál es el mejor [categoría] para [perfil]?"
 *
 * Cómo:
 * - "¿Cómo aprender [habilidad] rápido?"
 * - "¿Cómo elegir [producto/servicio]?"
 * - "¿Cómo empezar a [actividad] desde cero?"
 *
 * Cuánto:
 * - "¿Cuánto cuesta [servicio] en [ubicación]?"
 * - "¿Cuánto tiempo se tarda en aprender [habilidad]?"
 * - "¿Cuántas calorías quema [actividad]?"
 *
 * Dónde:
 * - "¿Dónde aprender [habilidad] en [ubicación]?"
 * - "¿Dónde tomar clases de [estilo]?"
 *
 * Necesito:
 * - "¿Necesito pareja para clases de [estilo]?"
 * - "¿Necesito experiencia previa para [actividad]?"
 *
 * FORMATO DE RESPUESTA (para AI citability):
 * - Primera oración: Respuesta directa (20-40 palabras)
 * - Segunda oración: Expansión con datos verificables
 * - Tercera oración: Enlace a acción (CTA suave)
 *
 * ============================================================================
 * REFERENCIAS E-E-A-T (Experience, Expertise, Authoritativeness, Trust)
 * ============================================================================
 *
 * FUENTES RECOMENDADAS POR CATEGORÍA:
 *
 * SALUD/FITNESS:
 * - Harvard Health Publishing (health.harvard.edu)
 * - New England Journal of Medicine (nejm.org)
 * - Frontiers in Psychology (frontiersin.org)
 * - PubMed/NCBI (pubmed.ncbi.nlm.nih.gov)
 * - WHO (who.int)
 * - Mayo Clinic (mayoclinic.org)
 *
 * HISTORIA/CULTURA:
 * - UNESCO (unesco.org)
 * - CID-UNESCO (cid-world.org)
 * - Universidades (harvard.edu, oxford.ac.uk)
 * - Archive.org
 * - Libros académicos citados con ISBN
 *
 * DATOS LOCALES:
 * - Ajuntament de Barcelona
 * - Institut d'Estadística de Catalunya
 * - Estudios de mercado verificables
 *
 * ============================================================================
 * ESTRATEGIA DE INTERNAL LINKING (ACTUALIZADO 2026)
 * ============================================================================
 *
 * Fuente: https://rathoreseo.com/blog/ai-seo-topic-clusters-internal-linking/
 *
 * relatedClasses (OBLIGATORIO - 3-5 clases):
 * - Siempre incluir la clase más relevante al tema
 * - Incluir clase de principiantes si aplica
 * - Incluir clases complementarias
 *
 * Ejemplo para artículo de Salsa:
 * relatedClasses: [
 *   'salsa-cubana-barcelona',      // Clase directa
 *   'salsa-bachata-barcelona',     // Combinado
 *   'bachata-barcelona',           // Complementaria
 *   'clases-baile-principiantes-barcelona', // Entrada
 * ]
 *
 * relatedArticles (RECOMENDADO - 2-3 artículos):
 * - Artículos del mismo cluster temático
 * - Artículos que profundicen en subtemas
 *
 * LINKS EN CONTENIDO (via markdown en traducciones):
 * - Usar [texto del link](/es/clase-relacionada)
 * - Mínimo 2-3 links contextuales en el cuerpo
 * - No más de 1 link por cada 100 palabras
 *
 * PILLAR/CLUSTER LINKING:
 * - Cluster → Pillar: SIEMPRE
 * - Pillar → Clusters: SIEMPRE
 * - Cluster → Cluster: Cuando sea relevante
 *
 * ============================================================================
 * LINK BUILDING STRATEGY (NUEVO 2026)
 * ============================================================================
 *
 * Fuente: https://backlinko.com/link-building
 * Fuente: https://ahrefs.com/blog/link-building/
 *
 * El link building efectivo combina TRES tipos de enlaces:
 *
 * 1. OUTBOUND LINKS (Enlaces salientes a fuentes externas)
 * ─────────────────────────────────────────────────────────
 * OBLIGATORIO para E-E-A-T y citabilidad AI:
 *
 * [ ] Mínimo 3-6 enlaces a fuentes autoritativas
 * [ ] Priorizar fuentes académicas (.edu, journals, PubMed)
 * [ ] Incluir organizaciones oficiales (UNESCO, OMS, etc.)
 * [ ] Evitar enlaces a competidores directos
 * [ ] Usar rel="nofollow" solo si es contenido patrocinado
 *
 * JERARQUÍA DE AUTORIDAD (de mayor a menor):
 * - Revistas científicas peer-reviewed (NEJM, Nature, etc.)
 * - Instituciones gubernamentales (.gov, .gob.es)
 * - Universidades y centros de investigación
 * - Organizaciones internacionales (UNESCO, WHO)
 * - Medios de comunicación reconocidos
 * - Blogs de expertos con credenciales verificables
 *
 * FORMATO DE CITACIÓN PARA GEO:
 * "Según un estudio de [Fuente] ([año]), [dato específico]."
 * Ejemplo: "Según el NEJM (2003), bailar reduce el riesgo de demencia en un 76%."
 *
 * 2. INTERNAL LINKS (Enlaces internos contextuales)
 * ─────────────────────────────────────────────────────────
 * ESTRATEGIA DE DENSIDAD:
 * - Artículo 1,500 palabras: 4-6 internal links
 * - Artículo 2,500 palabras: 6-10 internal links
 * - Artículo 3,500+ palabras: 10-15 internal links
 *
 * UBICACIÓN ESTRATÉGICA:
 * [ ] 1 link en introducción (hacia contenido relacionado)
 * [ ] 2-3 links en cuerpo (hacia clases o servicios)
 * [ ] 1 link en conclusión (CTA hacia contacto/reserva)
 * [ ] Links en FAQ cuando sea natural
 *
 * ANCHOR TEXT BEST PRACTICES:
 * ✅ Descriptivo: "clases de salsa para principiantes"
 * ✅ Natural: "aprende bachata en Barcelona"
 * ❌ Genérico: "haz clic aquí", "leer más"
 * ❌ Sobre-optimizado: repetir keyword exacta 10 veces
 *
 * PÁGINAS DESTINO PRIORITARIAS:
 * 1. /es/clases/[estilo]-barcelona (páginas de clase)
 * 2. /es/horarios-precios (conversión)
 * 3. /es/contacto (conversión final)
 * 4. /es/blog/[categoria]/[articulo-relacionado] (profundizar)
 *
 * 3. LINK EARNING (Estrategia para conseguir backlinks)
 * ─────────────────────────────────────────────────────────
 * El mejor link building es crear contenido que MEREZCA enlaces:
 *
 * CONTENIDO LINKABLE (alto potencial de backlinks):
 * [ ] Estudios originales con datos propios
 * [ ] Infografías con estadísticas visuales
 * [ ] Guías definitivas (pillar pages)
 * [ ] Herramientas útiles (calculadoras, tests)
 * [ ] Contenido controversial/opinión experta
 *
 * ESTADÍSTICAS CITABLES:
 * Incluir datos que otros quieran citar:
 * - "El 90% de nuestros alumnos pierde la vergüenza en 4 semanas"
 * - "Impartimos 120+ clases semanales en Barcelona"
 * - Datos específicos de la experiencia de Farray's
 *
 * OUTREACH OPORTUNIDADES:
 * - Blogs de viajes sobre Barcelona
 * - Medios locales (Time Out, Guía del Ocio)
 * - Directorios de actividades
 * - Colaboraciones con influencers locales
 *
 * ============================================================================
 * IMPLEMENTACIÓN EN TRADUCCIONES (i18n)
 * ============================================================================
 *
 * Los links se añaden directamente en las traducciones usando markdown:
 *
 * EJEMPLO EN es.ts:
 * ```typescript
 * blogPerderMiedoBailar_intro1: 'El miedo a bailar es más común de lo que crees.
 * En [Farray\'s Center](/es/clases/baile-barcelona) llevamos más de 15 años
 * ayudando a personas a superar esa barrera inicial.',
 *
 * blogPerderMiedoBailar_primeraClase: 'Tu [primera clase de salsa](/es/clases/salsa-cubana-barcelona)
 * puede ser el inicio de una transformación. Según el [NEJM](https://www.nejm.org/doi/full/10.1056/NEJMoa022252),
 * el baile regular reduce el riesgo de demencia en un 76%.',
 * ```
 *
 * REGLAS DE FORMATO:
 * - Links internos: [texto descriptivo](/es/ruta-destino)
 * - Links externos: [fuente](https://url-completa.com)
 * - No romper párrafos con exceso de links
 * - Mantener flujo de lectura natural
 *
 * ============================================================================
 * CHECKLIST LINK BUILDING POR ARTÍCULO
 * ============================================================================
 *
 * PRE-PUBLICACIÓN:
 * [ ] ¿Tiene mínimo 3 outbound links a fuentes autoritativas?
 * [ ] ¿Tiene mínimo 4 internal links a páginas de Farray's?
 * [ ] ¿Los anchor texts son descriptivos y variados?
 * [ ] ¿Hay un CTA con link a /contacto o /horarios-precios?
 * [ ] ¿Las fuentes externas están verificadas y funcionan?
 *
 * POST-PUBLICACIÓN:
 * [ ] Verificar que todos los links funcionan (no 404)
 * [ ] Añadir links al artículo desde páginas relacionadas
 * [ ] Compartir en redes para potencial link earning
 * [ ] Monitorizar backlinks en Search Console
 *
 */

import type { BlogArticleConfig } from '../types';

// ============================================================================
// CONFIGURACIÓN DEL ARTÍCULO
// ============================================================================

export const TEMPLATE_ENTERPRISE_CONFIG: BlogArticleConfig = {
  // ===========================================================================
  // IDENTIFICACIÓN
  // ===========================================================================
  /**
   * articleKey: Prefijo para todas las claves i18n del artículo
   * Convención: blog[NombreArticulo] (camelCase)
   * Ejemplo: blogBeneficiosSalsa, blogHistoriaBachata
   */
  articleKey: 'blogTemplateEnterprise',

  /**
   * slug: URL-friendly, sin acentos, minúsculas, guiones
   * IMPORTANTE: Incluir keyword principal
   * Ejemplo: beneficios-bailar-salsa, historia-bachata-barcelona
   */
  slug: 'template-enterprise-articulo',

  /**
   * category: Determina la URL y el cluster temático
   * Opciones: 'tutoriales' | 'tips' | 'historia' | 'fitness' | 'lifestyle'
   */
  category: 'tutoriales',

  // ===========================================================================
  // FECHAS (CRÍTICO PARA CONTENT FRESHNESS)
  // ===========================================================================
  /**
   * Formato ISO 8601: YYYY-MM-DD
   * dateModified: ACTUALIZAR con CADA edición significativa
   *
   * CONTENT FRESHNESS POLICY:
   * - Revisar artículo cada 30-90 días
   * - Actualizar stats si hay nuevos datos
   * - Actualizar dateModified con cada cambio
   */
  datePublished: '2026-01-16',
  dateModified: '2026-01-16',

  // ===========================================================================
  // MÉTRICAS DE LECTURA
  // ===========================================================================
  /**
   * readingTime: Calcular como wordCount / 200 (velocidad lectura media)
   * wordCount: Contar palabras del contenido traducido
   * Objetivo: 2000-3000 palabras para artículos principales
   */
  readingTime: 12,
  wordCount: 2400,

  // ===========================================================================
  // AUTHOR SCHEMA COMPLETO (E-E-A-T 2026)
  // ===========================================================================
  /**
   * NUEVO: Author schema completo para máximo E-E-A-T
   *
   * Todos los campos son importantes para AI citability:
   * - name: Nombre completo
   * - jobTitle: Puesto profesional
   * - description: Bio 50-100 palabras
   * - sameAs: Links a redes sociales (mínimo 2)
   * - worksFor: Organización
   * - credentials: Certificaciones
   *
   * AUTORES DISPONIBLES EN FARRAY'S:
   * - yunaisy: Yunaisy Farray (Directora, especialista salsa/latino)
   * - mar: Mar (Instructor principal, especialista varios estilos)
   */
  authorId: 'yunaisy', // 'yunaisy' | 'mar'

  // ===========================================================================
  // PILLAR/CLUSTER CONFIG (NUEVO 2026)
  // ===========================================================================
  /**
   * contentType: Define si es pillar page o cluster page
   * pillarSlug: Si es cluster, referencia al pillar
   * clusterSlugs: Si es pillar, lista de clusters relacionados
   *
   * Esto ayuda a:
   * - AI a entender la estructura del contenido
   * - Generar internal links automáticos
   * - Mejorar topical authority
   */
  contentType: 'cluster', // 'pillar' | 'cluster' | 'standalone'
  pillarSlug: 'guia-baile-barcelona', // Solo si es cluster
  // clusterSlugs: ['salsa-barcelona', 'bachata-barcelona'], // Solo si es pillar

  // ===========================================================================
  // SUMMARY BOX (CRÍTICO PARA GEO)
  // ===========================================================================
  /**
   * summaryBullets: 3-4 puntos clave que resumen el artículo
   * Estos son los puntos que AI search engines citarán
   * Formato recomendado: Hecho + Beneficio + Dato
   *
   * Ejemplos buenos:
   * - "La salsa quema 400 calorías/hora según Harvard"
   * - "Mejora la memoria un 76% (NEJM 2003)"
   * - "No necesitas experiencia previa ni pareja"
   * - "Clases desde 35€/mes en Barcelona"
   */
  summaryBullets: [
    'blogTemplateEnterprise_summaryBullet1',
    'blogTemplateEnterprise_summaryBullet2',
    'blogTemplateEnterprise_summaryBullet3',
    'blogTemplateEnterprise_summaryBullet4',
  ],

  /**
   * summaryStats: Estadísticas destacadas con holographic cards
   * OBLIGATORIO incluir source para E-E-A-T
   * Máximo 2-3 estadísticas impactantes
   *
   * ACTUALIZADO 2026: CitationConfig para schema.org Citation markup (GEO-optimized)
   * Incluye: source, url, year, authors, doi para máxima citabilidad AI
   */
  summaryStats: [
    {
      value: '400',
      labelKey: 'blogTemplateEnterprise_statCaloriasLabel',
      source: 'Harvard Medical School, 2023',
      // Citation completa para schema.org markup (recomendado para GEO)
      citation: {
        source: 'Harvard Health Publishing',
        url: 'https://www.health.harvard.edu/staying-healthy/the-many-health-benefits-of-dancing',
        year: '2023',
        authors: 'Harvard Medical School Staff',
      },
    },
    {
      value: '76%',
      labelKey: 'blogTemplateEnterprise_statMemoriaLabel',
      source: 'New England Journal of Medicine, 2003',
      citation: {
        source: 'New England Journal of Medicine',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa022252',
        year: '2003',
        authors: 'Verghese et al.',
        doi: '10.1056/NEJMoa022252',
      },
    },
  ],

  // ===========================================================================
  // SECCIONES DE CONTENIDO
  // ===========================================================================
  sections: [
    // -------------------------------------------------------------------------
    // INTRODUCCIÓN (CRÍTICO para GEO)
    // Primera oración debe responder la query directamente
    // Objetivo: 40-60 palabras con respuesta directa + hook
    // -------------------------------------------------------------------------
    {
      id: 'intro',
      type: 'paragraph',
      contentKey: 'blogTemplateEnterprise_intro',
    },
    {
      id: 'intro-2',
      type: 'paragraph',
      contentKey: 'blogTemplateEnterprise_intro2',
    },

    // -------------------------------------------------------------------------
    // SECCIÓN 1: [Keyword Principal en H2]
    // Incluir keyword principal o secundaria en el título H2
    // -------------------------------------------------------------------------
    {
      id: 'seccion-1',
      type: 'heading',
      level: 2,
      contentKey: 'blogTemplateEnterprise_seccion1Title',
    },
    {
      id: 'seccion-1-content',
      type: 'paragraph',
      contentKey: 'blogTemplateEnterprise_seccion1Content',
    },

    /**
     * Lista con puntos clave (AI-friendly)
     * Los motores AI prefieren extraer listas sobre párrafos densos
     */
    {
      id: 'seccion-1-lista',
      type: 'list',
      contentKey: 'blogTemplateEnterprise_seccion1ListaTitle',
      listItems: [
        'blogTemplateEnterprise_lista1Item1',
        'blogTemplateEnterprise_lista1Item2',
        'blogTemplateEnterprise_lista1Item3',
        'blogTemplateEnterprise_lista1Item4',
      ],
    },

    // -------------------------------------------------------------------------
    // ESTADÍSTICA #1 (GEO 2026: cada 150-200 palabras)
    // -------------------------------------------------------------------------
    {
      id: 'stat-1',
      type: 'statistic',
      contentKey: 'blogTemplateEnterprise_stat1Label',
      statisticValue: '400',
      statisticSource: 'Harvard Medical School, 2023',
    },

    // -------------------------------------------------------------------------
    // IMAGEN 1 (después de 300-400 palabras)
    // Incluir keyword en alt text
    // width/height OBLIGATORIOS para CLS
    // -------------------------------------------------------------------------
    {
      id: 'image-1',
      type: 'image',
      contentKey: 'blogTemplateEnterprise_image1Caption',
      image: {
        src: '/images/blog/template/imagen-1.webp',
        srcSet:
          '/images/blog/template/imagen-1-480.webp 480w, /images/blog/template/imagen-1-800.webp 800w',
        alt: "Descripción con keyword principal - Farray's Barcelona",
        caption: 'blogTemplateEnterprise_image1Caption',
        width: 800,
        height: 500,
        // NOTA: loading="lazy" se aplica en el componente para imágenes below-fold
      },
    },

    // -------------------------------------------------------------------------
    // SECCIÓN 2: [Keyword Secundaria en H2]
    // -------------------------------------------------------------------------
    {
      id: 'seccion-2',
      type: 'heading',
      level: 2,
      contentKey: 'blogTemplateEnterprise_seccion2Title',
    },
    {
      id: 'seccion-2-content',
      type: 'paragraph',
      contentKey: 'blogTemplateEnterprise_seccion2Content',
    },

    // -------------------------------------------------------------------------
    // ESTADÍSTICA #2 (GEO 2026: mantener ritmo de stats)
    // -------------------------------------------------------------------------
    {
      id: 'stat-2',
      type: 'statistic',
      contentKey: 'blogTemplateEnterprise_stat2Label',
      statisticValue: '76%',
      statisticSource: 'New England Journal of Medicine, 2003',
    },

    // -------------------------------------------------------------------------
    // DEFINICIÓN (para featured snippets)
    // Formato: "X es Y que Z"
    // Esto aparece en featured snippets de Google
    // -------------------------------------------------------------------------
    {
      id: 'definicion',
      type: 'definition',
      definitionTermKey: 'blogTemplateEnterprise_defTerm',
      contentKey: 'blogTemplateEnterprise_defContent',
    },

    // =========================================================================
    // ANSWER CAPSULES (CRÍTICOS para GEO - 72% de AI citation rate)
    // =========================================================================

    // -------------------------------------------------------------------------
    // ANSWER CAPSULE 1: Pregunta principal
    // Formato: Pregunta directa + Respuesta concisa (40-60 palabras) + Fuente
    // -------------------------------------------------------------------------
    {
      id: 'answer-capsule-1',
      type: 'answer-capsule',
      contentKey: 'blogTemplateEnterprise_answerCapsule1',
      answerCapsule: {
        questionKey: 'blogTemplateEnterprise_answerQuestion1',
        answerKey: 'blogTemplateEnterprise_answerText1',
        sourcePublisher: 'Harvard Medical School',
        sourceYear: '2023',
        sourceUrl:
          'https://www.health.harvard.edu/staying-healthy/the-many-health-benefits-of-dancing',
        confidence: 'high',
        icon: 'check',
      },
    },

    // -------------------------------------------------------------------------
    // ANSWER CAPSULE 2: Segunda pregunta común
    // -------------------------------------------------------------------------
    {
      id: 'answer-capsule-2',
      type: 'answer-capsule',
      contentKey: 'blogTemplateEnterprise_answerCapsule2',
      answerCapsule: {
        questionKey: 'blogTemplateEnterprise_answerQuestion2',
        answerKey: 'blogTemplateEnterprise_answerText2',
        sourcePublisher: 'New England Journal of Medicine',
        sourceYear: '2003',
        sourceUrl: 'https://www.nejm.org/doi/full/10.1056/NEJMoa022252',
        confidence: 'high',
        icon: 'lightbulb', // Opciones: 'info' | 'check' | 'star' | 'lightbulb'
      },
    },

    // -------------------------------------------------------------------------
    // SECCIÓN 3
    // -------------------------------------------------------------------------
    {
      id: 'seccion-3',
      type: 'heading',
      level: 2,
      contentKey: 'blogTemplateEnterprise_seccion3Title',
    },
    {
      id: 'seccion-3-content',
      type: 'paragraph',
      contentKey: 'blogTemplateEnterprise_seccion3Content',
    },

    // -------------------------------------------------------------------------
    // ESTADÍSTICA #3 (mantener ritmo GEO)
    // -------------------------------------------------------------------------
    {
      id: 'stat-3',
      type: 'statistic',
      contentKey: 'blogTemplateEnterprise_stat3Label',
      statisticValue: '35€',
      statisticSource: "Farray's Dance Center, 2026",
    },

    // -------------------------------------------------------------------------
    // LISTA NUMERADA (mejor para HowTo/Pasos)
    // Más estructurada que list normal, ideal para procesos secuenciales
    // -------------------------------------------------------------------------
    {
      id: 'pasos-lista',
      type: 'numbered-list',
      contentKey: 'blogTemplateEnterprise_pasosTitle',
      listItems: [
        'blogTemplateEnterprise_paso1',
        'blogTemplateEnterprise_paso2',
        'blogTemplateEnterprise_paso3',
        'blogTemplateEnterprise_paso4',
      ],
    },

    // -------------------------------------------------------------------------
    // IMAGEN 2
    // -------------------------------------------------------------------------
    {
      id: 'image-2',
      type: 'image',
      contentKey: 'blogTemplateEnterprise_image2Caption',
      image: {
        src: '/images/blog/template/imagen-2.webp',
        srcSet:
          '/images/blog/template/imagen-2-480.webp 480w, /images/blog/template/imagen-2-800.webp 800w',
        alt: "Segunda imagen con keyword - Farray's Center Barcelona",
        caption: 'blogTemplateEnterprise_image2Caption',
        width: 800,
        height: 500,
        // NOTA: loading="lazy" se aplica en el componente para imágenes below-fold
      },
    },

    // -------------------------------------------------------------------------
    // SECCIÓN 4
    // -------------------------------------------------------------------------
    {
      id: 'seccion-4',
      type: 'heading',
      level: 2,
      contentKey: 'blogTemplateEnterprise_seccion4Title',
    },
    {
      id: 'seccion-4-content',
      type: 'paragraph',
      contentKey: 'blogTemplateEnterprise_seccion4Content',
    },

    // -------------------------------------------------------------------------
    // ESTADÍSTICA #4
    // -------------------------------------------------------------------------
    {
      id: 'stat-4',
      type: 'statistic',
      contentKey: 'blogTemplateEnterprise_stat4Label',
      statisticValue: '21',
      statisticSource: 'Frontiers in Psychology, 2019',
    },

    // -------------------------------------------------------------------------
    // TABLA COMPARATIVA (si aplica)
    // Altamente citable por AI search engines
    // -------------------------------------------------------------------------
    {
      id: 'tabla-comparativa',
      type: 'comparison-table',
      contentKey: 'blogTemplateEnterprise_tablaTitle',
      tableConfig: {
        headers: [
          'blogTemplateEnterprise_tablaHeader1',
          'blogTemplateEnterprise_tablaHeader2',
          'blogTemplateEnterprise_tablaHeader3',
        ],
        rows: [
          [
            'blogTemplateEnterprise_row1Col1',
            'blogTemplateEnterprise_row1Col2',
            'blogTemplateEnterprise_row1Col3',
          ],
          [
            'blogTemplateEnterprise_row2Col1',
            'blogTemplateEnterprise_row2Col2',
            'blogTemplateEnterprise_row2Col3',
          ],
          [
            'blogTemplateEnterprise_row3Col1',
            'blogTemplateEnterprise_row3Col2',
            'blogTemplateEnterprise_row3Col3',
          ],
        ],
        highlightColumn: 1, // Columna a destacar (0-indexed)
      },
    },

    // -------------------------------------------------------------------------
    // ANSWER CAPSULE 3: Pregunta de precio/ubicación
    // -------------------------------------------------------------------------
    {
      id: 'answer-capsule-3',
      type: 'answer-capsule',
      contentKey: 'blogTemplateEnterprise_answerCapsule3',
      answerCapsule: {
        questionKey: 'blogTemplateEnterprise_answerQuestion3',
        answerKey: 'blogTemplateEnterprise_answerText3',
        sourcePublisher: "Farray's Dance Center",
        sourceYear: '2026',
        sourceUrl: 'https://www.farrays.com/es/precios',
        confidence: 'high',
        icon: 'star', // Opciones: 'info' | 'check' | 'star' | 'lightbulb'
      },
    },

    // -------------------------------------------------------------------------
    // SECCIÓN 5
    // -------------------------------------------------------------------------
    {
      id: 'seccion-5',
      type: 'heading',
      level: 2,
      contentKey: 'blogTemplateEnterprise_seccion5Title',
    },
    {
      id: 'seccion-5-content',
      type: 'paragraph',
      contentKey: 'blogTemplateEnterprise_seccion5Content',
    },

    // -------------------------------------------------------------------------
    // ESTADÍSTICA #5
    // -------------------------------------------------------------------------
    {
      id: 'stat-5',
      type: 'statistic',
      contentKey: 'blogTemplateEnterprise_stat5Label',
      statisticValue: '527%',
      statisticSource: 'BrightEdge Research, 2025',
    },

    {
      id: 'seccion-5-lista',
      type: 'list',
      contentKey: 'blogTemplateEnterprise_seccion5ListaTitle',
      listItems: [
        'blogTemplateEnterprise_lista5Item1',
        'blogTemplateEnterprise_lista5Item2',
        'blogTemplateEnterprise_lista5Item3',
      ],
    },

    // -------------------------------------------------------------------------
    // TESTIMONIAL (Social Proof con Review Schema)
    // Mejora E-E-A-T con experiencias reales de usuarios
    // -------------------------------------------------------------------------
    {
      id: 'testimonial-1',
      type: 'testimonial',
      contentKey: 'blogTemplateEnterprise_testimonial1',
      testimonial: {
        authorName: 'María García',
        authorLocation: 'Barcelona',
        textKey: 'blogTemplateEnterprise_testimonialText1',
        rating: 5,
        datePublished: '2025-12-15',
        reviewOf: 'school',
      },
    },

    // -------------------------------------------------------------------------
    // CITA DE EXPERTO (opcional pero recomendado para E-E-A-T)
    // -------------------------------------------------------------------------
    {
      id: 'quote-experto',
      type: 'quote',
      contentKey: 'blogTemplateEnterprise_quoteContent',
      quoteAuthor: 'Dr. Joe Verghese, New England Journal of Medicine',
    },

    // -------------------------------------------------------------------------
    // CALLOUT TIP (consejos de experto)
    // -------------------------------------------------------------------------
    {
      id: 'tip-experto',
      type: 'callout',
      calloutType: 'tip',
      contentKey: 'blogTemplateEnterprise_tipExperto',
    },

    // -------------------------------------------------------------------------
    // CALLOUT WARNING (errores comunes - opcional)
    // -------------------------------------------------------------------------
    {
      id: 'warning-errores',
      type: 'callout',
      calloutType: 'warning',
      contentKey: 'blogTemplateEnterprise_warningErrores',
    },

    // -------------------------------------------------------------------------
    // CALLOUT CTA (antes de conclusión)
    // -------------------------------------------------------------------------
    {
      id: 'cta-clases',
      type: 'callout',
      calloutType: 'cta',
      contentKey: 'blogTemplateEnterprise_ctaClases',
    },

    // -------------------------------------------------------------------------
    // CONCLUSIÓN
    // -------------------------------------------------------------------------
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogTemplateEnterprise_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogTemplateEnterprise_conclusionContent',
    },
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogTemplateEnterprise_conclusionCTA',
    },

    // -------------------------------------------------------------------------
    // REFERENCIAS (OBLIGATORIO para E-E-A-T)
    // Mínimo 3-6 fuentes verificables
    // -------------------------------------------------------------------------
    {
      id: 'referencias',
      type: 'references',
      contentKey: 'blogTemplateEnterprise_referencesIntro',
      references: [
        {
          id: 'ref-harvard',
          titleKey: 'blogTemplateEnterprise_refHarvardTitle',
          url: 'https://www.health.harvard.edu/staying-healthy/the-many-health-benefits-of-dancing',
          publisher: 'Harvard Health Publishing',
          year: '2023',
          descriptionKey: 'blogTemplateEnterprise_refHarvardDesc',
        },
        {
          id: 'ref-nejm',
          titleKey: 'blogTemplateEnterprise_refNEJMTitle',
          url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa022252',
          publisher: 'New England Journal of Medicine',
          year: '2003',
          descriptionKey: 'blogTemplateEnterprise_refNEJMDesc',
        },
        {
          id: 'ref-frontiers',
          titleKey: 'blogTemplateEnterprise_refFrontiersTitle',
          url: 'https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01221/full',
          publisher: 'Frontiers in Psychology',
          year: '2019',
          descriptionKey: 'blogTemplateEnterprise_refFrontiersDesc',
        },
        {
          id: 'ref-cid',
          titleKey: 'blogTemplateEnterprise_refCIDTitle',
          url: 'https://cid-world.org/',
          publisher: 'CID-UNESCO',
          year: '2024',
          descriptionKey: 'blogTemplateEnterprise_refCIDDesc',
        },
      ],
    },
  ],

  // ===========================================================================
  // IMAGEN PRINCIPAL (HERO)
  // ===========================================================================
  /**
   * Dimensiones recomendadas: 1200x630 (ratio 1.91:1 para Open Graph)
   * Formato: WebP con srcSet para responsive
   * Alt text: Incluir keyword principal
   * width/height: OBLIGATORIO para CLS
   */
  featuredImage: {
    src: '/images/blog/template/hero.webp',
    srcSet:
      '/images/blog/template/hero-480.webp 480w, /images/blog/template/hero-960.webp 960w, /images/blog/template/hero.webp 1200w',
    alt: "Título del artículo con keyword - Farray's Dance Center Barcelona",
    width: 1200,
    height: 630,
  },

  /**
   * OG Image opcional (si diferente de featuredImage)
   * Usar si necesitas una imagen específica para redes sociales
   */
  // ogImage: '/images/blog/template/og.webp',

  // ===========================================================================
  // NAVEGACIÓN (Breadcrumbs)
  // ===========================================================================
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_tutoriales', // Ajustar según categoría
    categoryUrl: '/blog/tutoriales',
    currentKey: 'blogTemplateEnterprise_breadcrumbCurrent',
  },

  // ===========================================================================
  // FAQ SECTION (5-8 preguntas para PAA)
  // ===========================================================================
  /**
   * Las FAQs generan FAQPage schema automáticamente
   * Optimizar para "People Also Ask" de Google
   * Incluir variaciones de la keyword principal
   *
   * NOTA 2026: FAQ schema sigue siendo válido y activamente soportado
   * Aunque Google restringe rich results a sitios autoritativos,
   * el schema sigue ayudando a AI platforms a extraer contenido
   */
  faqSection: {
    enabled: true,
    titleKey: 'blogTemplateEnterprise_faqTitle',
    faqs: [
      // FAQ 1: Pregunta "¿Qué es?"
      {
        id: '1',
        questionKey: 'blogTemplateEnterprise_faq1Question',
        answerKey: 'blogTemplateEnterprise_faq1Answer',
      },
      // FAQ 2: Pregunta "¿Cómo?"
      {
        id: '2',
        questionKey: 'blogTemplateEnterprise_faq2Question',
        answerKey: 'blogTemplateEnterprise_faq2Answer',
      },
      // FAQ 3: Pregunta "¿Cuánto cuesta?"
      {
        id: '3',
        questionKey: 'blogTemplateEnterprise_faq3Question',
        answerKey: 'blogTemplateEnterprise_faq3Answer',
      },
      // FAQ 4: Pregunta "¿Necesito pareja?"
      {
        id: '4',
        questionKey: 'blogTemplateEnterprise_faq4Question',
        answerKey: 'blogTemplateEnterprise_faq4Answer',
      },
      // FAQ 5: Pregunta "¿Dónde?"
      {
        id: '5',
        questionKey: 'blogTemplateEnterprise_faq5Question',
        answerKey: 'blogTemplateEnterprise_faq5Answer',
      },
      // FAQ 6: Pregunta "¿Cuánto tiempo?"
      {
        id: '6',
        questionKey: 'blogTemplateEnterprise_faq6Question',
        answerKey: 'blogTemplateEnterprise_faq6Answer',
      },
      // FAQ 7: Pregunta sobre beneficios
      {
        id: '7',
        questionKey: 'blogTemplateEnterprise_faq7Question',
        answerKey: 'blogTemplateEnterprise_faq7Answer',
      },
      // FAQ 8: Pregunta sobre experiencia previa
      {
        id: '8',
        questionKey: 'blogTemplateEnterprise_faq8Question',
        answerKey: 'blogTemplateEnterprise_faq8Answer',
      },
    ],
  },

  // ===========================================================================
  // ARTÍCULOS RELACIONADOS (2-3)
  // ===========================================================================
  /**
   * Seleccionar artículos del mismo cluster temático
   * Ayuda a reducir bounce rate y aumentar tiempo en sitio
   */
  relatedArticles: [
    {
      slug: 'beneficios-bailar-salsa',
      category: 'lifestyle',
      titleKey: 'blogBeneficiosSalsa_title',
      excerptKey: 'blogBeneficiosSalsa_excerpt',
      image: '/images/blog/beneficios-salsa/hero.webp',
    },
    {
      slug: 'historia-salsa-barcelona',
      category: 'historia',
      titleKey: 'blogHistoriaSalsa_title',
      excerptKey: 'blogHistoriaSalsa_excerpt',
      image: '/images/blog/historia-salsa/hero.webp',
    },
  ],

  // ===========================================================================
  // CLASES RELACIONADAS (3-5) - CRÍTICO para conversión
  // ===========================================================================
  /**
   * Internal linking strategy:
   * - Siempre incluir la clase más relevante al tema
   * - Incluir clase de principiantes
   * - Incluir clases complementarias
   */
  relatedClasses: [
    'salsa-cubana-barcelona',
    'bachata-barcelona',
    'salsa-bachata-barcelona',
    'clases-baile-principiantes-barcelona',
  ],

  // ===========================================================================
  // CONFIGURACIÓN UX
  // ===========================================================================
  tableOfContents: {
    enabled: true,
    sticky: true, // ToC fijo en sidebar desktop
  },
  progressBar: {
    enabled: true,
  },
  shareButtons: {
    enabled: true,
    platforms: ['whatsapp', 'facebook', 'twitter', 'linkedin', 'email'],
  },

  // ===========================================================================
  // SCHEMAS ADICIONALES (ACTUALIZADO 2026)
  // ===========================================================================

  /**
   * LocalBusiness Schema (NUEVO - RECOMENDADO para artículos locales)
   * Activa schema.org/DanceSchool para mejorar local SEO
   */
  localBusinessSchema: {
    enabled: true, // Activar para artículos sobre Barcelona/local
    // Los datos se toman automáticamente de la config global de Farray's
  },

  /**
   * Course Schema (NUEVO - para artículos sobre clases)
   * Activa schema.org/Course para clases de baile
   */
  // courseSchema: {
  //   enabled: true,
  //   courseNameKey: 'blogTemplateEnterprise_courseName',
  //   courseDescriptionKey: 'blogTemplateEnterprise_courseDesc',
  //   provider: "Farray's Dance Center",
  //   courseMode: 'Blended', // 'Online' | 'OnSite' | 'Blended'
  //   offers: {
  //     price: '35',
  //     currency: 'EUR',
  //     availability: 'InStock',
  //   },
  // },

  /**
   * Event Schema (NUEVO - para artículos sobre eventos/horarios)
   */
  // eventSchema: {
  //   enabled: true,
  //   eventNameKey: 'blogTemplateEnterprise_eventName',
  //   startDate: '2026-02-01T19:00:00+01:00',
  //   endDate: '2026-02-01T21:00:00+01:00',
  //   location: "Farray's Dance Center Barcelona",
  //   offers: {
  //     price: '15',
  //     currency: 'EUR',
  //   },
  // },

  /**
   * AggregateRating Schema (NUEVO - para mostrar calificación)
   */
  aggregateRatingSchema: {
    enabled: true,
    ratingValue: 4.9,
    reviewCount: 127,
    bestRating: 5,
    worstRating: 1,
  },

  /**
   * Video Schema (si hay video embebido)
   * Activar cuando el artículo incluye un video de YouTube
   */
  // videoSchema: {
  //   enabled: true,
  //   videoId: 'YOUTUBE_VIDEO_ID',
  //   titleKey: 'blogTemplateEnterprise_videoTitle',
  //   descriptionKey: 'blogTemplateEnterprise_videoDesc',
  //   duration: 'PT10M30S', // ISO 8601 (10 min 30 seg)
  //   uploadDate: '2026-01-16',
  // },

  /**
   * HowTo Schema (solo para artículos tipo tutorial)
   * Genera rich snippets de "Cómo hacer" en Google
   */
  // howToSchema: {
  //   enabled: true,
  //   nameKey: 'blogTemplateEnterprise_howToName',
  //   descriptionKey: 'blogTemplateEnterprise_howToDesc',
  //   totalTime: 'PT30M', // ISO 8601
  //   estimatedCost: {
  //     currency: 'EUR',
  //     value: '35',
  //   },
  //   supplies: [
  //     'blogTemplateEnterprise_supply1',
  //     'blogTemplateEnterprise_supply2',
  //   ],
  //   tools: ['blogTemplateEnterprise_tool1'],
  //   steps: [
  //     {
  //       nameKey: 'blogTemplateEnterprise_step1Name',
  //       textKey: 'blogTemplateEnterprise_step1Text',
  //       image: '/images/blog/template/step-1.webp',
  //     },
  //     {
  //       nameKey: 'blogTemplateEnterprise_step2Name',
  //       textKey: 'blogTemplateEnterprise_step2Text',
  //       image: '/images/blog/template/step-2.webp',
  //     },
  //   ],
  // },

  // ===========================================================================
  // SPEAKABLE (Voice Search GEO)
  // ===========================================================================
  /**
   * Selectores CSS de secciones que pueden ser leídas en voz alta
   * por Google Assistant, Alexa, Siri
   * Incluir las secciones más importantes del artículo
   *
   * PRIORIDAD (ordenar por importancia para voice search):
   * 1. Summary box (respuesta rápida)
   * 2. Answer capsules (respuestas directas)
   * 3. Definiciones (conceptos clave)
   * 4. Stats destacados
   * 5. Intro y conclusión
   */
  speakableSelectors: [
    '#article-summary', // Summary box - SIEMPRE incluir (prioridad máxima)
    '[data-answer-capsule="true"]', // Answer capsules - crítico para GEO
    '#definicion', // Definición del concepto
    '[data-statistic="true"]', // Estadísticas destacadas
    '#intro', // Introducción
    '#conclusion', // Conclusión
  ],

  // ===========================================================================
  // GOOGLE DISCOVER OPTIMIZATION (2026)
  // ===========================================================================
  /**
   * Activa optimizaciones para Google Discover:
   * - Añade meta tag: <meta name="robots" content="max-image-preview:large">
   * - Requiere imágenes de 1200px+ de ancho
   * - Mejora visibilidad en feed de Discover (móvil)
   */
  discoverOptimized: true,
};

// ============================================================================
// TIPOS ADICIONALES PARA NUEVOS SCHEMAS (2026)
// ============================================================================

/**
 * Configuración de Author Schema completo para E-E-A-T
 * Usar en BlogArticleConfig.authorConfig
 */
export interface AuthorSchemaConfig {
  id: 'yunaisy' | 'mar';
  name: string;
  jobTitle: string;
  description: string;
  image: string;
  sameAs: string[]; // URLs a LinkedIn, Instagram, Twitter, etc.
  worksFor: {
    name: string;
    url: string;
    type: 'DanceSchool' | 'Organization';
  };
  credentials?: string[]; // Certificaciones
  knowsAbout?: string[]; // Áreas de expertise
}

/**
 * Configuración de autores disponibles en Farray's
 *
 * NOTA: Para uso real, importar de constants/blog/author.ts:
 * - AUTHOR_YUNAISY (principal)
 * - AUTHOR_MAR_GUERRERO (invitada)
 *
 * Estos autores ya usan translation keys (roleKey, bioKey, etc.)
 * para soporte i18n completo.
 */
export const FARRAY_AUTHORS: Record<string, AuthorSchemaConfig> = {
  yunaisy: {
    id: 'yunaisy',
    name: 'Yunaisy Farray',
    // IMPORTANTE: Usar keys de traducción, no texto hardcodeado
    jobTitle: 'blog_authorRole', // Se traduce con t('blog_authorRole')
    description: 'blog_authorBio', // Se traduce con t('blog_authorBio')
    image: '/images/team/yunaisy-farray.webp',
    sameAs: [
      'https://www.instagram.com/farraysdancecenter/',
      'https://www.linkedin.com/company/farrays-dance-center/',
      'https://www.facebook.com/farraysdancecenter',
    ],
    worksFor: {
      name: "Farray's Dance Center",
      url: 'https://www.farrays.com',
      type: 'DanceSchool',
    },
    credentials: [
      'CID-UNESCO',
      'blog_credential_specialization',
      'blog_credential_experience',
      'blog_credential_founder',
    ],
    knowsAbout: ['Salsa Cubana', 'Bachata', 'Danzas Latinas', 'Coreografía', 'Pedagogía del Baile'],
  },
  mar: {
    id: 'mar',
    name: 'Mar Guerrero',
    // IMPORTANTE: Usar keys de traducción, no texto hardcodeado
    jobTitle: 'blog_authorRoleMar', // Se traduce con t('blog_authorRoleMar')
    description: 'blog_authorBioMar', // Se traduce con t('blog_authorBioMar')
    image: '/images/team/mar.webp',
    sameAs: ['https://www.instagram.com/farraysdancecenter/'],
    worksFor: {
      name: "Farray's Dance Center",
      url: 'https://www.farrays.com',
      type: 'DanceSchool',
    },
    knowsAbout: ['Salsa', 'Bachata', 'Heels', 'Danzas Urbanas', 'Hip Hop'],
  },
};

// ============================================================================
// NOTAS DE IMPLEMENTACIÓN (ACTUALIZADO 2026)
// ============================================================================
/**
 * DESPUÉS DE CREAR EL ARTÍCULO:
 *
 * 1. Crear traducciones en:
 *    - locales/es/blog.json (o archivo correspondiente)
 *    - locales/ca/blog.json
 *    - locales/en/blog.json
 *    - locales/fr/blog.json
 *
 * 2. Registrar en constants/blog/index.ts:
 *    export { NOMBRE_CONFIG } from './articles/nombre-articulo';
 *
 * 3. Agregar a components/pages/BlogArticlePage.tsx:
 *    const ARTICLE_CONFIGS = {
 *      'slug-del-articulo': NOMBRE_CONFIG,
 *      ...
 *    };
 *
 * 4. Agregar rutas en prerender.mjs:
 *    { path: 'es/blog/categoria/slug', lang: 'es', page: 'blogSlug' },
 *    { path: 'ca/blog/categoria/slug', lang: 'ca', page: 'blogSlug' },
 *    { path: 'en/blog/categoria/slug', lang: 'en', page: 'blogSlug' },
 *    { path: 'fr/blog/categoria/slug', lang: 'fr', page: 'blogSlug' },
 *
 * 5. Agregar metadata en prerender.mjs para cada idioma
 *
 * 6. Crear imágenes en:
 *    - public/images/blog/nombre-articulo/hero.webp (1200x630)
 *    - public/images/blog/nombre-articulo/hero-480.webp
 *    - public/images/blog/nombre-articulo/hero-960.webp
 *    - ... otras imágenes del artículo
 *
 * 7. Verificar con: npm run build
 *
 * 8. NUEVO: Validar schemas en:
 *    - https://search.google.com/test/rich-results
 *    - https://validator.schema.org/
 *
 * 9. NUEVO: Verificar accessibility con:
 *    - Lighthouse Accessibility audit
 *    - axe DevTools extension
 *
 * 10. NUEVO: Agendar revisión de contenido (30-90 días)
 *     para actualizar dateModified
 */

// ============================================================================
// QUICK REFERENCE: CAMBIOS PRINCIPALES V2.0 (2026)
// ============================================================================
/**
 * RESUMEN DE MEJORAS V2.0:
 *
 * 1. AUTHOR SCHEMA COMPLETO (E-E-A-T)
 *    - Añadido: author field con FARRAY_AUTHORS config
 *    - Incluye: jobTitle, sameAs, worksFor, credentials
 *
 * 2. FRECUENCIA DE STATS (GEO +40% citabilidad)
 *    - ANTES: 1 stat cada 500-700 palabras
 *    - AHORA: 1 stat cada 150-200 palabras
 *    - Template incluye 5+ stats de ejemplo
 *
 * 3. NUEVOS SCHEMAS
 *    - LocalBusiness/DanceSchool
 *    - Course (para clases)
 *    - Event (para horarios)
 *    - AggregateRating
 *
 * 4. WCAG 2.2 ACCESSIBILITY
 *    - Checklist completo en documentación
 *    - Image loading="lazy" para below-fold
 *    - width/height obligatorios para CLS
 *
 * 5. PILLAR/CLUSTER STRATEGY
 *    - contentType: 'pillar' | 'cluster' | 'standalone'
 *    - pillarSlug / clusterSlugs para linking automático
 *
 * 6. CORE WEB VITALS 2026
 *    - INP < 200ms (reemplazó FID)
 *    - LCP < 2.5s
 *    - CLS < 0.1
 *
 * 7. AI PLATFORM OPTIMIZATION
 *    - Answer capsules aumentados (2-4)
 *    - Speakable mejorado con stats
 *    - Content freshness policy
 *
 * 8. CONTENT FRESHNESS
 *    - Política de revisión cada 30-90 días
 *    - dateModified tracking obligatorio
 *
 * 9. GOOGLE DISCOVER (NUEVO)
 *    - Meta tag max-image-preview:large
 *    - Imágenes 1200px+ de ancho
 *    - Mobile performance < 2s
 *
 * 10. HREFLANG 4 IDIOMAS (NUEVO)
 *     - Self-referencing obligatorio
 *     - x-default configurado
 *     - URLs limpias por idioma
 *
 * 11. READABILITY GUIDELINES (NUEVO)
 *     - Target: Grade 6-9 para snippets
 *     - Oraciones 15-20 palabras
 *     - Estructura clara
 *
 * 12. SEMANTIC HTML5 (NUEVO)
 *     - Estructura article correcta
 *     - Landmarks con aria-labelledby
 *     - Heading hierarchy
 *
 * FUENTES:
 * - Core Web Vitals: https://www.neoseo.co.uk/core-web-vitals-2026/
 * - FAQ Schema AI: https://www.frase.io/blog/faq-schema-ai-search-geo-aeo
 * - Topic Clusters: https://searchengineland.com/guide/topic-clusters
 * - Internal Linking: https://rathoreseo.com/blog/ai-seo-topic-clusters-internal-linking/
 * - Google Discover: https://www.newsifier.com/blog/the-ultimate-google-discover-optimization-guide-12-tips-on-how-to-get-more-traffic
 * - Hreflang Guide: https://www.weglot.com/guides/hreflang-tag
 * - Semantic HTML5: https://dev.to/gerryleonugroho/semantic-html-in-2025-the-bedrock-of-accessible-seo-ready-and-future-proof-web-experiences-2k01
 * - Readability SEO: https://ahrefs.com/blog/flesch-reading-ease/
 */
