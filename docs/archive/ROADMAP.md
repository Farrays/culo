# 🗺️ ROADMAP - Farray's Center Web

## 📋 Tareas Pendientes - Página Danza Barcelona

### 🔴 ALTA PRIORIDAD

#### Imágenes Open Graph
- [ ] **Crear imagen OG específica para Danza Barcelona** (`og-danza-barcelona.jpg`)
  - Dimensiones: 1200x630px
  - Incluir: foto de ballet/contemporáneo, texto "Clases de Danza en Barcelona"
  - Subtexto: "Ballet Clásico Cubano · Contemporáneo · Jazz"
  - Logo Farray's Center
  - Colores de marca (#c82260)
  - Ubicación: `/public/images/og-danza-barcelona.jpg`
  - **Estado actual:** Usando `og-classes.jpg` temporalmente (SEO.tsx línea 50)

#### Imágenes de Estilos de Danza
- [ ] **Crear imágenes específicas para cada estilo** (opcional pero recomendado)
  - Ballet Clásico: Foto de ballet con técnica cubana
  - Danza Contemporánea: Foto de movimiento contemporáneo
  - Modern Jazz: Foto de jazz moderno
  - Afro Jazz: Foto de afro jazz
  - Afro Contemporáneo: Foto de fusión afro-contemporánea
  - Stretching: Foto de flexibilidad
  - **Estado actual:** Todas las cards usan la misma imagen genérica
  - **Impacto:** Falta diferenciación visual entre estilos

### 🟡 MEDIA PRIORIDAD

#### SEO & Configuración
- [x] ✅ Verificar que `/clases/danza-barcelona` está en `sitemap.xml` - **COMPLETADO**
  - ✅ Presente en 4 idiomas (es, ca, en, fr)
  - ✅ Priority: 0.85 (buena prioridad)
  - ✅ Changefreq: weekly
  - ✅ Hreflang correctamente configurado
- [x] ✅ Verificar configuración en `robots.txt` - **COMPLETADO**
  - ✅ Allow: / (permite todas las rutas)
  - ✅ Sitemap incluido
  - ✅ Crawl delay configurado
- [x] ✅ Configurar prerender en Vercel para esta ruta - **COMPLETADO**
  - ✅ Incluido en `prerender.mjs` (líneas 12, 17, 22, 27)
  - ✅ Metadata configurada para los 4 idiomas
  - ✅ Contenido inicial prerenderizado
- [x] ✅ Optimización WebP/AVIF para imágenes - **YA OPTIMIZADO**
  - ✅ Imágenes de Unsplash usan `auto=format` (WebP automático)
  - ✅ Imágenes locales ya están en WebP
  - ✅ Imágenes OG en JPG (requerido para redes sociales)

#### Optimización de Rendimiento
- [x] ✅ Evaluar implementar sprite SVG para iconos - **COMPLETADO**
  - ✅ Sprite SVG creado (`/public/icons/sprite.svg`) - 4.4 KB
  - ✅ Componente Icon reutilizable creado (`/components/Icon.tsx`) - 759 bytes
  - ✅ DanzaBarcelonaPage migrado: -33 líneas (-8%), -4.8 KB (-21%)
  - ✅ Mejor caché del navegador (sprite cacheable)
  - ✅ 6 iconos centralizados: globe, sparkles, building, star, trophy, academic-cap
  - ✅ TypeScript types seguros implementados
  - 📄 Ver reporte completo: `SVG_SPRITE_OPTIMIZATION_REPORT.md`
- [ ] Agregar preload del sprite SVG en `<head>` para FCP óptimo
  - Añadir: `<link rel="preload" href="/icons/sprite.svg" as="image" type="image/svg+xml">`
  - Beneficio: Carga anticipada del sprite antes de React hydration
- [ ] Migrar otros componentes al SVG sprite (reutilización)
  - WhyFIDC.tsx (usa los mismos iconos)
  - Home.tsx (si usa iconos similares)
  - Beneficio: Mayor ahorro de bundle size en toda la app
- [ ] Agregar preload para hero background si es necesario

### 🟢 BAJA PRIORIDAD

#### Accesibilidad
- [ ] Agregar "Skip to content" link (mejora accesibilidad)
- [ ] Revisar contraste en modo alto contraste del sistema

#### Optimización SVG Sprite (Mejoras Opcionales)
- [ ] Considerar sprite para iconos de redes sociales (Facebook, Instagram, etc.)
  - Beneficio: Centralizar todos los iconos en un solo sprite
- [ ] Evaluar sprite para logos de partners (CID-UNESCO, Got Talent, etc.)
  - Beneficio: Reducir peso de logos individuales
- [ ] Automatizar generación de TypeScript types desde sprite
  - Herramienta: Script que lea sprite.svg y genere tipos automáticamente
  - Beneficio: Evitar actualizar manualmente Icon.tsx cuando se añaden iconos
- [ ] Crear documentación Storybook para componente Icon
  - Mostrar todos los iconos disponibles
  - Ejemplos de uso con diferentes tamaños y colores
  - Beneficio: Mejor DX (Developer Experience)

#### UX Mejoras
- [ ] Considerar agregar testimonios de estudiantes de danza
  - Con fotos y nombres reales
  - Citando progreso específico (técnica, competiciones, etc.)
- [ ] Evaluar agregar galería de fotos de clases reales
  - Fotos de estudiantes en clases de Ballet, Contemporáneo, Jazz
  - Galas y presentaciones anuales
- [ ] Considerar video promocional de clases
  - Video corto (30-60s) mostrando clases en acción
  - Testimonios de estudiantes hablando
  - Mejora engagement y conversión

---

## ✅ Completado

- ✅ Implementación completa de traducciones ES
- ✅ Schema Markup (Breadcrumb, ItemList, FAQPage, Course)
- ✅ Meta tags SEO configurados
- ✅ 10 FAQs optimizadas
- ✅ Cards con hover descriptions
- ✅ Lazy loading en imágenes
- ✅ Accesibilidad ARIA labels
- ✅ Responsive design completo
- ✅ AnimatedCounter para stats
- ✅ 6 cards de diferenciación (Instructors, Method, Cuban School, Career, Prestige, Facilities)
- ✅ CTA optimizado para conversión y SEO ("principiantes hasta profesionales")
- ✅ Breadcrumbs funcionales
- ✅ Internal linking a páginas de estilos

---

## 📝 Notas

- Última actualización: 2025-11-15
- Página en branch: `claude/ensure-branch-work-01ChnXE28Q3nTw6CQWyPFZLM`
- Puntuación global actual: **9.0/10**
