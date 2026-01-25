# Plan de Implementación GEO Enterprise - Farray's Dance Center

> **Estado:** Pendiente - Ejecutar después de terminar blog y homepage
> **Última actualización:** Enero 2026

## Resumen Ejecutivo

Análisis profundo completado. El proyecto tiene una **base SEO excelente** pero necesita optimizaciones específicas para el nuevo paradigma de búsqueda por IA (ChatGPT, Claude, Perplexity).

### Puntuación Actual vs Objetivo

| Área                                         | Actual     | Objetivo    |
| -------------------------------------------- | ---------- | ----------- |
| Configuración Técnica (llms.txt, robots.txt) | 4/10       | 9/10        |
| Enlazado Interno                             | 6/10       | 8.5/10      |
| Estructura Contenido para IA                 | 8/10       | 9/10        |
| E-E-A-T                                      | 7.5/10     | 9/10        |
| Presencia Externa / Citabilidad              | 7/10       | 8.5/10      |
| **TOTAL GEO**                                | **6.5/10** | **9.5+/10** |

---

## FASE 1: Configuración Técnica (CRÍTICA)

### 1.1 Crear `public/llms.txt`

**Prioridad:** CRÍTICA | **Tiempo:** 15 min

```text
# Farray's International Dance Center
> Academia de baile de élite en Barcelona dirigida por Yunaisy Farray. Método Farray® exclusivo, +25 estilos, acreditación CID-UNESCO. Desde 2017, +15,000 estudiantes.

## Información Principal
- Web: https://www.farrayscenter.com
- Email: info@farrayscenter.com
- Teléfono: +34 622 247 085
- Dirección: Carrer d'Entença, 100, Local 1, 08015 Barcelona, Spain

## Páginas Clave
- [Inicio](https://www.farrayscenter.com/es): Academia de baile Barcelona
- [Clases](https://www.farrayscenter.com/es/clases/baile-barcelona): +25 estilos de danza
- [Método Farray](https://www.farrayscenter.com/es/metodo-farray): Metodología exclusiva
- [Sobre Nosotros](https://www.farrayscenter.com/es/sobre-nosotros): Historia y valores
- [Profesores](https://www.farrayscenter.com/es/profesores): Equipo internacional
- [FAQ](https://www.farrayscenter.com/es/preguntas-frecuentes): Preguntas frecuentes

## Estilos de Baile
Bachata Sensual, Salsa Cubana, Reggaeton, Hip Hop, Twerk, Dancehall, Afrobeats, Heels, Danza Contemporánea, Ballet, Modern Jazz, Lady Style, Commercial Dance, Afro-Cubano, Folklore Cubano, Sexy Style, Femmology, Body Conditioning, Stretching.

## Servicios
- Clases grupales (todos los niveles)
- Clases particulares personalizadas
- Alquiler de salas (700m²)
- Eventos corporativos y team building
- Estudio de grabación profesional

## Credenciales y Autoridad
- Fundadora: Yunaisy Farray (ENA Cuba, +20 años experiencia)
- Acreditación: CID-UNESCO
- Rating: 5.0 estrellas (505+ reseñas Google)
- Apariciones: Street Dance 2 (IMDb), Got Talent España, The Dancer

## Sitemap
https://www.farrayscenter.com/sitemap.xml
```

### 1.2 Actualizar `public/robots.txt`

**Prioridad:** CRÍTICA | **Tiempo:** 10 min

Añadir después de las reglas existentes:

```text
# AI Crawlers - GEO Optimization
User-agent: GPTBot
Allow: /
Crawl-delay: 1

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: CCBot
Allow: /
Crawl-delay: 2

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: cohere-ai
Allow: /

# LLMs.txt location for AI discovery
# https://www.farrayscenter.com/llms.txt
```

---

## FASE 2: Pre-rendering de Home (CRÍTICA)

### 2.1 Añadir contenido para Home en `prerender.mjs`

**Prioridad:** CRÍTICA | **Tiempo:** 1 hora
**Archivo:** `prerender.mjs`

**Problema:** La home page está VACÍA para bots que no ejecutan JavaScript.

**Solución:** Modificar `PAGES_TO_EXCLUDE_FROM_AUTO_CONTENT` y crear `initialContent.home`:

```javascript
// En initialContent.es (línea ~400)
home: `<main id="main-content">
  <h1>Farray's International Dance Center - Academia de Baile en Barcelona</h1>
  <p>Descubre el arte del baile con más de 25 estilos: Bachata Sensual, Salsa Cubana, Hip Hop, Twerk, Reggaeton, Dancehall y más. Método Farray® exclusivo, profesores internacionales, instalaciones de 700m². Centro acreditado por CID-UNESCO.</p>

  <section>
    <h2>¿Por qué Farray's?</h2>
    <ul>
      <li>+15,000 estudiantes satisfechos desde 2017</li>
      <li>505+ reseñas de Google con rating 5.0 estrellas</li>
      <li>Dirigido por Yunaisy Farray, artista internacional</li>
      <li>Método propio Farray® reconocido por CID-UNESCO</li>
      <li>700m² de instalaciones profesionales</li>
    </ul>
  </section>

  <section>
    <h2>Clases de Baile en Barcelona</h2>
    <p>Bachata Sensual, Salsa Cubana, Hip Hop, Reggaeton, Twerk, Dancehall, Afrobeats, Heels, Danza Contemporánea, Ballet, Modern Jazz, Lady Style, Commercial Dance.</p>
  </section>

  <section>
    <h2>Contacto</h2>
    <p>Carrer d'Entença 100, Local 1, Barcelona 08015. Teléfono: +34 622 247 085. Email: info@farrayscenter.com</p>
  </section>
</main>`,
```

Repetir para `ca`, `en`, `fr` con traducciones apropiadas.

---

## FASE 3: Indexación de FAQ (ALTA)

### 3.1 Cambiar FAQ de `noindex` a `index`

**Prioridad:** ALTA | **Tiempo:** 5 min
**Archivo:** `components/FAQPage.tsx:272`

```tsx
// CAMBIAR DE:
<meta name="robots" content="noindex, nofollow" />

// A:
<meta name="robots" content="index, follow" />
```

**Impacto:** 28 FAQs de alto valor serán indexables por IAs.

### 3.2 Limpiar HTML en respuestas de FAQ

**Prioridad:** ALTA | **Tiempo:** 30 min
**Archivo:** `i18n/locales/es.ts` (y otros idiomas)

**Problema:** Las respuestas FAQ tienen HTML embebido que dificulta la lectura por IAs.

```javascript
// ANTES (actual):
faq_reservas_1_a: '<p>Si es la primera vez... <a href="...">link</a>...</p>';

// DESPUÉS (limpio):
faq_reservas_1_a: 'Regístrate en www.farrayscenter.com/alta. Si ya eres estudiante, inicia sesión en Momence. Selecciona tu clase y realiza la compra. El proceso toma menos de 5 minutos.';
```

---

## FASE 4: Enlazado Interno (ALTA)

### 4.1 Implementar RelatedClasses en páginas de clases

**Prioridad:** ALTA | **Tiempo:** 1 hora
**Archivo:** `components/templates/FullDanceClassTemplate.tsx`

**Problema:** RelatedClasses solo se renderiza en Blog, no en páginas de clases.

**Solución:** Añadir antes del cierre del componente:

```tsx
{
  config.relatedClasses?.enabled && config.relatedClasses.classes.length > 0 && (
    <section className="py-16 bg-black/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8">{t('relatedClassesTitle')}</h2>
        <RelatedClasses
          relatedClasses={config.relatedClasses.classes.map(c => c.slug)}
          locale={locale}
        />
      </div>
    </section>
  );
}
```

**Impacto:** +30-40% más enlaces internos por página de clase.

---

## FASE 5: Estructura de Contenido para IA (MEDIA)

### 5.1 Mejorar About Page - Primera línea directa

**Prioridad:** MEDIA | **Tiempo:** 20 min
**Archivo:** `i18n/locales/es.ts` (about_intro)

```javascript
// ANTES (actual - divaga):
about_intro: 'Hay quienes buscan una escuela de baile parecida a las que ya conocen...';

// DESPUÉS (directo):
about_intro: "Farray's International Dance Center es una academia de danza multidisciplinar en Barcelona, acreditada por CID-UNESCO y dirigida por Yunaisy Farray. Ofrecemos +25 estilos de baile con el método exclusivo Farray®. Nuestra historia comenzó no de un plan de negocio, sino de una historia de amor por la danza...";
```

### 5.2 Añadir FAQPage Schema en Homepage

**Prioridad:** MEDIA | **Tiempo:** 30 min
**Archivo:** `index.html` o `components/SchemaMarkup.tsx`

Añadir las 5-7 preguntas más frecuentes en schema:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuestan las clases de baile en Farray's?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ofrecemos diferentes modalidades desde clases sueltas hasta bonos mensuales. Las clases grupales tienen precios accesibles con descuentos para estudiantes y packs."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué estilos de baile enseñan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Más de 25 estilos: Bachata Sensual, Salsa Cubana, Hip Hop, Reggaeton, Twerk, Dancehall, Afrobeats, Heels, Danza Contemporánea, Ballet, Modern Jazz, Lady Style y más."
      }
    },
    {
      "@type": "Question",
      "name": "¿Necesito experiencia previa para empezar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, tenemos clases para todos los niveles desde principiante absoluto hasta avanzado. Nuestro método Farray® está diseñado para que progreses a tu ritmo."
      }
    }
  ]
}
```

---

## FASE 6: Corrección NAP (MEDIA)

### 6.1 Unificar dirección y coordenadas

**Prioridad:** MEDIA | **Tiempo:** 30 min
**Archivos:** `Footer.tsx`, `SchemaMarkup.tsx`, `ContactPage.tsx`

**Problema detectado:** Inconsistencias en NAP:

- Dirección: "Carrer d'Entença" vs "Calle Entenca"
- Coordenadas: 41.380421 vs 41.3751

**Solución:** Estandarizar en TODOS los archivos:

```
Dirección: Carrer d'Entença, 100, Local 1, 08015 Barcelona, Spain
Coordenadas: 41.3804, 2.1480
Teléfono: +34 622 247 085
Email: info@farrayscenter.com
```

---

## FASE 7: E-E-A-T Mejorado (BAJA)

### 7.1 Añadir sección "As Featured In"

**Prioridad:** BAJA | **Tiempo:** 1 hora
**Archivo:** `components/AboutPage.tsx` o nuevo componente

Crear sección visual con logos de:

- IMDb (Street Dance 2)
- Got Talent España
- The Dancer
- CID-UNESCO

### 7.2 Mejorar perfiles de profesores

**Prioridad:** BAJA | **Tiempo:** 2 horas
**Archivo:** `components/TeachersPage.tsx`

- Añadir fotos profesionales reales
- Expandir biografías con certificaciones
- Añadir Person schema individual

---

## Archivos a Modificar (Resumen Fase 1-7)

| Archivo                                             | Acción                     | Prioridad | Tiempo |
| --------------------------------------------------- | -------------------------- | --------- | ------ |
| `public/llms.txt`                                   | CREAR                      | CRÍTICA   | 15 min |
| `public/robots.txt`                                 | MODIFICAR                  | CRÍTICA   | 10 min |
| `prerender.mjs`                                     | MODIFICAR (home content)   | CRÍTICA   | 1 hora |
| `components/FAQPage.tsx`                            | MODIFICAR (robots meta)    | ALTA      | 5 min  |
| `i18n/locales/es.ts`                                | MODIFICAR (FAQ answers)    | ALTA      | 30 min |
| `components/templates/FullDanceClassTemplate.tsx`   | MODIFICAR (RelatedClasses) | ALTA      | 1 hora |
| `i18n/locales/es.ts`                                | MODIFICAR (about_intro)    | MEDIA     | 20 min |
| `index.html`                                        | MODIFICAR (FAQPage schema) | MEDIA     | 30 min |
| `Footer.tsx`, `SchemaMarkup.tsx`, `ContactPage.tsx` | MODIFICAR (NAP)            | MEDIA     | 30 min |

**Tiempo total Fase 1-7: 5-7 horas**

---

# PARTE 2: RUTA AL 10/10 (Estrategias Avanzadas)

## Diagnóstico Adicional para 10/10

| Área                   | Estado Actual      | Necesario para 10/10 |
| ---------------------- | ------------------ | -------------------- |
| Artículos de blog      | 6 artículos        | 25-30 artículos      |
| Comparativas/Top 10    | 0                  | 3-5 artículos        |
| Casos de estudio       | 0 estructurados    | 5-7 documentados     |
| VideoObject Schema     | Existe pero 0 usan | Todos los videos     |
| HowTo Schema           | Existe pero 0 usan | 3-5 tutoriales       |
| Review Schema          | 0                  | 10-15 testimonios    |
| Offer Schema (precios) | 0                  | En todas las clases  |
| Estadísticas propias   | Dispersas          | Página centralizada  |
| Investigación original | 0                  | 1-2 estudios         |

---

## FASE 8: Autoridad Temática (Contenido Pilar)

### 8.1 Crear artículos pilares prioritarios

**Prioridad:** ALTA para 10/10 | **Tiempo:** 2-3 semanas

**Artículos a crear (por orden de impacto):**

1. **"Top 10 Academias de Baile en Barcelona 2026"** (Estrategia Ninja)
   - Posicionar Farray's en #3 o #4 (más creíble)
   - Tabla comparativa: precio, estilos, ubicación, rating
   - Incluir competidores reales
   - Schema ItemList

2. **"Guía Completa: Aprender a Bailar en Barcelona"** (Pillar Page)
   - 3,000+ palabras
   - Enlaza a todos los estilos
   - FAQ con 15+ preguntas
   - HowTo Schema

3. **"Bachata Sensual vs Dominicana vs Moderna: Diferencias"**
   - Tabla comparativa
   - Video explicativo
   - Muy buscado en ChatGPT

4. **"Beneficios del Baile: Guía Científica Completa"**
   - Expandir artículo existente
   - Más fuentes (Harvard, NEJM, etc.)
   - Infografía original

5. **"Historia del Reggaeton: Del Caribe a Barcelona"**
   - Contenido único
   - Timeline visual
   - Sin competencia en español

### 8.2 Estructura de clústeres temáticos

**Arquitectura recomendada:**

```
PILLAR: /blog/baile-barcelona (Hub)
├── /blog/salsa-barcelona (Sub-pillar)
│   ├── historia-salsa-barcelona
│   ├── beneficios-bailar-salsa
│   ├── salsa-cubana-vs-la-vs-ny
│   └── mejores-clases-salsa-barcelona
├── /blog/bachata-barcelona (Sub-pillar)
│   ├── historia-bachata
│   ├── bachata-sensual-vs-dominicana
│   └── aprender-bachata-principiantes
└── /blog/danzas-urbanas-barcelona (Sub-pillar)
    ├── historia-reggaeton
    ├── hip-hop-barcelona
    └── twerk-beneficios
```

---

## FASE 9: Contenido Transaccional (MOFU/BOFU)

### 9.1 Crear casos de estudio estructurados

**Prioridad:** CRÍTICA para 10/10 | **Tiempo:** 1-2 semanas

**Estructura de cada caso:**

```markdown
## Caso de Éxito: [Nombre] - De Principiante a [Logro]

**Perfil:**

- Edad: 32 años
- Experiencia previa: Ninguna
- Estilo: Bachata Sensual
- Duración: 8 meses

**Situación inicial:**
"Nunca había bailado, tenía vergüenza en eventos sociales..."

**Proceso con Farray's:**

- Mes 1-2: Clases grupales principiante
- Mes 3-4: Clases intermedias + práctica social
- Mes 5-8: Nivel avanzado + showcase

**Resultados medibles:**
| Métrica | Antes | Después |
|---------|-------|---------|
| Confianza (1-10) | 3 | 9 |
| Pasos dominados | 0 | 45+ |
| Eventos sociales/mes | 0 | 4-6 |

**Testimonial verificado:**
"Farray's cambió mi vida social. Ahora bailo en eventos cada semana."

- [Nombre], verificado en Google Reviews
```

### 9.2 Crear comparativas de decisión

**Artículos recomendados:**

1. **"Farray's vs Otras Academias: Comparativa Honesta"**
2. **"¿Clases Grupales o Particulares? Guía para Decidir"**
3. **"¿Cuánto Cuesta Aprender a Bailar en Barcelona? (Precios 2026)"**

---

## FASE 10: Schema Markup Avanzado

### 10.1 Implementar VideoObject Schema

**Prioridad:** ALTA | **Tiempo:** 2-3 horas
**Archivos:** Configs de blog (`constants/blog/*.ts`)

```typescript
// En cada artículo con video:
videoSchema: {
  enabled: true,
  videoId: "ABC123",
  titleKey: "blogArticle_videoTitle",
  descriptionKey: "blogArticle_videoDesc",
  duration: "PT5M30S",
  uploadDate: "2026-01-15",
  thumbnailUrl: "/images/blog/video-thumb.webp",
  transcript: "Transcripción completa del video..." // CRÍTICO para IAs
}
```

### 10.2 Implementar HowTo Schema

**Prioridad:** ALTA | **Tiempo:** 2-3 horas
**Archivos:** Artículos de tutoriales

```typescript
// En artículos tipo "Cómo aprender..."
howToSchema: {
  enabled: true,
  nameKey: "howToLearnSalsa_name",
  descriptionKey: "howToLearnSalsa_desc",
  totalTime: "PT3M", // 3 meses
  steps: [
    { name: "Paso 1: Elegir estilo", text: "...", image: "..." },
    { name: "Paso 2: Primera clase", text: "...", image: "..." },
    { name: "Paso 3: Práctica social", text: "...", image: "..." }
  ]
}
```

### 10.3 Implementar Review Schema individual

**Prioridad:** ALTA | **Tiempo:** 1 hora
**Archivo:** `components/reviews/ReviewsSection.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "DanceSchool",
    "name": "Farray's International Dance Center"
  },
  "author": { "@type": "Person", "name": "Ana García" },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "reviewBody": "5 estrellas y porque no hay más. Espectacular...",
  "datePublished": "2025-12-15"
}
```

### 10.4 Implementar Offer Schema (precios)

**Prioridad:** MEDIA | **Tiempo:** 1 hora
**Archivos:** Páginas de clases

```json
{
  "@context": "https://schema.org",
  "@type": "Offer",
  "name": "Clase de Bachata Sensual",
  "price": "15",
  "priceCurrency": "EUR",
  "availability": "https://schema.org/InStock",
  "validFrom": "2026-01-01",
  "seller": {
    "@type": "DanceSchool",
    "name": "Farray's International Dance Center"
  }
}
```

---

## FASE 11: Contenido Único y Citable

### 11.1 Crear página de estadísticas oficiales

**Prioridad:** ALTA | **Tiempo:** 2 horas
**Ruta:** `/sobre-nosotros/estadisticas` o `/datos-farray`

```markdown
# Farray's en Números (Actualizado Q1 2026)

## Trayectoria

- **Años activos:** 8+ (desde 2017)
- **Estudiantes formados:** +15,000
- **Estudiantes activos:** +1,500

## Infraestructura

- **Espacio:** 700m²
- **Salas:** 4 con suelo especializado
- **Estilos:** 25+

## Satisfacción

- **Rating Google:** 5.0/5 (505+ reseñas)
- **Tasa de recomendación:** 94%
- **Retención anual:** 78%

## Equipo

- **Profesores certificados:** 12
- **Años experiencia promedio:** 15+
- **Acreditación:** CID-UNESCO

_Fuente: Datos internos Farray's Center, actualizado enero 2026_
```

### 11.2 Crear White Paper del Método Farray®

**Prioridad:** ALTA para máxima citabilidad | **Tiempo:** 1 semana

**Estructura:**

1. Introducción: Filosofía y origen
2. Pilar 1: Disciplina y Rigor (técnica clásica)
3. Pilar 2: Sabor y Ritmo (herencia afrodescendiente)
4. Pilar 3: Innovación Global (fusión de estilos)
5. Resultados documentados
6. Testimonios de expertos
7. Conclusiones

**Formato:** PDF descargable + página web

---

## FASE 12: Presencia Externa y Menciones

### 12.1 Registro en directorios clave

**Prioridad:** MEDIA | **Acción:** Manual

- [ ] Yelp Barcelona
- [ ] TripAdvisor (experiencias)
- [ ] Directorios de danza especializados
- [ ] Google Business Profile (verificar/optimizar)
- [ ] Bing Places

### 12.2 Estrategia de menciones

**Objetivo:** Aparecer en fuentes que IAs consultan

- Wikipedia: Evaluar si Yunaisy cumple criterios de notabilidad
- Reddit: Participar en r/Barcelona, r/dance
- Quora: Responder preguntas sobre baile en Barcelona
- Medium: Publicar artículos del blog

---

# PARTE 3: EEAT PROFESIONAL (Caso Práctico Nivel Clínica Dental)

## Diagnóstico EEAT Actual

| Aspecto                           | Requerido               | Estado Actual          | Impacto    |
| --------------------------------- | ----------------------- | ---------------------- | ---------- |
| Fotos reales de profesores        | Obligatorio             | Solo InitialsAvatar    | CRÍTICO    |
| Páginas individuales              | Cada especialista       | Solo Yunaisy           | CRÍTICO    |
| Enlaces DOFOLLOW a instituciones  | Universidades, colegios | ENA Cuba sin enlace    | CRÍTICO    |
| Blog firmado por especialista     | 100% artículos          | 5/6 con author default | IMPORTANTE |
| Sección de formación estructurada | Estudios listados       | Solo en narrativa      | IMPORTANTE |
| LinkedIn/verificación profesional | B2B credibility         | Solo Instagram         | MEDIO      |

**Estado EEAT: 45% → Objetivo: 90%**

---

## FASE 13: Páginas Individuales de Profesores

### 13.1 Crear páginas para cada profesor TIER GOLD

**Prioridad:** CRÍTICA para EEAT | **Tiempo:** 3-4 horas por profesor

**Estructura requerida (siguiendo caso clínica dental):**

```tsx
<article>
  {/* 1. HERO con foto real + nombre + storytelling */}
  <section>
    <img src="/images/teachers/alejandro-minoso-professional.webp" alt="Alejandro Miñoso" />
    <h1>Alejandro Miñoso - Ballet y Danza Contemporánea</h1>
    <p>Ex-bailarín de la Compañía Carlos Acosta, formado en la ENA Cuba...</p>
  </section>

  {/* 2. FORMACIÓN (Expertise) - CON ENLACES DOFOLLOW */}
  <section>
    <h2>Formación</h2>
    <ul>
      <li>
        <a href="https://www.ena.cult.cu/" rel="dofollow">
          Escuela Nacional de Arte (ENA), Cuba
        </a> - Especialidad en Danza
      </li>
      <li>
        <a href="https://www.carlosacostadanza.com/" rel="dofollow">
          Compañía Carlos Acosta
        </a> - Bailarín profesional
      </li>
    </ul>
  </section>

  {/* 3. EXPERIENCIA (Experience) */}
  <section>
    <h2>Experiencia Profesional</h2>
    <ul>
      <li>2020-presente: Profesor - Farray's International Dance Center</li>
      <li>2015-2020: Bailarín - Compañía Carlos Acosta</li>
    </ul>
  </section>

  {/* 4. SCHEMA PERSON */}
  <script type="application/ld+json">
    {
      "@type": "Person",
      "name": "Alejandro Miñoso",
      "jobTitle": "Dance Instructor",
      "alumniOf": [
        { "@type": "EducationalOrganization", "name": "ENA Cuba" }
      ],
      "worksFor": { "@type": "DanceSchool", "name": "Farray's" }
    }
  </script>
</article>
```

---

## FASE 14: Enlaces DOFOLLOW a Instituciones

### 14.1 Añadir enlace a ENA Cuba

**Prioridad:** CRÍTICA | **Tiempo:** 15 min
**Archivo:** `components/YunaisyFarrayPage.tsx`

```typescript
// Añadir a EXTERNAL_LINKS:
{
  pattern: /ENA Cuba|Escuela Nacional de Arte/gi,
  url: 'https://www.ena.cult.cu/',
  title: 'Escuela Nacional de Arte de Cuba',
},
```

### 14.2 Lista de instituciones a enlazar

| Institución            | URL                                   | Profesor                         |
| ---------------------- | ------------------------------------- | -------------------------------- |
| ENA Cuba               | https://www.ena.cult.cu/              | Yunaisy, Alejandro, Lía, Charlie |
| ISA Cuba               | https://www.institutosuperiorarte.cu/ | Grechén                          |
| CID-UNESCO             | https://cid-world.org/                | Todos                            |
| Compañía Carlos Acosta | https://www.carlosacostadanza.com/    | Alejandro                        |
| El Rey León (París)    | IMDb o web oficial                    | Lía                              |

---

## FASE 15: Clusterización de Blog por Especialista

### 15.1 Asignar artículos a autores específicos

**Prioridad:** ALTA | **Tiempo:** 30 min
**Archivos:** `constants/blog/*.ts`

| Artículo                    | Author Actual | Author Correcto     |
| --------------------------- | ------------- | ------------------- |
| beneficios-bailar-salsa     | Yunaisy       | Yunaisy ✓           |
| historia-salsa-barcelona    | Yunaisy       | Yunaisy ✓           |
| historia-bachata-barcelona  | Yunaisy       | **Mathias/Eugenia** |
| clases-baile-principiantes  | Yunaisy       | **CrisAg**          |
| salsa-ritmo-conquisto-mundo | Yunaisy       | **Lía Valdés**      |
| clases-de-salsa-barcelona   | Mar Guerrero  | Mar Guerrero ✓      |

---

# PARTE 4: INVENTARIO REAL Y ACCIONES ESPECÍFICAS

## Inventario Real de Profesores (18 en total)

### TIER GOLD - Máximo potencial E-E-A-T (crear páginas individuales)

| Profesor             | Credenciales                                  | Estilos                                 | Acción                                |
| -------------------- | --------------------------------------------- | --------------------------------------- | ------------------------------------- |
| **Yunaisy Farray**   | ENA Cuba, CID-UNESCO, Método Farray®, 25 años | Afro-Jazz, Salsa Lady, Femmology, Timba | Ya tiene página ✓ - Añadir enlace ENA |
| **Alejandro Miñoso** | ENA Cuba, **Compañía Carlos Acosta**          | Ballet, Modern Jazz, Afro-Contemporáneo | CREAR página individual               |
| **Lía Valdés**       | ENA Cuba, **El Rey León París**, 20 años      | Salsa Cubana, Salsa Lady Style          | CREAR página individual               |
| **Grechén Méndez**   | **ISA Cuba (Universidad)**, 25 años           | Folklore Cubano, Rumba, Timba           | CREAR página individual               |
| **Mathias Font**     | **Campeón Mundial Salsa LA**                  | Bachata, Bachata Sensual                | CREAR página individual               |
| **Eugenia Trujillo** | **Campeona Mundial Salsa LA**                 | Bachata Lady, Salsa LA                  | CREAR página individual               |

### TIER HIGH - Alto potencial E-E-A-T (ampliar bio)

| Profesor              | Credenciales                       | Estilos                     |
| --------------------- | ---------------------------------- | --------------------------- |
| **Daniel Sené**       | Escuela Nacional de Ballet de Cuba | Ballet, Contemporáneo, Yoga |
| **Iroel Bastarreche** | Ballet Folklórico de Camagüey      | Salsa Cubana, Folklore      |
| **Charlie Breezy**    | ENA Cuba                           | Hip Hop, Afrobeats          |
| **Marcos Martínez**   | Juez Internacional                 | Hip Hop, Breaking, Popping  |

### TIER MID - Potencial medio

| Profesor          | Credenciales                                            | Estilos           |
| ----------------- | ------------------------------------------------------- | ----------------- |
| CrisAg            | Método Farray® (2012), The Cuban School of Arts Londres | Body Conditioning |
| Yasmina Fernández | Método Farray® (2016)                                   | Salsa, Sexy Style |
| Sandra Gómez      | Formación Jamaicana, 6 años                             | Dancehall, Twerk  |
| Isabel López      | Formación Jamaica, 5 años                               | Dancehall, Twerk  |

### TIER STANDARD

| Profesor     | Estilos                      |
| ------------ | ---------------------------- |
| Carlos Canto | Bachata                      |
| Noemi        | Bachata Lady                 |
| Juan Alvarez | Bachata Sensual              |
| Redbhlue     | Afrobeats (origen: Tanzania) |

---

## Instituciones para Enlaces DOFOLLOW

| Institución                            | URL                                   | Profesores                        |
| -------------------------------------- | ------------------------------------- | --------------------------------- |
| **ENA Cuba**                           | https://www.ena.cult.cu/              | Yunaisy, Alejandro, Lía, Charlie  |
| **ISA Cuba**                           | https://www.institutosuperiorarte.cu/ | Grechén Méndez                    |
| **CID-UNESCO**                         | https://cid-world.org/                | Yunaisy (verificar enlace actual) |
| **Compañía Carlos Acosta**             | https://www.carlosacostadanza.com/    | Alejandro Miñoso                  |
| **El Rey León (París)**                | IMDb o web oficial                    | Lía Valdés                        |
| **Ballet Folklórico de Camagüey**      | Web oficial Cuba                      | Iroel Bastarreche                 |
| **Escuela Nacional de Ballet de Cuba** | https://www.balletcuba.cult.cu/       | Daniel Sené                       |

---

## Mapeo Blog → Autor Especialista

### Artículos Nuevos Recomendados

| Autor            | Artículo                                           | Esquema               |
| ---------------- | -------------------------------------------------- | --------------------- |
| Alejandro Miñoso | "Ballet para Adultos: Nunca es Tarde"              | HowTo + FAQ           |
| Alejandro Miñoso | "Carlos Acosta y la Revolución del Ballet Cubano"  | Article + Person      |
| Grechén Méndez   | "Raíces del Folklore Cubano"                       | Article + VideoObject |
| Grechén Méndez   | "La Rumba: Patrimonio Inmaterial de la Humanidad"  | Article (UNESCO link) |
| Mathias/Eugenia  | "Bachata Sensual vs Dominicana: Diferencias"       | ComparisonTable + FAQ |
| Mathias/Eugenia  | "Cómo Prepararse para Competiciones de Baile"      | HowTo                 |
| Marcos Martínez  | "Historia del Breaking: De Nueva York a Barcelona" | Article + VideoObject |
| Marcos Martínez  | "Cómo Juzgar una Batalla de Hip Hop"               | HowTo                 |
| Lía Valdés       | "De La Habana a El Rey León París: Mi Viaje"       | Article + Person      |
| Sandra/Isabel    | "Dancehall Auténtico: Guía para Principiantes"     | HowTo + FAQ           |

---

## Schemas Existentes vs Utilizados

| Schema                 | En SchemaMarkup.tsx | ¿Usado?         | Acción                      |
| ---------------------- | ------------------- | --------------- | --------------------------- |
| CourseSchemaEnterprise | ✅                  | ❌ 0 clases     | ACTIVAR en todas las clases |
| HowToSchema            | ✅                  | ❌ 0 artículos  | ACTIVAR en tutoriales       |
| SpeakableSchema        | ✅                  | ❌ 0 páginas    | ACTIVAR en FAQ y About      |
| DefinedTermSchema      | ✅                  | ❌ 0 páginas    | ACTIVAR en glosario         |
| EventSchema            | ✅                  | ❌ 0 eventos    | ACTIVAR para workshops      |
| FAQPageSchema          | ✅                  | ✅ En artículos | OK                          |
| VideoObject            | ❌ NO existe        | -               | CREAR componente            |

### Archivos donde activar schemas

```
components/templates/FullDanceClassTemplate.tsx
├── CourseSchemaEnterprise ← ACTIVAR (schedule data ya existe)
└── SpeakableSchema ← ACTIVAR

components/FAQPage.tsx
└── SpeakableSchema ← AÑADIR

components/AboutPage.tsx
└── SpeakableSchema ← AÑADIR

constants/blog/articles/*.ts
├── HowToSchema ← AÑADIR en tutoriales
└── VideoObject ← CREAR y añadir
```

---

## Inconsistencias NAP Detectadas

### Dirección

| Archivo          | Actual                           | Correcto     |
| ---------------- | -------------------------------- | ------------ |
| SchemaMarkup.tsx | "Carrer d'Entença, 100, Local 1" | ✅ CORREGIDO |

### Coordenadas

| Archivo          | Actual              | Correcto (Google Maps) |
| ---------------- | ------------------- | ---------------------- |
| SchemaMarkup.tsx | 41.380421, 2.148014 | ✅ CORREGIDO           |

### Año de Fundación

| Archivo            | Actual | Correcto     |
| ------------------ | ------ | ------------ |
| OrganizationSchema | "2017" | ✅ CORREGIDO |

---

## Acciones Técnicas Prioritarias

### CRÍTICAS (Hacer primero)

1. **Crear `public/llms.txt`** - 15 min
2. **Actualizar `public/robots.txt`** con bots IA - 10 min
3. **Cambiar FAQPage.tsx** de noindex a index - 5 min
4. **Añadir enlace ENA Cuba** en YunaisyFarrayPage.tsx - 10 min
5. **Corregir NAP** en SchemaMarkup.tsx - 20 min

### ALTAS (Semana 1-2)

6. **Pre-renderizar home** en prerender.mjs - 1 hora
7. **Activar RelatedClasses** en FullDanceClassTemplate.tsx - 30 min
8. **Crear página Alejandro Miñoso** (Carlos Acosta) - 2-3 horas
9. **Crear página Mathias/Eugenia** (Campeones Mundiales) - 2-3 horas
10. **Activar CourseSchemaEnterprise** en páginas de clases - 1 hora

### MEDIAS (Semana 2-4)

11. **Reasignar artículo bachata** a Mathias/Eugenia
12. **Crear AuthorConfig** para nuevos autores
13. **Crear componente VideoObjectSchema** para blog
14. **Añadir HowToSchema** a artículos tipo tutorial
15. **Crear página de estadísticas** /datos-farray

---

## Verificación de Implementación

### Test 1: Archivos técnicos

```bash
curl https://www.farrayscenter.com/llms.txt
curl https://www.farrayscenter.com/robots.txt | grep -E "GPTBot|anthropic"
```

### Test 2: Schema validación

- https://validator.schema.org/ → Pegar URL de clase
- Verificar: CourseSchemaEnterprise, DanceSchool, FAQPage

### Test 3: Pre-rendering home

```bash
curl -s https://www.farrayscenter.com/es | grep -o "<h1>.*</h1>" | head -1
# Debe mostrar H1, no vacío
```

### Test 4: FAQ indexable

```bash
curl -s https://www.farrayscenter.com/es/preguntas-frecuentes | grep "robots"
# Debe mostrar "index, follow"
```

### Test 5: ChatGPT manual (modo incógnito)

- "Academia de baile en Barcelona con profesores de ENA Cuba"
- "Clases de bachata con campeones mundiales Barcelona"
- "Escuela de ballet con ex-bailarín de Carlos Acosta"
- "Donde aprender folklore cubano Barcelona"

---

## Resumen Ejecutivo Final

| Métrica                          | Estado Actual            | Post-Implementación     |
| -------------------------------- | ------------------------ | ----------------------- |
| Profesores con página individual | 1 (Yunaisy)              | 7+ (Tier Gold + Marcos) |
| Enlaces DOFOLLOW a instituciones | 3 (IMDb, CID, Wikipedia) | 10+                     |
| Blog articles con autor experto  | 1/6                      | 6/6                     |
| Schemas implementados vs usados  | 65%                      | 95%                     |
| FAQ indexadas                    | 0                        | 28+                     |
| **Score GEO Total**              | **6.5/10**               | **9.5+/10**             |

---

## Decisiones Confirmadas

- **Landing pages:** Mantener `noindex` (campañas de pago)
- **Horarios/Precios:** Mantener `noindex` (datos dinámicos)

---

## Checklist Rápido

### Fase 1-7: Base Técnica (6.5 → 8.0)

- [ ] Crear llms.txt
- [ ] Actualizar robots.txt con bots IA
- [ ] Pre-renderizar home
- [ ] Indexar FAQ (cambiar noindex)
- [ ] RelatedClasses en páginas de clases
- [ ] Corregir NAP
- [ ] About directo

### Fase 8-12: Estrategias Avanzadas (8.0 → 9.0)

- [ ] 5 artículos pilares nuevos
- [ ] "Top 10 Academias Barcelona"
- [ ] 5-7 casos de estudio
- [ ] VideoObject Schema
- [ ] HowTo Schema
- [ ] Review Schema individual
- [ ] Página de estadísticas

### Fase 13-16: EEAT Profesional (9.0 → 10)

- [ ] Páginas Alejandro, Mathias/Eugenia, Grechén, Lía, Marcos
- [ ] Enlaces DOFOLLOW a ENA, ISA, Carlos Acosta
- [ ] Reasignar artículos a autores especialistas
- [ ] Fotos profesionales de todos los profesores
- [ ] AuthorConfig para nuevos autores

---

# PARTE 5: MONITORIZACIÓN Y TRACKING DE LLMs

## Estado Actual: 2/10 en Monitorización

**Problema:** No hay forma de saber si ChatGPT, Perplexity o Claude están citando la web.

---

## FASE 17: Tracking de Tráfico desde IAs en GA4

### 17.1 Código de detección de referrers IA

**Prioridad:** ALTA | **Tiempo:** 30 min
**Archivo:** `src/utils/analytics.ts` o en el componente de Analytics

```typescript
// Lista de referrers de interfaces de IA
const AI_REFERRERS = [
  'chat.openai.com',
  'chatgpt.com',
  'perplexity.ai',
  'claude.ai',
  'bard.google.com',
  'gemini.google.com',
  'bing.com/chat',
  'copilot.microsoft.com',
  'you.com',
  'poe.com',
  'character.ai',
];

// Función para detectar y trackear
export function trackAIReferral() {
  const referrer = document.referrer;

  const aiSource = AI_REFERRERS.find(ai => referrer.includes(ai));

  if (aiSource) {
    // Evento GA4
    gtag('event', 'ai_referral', {
      event_category: 'AI Traffic',
      ai_source: aiSource,
      landing_page: window.location.pathname,
      full_referrer: referrer,
    });

    // También guardar en localStorage para análisis
    const aiVisits = JSON.parse(localStorage.getItem('ai_visits') || '[]');
    aiVisits.push({
      source: aiSource,
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('ai_visits', JSON.stringify(aiVisits.slice(-100)));
  }
}
```

### 17.2 Implementación en App.tsx

**Archivo:** `src/App.tsx`

```typescript
import { trackAIReferral } from './utils/analytics';

useEffect(() => {
  trackAIReferral();
}, []);
```

### 17.3 Crear audiencia en GA4

**Ubicación:** GA4 > Admin > Audiencias > Nueva audiencia

```
Nombre: Tráfico desde IA
Condiciones:
- sessionSource contiene "perplexity" OR
- sessionSource contiene "chatgpt" OR
- sessionSource contiene "chat.openai" OR
- sessionSource contiene "claude" OR
- sessionSource contiene "bing.com/chat" OR
- sessionSource contiene "copilot"
```

### 17.4 Crear informe personalizado en GA4

**Ubicación:** GA4 > Explorar > Nuevo informe

```
Dimensiones:
- Fuente de sesión
- Página de destino
- Fecha

Métricas:
- Sesiones
- Usuarios
- Tasa de rebote
- Duración media

Filtro:
- Fuente contiene: perplexity|chatgpt|claude|bing/chat
```

---

## FASE 18: Herramientas Externas de Monitorización

### 18.1 Opciones de herramientas

| Herramienta    | Qué hace                                                           | Precio   | Recomendación         |
| -------------- | ------------------------------------------------------------------ | -------- | --------------------- |
| **Otterly.ai** | Monitoriza menciones en ChatGPT/Perplexity, tracking de posiciones | ~$49/mes | ⭐ Mejor opción       |
| **DinoRANK**   | LLMO tracking, herramienta española                                | ~€30/mes | Buena para España     |
| **BrightEdge** | Enterprise AI tracking                                             | $$$$     | Solo si escalan mucho |
| **Brand24**    | Menciones generales (incluye algunos LLMs)                         | ~$79/mes | Alternativa           |
| **Mention**    | Similar a Brand24                                                  | ~$41/mes | Básico                |

### 18.2 Monitorización manual (GRATIS)

**Frecuencia:** Semanal
**Tiempo:** 15 min/semana

**Preguntas a probar en ChatGPT/Perplexity (modo incógnito):**

```
1. "Mejores academias de baile en Barcelona"
2. "Donde aprender salsa cubana en Barcelona"
3. "Clases de bachata sensual Barcelona"
4. "Escuelas de hip hop Barcelona"
5. "Twerk classes Barcelona"
6. "Academia de baile con profesores cubanos Barcelona"
7. "Clases de baile para principiantes Barcelona"
8. "Farray's dance center opiniones"
```

**Registrar en spreadsheet:**
| Fecha | Prompt | LLM | ¿Mencionados? | Posición | Competidores mencionados |
|-------|--------|-----|---------------|----------|--------------------------|

### 18.3 Alertas de Google

**URL:** https://www.google.com/alerts

Crear alertas para:

- "Farray's" OR "Farrays"
- "Farray's Dance Center"
- "Yunaisy Farray"
- "escuela baile Barcelona" + tu zona

---

## FASE 19: Formato de Contenido Optimizado para IAs

### 19.1 Estructura de párrafos

**Problema actual:** Algunos párrafos son muy largos (5+ líneas)
**Solución:** Máximo 3-4 líneas por párrafo

```markdown
❌ MAL:
"Farray's International Dance Center es una academia de baile ubicada en
Barcelona que ofrece más de 25 estilos diferentes de danza incluyendo
salsa cubana, bachata sensual, hip hop, twerk, dancehall y muchos más,
con profesores internacionales certificados y un método exclusivo
llamado Método Farray® reconocido por CID-UNESCO."

✅ BIEN:
"Farray's International Dance Center es una academia de baile en Barcelona
con más de 25 estilos de danza.

Ofrecemos salsa cubana, bachata sensual, hip hop, twerk, dancehall y más.

Nuestros profesores internacionales utilizan el Método Farray®,
reconocido por CID-UNESCO."
```

### 19.2 Bullet points al inicio

**Añadir en páginas de servicios/clases:**

```html
<section class="key-points">
  <h2>Lo que debes saber</h2>
  <ul>
    <li><strong>Primera clase gratis</strong> para nuevos estudiantes</li>
    <li><strong>Todos los niveles:</strong> principiante a avanzado</li>
    <li><strong>Profesores certificados</strong> con experiencia internacional</li>
    <li><strong>Ubicación:</strong> Metro Entença (L5), Barcelona</li>
  </ul>
</section>
```

### 19.3 Uso de negritas estratégicas

**Términos a destacar siempre:**

- Nombres de estilos de baile
- Credenciales (CID-UNESCO, ENA Cuba)
- Números y estadísticas
- Llamadas a la acción

### 19.4 Tablas comparativas

**Añadir en páginas de clases:**

```markdown
| Nivel        | Experiencia requerida | Duración recomendada |
| ------------ | --------------------- | -------------------- |
| Principiante | Ninguna               | 3-6 meses            |
| Intermedio   | 6+ meses              | 6-12 meses           |
| Avanzado     | 1+ año                | Continuo             |
```

---

# PARTE 6: AUDITORÍA PREVIA INTEGRADA (DinoRank)

## Comparación de Auditorías

| Área                    | Auditoría DinoRank | Mi Análisis GEO                     | Coincidencia           |
| ----------------------- | ------------------ | ----------------------------------- | ---------------------- |
| Schema.org              | 9.5/10             | 14+ schemas, 65% usados             | ✅ Coincide            |
| SEO Tradicional         | 9/10               | Meta, canonical, hreflang excelente | ✅ Coincide            |
| E-E-A-T                 | 8/10               | 18 profesores, solo 1 con página    | ✅ Coincide            |
| Estructura contenidos   | 7/10               | Jerarquía h1-h4 correcta            | ✅ Coincide            |
| Formato presentabilidad | 6/10               | Falta bullets, negritas             | ✅ Coincide            |
| Contexto semántico      | 7/10               | DefinedTermSchema existe            | ✅ Coincide            |
| **Monitorización LLMs** | **2/10**           | **No lo cubrí inicialmente**        | ⚠️ DinoRank lo detectó |
| Visibilidad digital     | 6/10               | Directorios pendientes              | ✅ Coincide            |

## Lo que DinoRank encontró que yo no enfaticé:

1. **Monitorización de menciones** - Ahora añadido en Parte 5
2. **Formato de escaneo** - Bullets, negritas, tablas
3. **Transcripciones de video** - Para VideoObject

## Lo que yo añadí que DinoRank no tenía:

1. **llms.txt** - Archivo específico para IAs
2. **robots.txt con bots IA** - Permisos explícitos
3. **Inventario de 18 profesores** con tiers E-E-A-T
4. **Enlaces DOFOLLOW** a instituciones específicas
5. **Código de tracking GA4** para referrers IA

---

## Hallazgos de Auditoría DinoRank (Documentación)

### Fortalezas Identificadas

- ✅ Schema.org nivel empresarial (15+ tipos)
- ✅ E-E-A-T sólido (Yunaisy con credenciales verificables)
- ✅ Multiidioma impecable (4 idiomas + hreflang)
- ✅ Pre-rendering con metadata en <head>
- ✅ SpeakableSpecification implementado
- ✅ DefinedTermSchema para terminología

### Debilidades Críticas

- ❌ Contenido pre-renderizado vacío (~40 páginas)
- ❌ No hay tracking de menciones en IA
- ❌ Formato no optimizado para escaneo
- ❌ Falta estadísticas verificables visibles
- ❌ Presencia en directorios no verificada

### Páginas con initialContent vacío (priorizar)

```
home, classesHub, about, faq, dancehall, twerk,
salsaCubana, bachata, hipHop, ballet, contemporaneo,
heels, afrobeats, reggaeton, salsaLadyStyle
```

---

# PARTE 7: DIRECTORIOS Y PRESENCIA EXTERNA

## Checklist de Directorios

### Directorios Generales

- [ ] **Google Business Profile** - Verificar/optimizar
- [ ] **Bing Places** - Registrar si no existe
- [ ] **Apple Maps** - Añadir negocio
- [ ] **Yelp Barcelona** - Crear perfil
- [ ] **TripAdvisor** - Experiencias/actividades
- [ ] **Páginas Amarillas** - Verificar listado

### Directorios de Danza/Fitness

- [ ] **ClassPass** - Si aplica
- [ ] **Gympass** - Si aplica
- [ ] **Directorios de escuelas CID** - Verificar listado
- [ ] **Asociaciones de danza Barcelona**
- [ ] **Guías de ocio Barcelona** (TimeOut, etc.)

### Plataformas de Reseñas

- [ ] **Trustpilot** - Crear perfil
- [ ] **Facebook Reviews** - Activar
- [ ] **Google Reviews** - Ya tienen 505+ ✅

### Menciones en Medios

- [ ] **Notas de prensa** locales
- [ ] **Blogs de Barcelona** - Outreach
- [ ] **Influencers de danza** - Colaboraciones

---

## Estadísticas Verificables para Añadir

### Datos a incluir en About/Home

```markdown
## Farray's en Números

- **8+ años** de experiencia (desde 2017)
- **+15,000** estudiantes formados
- **+1,500** estudiantes activos
- **505+** reseñas en Google (5.0 ⭐)
- **25+** estilos de baile
- **700m²** de instalaciones
- **4** salas con suelo profesional
- **18** profesores certificados
- **Acreditación** CID-UNESCO
```

### Schema para estadísticas

```json
{
  "@context": "https://schema.org",
  "@type": "DanceSchool",
  "foundingDate": "2017",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": 18,
    "unitText": "profesores"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "505"
  }
}
```

---

# PARTE 8: RESUMEN EJECUTIVO FINAL

## Puntuación Actualizada

| Área                    | Antes      | Después de Parte 1-4 | Después de Parte 5-7 |
| ----------------------- | ---------- | -------------------- | -------------------- |
| Configuración Técnica   | 4/10       | 9/10                 | 9/10                 |
| Enlazado Interno        | 6/10       | 8.5/10               | 8.5/10               |
| Estructura Contenido    | 8/10       | 9/10                 | 9.5/10               |
| E-E-A-T                 | 7.5/10     | 9/10                 | 9.5/10               |
| Presencia Externa       | 7/10       | 8.5/10               | 9/10                 |
| **Monitorización LLMs** | **2/10**   | **2/10**             | **8/10**             |
| Formato para IA         | 6/10       | 7/10                 | 9/10                 |
| **TOTAL GEO**           | **6.5/10** | **8.5/10**           | **9.5/10**           |

---

## Orden de Implementación Recomendado

### Semana 1: Críticos (2-3 horas)

1. ✅ Crear `llms.txt`
2. ✅ Actualizar `robots.txt`
3. ✅ Cambiar FAQ a index
4. ✅ Implementar tracking GA4 para IAs
5. ✅ Corregir NAP

### Semana 2: Altos (4-5 horas)

6. Pre-renderizar home
7. Añadir bullets/negritas en páginas clave
8. Enlace ENA Cuba
9. Crear audiencia GA4 para tráfico IA

### Semana 3-4: Medios (8-10 horas)

10. Páginas de profesores Tier Gold
11. Estadísticas visibles en About/Home
12. Reasignar autores de blog
13. Verificar/crear perfiles en directorios

### Mes 2+: Avanzados

14. 5 artículos pilares
15. VideoObject Schema
16. HowTo Schema en tutoriales
17. Herramienta de monitorización externa (Otterly/DinoRANK)

---

## Métricas de Éxito

### KPIs a medir mensualmente

| Métrica                 | Baseline      | Objetivo 3 meses    | Objetivo 6 meses  |
| ----------------------- | ------------- | ------------------- | ----------------- |
| Tráfico desde IAs       | 0 (no medido) | Establecer baseline | +50%              |
| Menciones en ChatGPT    | ?             | Medir               | Aparecer en top 5 |
| Menciones en Perplexity | ?             | Medir               | Aparecer en top 5 |
| FAQ pages indexadas     | 0             | 28                  | 28+               |
| Profesores con página   | 1             | 4                   | 7                 |
| Artículos de blog       | 6             | 10                  | 20                |

### Cómo medir éxito en IAs

1. **Semanal:** Test manual en ChatGPT/Perplexity (15 min)
2. **Mensual:** Revisar GA4 audiencia "Tráfico desde IA"
3. **Trimestral:** Evaluar si contratar Otterly/DinoRANK

---

## Checklist Maestro Final

### Fase Técnica ✅

- [ ] `public/llms.txt` creado
- [ ] `public/robots.txt` con bots IA
- [ ] FAQ indexable (quitar noindex)
- [ ] NAP corregido en todos los archivos
- [ ] Home pre-renderizada

### Fase Tracking ✅

- [ ] Código tracking IAs en analytics.ts
- [ ] Audiencia GA4 "Tráfico desde IA"
- [ ] Spreadsheet de monitorización manual
- [ ] Alertas de Google configuradas

### Fase Contenido ✅

- [ ] Bullets al inicio de páginas clave
- [ ] Negritas en términos importantes
- [ ] Estadísticas visibles en About/Home
- [ ] About con respuesta directa en primer párrafo

### Fase E-E-A-T ✅

- [ ] Enlace ENA Cuba añadido
- [ ] Página Alejandro Miñoso
- [ ] Página Mathias/Eugenia
- [ ] Artículos reasignados a especialistas

### Fase Externa ✅

- [ ] Google Business optimizado
- [ ] Bing Places registrado
- [ ] Yelp Barcelona creado
- [ ] Directorios de danza verificados
