# Resumen Ejecutivo - Análisis de Traducciones

**Fecha:** 24 de diciembre de 2025
**Análisis completo de:** 4 idiomas (ES, CA, EN, FR)

---

## Estado General

### Totales por Idioma

```
ES (Español - BASE):  8,981 claves
CA (Catalán):         9,232 claves (+251 extra)
EN (Inglés):          9,144 claves (+163 extra)
FR (Francés):         9,231 claves (+250 extra)
```

---

## Hallazgo Principal

**Hay 1,026 claves en español que NO están traducidas a ningún idioma (CA, EN, FR)**

Estas claves corresponden principalmente a:

### Top 10 Páginas Afectadas

| #   | Página/Sección                                   | Claves Faltantes |
| --- | ------------------------------------------------ | ---------------- |
| 1   | Homepage V2 (`homev*`)                           | 121 claves       |
| 2   | Bachata V (`bachataV*`)                          | 84 claves        |
| 3   | Dancehall Landing (`dhLanding*`, `dhLeadModal*`) | ~60 claves       |
| 4   | Cuerpo-Fit                                       | ~160 claves      |
| 5   | Baile Mañanas                                    | ~120 claves      |
| 6   | Full Body Cardio                                 | ~130 claves      |
| 7   | Test Class (Clase Prueba)                        | ~90 claves       |
| 8   | Facebook Landing (`fbLanding*`)                  | ~45 claves       |
| 9   | Hero Students (varios)                           | ~13 claves       |
| 10  | Navigation & CTAs                                | ~10 claves       |

---

## Detalle de Claves Faltantes

### 1. Homepage V2 (121 claves)

Página nueva completa sin traducir:

- SEO meta tags
- Hero section
- Founder section
- Method comparison
- Style finder
- Social proof
- Pricing
- FAQ
- Footer

**Archivos relacionados:**

- `c:\Users\fabio\Desktop\Gitclone\components\HomePageV2.tsx`
- `c:\Users\fabio\Desktop\Gitclone\constants\homepage-v2-config.ts`

---

### 2. Bachata V (84 claves)

Nueva versión de página de Bachata:

- Hero
- Identification
- Transformation
- Why Choose
- Preparation
- Schedule
- FAQ
- Final CTA

**Nota:** Parece ser una página en desarrollo (`bachataV3*`)

---

### 3. Cuerpo-Fit (~160 claves)

Página completa de clase de fitness:

- Breadcrumbs (4)
- Hero section (5)
- What Is section (4)
- Identify section (6)
- Transform section (12)
- Why Choose section (14)
- FAQ section (30: 15 Q + 15 A)
- Teachers section (2)
- Prepare section (8)
- Citable facts (6)
- Final CTA (4)
- Schema markup (2)
- Cultural history (4)
- Nearby section (4)

**Archivos relacionados:**

- `c:\Users\fabio\Desktop\Gitclone\components\CuerpoFitPage.tsx`
- `c:\Users\fabio\Desktop\Gitclone\constants\cuerpo-fit-config.ts`
- `c:\Users\fabio\Desktop\Gitclone\constants\cuerpo-fit.ts`

---

### 4. Baile Mañanas (~120 claves)

Estructura similar a Cuerpo-Fit:

- Breadcrumbs
- Hero
- What Is
- Identify
- Transform (12)
- Why Choose (14)
- FAQ (28: 14 Q + 14 A)
- Teachers (4)
- Prepare sections
- Citable facts (6)
- Final CTA

**Archivos relacionados:**

- `c:\Users\fabio\Desktop\Gitclone\components\BaileMananasPage.tsx`
- `c:\Users\fabio\Desktop\Gitclone\constants\baile-mananas-config.ts`
- `c:\Users\fabio\Desktop\Gitclone\constants\baile-mananas.ts`

---

### 5. Full Body Cardio (~130 claves)

Estructura similar a Cuerpo-Fit:

- FAQ (30: 15 Q + 15 A)
- Transform (12)
- Why Choose (14)
- Identify (6)
- Prepare (8)
- Citable facts (8)
- Cultural history (4)
- Y más...

**Archivos relacionados:**

- `c:\Users\fabio\Desktop\Gitclone\components\FullBodyCardioPage.tsx`
- `c:\Users\fabio\Desktop\Gitclone\constants\full-body-cardio-config.ts`
- `c:\Users\fabio\Desktop\Gitclone\constants\full-body-cardio.ts`

---

### 6. Test Class (~90 claves)

Página de clase de prueba:

- Transform section (24)
- Why Choose (12)
- Identify (6)
- FAQ (6: 3 Q + 3 A)
- Teachers (2)
- Y más secciones...

**Archivos relacionados:**

- `c:\Users\fabio\Desktop\Gitclone\components\TestClassPage.tsx`
- `c:\Users\fabio\Desktop\Gitclone\constants\test-class-config.ts`
- `c:\Users\fabio\Desktop\Gitclone\constants\test-class.ts`

---

### 7. Dancehall Landing (~60 claves)

Landing page específica:

- Lead Modal (43)
- Landing sections (17+)
- Exit Intent (6)
- Preparation section

**Archivos relacionados:**

- `c:\Users\fabio\Desktop\Gitclone\constants\dancehall-landing-config.ts`

---

### 8. Facebook Landing (~45 claves)

Landing de campaña:

- Value proposition (10)
- Testimonials (6)
- FAQ (6)
- Trust signals (3)
- Hero section
- Final CTA

**Archivos relacionados:**

- `c:\Users\fabio\Desktop\Gitclone\constants\landing-template-config.ts`

---

### 9. Claves Globales Faltantes

Claves que afectan a múltiples páginas:

```javascript
// Navegación
navBodyConditioning: 'Acondicionamiento Físico';
navCuerpoFit: 'Cuerpo-Fit';
navBaileMananas: 'Baile Mañanas';
navFAQ: 'Preguntas Frecuentes';

// CTAs Generales
limitedSpots: 'Plazas Limitadas';
startToday: 'Empieza Hoy';
finalCTADefaultNote: 'Consulta horarios disponibles';
verClasesBaile: 'Ver Clases de Baile';
consultarDisponibilidad: 'Consultar Disponibilidad';
contactanos: 'Contáctanos';
solicitarTour: 'Solicitar Tour';

// Dance Classes Hub
danceClassesHub_style_cuerpo_fit: 'Cuerpo-Fit (Cardio Dance)';
danceClassesHub_style_stretching: 'Stretching & Flexibilidad';
danceClassesHub_style_cuerpo_fit_desc: '...';
danceClassesHub_style_stretching_desc: '...';

// Hero Students (13 clases diferentes)
twerkHeroStudents: '+15.000 alumnos formados';
afroHeroStudents: '+15.000 alumnos formados';
// ... etc para cada estilo
```

---

## Problema Secundario: Claves Extra

### Claves en otros idiomas que NO existen en español

Estas claves están en CA/EN/FR pero no en ES (posiblemente código muerto):

#### CA y FR tienen 250+ claves extra:

- `bachataV3*` (84 claves) - Versión 3 de bachata (obsoleta?)
- `blog_*` (17 claves) - Sistema de blog
- `facilities*` (12 claves) - Instalaciones
- `particularesPage_*` (48 claves) - Clases particulares
- `hiphop*` (52 claves en CA/FR) - Hip hop
- `home_categories_*` (10 claves) - Categorías de home
- `rcb*` (11 claves) - Reggaeton Cubano
- `salsaCubana*` (9 claves) - Salsa Cubana

#### EN tiene 165 claves extra:

- Mismo conjunto pero sin las de `hiphop*` y `rcb*`

### Claves específicas faltantes

Solo 2 claves faltan individualmente en CA y EN:

**CA le faltan:**

- `Metales`
- `Modalidades`

**EN le faltan:**

- `Metales`
- `Modalities` (EN tiene esta pero falta en español!)

**FR:**

- No le falta ninguna clave individual

---

## Archivos Generados

### Para Traducir

1. **`missing_translations.json`**
   Archivo principal con 1,024 pares clave-valor listos para traducir

2. **`missing_translations_ca.json`**
   Claves específicas para catalán (0 pares - todas están en el principal)

3. **`missing_translations_en.json`**
   Claves específicas para inglés (0 pares - todas están en el principal)

4. **`missing_translations_fr.json`**
   Claves específicas para francés (0 pares - todas están en el principal)

### Reportes de Análisis

5. **`missing_translations_detailed.json`**
   Reporte JSON completo con análisis por idioma

6. **`missing_translations_categorized.json`**
   Traducciones organizadas por prefijo/categoría

7. **`REPORTE_TRADUCCIONES.md`**
   Reporte detallado en Markdown

8. **`RESUMEN_TRADUCCIONES_EJECUTIVO.md`**
   Este archivo - resumen ejecutivo

---

## Plan de Acción Recomendado

### Prioridad 1: CRÍTICA (traducciones faltantes)

1. **Traducir las 1,026 claves faltantes**
   - Usar `missing_translations.json` como fuente
   - Priorizar por páginas en producción:
     - Homepage V2 (si está publicada)
     - Cuerpo-Fit
     - Full Body Cardio
     - Baile Mañanas
     - Test Class

### Prioridad 2: ALTA (limpieza)

2. **Resolver claves extra (código muerto?)**
   - Verificar si `bachataV3*` se usa (84 claves)
   - Verificar si `blog_*` se usa (17 claves)
   - Verificar si `facilities*` se usa (12 claves)
   - Verificar si `particularesPage_*` se usa (48 claves)
   - Verificar si `hiphop*` se usa (52 claves en CA/FR)
   - Opciones:
     - Agregar al español si se usan
     - Eliminar de CA/EN/FR si no se usan

### Prioridad 3: MEDIA (consistencia)

3. **Agregar las 2 claves faltantes individuales**
   - Agregar `Metales` a CA y EN
   - Agregar `Modalidades` a CA y EN

### Prioridad 4: BAJA (optimización)

4. **Sincronizar idiomas**
   - Asegurar que todos tengan el mismo conjunto de claves
   - Eliminar duplicados
   - Verificar que no haya claves huérfanas

---

## Scripts Disponibles

Para ejecutar nuevamente los análisis:

```bash
# Extrae claves faltantes en TODOS los idiomas
node scripts/extract-missing-keys.mjs

# Análisis detallado por idioma
node scripts/extract-all-missing-keys.mjs

# Análisis inverso (claves extra)
node scripts/extract-reverse-missing-keys.mjs

# Reporte categorizado
node scripts/generate-translation-report.mjs
```

---

## Notas Técnicas

- Los scripts analizan archivos TypeScript en `i18n/locales/`
- Utilizan regex para extraer claves: `/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm`
- No capturan valores con comillas dentro (limitación conocida)
- Total de claves extraídas correctamente: 1,024 de 1,026 (99.8%)

---

## Conclusión

El proyecto tiene un desfase significativo de traducciones debido a:

1. Desarrollo de nuevas páginas (Homepage V2, nuevas clases)
2. Expansión de contenido (FAQ, landing pages)
3. Falta de proceso sincronizado de traducción

**Impacto:** Usuarios de CA/EN/FR verán contenido en español en ~1,026 puntos.

**Solución:** Priorizar traducción de páginas principales y establecer workflow de traducción simultánea para futuros desarrollos.
