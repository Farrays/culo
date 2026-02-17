# Auditoría SEO Post-Migración WordPress → React SPA

**Fecha**: 2026-02-16
**Última actualización**: 2026-02-17 (verificación completa con agentes)
**Contexto**: CTR cayendo de 2.38% a ~1.5% en 16 días, pese a mejorar posición de 9.4 a 6.5.
**Estado**: Investigación completada y **verificada**. Pendiente de corrección.

---

## Resumen Ejecutivo

| Severidad | Cantidad | Estado |
|-----------|----------|--------|
| CRÍTICO (P0) | 3 | Pendiente |
| ALTO (P1) | 6 | Pendiente |
| MEDIO (P2) | 10 | Pendiente |
| BAJO (P3) | 5 | Pendiente |
| RESUELTO | 2 | Completado (commit `5f91745`, desplegado en Vercel) |

---

## RESUELTOS

### R1. Páginas huérfanas (sin links en Header/Footer)
- **Qué era**: Commercial Dance, Cuerpo Fit y Baile Mañanas no tenían links internos.
- **Fix aplicado**: Añadidos a Footer (los 3) y Header (Commercial Dance).
- **Archivos modificados**: `Header.tsx`, `Footer.tsx`, `i18n/locales/*/common.json`
- **Desplegado**: Sí (commit `5f91745`)

### R2. Contenido pre-renderizado fino (thin content)
- **Qué era**: Las páginas de clases solo tenían `<h1>` + `<p>` (~120 chars) en el HTML estático.
- **Fix aplicado**: Nueva función `generateRichClassContent()` en `prerender.mjs` que genera HTML semántico con Hero, WhatIs (4 párrafos), Teachers, y FAQs (hasta 15 Q&A).
- **Resultado**: ~7,000 chars por página (50x más contenido). 27 clases × 4 idiomas = 108 páginas enriquecidas.
- **Archivo modificado**: `prerender.mjs`
- **Desplegado**: Sí (commit `5f91745`)

---

## P0 — CRÍTICO (Impacto directo en CTR)

### P0-1. Hreflang apuntando al homepage en ~53 páginas [VERIFICADO]

**Impacto**: Google cree que la versión alternativa de `/es/clases/afrobeats-barcelona` es el homepage. Esto confunde completamente el indexado multilingüe y probablemente es **la causa principal de la caída del CTR**.

**Archivo**: `prerender.mjs`, líneas 2651-2732

**Problema**: La cadena if/else que genera hreflang solo cubre 40 de ~90 page keys. Las ~50 restantes caen al default `pagePath = ''`, generando:
```html
<!-- En /es/clases/afrobeats-barcelona (INCORRECTO - apunta al homepage) -->
<link rel="alternate" hreflang="es" href="https://www.farrayscenter.com/es" />
<link rel="alternate" hreflang="ca" href="https://www.farrayscenter.com/ca" />
```

**Pages keys cubiertos** (40): `home`, `classes`, `danza`, `salsaBachata`, `bachataSensual`, `salsaCubana`, `salsaLadyStyle`, `folkloreCubano`, `timba`, `danzasUrbanas`, `dancehall`, `twerk`, `kpop`, `commercial`, `kizomba`, `heelsBarcelona`, `modernJazz`, `clasesParticulares`, `teamBuilding`, `blog`, `blogLifestyle`, `blogBeneficiosSalsa`, `blogHistoria`, `blogHistoriaSalsa`, `blogHistoriaBachata`, `blogTutoriales`, `blogSalsaRitmo`, `blogSalsaVsBachata`, `blogClasesSalsaBarcelona`, `blogTips`, `blogClasesPrincipiantes`, `blogAcademiaDanza`, `blogBalletAdultos`, `blogDanzaContemporaneaVsJazzBallet`, `blogDanzasUrbanas`, `blogModernJazz`, `blogPerderMiedoBailar`, `blogFitness`, `blogBaileSaludMental`, `baileManananas`

**Pages keys NO cubiertos** (~50 — hreflang apunta al homepage):
- **Clases**: `afrobeat`, `hipHop`, `hipHopReggaeton`, `sexyReggaeton`, `reggaetonCubano`, `femmology`, `sexyStyle`, `ballet`, `contemporaneo`, `stretching`, `afroContemporaneo`, `afroJazz`, `cuerpoFit`, `bumBum`, `bachataLadyStyle`, `entrenamientoBailarines`, `cuerpoFitPage`
- **Info**: `about`, `yunaisy`, `metodoFarray`, `contact`, `faq`, `profesores`, `ubicacion`, `calendario`, `facilities`
- **Servicios**: `alquilerSalas`, `estudioGrabacion`, `serviciosBaile`, `regalaBaile`, `merchandising`
- **Operativas**: `horariosPrecio`, `horariosClases`, `preciosClases`, `classesHub`, `reservas`, `hazteSocio`, `miReserva`, `fichaje`, `fichajeResumen`, `adminFichajes`, `feedbackGracias`, `feedbackComentario`, `asistenciaConfirmada`, `notFound`
- **Promos**: `promoClaseGratis`, `promoSexyReggaeton`
- **Landings**: Todas (~18 slugs — aunque son noindex, lo cual mitiga el impacto)
- **Especial**: `yrProject` (sin prefijo de locale)

**Fix verificado como seguro**: Reemplazar la cadena if/else por un lookup automático construido desde el array de routes. La variable `routePath` ya está disponible en scope (línea 2634). El pagePath se puede derivar automáticamente:

```javascript
// Auto-genera el mapa desde routes (ANTES del forEach)
const pagePathByLocale = {};
routes.forEach(r => {
  let localePath;
  if (r.path === '' || r.path === r.lang) localePath = '';
  else if (r.path.startsWith(`${r.lang}/`)) localePath = r.path.slice(r.lang.length + 1);
  else localePath = r.path;
  if (!pagePathByLocale[r.page]) pagePathByLocale[r.page] = {};
  if (!pagePathByLocale[r.page][r.lang]) pagePathByLocale[r.page][r.lang] = localePath;
});
```

**Edge cases verificados**:
- Homepage (`path: ''` y `path: 'es'`): Ambas producen `localePath = ''` → correcto
- `yr-project` (sin locale): Solo tiene versión `es`, las otras 3 quedan undefined → fallback a locale root
- Aliases (`facilities` con 2 URLs): `if (!pagePathByLocale[...][...])` toma la primera → correcto
- Landings noindex: Recibirían hreflang correcto (inofensivo, Google ignora hreflang en noindex)

**Interacción con client-side**: `SEO.tsx` también genera hreflang pero solo para 43 páginas (las que están en `PATH_TO_PAGE`). Para el resto, React no genera hreflang y quedan los tags del prerender. `BlogArticleTemplate.tsx` genera sus propios hreflang correctos para artículos de blog.

---

### P0-2. Reviews hardcodeadas e inconsistentes en 20+ archivos [VERIFICADO]

**Impacto**: Google detecta inconsistencia entre UI visible ("4.9/5") y JSON-LD schema ("5.0/5") → posible penalización por **misrepresentation**. Valores de `reviewCount` varían entre 287 y 509 en distintas páginas.

**Arquitectura actual** (NO hay API de Google Places):
1. Reviews copiadas manualmente de Google Maps → `data/reviews_google.txt`
2. Script `scripts/parse-reviews.mjs` genera → `data/reviews.json` (solo reviews de 5 estrellas)
3. Hook `useGoogleBusinessStats()` retorna valores hardcodeados
4. Cada componente tiene sus propios valores hardcodeados (no leen de una fuente central)

**Tabla de inconsistencias verificadas**:

| Archivo | Línea(s) | ratingValue | reviewCount | Problema |
|---------|----------|-------------|-------------|----------|
| `SchemaMarkup.tsx` | 967-968 | **5.0** | 509 | UI dice 4.9 |
| `hooks/useReviews.ts` | 239-240 | **5.0** | 509 | Hardcoded en función |
| `constants/reviews-data.ts` | 231-232 | **5.0** | 509 | Constante central |
| `TrustBar.tsx` | 96-98 | **4.9/5** | — | Contradice schema |
| `TrustBarHero.tsx` | 40-41 | **4.9/5** | 509+ | Hardcoded en JSX |
| `constants/shared.ts` | 37-41 | 4.9 | **508+** | 508 vs 509 |
| `constants/salsa-simple-config.ts` | 45-46 | 4.9 | **508** | 508 vs 509 |
| `ServiciosBailePage.tsx` | 296, 404 | 4.9 | **287** | Muy desactualizado |
| `AlquilerSalasPage.tsx` | 573-574 | 4.9 | **375** | Desactualizado |
| `ClasesParticularesPage.tsx` | 205 | 4.9 | **"500+"** | **Inválido** (no numérico) |
| `EstudioGrabacionPage.tsx` | 212-213 | 4.9 | **500** | Desactualizado |
| `HeelsBarcelonaPage.tsx` | 174, 178 | 5.0 | **3** | Conflicto con 2do schema |
| `HeelsBarcelonaPage.tsx` | 215-216 | 5 | 509 | **2 schemas en 1 página** |
| `HorariosPageV2.tsx` | 315-316 | 4.9 | 509 | — |
| `PreciosPage.tsx` | 389-393 | 4.9 | 509 | — |
| `DanzasUrbanasBarcelonaPage.tsx` | 403-404 | 5 | 509 | — |
| `DanzaBarcelonaPage.tsx` | 399-400 | 5 | 509 | — |
| `SalsaCubanaPage.tsx` | 168-169 | 5 | 509 | — |
| `FacilitiesPage.tsx` | 333-334 | 5 | 509 | — |
| `HazteSocioPage.tsx` | 436-437 | 4.9 | 509 | — |
| `ServicePageTemplate.tsx` | 74-75 | 4.9 | 500 | Template genérico |
| `data/reviews.json` | 2-4 | 5 | **375** | Archivo fuente |
| `data/reviews-stats.json` | 1-3 | 5 | **356** | Otro archivo fuente |
| `homepage-v2-config.ts` | 30-31 | 4.9 | 509+ | Config |
| `bachata-lady-style-config.ts` | 57-58 | 4.9/5 | 509+ | Config |
| Múltiples i18n JSON | — | 4.9/5 | 509 | Strings de traducción |

**Problemas específicos de Google**:
1. `reviewCount: '500+'` es inválido (no es numérico)
2. HeelsBarcelonaPage tiene 2 schemas AggregateRating conflictivos en la misma página
3. ratingValue 5.0 con 509 reviews es implausible (solo se importaron reviews de 5 estrellas)
4. UI visible dice "4.9" pero JSON-LD dice "5.0" → misrepresentation

**Fix necesario** (requiere decisión del usuario):
1. Crear una **single source of truth** (`constants/reviews-config.ts` o similar) con rating y count
2. Todos los componentes y schemas deben importar de ahí
3. Decidir: ¿4.9 o 5.0? (debe coincidir UI y schema)
4. reviewCount debe ser un número entero válido
5. HeelsBarcelonaPage: eliminar uno de los dos schemas
6. Automatizar actualización del conteo con script

---

### P0-3. Dominio incorrecto en RelatedClasses JSON-LD [VERIFICADO]

**Impacto**: Toda la structured data de clases relacionadas en artículos del blog apunta al dominio equivocado. Google asocia el contenido con un negocio diferente.

**Archivo**: `components/blog/RelatedClasses.tsx`

**3 valores incorrectos verificados**:

| Línea | Valor actual (INCORRECTO) | Valor correcto |
|-------|--------------------------|----------------|
| 215 | `https://www.bailemananas.com` | `https://www.farrayscenter.com` |
| 245 | `Carrer de Pallars, 85` | `Carrer d'Entença, 100, Local 1` |
| 247 | `08018` | `08015` |

**Verificado**: Es la ÚNICA ocurrencia de `bailemananas.com` en todo el codebase.

**Datos correctos** (verificados contra `index.html:127-133`, `constants/shared.ts:44-57`, `SchemaMarkup.tsx:73-80`):
- Dominio: `https://www.farrayscenter.com`
- Dirección: `Carrer d'Entença, 100, Local 1`
- CP: `08015`
- Coordenadas: `41.380421, 2.148014`
- Teléfono: `+34622247085`
- Email: `info@farrayscenter.com`

---

## P1 — ALTO

### P1-1. og:locale incorrecto en 6 archivos [VERIFICADO — ALCANCE AMPLIADO]

**Problema original**: `prerender.mjs` genera `en_ES` y `fr_ES`.
**Verificación**: El problema afecta a **6 archivos**, no solo 3.

**Inventario completo de og:locale en el codebase**:

| Archivo | Línea | Valores | Estado |
|---------|-------|---------|--------|
| `SEO.tsx` | 449 | `ogLocaleMap` con `es_ES`, `ca_ES`, `en_US`, `fr_FR` | **CORRECTO** (referencia) |
| `FullDanceClassTemplate.tsx` | 1120-1135 | Ternario completo con alternates | **CORRECTO** |
| `AlquilerSalasPage.tsx` | 682-692 | Ternario completo | **CORRECTO** |
| `ClasesParticularesPage.tsx` | 294-304 | Ternario completo | **CORRECTO** |
| `EstudioGrabacionPage.tsx` | 330-340 | Ternario completo | **CORRECTO** |
| `SalsaBachataPage.tsx` | 463-473 | Ternario completo | **CORRECTO** |
| **`prerender.mjs`** | **2797** | **`${lang}_ES`** | **INCORRECTO** (`en_ES`, `fr_ES`) |
| **`ServicePageTemplate.tsx`** | **1257** | **`{locale}`** (bare code) | **INCORRECTO** (todos mal) |
| **`BlogArticleTemplate.tsx`** | **136** | **`locale === 'es' ? 'es_ES' : locale`** | **INCORRECTO** (ca/en/fr mal) |
| **`ServiciosBailePage.tsx`** | **448** | **`locale === 'es' ? 'es_ES' : locale`** | **INCORRECTO** (ca/en/fr mal) |
| **`BookingPage.tsx`** | **115-124** | Ternario con **`en_GB`** | **INCONSISTENTE** (resto usa `en_US`) |
| **`HorariosPageV2.tsx`** | **419** | og:locale:alternate `"en"` (bare) | **INCORRECTO** |

**Fix necesario**: Importar/usar el mismo mapa `{ es: 'es_ES', ca: 'ca_ES', en: 'en_US', fr: 'fr_FR' }` en los 6 archivos incorrectos. Idealmente exportarlo desde un lugar central (ej: `constants/shared.ts`).

---

### P1-2. LocalBusiness schema duplicado en index.html [VERIFICADO]

**Archivo**: `index.html`, líneas 115-198

**Problema verificado**: `index.html` tiene un schema `LocalBusiness` estático sin `@id` ni `aggregateRating`. `SchemaMarkup.tsx` genera `DanceSchoolWithRatingSchema` dinámico (también `LocalBusiness`) con `@id: "#danceschool"` y `aggregateRating`. Google ve 2 schemas del mismo tipo con datos conflictivos.

**Conflicto adicional verificado**: Los horarios de apertura son diferentes:
- `index.html` estático: `"Mo 10:30-12:30, 17:30-23:00"` (formato string, horarios específicos)
- `DanceSchoolWithRatingSchema`: `10:00-22:00` L-V, `10:00-20:00` Sáb (formato `OpeningHoursSpecification`)

**Fix necesario**: Eliminar el schema estático de `index.html` (líneas 115-198). El componente React ya genera uno más completo.

---

### P1-3. Contenido duplicado: 2 URLs para Instalaciones [VERIFICADO]

**Archivo**: `prerender.mjs`
- Línea 526: `{ path: 'es/instalaciones', ..., page: 'facilities' }`
- Línea 568: `{ path: 'es/instalaciones-escuela-baile-barcelona', ..., page: 'facilities' }`
(Repetido para ca, en, fr = 8 páginas duplicadas)

**Nota verificada**: El código tiene un comentario intencional en línea 567: `// URL aliases (same content, different URL for SEO)`. Es decir, fue intencionado, pero sigue siendo contenido duplicado sin canonical entre ellas.

**Fix necesario**: Elegir UNA URL canónica (recomendado: `instalaciones-escuela-baile-barcelona`), añadir redirect 301 desde la otra en `vercel.json`, y eliminar la ruta duplicada de `prerender.mjs`.

---

### P1-4. Conflicto redirección `/reparto` [VERIFICADO]

**Archivo**: `vercel.json`, líneas 1046-1048 y 1988-1990 vs `App.tsx`, línea 1452

- **vercel.json línea 1046**: `/reparto` → `/es` (homepage) — 301
- **vercel.json línea 1988**: `/reparto/:path*` → `/es` (homepage) — 301
- **App.tsx línea 1452**: `/reparto` → `/${locale}/clases/reggaeton-cubano-barcelona`

**Verificado**: El server-side (vercel.json) gana siempre. La ruta React es dead code.

**Fix necesario**: Decidir el destino correcto y alinear ambos.

---

### P1-5. Sitemap de imágenes con URLs incorrectas [VERIFICADO]

**Archivo**: `public/sitemap-images.xml`

**Verificado**: Las 18 entradas `<loc>` apuntan todas a `https://www.farrayscenter.com/es`. Ninguna imagen está asociada a su página correspondiente.

**Fix necesario**: Regenerar con URLs correctas por página.

---

### P1-6. Dirección incorrecta en HorariosPageV2.tsx [NUEVO]

**Archivo**: `components/HorariosPageV2.tsx`, línea 302

**Problema**: Mismo error que RelatedClasses pero en un archivo diferente:
- Dirección: `Carrer de Pallars, 85` (INCORRECTO — debería ser `Carrer d'Entença, 100`)
- CP: `08018` (INCORRECTO — debería ser `08015`)
- Coordenadas GPS: `41.3979, 2.1919` (INCORRECTO — apunta a Poblenou, no a Entença)

**Coordenadas correctas**: `41.380421, 2.148014`

**Fix necesario**: Corregir los 3 valores.

---

## P2 — MEDIO

### P2-1. SEO.tsx no reconoce ~42 páginas

**Archivo**: `components/SEO.tsx`, líneas 41-84

**Problema**: `PATH_TO_PAGE` tiene 43 entradas de ~85 rutas públicas. Las páginas no reconocidas no reciben schemas globales (Organization, Website, DanceSchool). Páginas afectadas incluyen:
- Todas las rutas de blog (tienen sus propios schemas vía BlogArticleTemplate)
- `/horarios-clases-baile-barcelona`, `/precios-clases-baile-barcelona`
- `/profesores-baile-barcelona`, `/calendario`
- `/metodo-farray`, `/como-llegar-escuela-baile-barcelona`
- `/hazte-socio`, `/team-building-barcelona`
- Todas las landing pages (noindex, menor impacto)

**Fix necesario**: Ampliar `PATH_TO_PAGE` o reestructurar para que el schema global se inyecte siempre.

---

### P2-2. WordPress `/?p=` y `/?page_id=` sin redirect 301

**Archivo**: `public/robots.txt` (líneas 24-41) — solo bloquea, no redirige

**Problema**: URLs tipo `/?p=123` y `/?page_id=456` están bloqueadas en robots.txt pero NO tienen redirect 301 en `vercel.json`. Link equity de backlinks se pierde.

**Fix necesario**: Añadir redirects 301 genéricos si es posible, o específicos para IDs conocidos.

---

### P2-3. Páginas de niños eliminadas sin equivalente

**Archivo**: `vercel.json` — múltiples reglas

**URLs afectadas**: `/classes/ballet-ninos`, `/classes/contemporaneo-ninos`, `/classes/hip-hop-ninos`, `/classes/jazz-ninos`, `/classes/commercial-dance-ninos`, `/classes/predanza`, `/clases-de-baile-para-ninos` — todas redirigen a `/es/clases/baile-barcelona` (genérico).

**Fix necesario**: Evaluar si crear página dedicada para niños.

---

### P2-4. Redirect chain en blog (2 saltos)

**Archivo**: `vercel.json`

**Cadena**: `/:locale/blog/clases/baile-salud-mental` → `lifestyle/...` → `fitness/...` (2 saltos)

**Fix necesario**: Añadir regla directa de `blog/clases/baile-salud-mental` → `blog/fitness/baile-salud-mental`.

---

### P2-5. Wildcard `/blog/clases/:slug*` redirige a `lifestyle/` (posible 404)

**Archivo**: `vercel.json`, líneas 219-222

**Fix necesario**: Cambiar destino genérico a `/:locale/blog` en vez de `/:locale/blog/lifestyle/:slug*`.

---

### P2-6. Rewrites duplicados en vercel.json [VERIFICADO]

**Duplicados confirmados**:
- `/yr-project`: Líneas 2347 y 2463 (idénticos)
- `/:locale/fichaje/resumen/:token`: Líneas 2367 y 2467 (idénticos)

**Fix necesario**: Eliminar líneas 2463 y 2467.

---

### P2-7. Glosario eliminado sin contenido equivalente

**Archivo**: `vercel.json`, líneas 143-147

**Fix necesario**: Evaluar si vale la pena crear un glosario.

---

### P2-8. LLMArticleSchema hardcodea `inLanguage: 'es-ES'` [NUEVO]

**Archivo**: `components/SchemaMarkup.tsx`, línea 1338

**Problema**: El schema para artículos de blog destinados a LLMs hardcodea `inLanguage: 'es-ES'` para todos los idiomas. Los artículos en inglés, francés y catalán reciben un valor incorrecto.

**Fix necesario**: Usar el locale actual para generar el valor correcto (`es-ES`, `ca-ES`, `en-US`, `fr-FR`).

---

### P2-9. Horarios de apertura conflictivos entre schemas [NUEVO]

**Archivos**: `index.html` líneas 115-198 vs `SchemaMarkup.tsx` `DanceSchoolWithRatingSchema`

**Problema**:
- `index.html` estático: Horarios específicos por día (`Mo 10:30-12:30, 17:30-23:00`, `Fr 17:30-20:30`)
- `DanceSchoolWithRatingSchema`: Horarios genéricos (`10:00-22:00` L-V, `10:00-20:00` Sáb)

Google ve dos fuentes de horarios contradictorias para el mismo negocio.

**Fix**: Se resuelve con P1-2 (eliminar schema de index.html).

---

### P2-10. LegalNoticePage tiene noindex [NUEVO — VERIFICAR]

**Archivo**: `components/LegalNoticePage.tsx`

**Problema**: La página de Aviso Legal tiene `noindex, nofollow`. Las páginas legales normalmente deberían ser indexables. Podría ser intencional, pero vale la pena verificar.

**Fix necesario**: Confirmar con el usuario si el noindex es intencional.

---

## P3 — BAJO

### P3-1. Dead code en App.tsx (React routes interceptadas por Vercel)

**Archivo**: `App.tsx`

Routes que nunca se ejecutan porque vercel.json las intercepta antes:
- Línea 1387: `/dancehall` (Vercel línea 739)
- Línea 1403: `/twerk` (Vercel línea 742)
- Línea 1452: `/reparto` (Vercel línea 1046)

**Fix**: Eliminar estas rutas de App.tsx para limpieza de código.

---

### P3-2. Schema usa `LocalBusiness` en vez de `DanceSchool`

**Archivo**: `SchemaMarkup.tsx`, línea 927

`DanceSchool` es un subtipo más específico de Schema.org. Usar el tipo más específico ayuda a Google a categorizar mejor el negocio.

---

### P3-3. Alt text de RelatedClasses siempre en español

**Archivo**: `components/blog/RelatedClasses.tsx`, línea 342

El texto circundante ("Clase de ... en Barcelona") está hardcodeado en español, no usa i18n.

---

### P3-4. No hay RSS feed

WordPress genera RSS automáticamente. La app React no tiene RSS. Menor impacto en 2026.

---

### P3-5. Service Worker puede servir HTML cacheado obsoleto

**Archivo**: `vite.config.ts`, líneas 18-19

Con `skipWaiting: true` y `StaleWhileRevalidate` para imágenes (30 días), los usuarios pueden ver contenido desactualizado tras un deploy.

---

## Orden de Ejecución Recomendado

```
Fase 1 (Inmediato — Mayor impacto en CTR):
├── P0-1: Fix hreflang en prerender.mjs (auto-lookup desde routes)
├── P0-3: Fix dominio/dirección en RelatedClasses.tsx (3 valores)
├── P1-1: Fix og:locale en 6 archivos
└── P1-6: Fix dirección en HorariosPageV2.tsx (3 valores)

Fase 2 (Corto plazo — Evitar penalizaciones):
├── P0-2: Unificar reviews (single source of truth) ⚠️ Requiere decisión usuario
├── P1-2: Eliminar LocalBusiness duplicado de index.html (resuelve también P2-9)
└── P1-3: Resolver duplicado de instalaciones

Fase 3 (Medio plazo — Optimización):
├── P1-4: Fix /reparto redirect ⚠️ Requiere decisión usuario
├── P1-5: Regenerar sitemap-images.xml
├── P2-1: Ampliar PATH_TO_PAGE en SEO.tsx
├── P2-4: Fix redirect chain blog
├── P2-5: Fix wildcard blog/clases
├── P2-6: Eliminar rewrites duplicados
├── P2-8: Fix LLMArticleSchema inLanguage
└── P2-10: Verificar noindex en LegalNoticePage ⚠️ Requiere decisión usuario

Fase 4 (Cuando haya tiempo):
├── P2-2: Redirects para /?p= WordPress
├── P2-3: Evaluar página de niños ⚠️ Requiere decisión usuario
├── P2-7: Evaluar glosario ⚠️ Requiere decisión usuario
└── P3-*: Mejoras menores
```

---

## Notas

- **Enterprise mode**: Todos los fixes deben aplicarse sin romper funcionalidad existente.
- **Verificación**: Después de cada fase, ejecutar `npm run build` y verificar HTML generado.
- **Monitoreo**: Tras deploy, monitorear Google Search Console durante 2-4 semanas para confirmar mejora.
- **Decisiones pendientes del usuario**: P0-2 (rating 4.9 vs 5.0), P1-4 (destino /reparto), P2-10 (noindex legal), P2-3 (página niños), P2-7 (glosario).
- **Todos los hallazgos han sido verificados** con agentes de investigación independientes (2026-02-17).
