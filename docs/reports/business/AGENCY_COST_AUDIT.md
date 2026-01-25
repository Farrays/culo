# Auditoría de Costos - Proyecto Farray's International Dance Center

**Fecha de auditoría:** 31 de Diciembre 2025
**Versión del proyecto:** Production (347 commits)
**Auditor:** Claude Code (Opus 4.5)

---

## Resumen Ejecutivo

Este documento presenta una auditoría completa del proyecto web de Farray's International Dance Center, con estimaciones de costos si el proyecto fuera desarrollado por una agencia premium.

### Métricas Clave del Proyecto

| Métrica                     | Valor                                 |
| --------------------------- | ------------------------------------- |
| **Framework**               | React 19 + TypeScript + Vite          |
| **Páginas prerenderizadas** | 53 (x4 idiomas = 212 URLs)            |
| **Componentes React**       | 239 archivos TSX                      |
| **Líneas de código total**  | ~164,500                              |
| **Idiomas soportados**      | 4 (Español, Inglés, Catalán, Francés) |
| **Líneas de traducción**    | 73,109                                |
| **Imágenes optimizadas**    | 1,400 archivos (1.3 GB)               |
| **Tests**                   | 35 archivos                           |
| **Commits en historial**    | 347                                   |

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
├── components/           # 239 archivos TSX (51,627 líneas)
│   ├── blog/            # 14 componentes de blog
│   ├── header/          # 5 componentes de navegación
│   ├── home/            # 5 componentes homepage v1
│   ├── homev2/          # 18 componentes homepage v2
│   ├── landing/         # 14 landing pages
│   ├── pages/           # Páginas especiales
│   ├── schedule/        # 8 componentes de horarios
│   ├── shared/          # 14 componentes reutilizables
│   ├── templates/       # 6 templates
│   └── __tests__/       # 26 archivos de test
├── constants/           # 94 archivos (22,010 líneas)
│   ├── blog/            # Datos de artículos
│   └── [dance-class]/   # ~70 configs por estilo de baile
├── hooks/               # 8 custom hooks
├── i18n/locales/        # 4 idiomas (73,109 líneas)
│   ├── es.ts            # 19,361 líneas
│   ├── en.ts            # 17,750 líneas
│   ├── ca.ts            # 17,960 líneas
│   └── fr.ts            # 18,038 líneas
├── utils/               # 5 archivos utilidades
├── lib/                 # Icons library (39,047 líneas)
├── api/                 # 3 endpoints serverless
├── scripts/             # 22 scripts de build
├── public/images/       # 1,400 imágenes (1.3 GB)
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
| DanceClassesPage.tsx    | 1,247  | ⭐⭐⭐⭐    | Hub con 28+ clases                               |

### Funcionalidades Especiales Implementadas

| Funcionalidad  | Complejidad | Descripción                                 |
| -------------- | ----------- | ------------------------------------------- |
| Sistema i18n   | ⭐⭐⭐⭐⭐  | 4 idiomas, 7,000+ keys, hook personalizado  |
| Rate Limiting  | ⭐⭐⭐⭐    | Client-side + Server-side, sliding window   |
| SEO/Schema     | ⭐⭐⭐⭐    | JSON-LD (LocalBusiness, Course, FAQ, Event) |
| Animaciones    | ⭐⭐⭐      | 40+ animaciones CSS, scroll effects         |
| Image Pipeline | ⭐⭐⭐⭐    | Sharp, WebP/AVIF, responsive breakpoints    |
| Video HLS      | ⭐⭐⭐      | Streaming optimizado con HLS.js             |
| Analytics      | ⭐⭐⭐      | GA4 + FB Pixel + Sentry + custom events     |
| CI/CD          | ⭐⭐⭐⭐    | 6 jobs paralelos, coverage, lighthouse      |

---

## Desglose de Horas de Desarrollo

### Por Área Funcional

| Área                                     | Horas Min | Horas Max | Promedio  |
| ---------------------------------------- | --------- | --------- | --------- |
| Setup & Arquitectura base                | 80        | 120       | 100       |
| Componentes UI (239)                     | 300       | 400       | 350       |
| Páginas (53 únicas)                      | 200       | 280       | 240       |
| Sistema de internacionalización          | 120       | 180       | 150       |
| Integraciones API (Momence, Redis, etc.) | 100       | 150       | 125       |
| SEO & Schema markup                      | 80        | 120       | 100       |
| Sistema de imágenes responsive           | 80        | 120       | 100       |
| Animaciones y efectos                    | 60        | 100       | 80        |
| Testing (unit, integration, a11y)        | 100       | 150       | 125       |
| CI/CD Pipeline                           | 60        | 100       | 80        |
| QA & Bug fixes                           | 100       | 150       | 125       |
| Gestión de proyecto                      | 100       | 130       | 115       |
| **TOTAL**                                | **1,380** | **2,000** | **1,690** |

### Por Rol (Equipo típico agencia)

| Rol                       | Horas   | % del Total |
| ------------------------- | ------- | ----------- |
| Tech Lead / Arquitecto    | 200-300 | 15%         |
| Senior Frontend Developer | 500-700 | 35%         |
| Frontend Developer        | 400-600 | 30%         |
| QA Engineer               | 150-200 | 10%         |
| Project Manager           | 100-150 | 8%          |
| DevOps Engineer           | 30-50   | 2%          |

---

## Estimación de Costos

### Por Tipo de Agencia

#### Agencia Premium (Barcelona/Madrid/USA)

```
Tarifa: €120 - €180/hora
Horas: 1,380 - 2,000

Rango de costos:
├── Mínimo: 1,380h × €120 = €165,600
├── Típico: 1,690h × €150 = €253,500
└── Máximo: 2,000h × €180 = €360,000

ESTIMACIÓN AGENCIA PREMIUM: €200,000 - €360,000
```

#### Agencia Mid-Level (España)

```
Tarifa: €60 - €90/hora
Horas: 1,380 - 2,000

Rango de costos:
├── Mínimo: 1,380h × €60 = €82,800
├── Típico: 1,690h × €75 = €126,750
└── Máximo: 2,000h × €90 = €180,000

ESTIMACIÓN AGENCIA MID-LEVEL: €100,000 - €180,000
```

#### Agencia Nearshore (Latam/Europa Este)

```
Tarifa: €35 - €55/hora
Horas: 1,380 - 2,000

Rango de costos:
├── Mínimo: 1,380h × €35 = €48,300
├── Típico: 1,690h × €45 = €76,050
└── Máximo: 2,000h × €55 = €110,000

ESTIMACIÓN AGENCIA NEARSHORE: €50,000 - €110,000
```

### Tabla Comparativa

| Tipo de Agencia       | Mínimo   | Típico   | Máximo   |
| --------------------- | -------- | -------- | -------- |
| **Premium (ES/USA)**  | €165,600 | €253,500 | €360,000 |
| **Mid-Level (ES)**    | €82,800  | €126,750 | €180,000 |
| **Nearshore (LATAM)** | €48,300  | €76,050  | €110,000 |

### En Dólares (USD) - Agencia USA

| Escenario | Costo USD |
| --------- | --------- |
| Mínimo    | $180,000  |
| Típico    | $275,000  |
| Máximo    | $400,000  |

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
| Core App (React + Router + Build) | €25,000-40,000 | 15%         |
| Sistema de componentes (239)      | €45,000-70,000 | 28%         |
| Internacionalización (4 idiomas)  | €20,000-35,000 | 13%         |
| SEO & Performance                 | €15,000-25,000 | 10%         |
| Integraciones (CRM, Analytics)    | €18,000-30,000 | 12%         |
| Sistema de imágenes               | €12,000-20,000 | 8%          |
| Testing & QA                      | €15,000-25,000 | 10%         |
| CI/CD & DevOps                    | €8,000-15,000  | 5%          |

---

## Factores que Aumentan el Valor

### Complejidad Técnica

- ✅ TypeScript strict mode en todo el proyecto
- ✅ 4 idiomas con sistema i18n personalizado
- ✅ 53 páginas prerenderizadas (SSG)
- ✅ Rate limiting client + server side
- ✅ Pipeline de imágenes responsive (WebP, AVIF)

### Calidad de Código

- ✅ 239 componentes bien estructurados
- ✅ 35 archivos de tests
- ✅ CI/CD con 6 jobs de validación
- ✅ ESLint + Prettier configurados
- ✅ Documentación ARCHITECTURE.md

### SEO & Performance

- ✅ Lighthouse Score: 85-100
- ✅ Schema markup completo (JSON-LD)
- ✅ Sitemap dinámico (141 KB)
- ✅ Core Web Vitals optimizados
- ✅ Code splitting con lazy loading

### Assets Profesionales

- ✅ 1,400 imágenes optimizadas
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
| **Este proyecto (53 páginas, 4 idiomas)** | **€150,000-250,000** |
| Plataforma SaaS completa                  | €200,000-500,000     |

---

## Conclusiones

### Valor Justo de Mercado

| Escenario       | Rango               |
| --------------- | ------------------- |
| **Conservador** | €120,000 - €150,000 |
| **Realista**    | €150,000 - €200,000 |
| **Premium**     | €200,000 - €280,000 |

### Recomendación de Precio

**Precio de referencia sugerido: €175,000 - €225,000**

Este rango considera:

- Complejidad técnica del proyecto
- Calidad del código y arquitectura
- Funcionalidades enterprise (i18n, SEO, analytics)
- Assets incluidos (imágenes, diseño)
- Tiempo de desarrollo estimado (6-9 meses con equipo de 3-4)

---

## Notas Adicionales

### Lo que NO está incluido en esta estimación

- Costos de diseño UX/UI desde cero (diseño ya existente)
- Fotografía y producción de video profesional
- Copywriting y traducción profesional
- Costos de dominio y hosting durante desarrollo
- Formación al cliente

### Tiempo de desarrollo estimado

- **Equipo de 2 personas:** 10-14 meses
- **Equipo de 3-4 personas:** 6-9 meses
- **Equipo de 5+ personas:** 4-6 meses

---

_Documento generado automáticamente por Claude Code_
_Última actualización: 31 de Diciembre 2025_
