# 📋 Plan de Acción - Auditoría Enterprise FarRays Center

**Fecha**: 23 de noviembre de 2025  
**Basado en**: `docs/ENTERPRISE_AUDIT_COMPLETE.md`  
**Estado**: Pendiente de implementación

---

## 🔴 BLOQUE 1: Urgente / Alto Impacto (Semana 1 - 8h)

### P1.1 - Reducir Bundle Size ES (-50KB) ⚡
- **Prioridad**: 🔴 CRÍTICA
- **Área**: Performance
- **Impacto**: +8-10 puntos Lighthouse
- **Esfuerzo**: 4 horas
- **Archivos**: 
  - `i18n/locales/*.ts`
  - `hooks/useI18n.tsx`
  - `vite.config.ts`

**Tareas**:
- [ ] Crear carpeta `public/locales/`
- [ ] Convertir `i18n/locales/es.ts` a `public/locales/es.json`
- [ ] Convertir `i18n/locales/ca.ts` a `public/locales/ca.json`
- [ ] Convertir `i18n/locales/en.ts` a `public/locales/en.json`
- [ ] Convertir `i18n/locales/fr.ts` a `public/locales/fr.json`
- [ ] Modificar `useI18n.tsx` para cargar JSON con `fetch()`
- [ ] Verificar bundle size con `npm run size`

---

### P1.2 - Crear OG Images Específicas 🖼️
- **Prioridad**: 🔴 ALTA
- **Área**: SEO
- **Impacto**: Rich previews en redes sociales
- **Esfuerzo**: 2 horas
- **Archivos**: `public/images/`, `components/SEO.tsx`

**Tareas**:
- [ ] Crear `og-danza-barcelona.jpg` (1200x630px)
- [ ] Crear `og-salsa-bachata-barcelona.jpg` (1200x630px)
- [ ] Crear `og-danzas-urbanas-barcelona.jpg` (1200x630px)
- [ ] Crear `og-clases-particulares.jpg` (1200x630px)
- [ ] Crear `og-prep-fisica.jpg` (1200x630px)
- [ ] Crear `og-facilities.jpg` (1200x630px)
- [ ] Crear `og-about.jpg` (1200x630px)
- [ ] Actualizar `components/SEO.tsx` con rutas correctas

---

### P1.3 - Mejorar CSP (Quitar unsafe-inline) 🔒
- **Prioridad**: 🔴 CRÍTICA (Seguridad)
- **Área**: Seguridad
- **Impacto**: Elimina vector XSS
- **Esfuerzo**: 1 hora
- **Archivos**: `vercel.json`, `scripts/generate-csp-hashes.mjs` (NUEVO)

**Tareas**:
- [ ] Crear script `scripts/generate-csp-hashes.mjs`
- [ ] Generar hashes de styles inline
- [ ] Actualizar `vercel.json` CSP con hashes
- [ ] Quitar `'unsafe-inline'` de `style-src`
- [ ] Verificar en securityheaders.com

**Snippet CSP mejorado** (ver `ENTERPRISE_AUDIT_COMPLETE.md` sección 5.1)

---

### P1.4 - Añadir LocalBusinessSchema JSON-LD 📍
- **Prioridad**: 🔴 ALTA (SEO)
- **Área**: SEO
- **Impacto**: Rich Snippets en Google
- **Esfuerzo**: 30 minutos
- **Archivos**: `components/schema/LocalBusinessSchema.tsx` (NUEVO), `HomePage.tsx`

**Tareas**:
- [ ] Crear `components/schema/LocalBusinessSchema.tsx`
- [ ] Implementar JSON-LD completo (ver snippet en auditoría)
- [ ] Importar en `HomePage.tsx`
- [ ] Verificar en validator.schema.org
- [ ] Verificar en Google Rich Results Test

---

### P1.5 - Actualizar Sitemap.xml 🗺️
- **Prioridad**: 🔴 ALTA (SEO)
- **Área**: SEO
- **Impacto**: Mejor indexación de páginas nuevas
- **Esfuerzo**: 20 minutos
- **Archivos**: `scripts/update-sitemap.mjs`, `sitemap.xml`

**Tareas**:
- [ ] Añadir páginas faltantes: FAQ, instalaciones, servicios, etc.
- [ ] Ejecutar `npm run update:sitemap`
- [ ] Verificar en Google Search Console
- [ ] Subir sitemap actualizado

---

## �� BLOQUE 2: Importante (Semana 2-3 - 16h)

### P2.1 - Tests E2E con Playwright 🧪
- **Prioridad**: 🟡 MEDIA
- **Área**: CI/CD
- **Impacto**: Prevenir regresiones
- **Esfuerzo**: 6 horas

**Tareas**:
- [ ] Instalar `@playwright/test`
- [ ] Crear `tests/e2e/navigation.spec.ts`
- [ ] Crear `tests/e2e/seo.spec.ts`
- [ ] Crear `tests/e2e/a11y.spec.ts`
- [ ] Añadir job E2E en `.github/workflows/ci.yml`
- [ ] Configurar en CI/CD

---

### P2.2 - Structured Data Completo 📊
- **Prioridad**: 🟡 MEDIA
- **Área**: SEO
- **Impacto**: Rich Snippets para clases
- **Esfuerzo**: 4 horas

**Tareas**:
- [ ] Crear `components/schema/CourseSchema.tsx`
- [ ] Añadir a `DancehallPage.tsx`
- [ ] Añadir a `DanzaBarcelonaPage.tsx`
- [ ] Añadir a `SalsaBachataPage.tsx`
- [ ] Añadir a `DanzasUrbanasBarcelonaPage.tsx`
- [ ] Crear `BreadcrumbSchema.tsx`
- [ ] Verificar en validator.schema.org

---

### P2.3 - Mejorar Accessibility ♿
- **Prioridad**: 🟡 MEDIA
- **Área**: Accesibilidad
- **Impacto**: Compliance WCAG 2.1 AA
- **Esfuerzo**: 4 horas

**Tareas**:
- [ ] Mejorar `SkipLink.tsx` (visible on focus)
- [ ] Añadir ARIA labels a dropdowns en `Header.tsx`
- [ ] Implementar focus trap en menú móvil
- [ ] Añadir tests axe-core en `__tests__/`
- [ ] Configurar tests a11y en CI

---

### P2.4 - Performance Budgets Estrictos 📉
- **Prioridad**: 🟡 MEDIA
- **Área**: Performance
- **Impacto**: Prevenir regresiones
- **Esfuerzo**: 1 hora

**Tareas**:
- [ ] Cambiar `"warn"` → `"error"` en `lighthouserc.json`
- [ ] Reducir thresholds (ej: performance 0.85 → 0.90)
- [ ] Configurar en CI para bloquear PRs
- [ ] Documentar en README

---

### P2.5 - Configurar Dependabot ✅
- **Prioridad**: 🟡 MEDIA  
- **Área**: DevOps
- **Esfuerzo**: Ya implementado ✅

**Tareas**:
- [x] Crear `.github/dependabot.yml`
- [x] Configurar updates semanales
- [x] Agrupar por tipo (dev/prod)
- [ ] Verificar que funciona (esperar primer PR)

---

## 🟢 BLOQUE 3: Mejores Prácticas Enterprise (Mes 1-2)

### P3.1 - Service Worker (Offline-First) 📴
- **Prioridad**: 🟢 BAJA
- **Área**: Performance / PWA
- **Esfuerzo**: 8 horas

**Tareas**:
- [ ] Instalar `vite-plugin-pwa`
- [ ] Configurar estrategia de caching
- [ ] Implementar offline fallback
- [ ] Añadir install prompt
- [ ] Verificar con Lighthouse PWA

---

### P3.2 - Monitoring Avanzado 📈
- **Prioridad**: 🟢 BAJA
- **Área**: Observabilidad
- **Esfuerzo**: 4 horas

**Tareas**:
- [ ] Configurar Hotjar (heatmaps, recordings)
- [ ] Configurar SpeedCurve (performance monitoring)
- [ ] Configurar UptimeRobot (uptime monitoring)
- [ ] Dashboard centralizado

---

### P3.3 - Migrar i18n a react-i18next 🌐
- **Prioridad**: 🟢 BAJA
- **Área**: i18n
- **Esfuerzo**: 6 horas

**Tareas**:
- [ ] Instalar `react-i18next`
- [ ] Migrar traducciones a formato i18next
- [ ] Configurar lazy loading
- [ ] Añadir Crowdin para gestión de traducciones
- [ ] Tests de regresión

---

## ✅ Verificación de Completado

Después de implementar cada bloque, ejecutar:

```bash
# Performance
npm run build
npm run size
npm run lighthouse

# TypeScript
npm run typecheck

# Lint
npm run lint

# Tests
npm run test:run
npm run test:e2e  # (cuando estén creados)

# Security
npm audit --audit-level=moderate

# SEO
# - Google Rich Results Test
# - validator.schema.org
# - Google Search Console
```

---

## 📊 Métricas de Éxito

| Métrica | Antes | Objetivo Bloque 1 | Objetivo Final |
|---------|-------|-------------------|----------------|
| Lighthouse Performance | 70-75 | 85-90 | 95+ |
| Lighthouse SEO | 85-90 | 95+ | 98+ |
| Lighthouse A11Y | 85-90 | 90-95 | 95+ |
| Bundle Size Main | 244KB | 190KB | 170KB |
| Bundle Size ES | 263KB | 180KB | 160KB |
| LCP | 3.5s | 2.5s | <2.0s |
| Security Headers | 6/8 | 8/8 | 8/8 |

---

## 📚 Documentación de Referencia

- **Auditoría completa**: `docs/ENTERPRISE_AUDIT_COMPLETE.md`
- **Resumen de mejoras**: `docs/IMPROVEMENTS_SUMMARY.md`
- **Referencia rápida**: `docs/QUICK_REFERENCE.md`

---

**Creado**: 23 de noviembre de 2025  
**Última actualización**: 23 de noviembre de 2025  
**Responsable**: Equipo de desarrollo FarRays Center

---

## 💬 Comentarios

_Usa esta sección para trackear progreso, obstáculos y decisiones tomadas durante la implementación._
