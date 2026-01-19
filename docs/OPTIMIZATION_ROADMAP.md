# Roadmap de Optimización Enterprise: i18n + Blog Escalable

> **Estado:** Para implementar al final del proyecto
> **Fecha de análisis:** 2026-01-19
> **Impacto estimado:** PageSpeed 70 → 90+ puntos

---

## Resumen Ejecutivo

Este roadmap documenta la estrategia enterprise para:

1. **Migrar a i18next** con namespace splitting (reducir bundles 73%)
2. **Escalar blog** de 8 a 80+ artículos sin degradar performance
3. **Implementar MDX** para contenido multiidioma
4. **Configurar ISR** para deploys instantáneos

---

## Diagnóstico Actual

### PageSpeed: Por Qué Tenemos 70 en Lugar de 90+

| Problema                        | Impacto LCP      | Impacto TBT   | Puntos Perdidos |
| ------------------------------- | ---------------- | ------------- | --------------- |
| **i18n bundles (1.4MB/locale)** | 1-2s             | 100-200ms     | **-15pts**      |
| **HLS.js video (508KB)**        | 500-800ms        | 80-150ms      | **-8pts**       |
| **React bundles (428KB)**       | 800ms-1.2s       | 120-200ms     | **-10pts**      |
| **GTM scripts bloqueantes**     | 200-300ms        | 50-100ms      | **-5pts**       |
| **CSS no optimizado (136KB)**   | 400-800ms        | 0             | **-4pts**       |
| **DNS prefetch excesivo (12)**  | 100-200ms        | 0             | **-3pts**       |
| **Sin Service Worker**          | -                | -             | **-2pts**       |
| **TOTAL**                       | **2-4 segundos** | **350-650ms** | **~47pts**      |

### Bundles de Traducción Actuales

```
i18n/locales/es.ts → 1.5MB (21,198 líneas)
i18n/locales/en.ts → 1.4MB (19,582 líneas)
i18n/locales/ca.ts → 1.5MB (19,832 líneas)
i18n/locales/fr.ts → 1.6MB (20,010 líneas)
─────────────────────────────────────────
TOTAL: 6.0MB de traducciones (370-400KB gzip por locale)
```

---

## Solución Validada: Migrar a i18next

### Por Qué i18next

| Factor                     | Hook Actual | i18next                         |
| -------------------------- | ----------- | ------------------------------- |
| **Descargas/semana**       | -           | 6.3M                            |
| **Namespace lazy loading** | Manual      | Built-in                        |
| **TypeScript types**       | Manual      | Auto-generados                  |
| **Plugins**                | 0           | 100+                            |
| **Usado por**              | -           | Netflix, TikTok, Twitch, Notion |

### Impacto Esperado

| Métrica        | Antes | Después | Mejora        |
| -------------- | ----- | ------- | ------------- |
| Bundle inicial | 370KB | 100KB   | **-73%**      |
| LCP            | 2.8s  | 1.2s    | **-57%**      |
| PageSpeed      | 70    | 85-90   | **+15-20pts** |

---

## Plan de Implementación

### Fase 0: Quick Wins (3-5 días)

**Objetivo:** Ganar 15 puntos sin refactorizar traducciones

```typescript
// Hero.tsx - Cambiar:
loadDelay: 150  →  loadDelay: 2500

// index.html - Añadir defer:
<script defer>window.dataLayer = ...</script>
```

- [ ] GTM async (+3-5 pts)
- [ ] HLS.js defer (+5-8 pts)
- [ ] Reducir DNS prefetch de 12 a 4 (+2-3 pts)
- [ ] Service Worker básico (+2 pts)
- [ ] Investigar chunks duplicados (+3 pts)

---

### Fase 1: Migración a i18next (Semana 1-2)

**Objetivo:** Reducir carga inicial de 370KB a ~100KB

#### 1.1 Instalación

```bash
npm install i18next react-i18next i18next-resources-to-backend
npm install -D i18next-parser
```

#### 1.2 Nueva Estructura de Archivos

```
i18n/
├── i18n.ts                         # Configuración central
├── locales/
│   ├── es/
│   │   ├── common.json             # Nav, footer, SEO (~50KB)
│   │   ├── booking.json            # Widget reservas (~25KB)
│   │   ├── schedule.json           # Horarios (~15KB)
│   │   ├── home.json               # Homepage (~10KB)
│   │   ├── classes.json            # Hub clases (~20KB)
│   │   └── ...                     # Una por página
│   ├── en/
│   │   └── ...
│   └── ...
└── types/
    └── i18next.d.ts
```

#### 1.3 Configuración i18next

```typescript
// i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

i18n
  .use(initReactI18next)
  .use(
    resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`))
  )
  .init({
    lng: 'es',
    fallbackLng: 'es',
    supportedLngs: ['es', 'ca', 'en', 'fr'],
    defaultNS: 'common',
    ns: ['common', 'booking', 'schedule', 'calendar'], // Eager
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
  });

export default i18n;
```

#### 1.4 Clasificación de Namespaces

| Tipo      | Namespaces                        | Carga    | Razón            |
| --------- | --------------------------------- | -------- | ---------------- |
| **CORE**  | common                            | Siempre  | Nav, footer, SEO |
| **EAGER** | booking, schedule, calendar       | Con core | Keys dinámicas   |
| **LAZY**  | home, classes, dancehall, blog/\* | Por ruta | Solo al visitar  |

#### 1.5 Manejo de Keys Dinámicas (CRÍTICO)

Componentes con keys dinámicas encontrados:

| Archivo                          | Patrón                           | Namespace |
| -------------------------------- | -------------------------------- | --------- |
| `DynamicScheduleSection.tsx:165` | `dayShort_${dayKey}`             | schedule  |
| `BookingWidgetV2.tsx:2024`       | `booking_filter_level_${level}`  | booking   |
| `MetodoFarrayPage.tsx`           | `metodoFarray_problem_point${i}` | metodo    |
| `CalendarPage.tsx:440`           | `calendar_type_${type}`          | calendar  |

**Solución:** Eager loading de estos namespaces + `useSuspense: false`

```typescript
const { t, ready } = useTranslation('metodo', { useSuspense: false });

if (!ready) return <PageSkeleton />;

return <div>{t(`metodoFarray_problem_point${i}`)}</div>;
```

#### 1.6 Migración de Componentes (57 archivos)

**Antes:**

```typescript
const { t, locale } = useI18n();
```

**Después:**

```typescript
const { t, i18n } = useTranslation();
const locale = i18n.language;
```

---

### Fase 2: Sistema de Blog MDX (Semana 3-4)

#### Estructura de Contenido

```
content/
└── blog/
    ├── _config.json
    ├── beneficios-bailar-salsa/
    │   ├── meta.json
    │   ├── content.es.mdx
    │   ├── content.en.mdx
    │   ├── content.ca.mdx
    │   ├── content.fr.mdx
    │   └── images/
    └── ...
```

#### Ejemplo meta.json

```json
{
  "slug": "beneficios-bailar-salsa",
  "category": "lifestyle",
  "author": "yunaisy",
  "datePublished": "2025-01-15",
  "readingTime": 8,
  "featuredImage": "./images/hero.webp",
  "relatedClasses": ["salsa-cubana", "bachata"]
}
```

#### Ejemplo MDX

```mdx
---
title: 10 Beneficios de Bailar Salsa
description: Descubre los beneficios científicamente probados...
---

## 1. Quema Calorías

<StatHighlight value="400" unit="calorías/hora" />
```

---

### Fase 3: Auto-generación de Rutas (Semana 5)

#### Script generate-blog-manifest.mjs

```javascript
// Escanea content/blog/ y genera:
// 1. Manifest JSON con todos los artículos
// 2. Rutas para pre-render
// 3. Sitemap XML
// 4. RSS feed por idioma
```

#### Integración con prerender.mjs

```javascript
import blogManifest from './src/generated/blog-manifest.json';
const routes = [...staticRoutes, ...blogManifest.routes];
```

---

### Fase 4: ISR en Vercel (Semana 6)

#### Estrategia de Tiering

| Tier       | Páginas                                    | Estrategia         |
| ---------- | ------------------------------------------ | ------------------ |
| **Tier 1** | Home, clases principales, top 20 artículos | SSG (build time)   |
| **Tier 2** | Resto de artículos                         | ISR (1 hora cache) |
| **Tier 3** | Artículos nuevos post-build                | ISR on-demand      |

#### API de Revalidación

```typescript
// api/revalidate.ts
export default async function handler(req, res) {
  const { secret, slug } = req.query;

  if (secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  for (const locale of ['es', 'ca', 'en', 'fr']) {
    await res.revalidate(`/${locale}/blog/${slug}`);
  }

  return res.json({ revalidated: true });
}
```

---

### Fase 5: Migración Completa (Semana 7-8)

- [ ] Migrar artículos existentes a MDX
- [ ] Dividir traducciones en namespaces
- [ ] Eliminar archivos legacy (useI18n.tsx, locales/index.ts)
- [ ] Tests E2E completos
- [ ] Documentación actualizada

---

## Archivos a Modificar

| Archivo                   | Acción                     |
| ------------------------- | -------------------------- |
| `i18n/i18n.ts`            | **CREAR** - Config i18next |
| `i18n/types/i18next.d.ts` | **CREAR** - TypeScript     |
| `hooks/useI18n.tsx`       | **ELIMINAR**               |
| `i18n/locales/index.ts`   | **ELIMINAR**               |
| `i18n/locales/es.ts`      | **DIVIDIR** en JSONs       |
| `App.tsx`                 | Reemplazar provider        |
| `vite.config.ts`          | Actualizar chunks          |
| `prerender.mjs`           | Consumir manifest          |

---

## Verificación

### Comandos de Test

```bash
# Lighthouse CI
npm run lighthouse -- --url=https://farrays.com/es

# Bundle analysis
npm run build && open dist/stats.html

# Size limits
npm run size-limit
```

### Criterios de Éxito

- [ ] Bundle inicial < 100KB (gzip)
- [ ] LCP < 1.5s en mobile 4G
- [ ] Build time < 5 minutos
- [ ] 0 errores de hidratación
- [ ] Todas las rutas de blog funcionan
- [ ] PageSpeed > 85

---

## Plan de Contingencia

Si algo falla gravemente:

```bash
git checkout main
```

- Branch de trabajo: `feat/i18next-migration`
- Sin pérdida de trabajo
- Máximo 1-2 días de rollback

---

## Referencias

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next](https://react.i18next.com/)
- [i18next-resources-to-backend](https://github.com/i18next/i18next-resources-to-backend)
- [Airbnb i18n Platform](https://medium.com/airbnb-engineering/building-airbnbs-internationalization-platform-45cf0104b63c)
- [Vercel ISR](https://vercel.com/docs/incremental-static-regeneration)
