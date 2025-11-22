# 🖼️ Open Graph Images - Imágenes Faltantes

## ⚠️ CRÍTICO: Faltan las siguientes imágenes OG

Tu código referencia estas imágenes pero **NO EXISTEN** en `/public/images/`:

### Imágenes necesarias:

1. **`/public/images/og-home.jpg`**
   - Usado en: `components/SEO.tsx` (línea 37)
   - Usado en: `prerender.mjs` (para página home)
   - **Dimensiones recomendadas:** 1200x630 px
   - **Peso máximo:** 8 MB (recomendado < 500 KB)
   - **Formato:** JPG o PNG
   - **Contenido sugerido:** Logo FarRays + "Escuela de Baile Urbano en Barcelona" + imagen de bailarines

2. **`/public/images/og-classes.jpg`**
   - Usado en: `components/SEO.tsx` (línea 42)
   - Usado en: `prerender.mjs` (para página classes)
   - **Dimensiones:** 1200x630 px
   - **Contenido sugerido:** Colage de diferentes clases + "Clases de Baile - FarRays Center"

3. **`/public/images/og-dancehall.jpg`**
   - Usado en: `components/SEO.tsx` (línea 47)
   - Usado en: `prerender.mjs` (para página dancehall)
   - **Dimensiones:** 1200x630 px
   - **Contenido sugerido:** Imagen de clase de Dancehall + "Clases de Dancehall en Barcelona"

4. **`/public/images/og-image.jpg`** (fallback general)
   - Usado en: `index.html` (línea 19) y `components/HomePage.tsx` (línea 45)
   - **Dimensiones:** 1200x630 px
   - Puede ser la misma que `og-home.jpg`

5. **`/public/images/twitter-image.jpg`** (opcional)
   - Usado en: `index.html` (línea 26)
   - **Dimensiones:** 1200x630 px (summary_large_image)
   - Puede ser la misma que `og-image.jpg`

---

## 🎨 Especificaciones técnicas de Open Graph Images

### Dimensiones ideales:
- **Facebook/LinkedIn:** 1200x630 px (ratio 1.91:1)
- **Twitter:** 1200x628 px o 1200x675 px
- **Dimensión universal segura:** **1200x630 px**

### Formato:
- **JPG** (mejor compresión) o **PNG** (mejor calidad)
- **Peso:** < 500 KB recomendado (máximo 8 MB)

### Zona segura:
- Evita poner texto/logos importantes en los bordes extremos
- **Zona segura:** 1104x550 px centrados

### Contenido recomendado:
- ✅ Logo de la marca
- ✅ Título principal claro (grande y legible)
- ✅ Imagen de fondo relevante
- ✅ Colores de marca
- ❌ Evitar texto muy pequeño (ilegible en móvil)

---

## 🚀 Cómo crear las imágenes

### Opción 1: Canva (recomendado, fácil)
1. Ir a https://www.canva.com/
2. Crear diseño → "Facebook Post" o "Open Graph"
3. Tamaño: 1200x630 px
4. Diseñar con plantillas predefinidas
5. Descargar como JPG

### Opción 2: Figma (profesional)
1. Crear frame de 1200x630 px
2. Diseñar la imagen
3. Export as JPG/PNG

### Opción 3: Photoshop/GIMP
1. Nuevo documento 1200x630 px, 72 dpi
2. Diseñar
3. Save for Web

### Opción 4: Herramientas automáticas
- https://ogimage.vercel.app/ (generador automático)
- https://metatags.io/ (preview + generador)
- https://www.opengraph.xyz/ (generador con templates)

---

## ✅ Una vez creadas las imágenes:

1. **Guardar en:**
   ```
   /public/images/og-home.jpg
   /public/images/og-classes.jpg
   /public/images/og-dancehall.jpg
   /public/images/og-image.jpg
   /public/images/twitter-image.jpg
   ```

2. **Verificar que se sirven correctamente:**
   ```bash
   # Después de deploy
   curl -I https://www.farrayscenter.com/images/og-home.jpg
   # Debería devolver 200 OK
   ```

3. **Testear el preview:**
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/
   - General: https://metatags.io/

---

## 🎯 Placeholder temporal (mientras no tengas las imágenes)

Si necesitas un placeholder rápido, puedes:

**Opción A:** Usar una imagen existente como fallback:
```typescript
// En SEO.tsx, cambiar temporalmente a:
image: `${baseUrl}/images/classes/dancehall/img/dancehall-classes-barcelona-01_640.webp`,
```

**Opción B:** Crear un placeholder simple con texto:
```bash
# Requiere ImageMagick instalado
convert -size 1200x630 xc:#000000 \
  -font Arial -pointsize 60 -fill white \
  -gravity center -annotate +0+0 "FarRays Center\nEscuela de Baile Barcelona" \
  /public/images/og-home.jpg
```

---

## 📊 Prioridad

🔴 **CRÍTICO** - Las páginas sin imágenes OG se verán mal cuando se compartan en:
- WhatsApp
- Facebook
- Twitter/X
- LinkedIn
- Slack
- Discord

Sin estas imágenes, se mostrará:
- Enlace sin preview
- O imagen rota
- O imagen incorrecta

**Recomendación:** Crear estas imágenes ANTES de hacer marketing/redes sociales.
