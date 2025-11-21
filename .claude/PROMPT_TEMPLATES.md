# 📝 Plantillas de Instrucciones para Claude Code

Estas plantillas están diseñadas para que copies, pegues y ajustes según tus necesidades. Son **instrucciones claras y acotadas** que le dicen a Claude exactamente qué hacer y qué NO tocar.

---

## 🆕 1. Crear una Nueva Página de Clase (Automático)

**Usa el script generador:**

```bash
npm run create:class -- --name=bachata --instructor="Carlos Martínez" --specialty="Bachata Sensual"
```

**O en modo interactivo:**

```bash
npm run create:class
```

Esto generará automáticamente:
- Componente de página
- Rutas en App.tsx
- Estructura de directorios para imágenes
- Plantilla i18n
- Actualización del script de imágenes

---

## 🎨 2. Personalizar Contenido de una Página Existente

### 2.1 Ajustar Textos y Copy

```markdown
**Tarea:** Mejorar textos de la página de Bachata

**Archivos a modificar:**
- i18n/locales/es.ts (sección Bachata)
- i18n/locales/en.ts (sección Bachata)
- i18n/locales/ca.ts (sección Bachata)
- i18n/locales/fr.ts (sección Bachata)

**NO TOCAR:**
- Componentes (components/*.tsx)
- Configuración (vite.config.ts, tailwind.config.js, package.json)
- Otras páginas

**Requisitos:**
1. **Hero Title:** Debe ser impactante, máximo 4 palabras
2. **Hero Subtitle:** Descripción breve (1 línea, máximo 100 caracteres)
3. **About Desc1:** Párrafo introductorio sobre qué es Bachata (2-3 líneas)
4. **About Desc2:** Párrafo sobre beneficios y cultura (2-3 líneas)
5. **Pillars:** 3 pilares con títulos de 1-2 palabras y descripciones de 1 línea
6. **Niveles (Beginner/Inter/Advanced):** Descripción breve de cada nivel (1-2 líneas)
7. **Instructor Bio:** Biografía persuasiva pero auténtica (3-4 líneas)
8. **FAQs:** 4 preguntas frecuentes reales con respuestas claras (2-3 líneas cada una)
9. **Testimonios:** 2 testimonios auténticos y específicos (2-3 líneas)

**Tono:** Cercano, motivador, profesional. Sin exageraciones. Enfocado en resultados concretos.

**SEO:**
- Meta description entre 140-160 caracteres
- Incluir "Barcelona" y el nombre del baile
- Evitar keyword stuffing

**Traducciones:**
- Mantén la misma estructura en los 4 idiomas
- Adapta culturalmente cuando sea necesario (no traduzcas literalmente)
- En inglés: tono ligeramente más informal
- En francés: mantén elegancia
- En catalán: cercano y local
```

---

### 2.2 Cambiar Imágenes

```markdown
**Tarea:** Actualizar las imágenes de la página de Bachata

**Pasos:**

1. **Sube las nuevas imágenes originales** a:
   - `public/images/classes/bachata/raw/bachata-hero.jpg`
   - `public/images/classes/bachata/raw/bachata-clase-1.jpg`
   - `public/images/classes/bachata/raw/bachata-profesor.jpg`

2. **Ejecuta el script de optimización:**
   ```bash
   npm run build:images
   ```

3. **Verifica que se generaron** en `public/images/classes/bachata/img/`

4. **Actualiza los alt texts** en `i18n/locales/*.ts`:
   - `bachataImage1Alt`
   - `bachataImage2Alt`
   - `bachataImage3Alt`

**Requisitos de las imágenes:**
- Hero: 1920x1080 mínimo (horizontal)
- Clase: 1200x1500 mínimo (vertical, 4:5)
- Profesor: 800x800 mínimo (cuadrado)
- Formato: JPG o PNG (se convertirá a WebP automáticamente)
- Peso máximo original: 5MB por imagen

**NO TOCAR:**
- Componentes (ResponsiveImage sigue igual)
- Scripts (ya está configurado)
```

---

### 2.3 Ajustar FAQs

```markdown
**Tarea:** Añadir/modificar FAQs de la página de Salsa

**Archivos a modificar:**
- i18n/locales/es.ts (salsaFaqQ1-Q4, salsaFaqA1-A4)
- i18n/locales/en.ts (mismas claves)
- i18n/locales/ca.ts (mismas claves)
- i18n/locales/fr.ts (mismas claves)

**NO TOCAR:**
- components/SalsaPage.tsx (el componente ya renderiza las FAQs correctamente)

**Requisitos:**
1. **4 preguntas** que tus alumnos realmente hacen
2. **Preguntas claras** y directas (¿Cómo...? ¿Qué...? ¿Cuándo...?)
3. **Respuestas concretas** (2-4 líneas, sin rodeos)
4. Incluir keywords naturales: "clases de salsa", "Barcelona", "principiantes", etc.

**Ejemplos de buenas preguntas:**
- "¿Necesito pareja para las clases?"
- "¿Qué estilo de Salsa enseñan?"
- "¿Cuánto tiempo se tarda en aprender?"
- "¿Qué debo llevar a la primera clase?"

**Traducciones:**
- Mantén la misma estructura
- Adapta culturalmente (ej: en inglés "Do I need..." vs español "¿Necesito...")
```

---

### 2.4 Cambiar Instructor

```markdown
**Tarea:** Actualizar información del instructor de Kizomba

**Archivos a modificar:**
- i18n/locales/es.ts (kizombaInstructorName, kizombaInstructorSpecialty, kizombaInstructorBio)
- i18n/locales/en.ts (mismas claves)
- i18n/locales/ca.ts (mismas claves)
- i18n/locales/fr.ts (mismas claves)
- public/images/teachers/ (añadir foto del instructor si es nueva)

**NO TOCAR:**
- components/KizombaPage.tsx (ya está configurado)

**Requisitos:**
1. **Nombre completo** del instructor
2. **Especialidad** (ej: "Especialista en Kizomba Angoleña")
3. **Biografía** (3-5 líneas):
   - Años de experiencia
   - Estilos que domina
   - Logros/premios relevantes
   - Enfoque pedagógico único
   - Por qué es un gran instructor (sin exagerar)

**Foto del instructor:**
- Nombre de archivo: `nombre-apellido.jpg` (kebab-case)
- Tamaño: 800x800 mínimo
- Formato: JPG
- Profesional pero cercano (no formal corporativo)
- Subir a: `public/images/teachers/`

**Actualizar referencia en el componente:**
- Busca `<img src="/images/teachers/...` en `KizombaPage.tsx`
- Cambia el nombre del archivo
```

---

## 🐛 3. Corregir Errores

### 3.1 Error de TypeScript

```markdown
**Tarea:** Corregir error de TypeScript en [nombre del archivo]

**Contexto:**
[Describe el error que ves en la terminal o en VSCode]

**Archivos a modificar:**
- [archivo específico donde está el error]

**NO TOCAR:**
- Otros archivos sin errores
- Configuración de TypeScript (tsconfig.json)

**Requisitos:**
- Corregir el error sin cambiar la funcionalidad
- Mantener tipos estrictos
- No usar `any` a menos que sea absolutamente necesario
```

---

### 3.2 Error de SEO/Meta Tags

```markdown
**Tarea:** Corregir meta tags de la página de Bachata

**Problema:**
[Describe qué está mal: canonical incorrecto, meta description muy larga, etc.]

**Archivos a modificar:**
- components/BachataPage.tsx (sección Helmet)

**NO TOCAR:**
- i18n (traducciones están bien)
- Otros componentes

**Requisitos:**
- Canonical URL: https://www.farrayscenter.com/{locale}/bachata
- Meta description: 140-160 caracteres
- OG image: debe existir en /public/images/
- Hreflang: es, en, ca, fr + x-default
```

---

### 3.3 Error de Responsive/Mobile

```markdown
**Tarea:** Arreglar problema de responsive en la página de Salsa

**Problema:**
[Describe el problema: textos se cortan, imágenes desalineadas, menú no funciona, etc.]

**Archivos a modificar:**
- components/SalsaPage.tsx (sección con el problema)

**NO TOCAR:**
- Estilos globales (index.css)
- Tailwind config
- Otros componentes

**Requisitos:**
- Usar breakpoints de Tailwind: sm:, md:, lg:, xl:
- Probar en:
  - Mobile: 375px (iPhone SE)
  - Tablet: 768px (iPad)
  - Desktop: 1440px
- Mantener jerarquía visual
- Touch targets mínimo 44x44px
```

---

## 🔗 4. Añadir Enlaces Internos

```markdown
**Tarea:** Añadir enlaces internos en la página de Afrobeats

**Archivos a modificar:**
- components/AfrobeatsPage.tsx

**NO TOCAR:**
- Otras páginas
- Header/Footer (ya tienen navegación)

**Enlaces a añadir:**

1. **Desde "About Afrobeats"** → Link a `/clases`
   - Texto: "Descubre todas nuestras clases"

2. **Desde "Instructor"** → Link a (futuro) `/profesores`
   - Texto: "Conoce a todo nuestro equipo"

3. **Desde "Classes"** → Link a `/clases#horarios`
   - Texto: "Ver horarios y reservar"

4. **En el CTA final** → Ya está (no tocar)

**Estilo de los enlaces:**
- Clase CSS: `text-primary-accent hover:text-white underline transition-colors`
- Siempre en el mismo idioma que la página (usar `locale` del hook useI18n)
```

---

## 🎯 5. Optimización SEO Avanzada

### 5.1 Añadir Datos Estructurados (Schema.org)

```markdown
**Tarea:** Añadir datos estructurados JSON-LD a la página de Bachata

**Archivos a modificar:**
- components/BachataPage.tsx (dentro del <Helmet>)

**NO TOCAR:**
- FAQSection (ya tiene FAQPage schema automático)
- Otras páginas

**Schemas a añadir:**

1. **WebPage**
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{bachataPageTitle}",
  "description": "{bachataMetaDescription}",
  "url": "https://www.farrayscenter.com/{locale}/bachata",
  "inLanguage": "{locale}",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Farray's International Dance Center",
    "url": "https://www.farrayscenter.com"
  }
}
```

2. **Course**
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Clases de Bachata en Barcelona",
  "description": "{bachataMetaDescription}",
  "provider": {
    "@type": "Organization",
    "name": "Farray's International Dance Center",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Carrer de Sant Martí, 123",
      "addressLocality": "Barcelona",
      "addressCountry": "ES"
    }
  },
  "courseCode": "BACHATA-101",
  "educationalLevel": "Beginner to Advanced",
  "teaches": "Bachata Dance"
}
```

3. **Person (Instructor)** - Solo si el instructor es público
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "{bachataInstructorName}",
  "jobTitle": "{bachataInstructorSpecialty}",
  "description": "{bachataInstructorBio}",
  "worksFor": {
    "@type": "Organization",
    "name": "Farray's International Dance Center"
  }
}
```

**Implementación:**
```tsx
<script type="application/ld+json">
  {JSON.stringify(schemaObject)}
</script>
```

**Validación:**
- Usa: https://search.google.com/test/rich-results
- Pega la URL de Vercel Preview
- Verifica que no haya errores
```

---

### 5.2 Mejorar Internal Linking

```markdown
**Tarea:** Mejorar estrategia de internal linking en todas las páginas de clases

**Archivos a modificar:**
- components/DancehallPage.tsx
- components/AfrobeatsPage.tsx
- components/BachataPage.tsx (cuando esté creada)

**NO TOCAR:**
- Header/Footer (ya tienen menú principal)

**Estrategia:**

Desde cada página de clase, añadir enlaces a:

1. **Otras clases relacionadas** (al final de "About" section):
   - Dancehall → Afrobeats, Bachata
   - Afrobeats → Dancehall, Salsa
   - Bachata → Salsa, Kizomba

2. **Página principal de clases** (en el CTA):
   - "Ver todas nuestras clases" → /clases

3. **Sección de horarios** (si existe):
   - "Consulta horarios" → /clases#horarios

**Ejemplo de HTML:**
```tsx
<p className="text-lg text-neutral/80 mt-6">
  Si te gusta Dancehall, también te puede interesar{' '}
  <a href={`/${locale}/afrobeats`} className="text-primary-accent hover:text-white underline">
    Afrobeats
  </a>{' '}
  o{' '}
  <a href={`/${locale}/bachata`} className="text-primary-accent hover:text-white underline">
    Bachata
  </a>.
</p>
```

**Posición:**
- Al final de la sección "About" (antes de los Pillars)
- Texto natural, no forzado
```

---

## 🧪 6. Testing y QA

### 6.1 Probar Nueva Página

```markdown
**Tarea:** Hacer QA completo de la página de Bachata antes de mergear el PR

**Checklist:**

### **Desktop (Chrome, Firefox, Safari)**
- [ ] Hero video carga y reproduce
- [ ] Imágenes cargan en WebP (verificar en Network tab)
- [ ] Textos legibles, sin typos
- [ ] Animaciones funcionan (scroll)
- [ ] Enlaces internos funcionan
- [ ] CTA lleva a contacto/clases
- [ ] Footer tiene enlaces correctos

### **Mobile (iOS Safari, Android Chrome)**
- [ ] Layout responsive perfecto (sin scroll horizontal)
- [ ] Imágenes adaptadas (tamaño correcto)
- [ ] Menú móvil funciona
- [ ] Touch interactions funcionan
- [ ] Texto legible (mínimo 16px)
- [ ] Botones táctiles (mínimo 44x44px)

### **SEO (Google Rich Results Test)**
- [ ] WebPage schema válido
- [ ] Course schema válido
- [ ] FAQPage schema válido (automático)
- [ ] Person schema válido (si aplica)
- [ ] No hay errores de validación

### **Performance (Lighthouse)**
- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 90
- [ ] SEO > 95
- [ ] No hay CLS (Cumulative Layout Shift)

### **i18n (Internacionalización)**
- [ ] Cambiar idioma a ES: textos correctos
- [ ] Cambiar idioma a EN: textos correctos
- [ ] Cambiar idioma a CA: textos correctos
- [ ] Cambiar idioma a FR: textos correctos
- [ ] URLs tienen prefijo correcto (/es/, /en/, /ca/, /fr/)
- [ ] Hreflang tags correctos

### **Funcionalidad**
- [ ] FAQs se expanden/cierran
- [ ] Video poster se muestra antes de play
- [ ] Testimonios se leen completamente
- [ ] Ratings se muestran (5 estrellas)

**Herramientas:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Lighthouse: Chrome DevTools > Lighthouse
- Responsive: Chrome DevTools > Device Toolbar
- Network: Chrome DevTools > Network (filtrar WebP)
```

---

### 6.2 Probar Build de Producción

```markdown
**Tarea:** Verificar que el build de producción funciona correctamente

**Pasos:**

1. **Hacer build local:**
   ```bash
   npm run build
   ```

2. **Verificar que no hay errores:**
   - No debe haber errores de TypeScript
   - No debe haber warnings de ESLint
   - El prerender debe completarse sin errores

3. **Probar preview:**
   ```bash
   npm run preview
   ```

4. **Abrir en navegador:**
   ```
   http://localhost:4173/es/bachata
   ```

5. **Verificar:**
   - [ ] Página carga correctamente
   - [ ] Imágenes optimizadas se cargan
   - [ ] JavaScript funciona (animaciones, menú, etc.)
   - [ ] CSS se aplica correctamente
   - [ ] No hay errores en la consola del navegador

6. **Verificar prerender (SSG):**
   ```bash
   ls dist/es/bachata/index.html
   ```
   - Debe existir el archivo HTML prerenderizado
   - Abrir el archivo y verificar que tiene el contenido completo (no solo el shell)

**Si hay errores:**
- Leer el error completo en la terminal
- Buscar el archivo y línea donde falla
- Corregir antes de pushear
```

---

## 🚀 7. Deployment y PR

### 7.1 Crear PR (Pull Request)

```markdown
**Tarea:** Abrir Pull Request para la nueva página de Bachata

**Antes de abrir el PR:**
1. [ ] Hacer commit de todos los cambios
2. [ ] Push a la rama feat/bachata-page
3. [ ] Build local funciona (npm run build)
4. [ ] No hay errores de TypeScript/ESLint

**Información del PR:**

**Título:**
```
feat: Add Bachata class page with full SEO and i18n
```

**Descripción:**
```markdown
## 📄 Summary
Nueva página de Bachata con SEO completo, datos estructurados y soporte multiidioma.

## ✅ Changes
- ✅ BachataPage component based on Dancehall template
- ✅ i18n translations (es, en, ca, fr)
- ✅ SEO metadata (title, description, canonical, hreflang)
- ✅ Structured data (WebPage, Course, FAQPage schemas)
- ✅ 3 optimized images (hero, class, instructor)
- ✅ 4 FAQs with schema markup
- ✅ 2 testimonials
- ✅ Internal links to /clases and related pages
- ✅ Responsive design (mobile-first)
- ✅ Accessibility (ARIA labels, keyboard nav)

## 🧪 Test Plan
### Desktop
- [ ] Chrome: layout, images, animations
- [ ] Firefox: cross-browser compatibility
- [ ] Safari: WebP fallback to JPG

### Mobile
- [ ] iOS Safari: responsive, touch
- [ ] Android Chrome: responsive, performance

### SEO
- [ ] Google Rich Results Test: all schemas valid
- [ ] Lighthouse: Performance >90, SEO >95

### i18n
- [ ] All 4 languages display correctly
- [ ] URLs have correct locale prefix
- [ ] Language switcher works

## 🔗 Preview URL
(Vercel añadirá la URL aquí automáticamente)

## 📸 Screenshots
(Opcional: añadir capturas de Desktop + Mobile)

🤖 Generated with Claude Code
```

**Labels:**
- `enhancement`
- `SEO`
- `i18n`

**Reviewers:**
- Asignarte a ti mismo

**Draft:**
- Marcar como "Draft" si aún quieres hacer cambios
- Cambiar a "Ready for review" cuando esté listo para producción
```

---

### 7.2 Mergear a Producción

```markdown
**Tarea:** Mergear el PR de Bachata a producción

**Antes de mergear:**
1. [ ] Revisar Vercel Preview (URL en el PR)
2. [ ] QA completo (ver checklist 6.1)
3. [ ] Google Rich Results Test pasa
4. [ ] Lighthouse >90 en todos los scores
5. [ ] Sin errores en la consola
6. [ ] Aprobación (si tienes reviewer)

**Cómo mergear:**
1. En GitHub, ir al PR
2. Click "Merge pull request"
3. Elegir "Squash and merge" (recomendado para limpiar historial)
4. Click "Confirm merge"
5. Click "Delete branch" (limpiar)

**Después de mergear:**
1. Vercel desplegará automáticamente a producción (~3 minutos)
2. Verificar en: https://www.farrayscenter.com/es/bachata
3. Verificar que el sitemap se actualizó: https://www.farrayscenter.com/sitemap.xml
4. (Opcional) Hacer ping a Google Search Console para reindexar

**Si algo sale mal:**
- Opción 1: Revert desde GitHub (botón "Revert")
- Opción 2: Revert desde terminal:
  ```bash
  git checkout main
  git pull
  git revert <commit-hash>
  git push
  ```
```

---

## 🔄 8. Mantenimiento

### 8.1 Actualizar Textos de una Página

```markdown
**Tarea:** Actualizar textos de la página de Dancehall (contenido desactualizado)

**Archivos a modificar:**
- i18n/locales/es.ts (sección Dancehall)
- i18n/locales/en.ts (sección Dancehall)
- i18n/locales/ca.ts (sección Dancehall)
- i18n/locales/fr.ts (sección Dancehall)

**NO TOCAR:**
- components/DancehallPage.tsx (componente sigue igual)

**Cambios específicos:**
[Lista exacta de cambios, por ejemplo:]
- `dancehallAboutDesc1`: Actualizar información sobre el estilo (de X a Y)
- `dancehallInstructorBio`: Actualizar logros del instructor (añadir premio 2024)
- `dancehallFaqA2`: Actualizar horarios de las clases

**Workflow:**
1. Crear rama: `git checkout -b content/dancehall-update`
2. Hacer cambios en los 4 idiomas
3. Commit: `git commit -m "content: Update Dancehall page info (instructor bio, schedule)"`
4. Push: `git push -u origin content/dancehall-update`
5. Abrir PR
6. Revisar preview de Vercel
7. Mergear
```

---

### 8.2 Añadir Nueva Clase (Rápido)

```markdown
**Tarea:** Añadir página de Kizomba

**Método rápido (usar el generador):**

1. **Generar la página base:**
   ```bash
   npm run create:class -- --name=kizomba --instructor="Ana Silva" --specialty="Especialista en Kizomba Angoleña"
   ```

2. **Seguir los pasos del output:**
   - Copiar claves i18n a `i18n/locales/*.ts`
   - Subir 3 imágenes a `public/images/classes/kizomba/raw/`
   - Ejecutar `npm run build:images`
   - Personalizar textos (reemplazar [TODO])

3. **Probar localmente:**
   ```bash
   npm run dev
   # Abrir: http://localhost:5173/es/kizomba
   ```

4. **Crear PR:**
   ```bash
   git checkout -b feat/kizomba-page
   git add .
   git commit -m "feat: Add Kizomba class page"
   git push -u origin feat/kizomba-page
   ```

5. **Revisar preview de Vercel → Mergear**
```

---

## 🆘 9. Troubleshooting

### 9.1 Claude cambió archivos que no debía

```markdown
**Problema:** Claude modificó package.json, vite.config.ts u otros archivos de configuración sin que se lo pidieras.

**Solución:**

1. **Revisar qué cambió:**
   ```bash
   git status
   git diff
   ```

2. **Revertir archivos no deseados:**
   ```bash
   # Revertir UN archivo específico
   git checkout -- package.json

   # Revertir VARIOS archivos
   git checkout -- package.json vite.config.ts tailwind.config.js
   ```

3. **Mantener solo los cambios buenos:**
   ```bash
   # Resetear todo
   git reset --hard HEAD

   # Volver a aplicar solo los cambios que quieres
   # (Claude tendrá que hacerlos de nuevo, pero esta vez bien acotados)
   ```

4. **Prevenir en el futuro:**
   - Sé MUY específico en las instrucciones
   - Lista exactamente los archivos permitidos
   - Lista explícitamente los archivos NO permitidos
```

---

### 9.2 Preview de Vercel no funciona

```markdown
**Problema:** Vercel preview falla o no se genera

**Diagnóstico:**

1. **Verificar que el build local funciona:**
   ```bash
   npm run build
   ```
   - Si falla aquí, el problema es tu código (no Vercel)
   - Leer el error y corregir

2. **Verificar logs de Vercel:**
   - En el PR de GitHub, click en "Details" del check de Vercel
   - Leer el log de build
   - Buscar la línea del error

3. **Errores comunes:**
   - TypeScript error → Corregir tipos
   - Import not found → Verificar paths
   - Image not found → Verificar que la imagen existe en /public
   - Out of memory → Reducir tamaño de imágenes en /raw antes de build:images

4. **Forzar redeploy:**
   - Hacer un commit vacío: `git commit --allow-empty -m "chore: trigger redeploy"`
   - Push: `git push`
```

---

### 9.3 Imágenes no se ven

```markdown
**Problema:** Las imágenes no se ven en la web

**Diagnóstico:**

1. **Verificar que existen:**
   ```bash
   ls public/images/classes/bachata/img
   ```
   - Debe haber archivos `*_640.webp`, `*_960.webp`, `*_1440.webp` (y `.jpg`)

2. **Verificar el path en el componente:**
   ```tsx
   <ResponsiveImage
     basePath="/images/classes/bachata/img/bachata-hero"  // ✅ Correcto (sin /public)
     // NO:
     // basePath="/public/images/..."  // ❌ Incorrecto
     alt={t("bachataImage1Alt")}
   />
   ```

3. **Verificar que el script corrió:**
   ```bash
   npm run build:images
   ```

4. **Verificar en DevTools:**
   - Chrome DevTools > Network tab
   - Recargar la página
   - Buscar la imagen (ej: `bachata-hero_960.webp`)
   - Si da 404: el path está mal
   - Si da 200: el problema es CSS (verificar que no está oculta)

5. **Verificar aspect ratio CSS:**
   - Si la imagen "existe" pero no se ve, puede ser un problema de `aspectRatio`
   - Verificar que el aspect ratio CSS coincide con la imagen real
```

---

## 💡 Tips Finales

1. **Siempre trabaja en ramas** → Nunca push directo a `main`
2. **Commits pequeños y frecuentes** → Más fácil revertir si algo falla
3. **Mensajes de commit descriptivos** → `feat:`, `fix:`, `content:`, `refactor:`
4. **Revisa el diff antes de commit** → `git diff` es tu amigo
5. **Prueba localmente antes de push** → `npm run build` debe funcionar
6. **Usa el preview de Vercel** → Revisa SIEMPRE antes de mergear
7. **No tengas miedo de revertir** → Es mejor revertir que dejar algo roto en producción

---

🎉 **¡Ya tienes todas las herramientas para trabajar como un pro!**
