# ✅ Checklist de QA Pre-Deploy

Esta checklist garantiza que cada página nueva o cambio cumple con todos los estándares de calidad antes de mergear a producción.

---

## 📋 Checklist General (Para TODA nueva página o cambio)

### 1. **Funcionalidad Básica**
- [ ] La página carga sin errores (revisar consola del navegador)
- [ ] Todos los textos se muestran correctamente
- [ ] Las imágenes cargan correctamente
- [ ] Los enlaces funcionan (internos y externos)
- [ ] El CTA (Call-to-Action) lleva al destino correcto
- [ ] El menú de navegación funciona
- [ ] El footer se muestra correctamente

---

### 2. **Responsive Design**

#### **Mobile (375px - iPhone SE)**
- [ ] Sin scroll horizontal
- [ ] Textos legibles (mínimo 16px)
- [ ] Imágenes adaptadas (no se cortan)
- [ ] Botones táctiles (mínimo 44x44px)
- [ ] Menú hamburguesa funciona
- [ ] Formularios usables (si aplica)
- [ ] Espaciado adecuado (no apiñado)

#### **Tablet (768px - iPad)**
- [ ] Layout adaptado (no es solo mobile agrandado)
- [ ] Imágenes en tamaño correcto
- [ ] Textos legibles
- [ ] Navegación funcional

#### **Desktop (1440px)**
- [ ] Layout se expande correctamente
- [ ] Imágenes en alta resolución
- [ ] Contenido centrado (max-width)
- [ ] Hover effects funcionan
- [ ] No hay elementos descuadrados

---

### 3. **SEO (Search Engine Optimization)**

#### **Meta Tags Básicos**
- [ ] `<title>` único y descriptivo (50-60 caracteres)
- [ ] `<meta name="description">` relevante (140-160 caracteres)
- [ ] `<link rel="canonical">` correcto
- [ ] `<meta name="robots" content="index, follow">` (si aplica)

#### **Open Graph (Facebook/LinkedIn)**
- [ ] `og:type` = "website"
- [ ] `og:url` correcto
- [ ] `og:title` presente
- [ ] `og:description` presente
- [ ] `og:image` existe (1200x630 mínimo)

#### **Twitter Cards**
- [ ] `twitter:card` = "summary_large_image"
- [ ] `twitter:title` presente
- [ ] `twitter:description` presente
- [ ] `twitter:image` existe

#### **Hreflang (Multiidioma)**
- [ ] `<link rel="alternate" hreflang="es">` → `/es/pagina`
- [ ] `<link rel="alternate" hreflang="en">` → `/en/pagina`
- [ ] `<link rel="alternate" hreflang="ca">` → `/ca/pagina`
- [ ] `<link rel="alternate" hreflang="fr">` → `/fr/pagina`
- [ ] `<link rel="alternate" hreflang="x-default">` → `/es/pagina` (fallback)

---

### 4. **Datos Estructurados (Schema.org)**

Verificar con: https://search.google.com/test/rich-results

#### **WebPage Schema**
- [ ] `@type: "WebPage"` presente
- [ ] `name` correcto
- [ ] `description` correcta
- [ ] `url` correcta
- [ ] `inLanguage` correcto
- [ ] Sin errores de validación

#### **Course Schema (Páginas de clases)**
- [ ] `@type: "Course"` presente
- [ ] `name` descriptivo
- [ ] `provider` con información de la organización
- [ ] `educationalLevel` especificado
- [ ] Sin errores de validación

#### **FAQPage Schema**
- [ ] `@type: "FAQPage"` presente (generado automáticamente por FAQSection)
- [ ] Mínimo 4 preguntas
- [ ] Respuestas completas y útiles
- [ ] Sin errores de validación

#### **Person Schema (Si hay instructor destacado)**
- [ ] `@type: "Person"` presente
- [ ] `name` correcto
- [ ] `jobTitle` correcto
- [ ] `description` relevante
- [ ] Sin errores de validación

---

### 5. **Performance (Lighthouse)**

Ejecutar en Chrome DevTools > Lighthouse (modo incógnito)

#### **Performance**
- [ ] Score > 90 (Desktop)
- [ ] Score > 80 (Mobile)
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Total Blocking Time < 200ms
- [ ] Cumulative Layout Shift < 0.1

#### **Accesibilidad**
- [ ] Score > 95
- [ ] Contraste suficiente (mínimo 4.5:1 para texto normal)
- [ ] ARIA labels en elementos interactivos
- [ ] Alt text en todas las imágenes
- [ ] Navegación por teclado funciona (Tab, Enter, Escape)
- [ ] Focus visible en elementos interactivos

#### **Best Practices**
- [ ] Score > 90
- [ ] HTTPS en producción
- [ ] Sin errores en la consola
- [ ] Imágenes con aspect ratio (evita CLS)
- [ ] Sin mixed content (HTTP/HTTPS)

#### **SEO (Lighthouse)**
- [ ] Score > 95
- [ ] Meta description presente
- [ ] Documento tiene `<title>`
- [ ] Links tienen texto descriptivo (no "click aquí")
- [ ] Imágenes tienen `alt` attributes
- [ ] Página es mobile-friendly

---

### 6. **Imágenes Optimizadas**

#### **Formato y Tamaño**
- [ ] Formato WebP principal (con fallback JPG)
- [ ] Imágenes responsive (múltiples tamaños: 640, 960, 1440)
- [ ] `<picture>` tag con `srcset`
- [ ] Peso total < 500KB por página (verificar en Network tab)
- [ ] `loading="lazy"` en imágenes below-the-fold

#### **Accesibilidad**
- [ ] Todas las imágenes tienen `alt` text descriptivo
- [ ] `alt` text es útil (no "imagen", "foto", etc.)
- [ ] Imágenes decorativas tienen `alt=""` (vacío)

#### **Aspect Ratio**
- [ ] CSS `aspect-ratio` definido (evita CLS)
- [ ] Aspect ratio coincide con la imagen real

---

### 7. **Internacionalización (i18n)**

#### **Español (es)**
- [ ] Todos los textos en español
- [ ] Sin claves de traducción visibles (ej: `{homeTitle}`)
- [ ] Tono y estilo coherente
- [ ] URLs: `/es/pagina`

#### **Inglés (en)**
- [ ] Todos los textos en inglés
- [ ] Traducción natural (no literal)
- [ ] Tono adaptado culturalmente
- [ ] URLs: `/en/pagina`

#### **Catalán (ca)**
- [ ] Todos los textos en catalán
- [ ] Traducción natural
- [ ] Tono cercano y local
- [ ] URLs: `/ca/pagina`

#### **Francés (fr)**
- [ ] Todos los textos en francés
- [ ] Traducción natural
- [ ] Tono elegante
- [ ] URLs: `/fr/pagina`

#### **Selector de idioma**
- [ ] Cambia correctamente entre idiomas
- [ ] URL se actualiza con el prefijo correcto
- [ ] Mantiene la misma página (no redirige a home)

---

### 8. **Enlaces Internos**

- [ ] Todas las rutas internas tienen el prefijo de idioma (`/${locale}/...`)
- [ ] Enlaces a otras secciones funcionan (ej: `#horarios`)
- [ ] Enlaces externos abren en nueva pestaña (`target="_blank" rel="noopener noreferrer"`)
- [ ] No hay enlaces rotos (404)

---

### 9. **Contenido**

#### **Textos**
- [ ] Sin typos o errores gramaticales
- [ ] Tono consistente con la marca
- [ ] Jerarquía clara (H1 → H2 → H3)
- [ ] Solo UN H1 por página
- [ ] Párrafos cortos y legibles (máx. 3-4 líneas)
- [ ] CTA claro y persuasivo

#### **FAQs**
- [ ] Mínimo 4 preguntas relevantes
- [ ] Respuestas completas (2-4 líneas)
- [ ] Preguntas que los usuarios realmente hacen
- [ ] Sin duplicados entre diferentes páginas

#### **Testimonios**
- [ ] Auténticos (nombre real, ciudad)
- [ ] Específicos (no genéricos como "¡Genial!")
- [ ] Variados (diferentes perfiles de alumnos)
- [ ] Con foto (si es posible)

---

### 10. **Código**

#### **TypeScript**
- [ ] Sin errores de TypeScript (`npm run typecheck`)
- [ ] Tipos correctos (no `any` innecesarios)
- [ ] Imports correctos

#### **ESLint**
- [ ] Sin errores de ESLint (`npm run lint`)
- [ ] Sin warnings (o justificados con comentarios)

#### **Prettier**
- [ ] Código formateado correctamente (`npm run format:check`)

#### **Build**
- [ ] Build local funciona sin errores (`npm run build`)
- [ ] Prerender completa correctamente
- [ ] Output en `dist/` se genera correctamente

---

### 11. **Git**

#### **Commits**
- [ ] Mensajes descriptivos (ej: `feat: Add Bachata page`, `fix: Correct meta tags`)
- [ ] Commits atómicos (un cambio lógico por commit)
- [ ] No hay archivos innecesarios (node_modules, .env, etc.)

#### **Rama**
- [ ] Nombre descriptivo (ej: `feat/bachata-page`, `fix/dancehall-seo`)
- [ ] Basada en `main` actualizado
- [ ] Sin conflictos con `main`

#### **PR (Pull Request)**
- [ ] Título descriptivo
- [ ] Descripción completa (qué, por qué, cómo)
- [ ] Checklist de cambios incluida
- [ ] Screenshots (si hay cambios visuales)
- [ ] Labels apropiados (`enhancement`, `bug`, `SEO`, etc.)

---

### 12. **Vercel Preview**

- [ ] Preview se genera correctamente
- [ ] URL de preview funciona
- [ ] Página se ve como en local
- [ ] Build logs sin errores
- [ ] Performance aceptable en preview

---

## 🚀 Checklist Rápida (Antes de Mergear)

Si tienes prisa, al menos verifica estos puntos críticos:

1. **Funcionalidad:**
   - [ ] Página carga sin errores (consola limpia)
   - [ ] Imágenes se ven correctamente
   - [ ] Enlaces funcionan

2. **Responsive:**
   - [ ] Mobile: sin scroll horizontal, textos legibles
   - [ ] Desktop: layout correcto, imágenes HD

3. **SEO:**
   - [ ] Google Rich Results Test: todos los schemas válidos
   - [ ] Meta description entre 140-160 caracteres

4. **i18n:**
   - [ ] Los 4 idiomas muestran textos correctos
   - [ ] URLs con prefijo correcto

5. **Performance:**
   - [ ] Lighthouse Performance > 85 (Desktop y Mobile)

6. **Código:**
   - [ ] `npm run build` funciona sin errores
   - [ ] `npm run lint` sin errores

7. **Git:**
   - [ ] PR tiene descripción completa
   - [ ] Vercel preview se ve bien

---

## 🛠️ Herramientas de Testing

### **Validadores Online**

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Qué testea: Datos estructurados (Schema.org)
   - Cómo usar: Pega la URL de Vercel Preview

2. **PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Qué testea: Performance, SEO, Accesibilidad
   - Cómo usar: Pega la URL de producción o preview

3. **W3C HTML Validator**
   - URL: https://validator.w3.org/
   - Qué testea: HTML válido
   - Cómo usar: Pega la URL o el HTML

4. **WebAIM Contrast Checker**
   - URL: https://webaim.org/resources/contrastchecker/
   - Qué testea: Contraste de colores (accesibilidad)
   - Cómo usar: Ingresa color de fondo y texto

5. **Broken Link Checker**
   - URL: https://www.brokenlinkcheck.com/
   - Qué testea: Enlaces rotos (404)
   - Cómo usar: Ingresa la URL de producción

---

### **Herramientas en el Navegador**

1. **Chrome DevTools > Lighthouse**
   - Modo incógnito (sin extensiones)
   - Desktop + Mobile
   - Todos los audits (Performance, Accessibility, Best Practices, SEO)

2. **Chrome DevTools > Network**
   - Filtrar por "Img" para ver tamaño de imágenes
   - Verificar que cargan WebP (no JPG) en navegadores modernos
   - Ver tiempo de carga total

3. **Chrome DevTools > Console**
   - Verificar que no hay errores (rojo)
   - Verificar que no hay warnings críticos (amarillo)

4. **Chrome DevTools > Device Toolbar**
   - Probar en: iPhone SE (375px), iPad (768px), Desktop (1440px)
   - Verificar responsive

5. **Chrome DevTools > Application > Manifest**
   - Verificar PWA (si aplica)

---

### **Herramientas en Terminal**

1. **Build de producción:**
   ```bash
   npm run build
   ```

2. **Preview local:**
   ```bash
   npm run preview
   # Abrir: http://localhost:4173
   ```

3. **TypeScript check:**
   ```bash
   npm run typecheck
   ```

4. **ESLint:**
   ```bash
   npm run lint
   ```

5. **Prettier:**
   ```bash
   npm run format:check
   ```

6. **Test unitarios (si existen):**
   ```bash
   npm run test
   ```

---

## 📊 Criterios de Aceptación

Una página está **lista para producción** si:

✅ **Todos los items críticos** de la checklist están marcados
✅ **Lighthouse Performance** > 85 (Desktop y Mobile)
✅ **Lighthouse SEO** > 95
✅ **Google Rich Results Test** sin errores
✅ **4 idiomas** funcionan correctamente
✅ **Build local** funciona sin errores
✅ **Vercel Preview** se ve perfecto
✅ **Sin errores en consola** del navegador

---

## 🚨 Bloquers (NO mergear si...)

❌ **Build falla** (TypeScript errors, import errors)
❌ **Lighthouse Performance < 70** (Desktop o Mobile)
❌ **Esquemas de datos estructurados inválidos** (Google Rich Results Test)
❌ **Faltan traducciones** en algún idioma
❌ **Imágenes no optimizadas** (peso > 1MB por imagen)
❌ **Errores en consola** del navegador
❌ **Responsive roto** en mobile (scroll horizontal, textos ilegibles)
❌ **SEO crítico faltante** (sin meta description, sin canonical)

---

## 🎯 Template de Comentario para PR

Copia esto en tu PR cuando hayas completado la QA:

```markdown
## ✅ QA Completed

### Funcionalidad
- ✅ Página carga sin errores
- ✅ Imágenes optimizadas (WebP + JPG)
- ✅ Enlaces funcionan correctamente
- ✅ CTA lleva al destino correcto

### Responsive
- ✅ Mobile (375px): perfecto
- ✅ Tablet (768px): perfecto
- ✅ Desktop (1440px): perfecto

### SEO
- ✅ Meta tags completos
- ✅ Google Rich Results Test: sin errores
- ✅ Hreflang tags correctos (es, en, ca, fr)

### Performance
- ✅ Lighthouse Desktop: 92/100
- ✅ Lighthouse Mobile: 87/100
- ✅ Core Web Vitals: OK

### i18n
- ✅ Español: OK
- ✅ Inglés: OK
- ✅ Catalán: OK
- ✅ Francés: OK

### Código
- ✅ TypeScript: sin errores
- ✅ ESLint: sin warnings
- ✅ Build: OK

**Preview URL:** [Vercel preview link]

**Screenshots:**
(Opcional: añadir capturas de Desktop + Mobile)

🚀 Ready to merge!
```

---

🎉 **¡Usa esta checklist antes de cada merge para mantener la calidad 10/10!**
