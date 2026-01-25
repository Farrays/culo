# Auditoría de Costos - Proyecto Farray's International Dance Center

**Fecha de auditoría:** 25 de Enero 2026
**Versión del proyecto:** Production (531 commits)
**Auditor:** Claude Code (Opus 4.5)

---

## Resumen Ejecutivo

Este documento presenta una auditoría completa del proyecto web de Farray's International Dance Center, con estimaciones de costos si el proyecto fuera desarrollado por una agencia premium.

### Métricas Clave del Proyecto

| Métrica                     | Valor                                 | Δ vs Dic 2025 |
| --------------------------- | ------------------------------------- | ------------- |
| **Framework**               | React 19 + TypeScript + Vite          | -             |
| **Páginas prerenderizadas** | 80 (x4 idiomas = 322 URLs)            | +52%          |
| **Componentes React**       | 273 archivos TSX                      | +14%          |
| **Líneas de código total**  | ~117,385 (optimizado)                 | -29%\*        |
| **Idiomas soportados**      | 4 (Español, Inglés, Catalán, Francés) | -             |
| **Líneas de traducción**    | 86,812                                | +19%          |
| **Imágenes optimizadas**    | 1,881 archivos (2.0 GB)               | +34%          |
| **Tests**                   | 45 archivos                           | +29%          |
| **Scripts de build**        | 66 archivos                           | +200%         |
| **API Endpoints**           | 8 serverless functions                | +167%         |
| **Commits en historial**    | 531                                   | +53%          |

> \*La reducción de líneas se debe a limpieza de código muerto (25MB+ eliminados) manteniendo funcionalidad completa.

### Crecimiento desde Diciembre 2025

| Métrica                | Dic 2025 | Ene 2026 | Crecimiento |
| ---------------------- | -------- | -------- | ----------- |
| Commits                | 347      | 531      | **+184**    |
| Páginas únicas         | 53       | 80       | **+27**     |
| URLs prerenderizadas   | 212      | 322      | **+110**    |
| Componentes TSX        | 239      | 273      | **+34**     |
| Líneas de traducción   | 73,109   | 86,812   | **+13,703** |
| Imágenes               | 1,400    | 1,881    | **+481**    |
| Tamaño assets          | 1.3 GB   | 2.0 GB   | **+0.7 GB** |
| Scripts automatización | 22       | 66       | **+44**     |
| Tests                  | 35       | 45       | **+10**     |
| API Endpoints          | 3        | 8        | **+5**      |

---

## Stack Tecnológico Completo

### Core

| Tecnología   | Versión | Propósito    |
| ------------ | ------- | ------------ |
| React        | 19.2.0  | UI Framework |
| TypeScript   | 5.8.2   | Type Safety  |
| Vite         | 6.2.0   | Build Tool   |
| React Router | 7.9.5   | Routing      |
| TailwindCSS  | 3.4.18  | Styling      |

### Integraciones

| Servicio           | Propósito                      |
| ------------------ | ------------------------------ |
| Vercel             | Hosting + Serverless Functions |
| Momence CRM        | Lead capture + Contact forms   |
| Redis (ioredis)    | Deduplicación de leads         |
| Google Analytics 4 | Analytics                      |
| Facebook Pixel     | Conversion tracking            |
| Sentry             | Error monitoring               |
| HLS.js             | Video streaming                |

### DevOps

| Herramienta       | Propósito                |
| ----------------- | ------------------------ |
| GitHub Actions    | CI/CD (6 jobs paralelos) |
| Vitest            | Unit testing             |
| ESLint + Prettier | Code quality             |
| Husky             | Pre-commit hooks         |
| Sharp             | Image optimization       |

---

## Estructura del Proyecto

```
Gitclone/
├── components/           # 273 archivos TSX
│   ├── blog/            # 14 componentes de blog
│   ├── header/          # 5 componentes de navegación
│   ├── home/            # 5 componentes homepage v1
│   ├── homev2/          # 18 componentes homepage v2
│   ├── landing/         # 14 landing pages
│   ├── pages/           # Páginas especiales
│   ├── schedule/        # 8 componentes de horarios
│   ├── shared/          # 14 componentes reutilizables
│   ├── templates/       # 6 templates
│   ├── stories/         # 4 Storybook stories
│   └── __tests__/       # 30+ archivos de test
├── constants/           # 112 archivos (28,464 líneas)
│   ├── blog/            # Datos de artículos
│   └── [dance-class]/   # ~85 configs por estilo de baile
├── hooks/               # 8 custom hooks
├── i18n/locales/        # 4 idiomas (86,812 líneas)
│   ├── es.ts            # 23,038 líneas
│   ├── en.ts            # 21,026 líneas
│   ├── ca.ts            # 21,214 líneas
│   └── fr.ts            # 21,534 líneas
├── utils/               # 5 archivos utilidades
├── lib/                 # Icons library
├── api/                 # 8 endpoints serverless
├── scripts/             # 66 scripts de build/automatización
├── public/images/       # 1,881 imágenes (2.0 GB)
└── .github/workflows/   # CI/CD pipeline
```

---

## Análisis de Complejidad por Componente

### Componentes de Alta Complejidad (>1,000 líneas)

| Componente              | Líneas | Complejidad | Justificación                                    |
| ----------------------- | ------ | ----------- | ------------------------------------------------ |
| SalsaCubanaPage.tsx     | 2,154  | ⭐⭐⭐⭐⭐  | Videos HLS, galerías, schema markup, animaciones |
| Header.tsx              | 1,512  | ⭐⭐⭐⭐⭐  | 5 subcomponentes, estado complejo, responsive    |
| HorariosPreciosPage.tsx | 1,621  | ⭐⭐⭐⭐    | Tablas interactivas, filtros, i18n               |
| PreciosPage.tsx         | 1,415  | ⭐⭐⭐⭐    | Tabla de precios dinámica                        |
| ContactPage.tsx         | 1,355  | ⭐⭐⭐⭐⭐  | Rate limiting, validación, CRM, analytics        |
| HeelsBarcelonaPage.tsx  | 1,298  | ⭐⭐⭐⭐    | Galería, testimonios, schema                     |
| DanceClassesPage.tsx    | 1,247  | ⭐⭐⭐⭐    | Hub con 30+ clases                               |
| HomePageV2.tsx          | 1,100+ | ⭐⭐⭐⭐⭐  | Nueva homepage, GEO FAQs consolidados            |

### Funcionalidades Especiales Implementadas

| Funcionalidad      | Complejidad | Descripción                                 |
| ------------------ | ----------- | ------------------------------------------- |
| Sistema i18n       | ⭐⭐⭐⭐⭐  | 4 idiomas, 8,500+ keys, hook personalizado  |
| Rate Limiting      | ⭐⭐⭐⭐    | Client-side + Server-side, sliding window   |
| SEO/Schema         | ⭐⭐⭐⭐⭐  | JSON-LD (LocalBusiness, Course, FAQ, Event) |
| GEO Optimization   | ⭐⭐⭐⭐    | Answer capsules, citations, speakable       |
| Animaciones        | ⭐⭐⭐      | 40+ animaciones CSS, scroll effects         |
| Image Pipeline     | ⭐⭐⭐⭐⭐  | Sharp, WebP/AVIF, responsive, 66 scripts    |
| Video HLS          | ⭐⭐⭐      | Streaming optimizado con HLS.js             |
| Analytics          | ⭐⭐⭐      | GA4 + FB Pixel + Sentry + custom events     |
| CI/CD              | ⭐⭐⭐⭐    | 6 jobs paralelos, coverage, lighthouse      |
| Category Templates | ⭐⭐⭐⭐    | Sistema de templates para categorías        |

---

## Desglose de Horas de Desarrollo

### Por Área Funcional

| Área                                     | Horas Min | Horas Max | Promedio  |
| ---------------------------------------- | --------- | --------- | --------- |
| Setup & Arquitectura base                | 80        | 120       | 100       |
| Componentes UI (273)                     | 350       | 480       | 415       |
| Páginas (80 únicas)                      | 300       | 420       | 360       |
| Sistema de internacionalización          | 160       | 240       | 200       |
| Integraciones API (Momence, Redis, etc.) | 120       | 180       | 150       |
| SEO, Schema & GEO markup                 | 120       | 180       | 150       |
| Sistema de imágenes responsive           | 120       | 180       | 150       |
| Scripts de automatización (66)           | 100       | 150       | 125       |
| Animaciones y efectos                    | 60        | 100       | 80        |
| Testing (unit, integration, a11y)        | 120       | 180       | 150       |
| CI/CD Pipeline                           | 60        | 100       | 80        |
| QA & Bug fixes                           | 120       | 180       | 150       |
| Gestión de proyecto                      | 120       | 160       | 140       |
| **TOTAL**                                | **1,830** | **2,670** | **2,250** |

### Por Rol (Equipo típico agencia)

| Rol                       | Horas   | % del Total |
| ------------------------- | ------- | ----------- |
| Tech Lead / Arquitecto    | 280-400 | 15%         |
| Senior Frontend Developer | 640-930 | 35%         |
| Frontend Developer        | 550-800 | 30%         |
| QA Engineer               | 180-270 | 10%         |
| Project Manager           | 130-190 | 8%          |
| DevOps Engineer           | 50-80   | 2%          |

---

## Estimación de Costos

### Por Tipo de Agencia

#### Agencia Premium (Barcelona/Madrid/USA)

```
Tarifa: €120 - €180/hora
Horas: 1,830 - 2,670

Rango de costos:
├── Mínimo: 1,830h × €120 = €219,600
├── Típico: 2,250h × €150 = €337,500
└── Máximo: 2,670h × €180 = €480,600

ESTIMACIÓN AGENCIA PREMIUM: €280,000 - €480,000
```

#### Agencia Mid-Level (España)

```
Tarifa: €60 - €90/hora
Horas: 1,830 - 2,670

Rango de costos:
├── Mínimo: 1,830h × €60 = €109,800
├── Típico: 2,250h × €75 = €168,750
└── Máximo: 2,670h × €90 = €240,300

ESTIMACIÓN AGENCIA MID-LEVEL: €140,000 - €240,000
```

#### Agencia Nearshore (Latam/Europa Este)

```
Tarifa: €35 - €55/hora
Horas: 1,830 - 2,670

Rango de costos:
├── Mínimo: 1,830h × €35 = €64,050
├── Típico: 2,250h × €45 = €101,250
└── Máximo: 2,670h × €55 = €146,850

ESTIMACIÓN AGENCIA NEARSHORE: €80,000 - €150,000
```

### Tabla Comparativa

| Tipo de Agencia       | Mínimo   | Típico   | Máximo   |
| --------------------- | -------- | -------- | -------- |
| **Premium (ES/USA)**  | €219,600 | €337,500 | €480,600 |
| **Mid-Level (ES)**    | €109,800 | €168,750 | €240,300 |
| **Nearshore (LATAM)** | €64,050  | €101,250 | €146,850 |

### Comparativa con Auditoría Diciembre 2025

| Tipo de Agencia | Dic 2025 (Típico) | Ene 2026 (Típico) | Incremento |
| --------------- | ----------------- | ----------------- | ---------- |
| Premium         | €253,500          | €337,500          | **+33%**   |
| Mid-Level       | €126,750          | €168,750          | **+33%**   |
| Nearshore       | €76,050           | €101,250          | **+33%**   |

### En Dólares (USD) - Agencia USA

| Escenario | Costo USD |
| --------- | --------- |
| Mínimo    | $240,000  |
| Típico    | $370,000  |
| Máximo    | $525,000  |

---

## Costos Operativos Anuales

### Infraestructura

| Servicio                  | Costo Mensual | Costo Anual    |
| ------------------------- | ------------- | -------------- |
| Vercel Pro                | €20-50        | €240-600       |
| Redis (Upstash/Vercel KV) | €10-30        | €120-360       |
| Dominio + SSL             | €2-5          | €24-60         |
| **Subtotal Infra**        | €32-85        | **€384-1,020** |

### Mantenimiento

| Concepto                       | Horas/Año | Costo (€75/h)      |
| ------------------------------ | --------- | ------------------ |
| Bug fixes                      | 50-80     | €3,750-6,000       |
| Actualizaciones dependencias   | 30-50     | €2,250-3,750       |
| Nuevas funcionalidades menores | 80-120    | €6,000-9,000       |
| Optimización performance       | 20-30     | €1,500-2,250       |
| Monitoreo y soporte            | 20-30     | €1,500-2,250       |
| **Subtotal Mantenimiento**     | 200-310h  | **€15,000-23,250** |

### Total Anual de Operación

| Concepto        | Mínimo      | Máximo      |
| --------------- | ----------- | ----------- |
| Infraestructura | €384        | €1,020      |
| Mantenimiento   | €15,000     | €23,250     |
| **TOTAL ANUAL** | **€15,384** | **€24,270** |

---

## Valor por Funcionalidad

### Desglose del valor de cada módulo

| Módulo                            | Valor Estimado | % del Total |
| --------------------------------- | -------------- | ----------- |
| Core App (React + Router + Build) | €30,000-50,000 | 14%         |
| Sistema de componentes (273)      | €55,000-90,000 | 27%         |
| Internacionalización (4 idiomas)  | €30,000-50,000 | 14%         |
| SEO, Schema & GEO                 | €25,000-40,000 | 11%         |
| Integraciones (CRM, Analytics)    | €20,000-35,000 | 10%         |
| Sistema de imágenes + Scripts     | €20,000-35,000 | 10%         |
| Testing & QA                      | €18,000-30,000 | 9%          |
| CI/CD & DevOps                    | €10,000-18,000 | 5%          |

---

## Factores que Aumentan el Valor

### Complejidad Técnica

- ✅ TypeScript strict mode en todo el proyecto
- ✅ 4 idiomas con sistema i18n personalizado (86,812 líneas)
- ✅ 80 páginas prerenderizadas (SSG)
- ✅ Rate limiting client + server side
- ✅ Pipeline de imágenes responsive (WebP, AVIF, 66 scripts)
- ✅ GEO Optimization (Answer capsules, citations, speakable)

### Calidad de Código

- ✅ 273 componentes bien estructurados
- ✅ 45 archivos de tests
- ✅ CI/CD con 6 jobs de validación
- ✅ ESLint + Prettier configurados
- ✅ Documentación ARCHITECTURE.md
- ✅ Limpieza de 25MB+ de código muerto

### SEO & Performance

- ✅ Lighthouse Score: 85-100
- ✅ Schema markup completo (JSON-LD)
- ✅ Sitemap dinámico
- ✅ Core Web Vitals optimizados
- ✅ Code splitting con lazy loading

### Assets Profesionales

- ✅ 1,881 imágenes optimizadas (2.0 GB)
- ✅ Videos HLS streaming
- ✅ Diseño UI/UX completo
- ✅ Responsive en todos los breakpoints

---

## Comparativa con Proyectos Similares

| Tipo de Proyecto                          | Costo Típico Mercado |
| ----------------------------------------- | -------------------- |
| Landing page simple                       | €5,000-15,000        |
| Web corporativa (5-10 páginas)            | €15,000-40,000       |
| E-commerce básico                         | €30,000-80,000       |
| Web app con CMS                           | €50,000-120,000      |
| **Este proyecto (80 páginas, 4 idiomas)** | **€200,000-340,000** |
| Plataforma SaaS completa                  | €200,000-500,000     |

---

## Conclusiones

### Valor Justo de Mercado

| Escenario       | Rango               |
| --------------- | ------------------- |
| **Conservador** | €160,000 - €200,000 |
| **Realista**    | €200,000 - €280,000 |
| **Premium**     | €280,000 - €380,000 |

### Recomendación de Precio

**Precio de referencia sugerido: €230,000 - €300,000**

Este rango considera:

- Complejidad técnica del proyecto
- Calidad del código y arquitectura
- Funcionalidades enterprise (i18n, SEO, GEO, analytics)
- Assets incluidos (imágenes, diseño)
- Tiempo de desarrollo estimado (8-12 meses con equipo de 3-4)
- Crecimiento del 33% desde diciembre 2025

### Evolución del Valor

| Fecha          | Precio Sugerido     | Incremento |
| -------------- | ------------------- | ---------- |
| Diciembre 2025 | €175,000 - €225,000 | -          |
| **Enero 2026** | €230,000 - €300,000 | **+31%**   |

---

## Notas Adicionales

### Lo que NO está incluido en esta estimación

- Costos de diseño UX/UI desde cero (diseño ya existente)
- Fotografía y producción de video profesional
- Copywriting y traducción profesional
- Costos de dominio y hosting durante desarrollo
- Formación al cliente

### Tiempo de desarrollo estimado

- **Equipo de 2 personas:** 12-18 meses
- **Equipo de 3-4 personas:** 8-12 meses
- **Equipo de 5+ personas:** 5-8 meses

---

## Historial de Auditorías

| Fecha           | Commits | Páginas | Componentes | Valor Típico |
| --------------- | ------- | ------- | ----------- | ------------ |
| 31 Dic 2025     | 347     | 53      | 239         | €200,000     |
| **25 Ene 2026** | **531** | **80**  | **273**     | **€265,000** |

---

_Documento generado automáticamente por Claude Code_
_Última actualización: 25 de Enero 2026_
