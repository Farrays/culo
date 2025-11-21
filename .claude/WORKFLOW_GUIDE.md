# 🚀 Guía Completa: Workflow Seguro para Desarrollo

## 🎯 Objetivo
Trabajar de forma **100% segura** sin tocar producción, usando **ramas**, **Pull Requests** y **Vercel Previews** para revisar cambios antes de desplegarlos.

---

## 📋 Flujo de Trabajo (Paso a Paso)

### 1️⃣ **Crear una Rama de Trabajo**

**Siempre trabaja en una rama separada, nunca directamente en `main`.**

```bash
# Nomenclatura recomendada:
# feat/nombre-funcionalidad  → Nueva funcionalidad
# fix/nombre-bug             → Corrección de bug
# content/nombre-pagina      → Cambios de contenido

# Ejemplo: crear página de Bachata
git checkout -b feat/bachata-page

# Ejemplo: ajustar textos de Dancehall
git checkout -b content/dancehall-texts
```

**✅ Ventaja:** Todo lo que hagas queda aislado. Producción (`main`) no se toca.

---

### 2️⃣ **Hacer los Cambios (con Claude Code)**

**Pídele a Claude que trabaje SOLO en los archivos necesarios:**

```markdown
**Instrucciones claras para Claude:**

"Crea una nueva página de Bachata basada en DancehallPage.tsx.

**Archivos a modificar/crear:**
- components/BachataPage.tsx (nuevo, clonar de DancehallPage)
- App.tsx (añadir ruta /bachata)
- i18n/locales/*.ts (añadir traducciones)
- public/images/classes/bachata/ (preparar estructura)

**NO TOCAR:**
- Estilos globales (index.css, tailwind.config.js)
- Configuración (vite.config.ts, package.json)
- Otras páginas
- Componentes compartidos (Header, Footer, etc.)

**Requisitos:**
- SEO completo (title, meta, canonical, hreflang)
- Datos estructurados (WebPage + Course + FAQPage)
- 3 imágenes optimizadas (hero, clase, profesor)
- 4 FAQs con schema
- Enlaces internos a /clases y /profesores
- Responsive y accesible
"
```

**✅ Ventaja:** Claude sabe exactamente qué puede y qué NO puede tocar.

---

### 3️⃣ **Revisar los Cambios Antes de Commitear**

**Antes de hacer commit, revisa qué archivos cambió Claude:**

```bash
# Ver archivos modificados
git status

# Ver cambios línea por línea
git diff

# Ver cambios de un archivo específico
git diff components/BachataPage.tsx
```

**✅ Qué verificar:**
- ✅ Solo cambió los archivos que debía
- ✅ No tocó config, package.json, estilos globales
- ✅ No añadió dependencias nuevas sin avisar
- ❌ Si cambió algo que NO debía → pídale que lo revierta

---

### 4️⃣ **Hacer Commit y Push**

```bash
# Añadir archivos al staging
git add .

# Hacer commit con mensaje descriptivo
git commit -m "feat: Add Bachata class page with SEO and structured data

- Create BachataPage component based on Dancehall
- Add i18n translations for 4 languages
- Include FAQs with schema markup
- Optimize 3 images (hero, class, instructor)
- Add internal links to /clases and /teachers

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Subir la rama a GitHub
git push -u origin feat/bachata-page
```

**✅ Ventaja:** El código está en GitHub pero NO en producción aún.

---

### 5️⃣ **Abrir un Pull Request (PR)**

**En GitHub:**

1. Ve a tu repositorio
2. Verás un botón amarillo: **"Compare & pull request"** → Click
3. Rellena el PR:

**Título:**
```
feat: Add Bachata class page with full SEO
```

**Descripción:**
```markdown
## 📄 Summary
Nueva página de Bachata basada en la estructura de Dancehall.

## ✅ Changes
- ✅ BachataPage.tsx component
- ✅ i18n translations (es, en, ca, fr)
- ✅ SEO metadata (title, description, canonical, hreflang)
- ✅ Structured data (WebPage, Course, FAQPage)
- ✅ 3 optimized images (hero, class, instructor)
- ✅ 4 FAQs with schema
- ✅ Internal links to /clases and /teachers
- ✅ Responsive design

## 🧪 Test Plan
- [ ] Desktop: Chrome, Firefox, Safari
- [ ] Mobile: iOS Safari, Android Chrome
- [ ] SEO: Google Rich Results Test
- [ ] Performance: Lighthouse (>90)
- [ ] i18n: Verify all 4 languages
- [ ] Links: Internal links work
- [ ] Images: Load correctly, responsive

## 🔗 Preview URL
(Vercel añadirá aquí la URL automáticamente)

🤖 Generated with Claude Code
```

4. **Marca el PR como "Draft"** si aún no está listo para producción
5. Click **"Create pull request"**

**✅ Ventaja:** Vercel generará una **URL de preview** automáticamente.

---

### 6️⃣ **Revisar la Preview de Vercel**

**Vercel creará un deployment temporal con una URL tipo:**
```
https://web-abc123xyz.vercel.app/es/bachata
```

**🔍 Qué revisar:**

#### **Desktop (Chrome/Firefox/Safari):**
- [ ] Textos correctos en los 4 idiomas
- [ ] Imágenes cargan correctamente
- [ ] Hero video funciona
- [ ] Animaciones funcionan
- [ ] Enlaces internos funcionan
- [ ] CTA lleva a contacto/clases

#### **Mobile (iOS/Android):**
- [ ] Layout responsive perfecto
- [ ] Imágenes adaptadas
- [ ] Menú móvil funciona
- [ ] Touch interactions

#### **SEO (Google Rich Results Test):**
- [ ] Ir a: https://search.google.com/test/rich-results
- [ ] Pegar la URL de Vercel Preview
- [ ] Verificar: WebPage, Course, FAQPage schemas válidos

#### **Performance (Lighthouse):**
- [ ] Chrome DevTools > Lighthouse
- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 90
- [ ] SEO > 95

#### **i18n:**
- [ ] Cambiar idioma en el selector
- [ ] Verificar que todos los textos cambian
- [ ] URLs tienen el prefijo correcto (/es/, /en/, /ca/, /fr/)

---

### 7️⃣ **Hacer Ajustes (si es necesario)**

**Si encuentras errores en la preview:**

```bash
# Sigue en la misma rama
git status

# Pídele a Claude que haga los cambios
# Ejemplo: "En la rama feat/bachata-page, reduce el texto de la sección
# '¿Qué aprenderás?' a 3 bullets, tono más persuasivo"

# Claude hace los cambios...

# Commitear y pushear
git add .
git commit -m "fix: Reduce 'What you'll learn' section to 3 bullets"
git push
```

**✅ Vercel actualizará la preview automáticamente en ~2 minutos.**

---

### 8️⃣ **Mergear a Producción (cuando esté perfecto)**

**Cuando la preview esté 100% perfecta:**

1. En el PR de GitHub, click **"Ready for review"** (si estaba en Draft)
2. Click **"Merge pull request"**
3. Click **"Confirm merge"**
4. (Opcional) Click **"Delete branch"** para limpiar

**✅ Vercel desplegará a producción automáticamente en ~3 minutos.**

**🌐 URL de producción:**
```
https://www.farrayscenter.com/es/bachata
```

---

## 🔄 Revertir Cambios (si algo sale mal)

### **Antes de mergear (en la rama):**

```bash
# Opción 1: Deshacer el último commit (mantener cambios)
git reset HEAD~1

# Opción 2: Deshacer el último commit (borrar cambios)
git reset --hard HEAD~1

# Opción 3: Volver a un commit específico
git log  # ver historial
git reset --hard abc123  # reemplaza abc123 con el hash del commit

# Opción 4: Cerrar el PR y borrar la rama
# En GitHub: Close PR → Delete branch
```

### **Después de mergear (en producción):**

```bash
# Opción 1: Revert desde GitHub (recomendado)
# En el PR mergeado → Click "Revert" → Crear nuevo PR de revert → Mergear

# Opción 2: Revert desde terminal
git checkout main
git pull
git revert abc123  # hash del commit a revertir
git push
```

**✅ Ventaja:** Revertir es tan fácil como un click. Sin pánico.

---

## 🛡️ Protecciones Recomendadas

### **En GitHub (Settings > Branches > Branch protection rules):**

1. **Proteger `main`:**
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass (Vercel)
   - ✅ Require conversation resolution before merging
   - ❌ No permitir push directo a `main`

2. **CODEOWNERS (opcional):**
```bash
# .github/CODEOWNERS
* @tu-usuario
/package.json @tu-usuario
/vite.config.ts @tu-usuario
/tailwind.config.js @tu-usuario
```

**✅ Ventaja:** GitHub te pedirá aprobación antes de mergear cambios críticos.

---

## 📦 Workflow para Imágenes

### **Añadir imágenes nuevas (ej: Bachata):**

1. **Sube las originales:**
```bash
public/images/classes/bachata/raw/
  bachata-hero.jpg
  bachata-clase-1.jpg
  bachata-profesor.jpg
```

2. **Actualiza el script:**
```javascript
// scripts/build-images.mjs
const classes = ["dancehall", "bachata"];  // añade "bachata"
```

3. **Ejecuta optimización:**
```bash
npm run build:images
```

4. **Verifica que se generaron:**
```bash
ls public/images/classes/bachata/img
# Deberías ver: bachata-hero_640.webp, bachata-hero_960.webp, etc.
```

5. **Añade traducciones de alt text:**
```typescript
// i18n/locales/es.ts
bachataImage1Alt: "Clases de Bachata en Barcelona - Farray's Center",
bachataImage2Alt: "Estudiantes practicando Bachata Sensual",
bachataImage3Alt: "Profesor de Bachata - Carlos Martínez",
```

6. **Commitear:**
```bash
git add public/images/classes/bachata i18n/locales scripts/build-images.mjs
git commit -m "feat: Add optimized Bachata images (3 images, 3 sizes, WebP+JPG)"
git push
```

---

## 🚨 Troubleshooting

### **❌ La preview de Vercel no funciona**
```bash
# Verifica que el build local funciona
npm run build
npm run preview
# Abre http://localhost:4173
```

### **❌ Claude cambió archivos que no debía**
```bash
# Revierte los cambios
git checkout -- archivo-no-deseado.ts
# O revierte TODO excepto algunos archivos
git checkout -- .
git add archivo-deseado.ts
git commit -m "fix: Revert unwanted changes"
```

### **❌ El PR tiene conflictos con main**
```bash
# Actualiza tu rama con los cambios de main
git checkout feat/bachata-page
git fetch origin
git merge origin/main
# Resuelve conflictos en VSCode
git add .
git commit -m "merge: Resolve conflicts with main"
git push
```

### **❌ Quiero empezar desde cero**
```bash
# Opción 1: Borrar la rama local y remota
git checkout main
git branch -D feat/bachata-page
git push origin --delete feat/bachata-page

# Opción 2: Crear una nueva rama desde main limpio
git checkout main
git pull
git checkout -b feat/bachata-page-v2
```

---

## ✅ Checklist Final (antes de mergear)

- [ ] **Funcionalidad:** Todo funciona en la preview de Vercel
- [ ] **SEO:** Google Rich Results Test pasa
- [ ] **Performance:** Lighthouse > 90
- [ ] **i18n:** Todos los idiomas correctos
- [ ] **Responsive:** Desktop + Mobile perfecto
- [ ] **Accesibilidad:** Screen readers, contraste, keyboard nav
- [ ] **Links:** Internos funcionan, externos abren en nueva pestaña
- [ ] **Images:** Optimizadas, alt text, aspect ratio correcto
- [ ] **Code:** No warnings de ESLint, TypeScript pasa
- [ ] **Git:** Commits limpios, mensajes descriptivos
- [ ] **PR:** Descripción completa, test plan documentado

---

## 🎓 Comandos Git Útiles (Cheatsheet)

```bash
# Ver estado actual
git status

# Ver ramas
git branch

# Cambiar de rama
git checkout nombre-rama

# Crear y cambiar a nueva rama
git checkout -b nueva-rama

# Ver historial de commits
git log --oneline

# Ver cambios no commiteados
git diff

# Descartar cambios de un archivo
git checkout -- archivo.ts

# Actualizar rama con cambios de main
git checkout tu-rama
git merge origin/main

# Ver ramas remotas
git branch -r

# Borrar rama local
git branch -D nombre-rama

# Borrar rama remota
git push origin --delete nombre-rama

# Ver quién cambió cada línea de un archivo
git blame archivo.ts

# Buscar en el historial
git log --grep="palabra"
```

---

## 🎯 Resumen del Flujo Ideal

```
1. git checkout -b feat/nueva-funcionalidad
2. [Pedir a Claude que haga los cambios]
3. git status && git diff  (revisar)
4. git add . && git commit -m "mensaje"
5. git push -u origin feat/nueva-funcionalidad
6. [Abrir PR en GitHub]
7. [Vercel genera preview automáticamente]
8. [Revisar preview: funcionalidad, SEO, performance]
9. [Si hay errores: hacer ajustes y pushear]
10. [Cuando esté perfecto: Merge PR]
11. [Vercel despliega a producción automáticamente]
```

---

## 📚 Recursos

- **GitHub:** https://github.com/tu-usuario/tu-repo
- **Vercel:** https://vercel.com/dashboard
- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Lighthouse:** Chrome DevTools > Lighthouse
- **Git Docs:** https://git-scm.com/doc

---

🎉 **¡Listo! Ahora puedes trabajar con confianza sabiendo que producción está protegida.**
